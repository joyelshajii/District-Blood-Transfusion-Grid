/**
 * Clinical Web Audio API Acoustic Dispatch & Telemetry Chime Engine
 * Zero external audio files • 100% Offline Synthesizer • Exponential Decays
 * Provides instantaneous situational awareness for hospital dispatchers and volunteers
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private listeners: Array<(muted: boolean) => void> = [];

  constructor() {
    // Check saved user preference from localStorage
    try {
      const saved = localStorage.getItem('district_grid_audio_muted');
      if (saved !== null) {
        this.muted = saved === 'true';
      }
    } catch {
      this.muted = false;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    try {
      localStorage.setItem('district_grid_audio_muted', String(muted));
    } catch {}
    this.notifyListeners();
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    // If unmuting, play a small confirmation ping
    if (!this.muted) {
      this.playTriageClick();
    }
    return this.muted;
  }

  public subscribe(listener: (muted: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.muted);
      } catch {}
    }
  }

  /**
   * Code Crimson Alert Chime (Level-1 Critical Emergency Requisition)
   * Urgent alternating dual-tone acoustic chime (880Hz -> 659.25Hz pulse)
   */
  public playCodeCrimsonAlert(): void {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Pulse 1: 880 Hz (A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(850, now + 0.18);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.22, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.22);

      // Pulse 2: 659.25 Hz (E5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, now + 0.2);
      osc2.frequency.exponentialRampToValueAtTime(640, now + 0.42);

      gain2.gain.setValueAtTime(0, now + 0.2);
      gain2.gain.linearRampToValueAtTime(0.25, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 0.45);

      // Repeat second pulse for high emergency presence
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(880, now + 0.45);
      gain3.gain.setValueAtTime(0, now + 0.45);
      gain3.gain.linearRampToValueAtTime(0.28, now + 0.47);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.45);
      osc3.stop(now + 0.7);
    } catch (err) {
      console.warn('Audio playback throttled by browser policy:', err);
    }
  }

  /**
   * Acceptance Confirmation Chime
   * Ascending 4-tone harmonic confirmation (C5 -> E5 -> G5 -> C6)
   * Played when a volunteer explicitly confirms acceptance and unmasks contact
   */
  public playAcceptanceSuccessChime(): void {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.16 }, // C5
        { freq: 659.25, time: 0.12, dur: 0.16 }, // E5
        { freq: 783.99, time: 0.24, dur: 0.18 }, // G5
        { freq: 1046.5, time: 0.38, dur: 0.4 },  // C6
      ];

      notes.forEach(({ freq, time, dur }, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(idx === 3 ? 0.25 : 0.16, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }

  /**
   * On-Site QR / Barcode Scan Verification Ping
   * Crisp high-frequency hospital terminal confirmation ping (1046Hz -> 1318Hz)
   */
  public playScanVerifiedChime(): void {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now);
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (err) {
      console.warn('Audio scan ping error:', err);
    }
  }

  /**
   * Subtle Triage Navigation Click (Tactile 320Hz impulse)
   */
  public playTriageClick(): void {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.02);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
