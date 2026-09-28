/**
 * Web Push Notification Service & Alert Dispatch Manager
 * Handles HTML5 Notification API permissions, vibration patterns, and acoustic triggers
 * Ensures emergency requisitions reach volunteers even when browser tabs are in the background
 */

import { soundEngine } from './soundEngine';

export interface EmergencyNotificationPayload {
  caseNumber: string;
  bloodGroup: string;
  hospitalName: string;
  hospitalTaluk?: string;
  unitsRequired?: number;
  token?: string;
  distanceKm?: number;
}

class PushNotificationManager {
  private inAppToastListeners: Array<(payload: EmergencyNotificationPayload) => void> = [];

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (!this.isSupported()) return 'unsupported';
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        soundEngine.playAcceptanceSuccessChime();
      }
      return perm;
    } catch (err) {
      console.warn('Notification permission request failed:', err);
      return 'denied';
    }
  }

  public subscribeInAppToasts(listener: (payload: EmergencyNotificationPayload) => void): () => void {
    this.inAppToastListeners.push(listener);
    return () => {
      this.inAppToastListeners = this.inAppToastListeners.filter((l) => l !== listener);
    };
  }

  /**
   * Dispatches an Emergency Blood Requisition Alert with both system notification & acoustic warning
   */
  public triggerEmergencyAlert(payload: EmergencyNotificationPayload): void {
    // 1. Play synthetic clinical acoustic chime
    soundEngine.playCodeCrimsonAlert();

    // 2. Dispatch native OS / Browser Notification if permission granted
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        const title = `🚨 [STAT BLOOD DISPATCH] ${payload.bloodGroup} Needed Urgently`;
        const options: NotificationOptions = {
          body: `${payload.hospitalName} (${payload.hospitalTaluk || 'Ernakulam'}) has issued an emergency requisition. Your contact details remain 100% private.`,
          icon: '/favicon.ico',
          tag: `blood-dispatch-${payload.caseNumber}`,
          requireInteraction: true,
          badge: '/favicon.ico',
        };

        const notification = new Notification(title, options);
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (err) {
        console.warn('Native notification trigger failed, falling back to in-app toast:', err);
      }
    }

    // 3. Notify internal in-app toast listeners
    for (const listener of this.inAppToastListeners) {
      try {
        listener(payload);
      } catch {}
    }
  }
}

export const pushNotifications = new PushNotificationManager();
