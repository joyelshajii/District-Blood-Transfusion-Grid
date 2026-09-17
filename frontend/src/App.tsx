import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HospitalDashboard } from './pages/HospitalDashboard';
import { DonorSimulationPortal } from './pages/DonorSimulationPortal';
import { DonorDirectory } from './pages/DonorDirectory';
import { SlideDeck } from './pages/SlideDeck';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { ArchitectureGuide } from './pages/ArchitectureGuide';
import { api } from './services/api';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('hospital');
  const [donorToken, setDonorToken] = useState<string>('');
  const [showNewRequestModal, setShowNewRequestModal] = useState<boolean>(false);
  const [evaluationDrawerOpen, setEvaluationDrawerOpen] = useState<boolean>(true);
  const [activeRequestsCount, setActiveRequestsCount] = useState<number>(0);

  useEffect(() => {
    // Check URL parameters for direct deep-linking
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const tab = urlParams.get('tab');

    if (token) {
      setDonorToken(token);
      setCurrentTab('donor');
    } else if (tab) {
      setCurrentTab(tab);
    }

    // Fetch initial active count
    api.getRequests().then((reqs) => {
      const active = reqs.filter((r) => r.status === 'OPEN' || r.status === 'DISPATCHED');
      setActiveRequestsCount(active.length);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-red-700 selection:text-white">
      
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewRequestModal={() => {
          setCurrentTab('hospital');
          setShowNewRequestModal(true);
        }}
        onToggleEvaluationDrawer={() => setEvaluationDrawerOpen(!evaluationDrawerOpen)}
        evaluationDrawerOpen={evaluationDrawerOpen}
        activeRequestsCount={activeRequestsCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {currentTab === 'hospital' && (
          <HospitalDashboard
            onNavigateToDonorSimulator={(token) => {
              if (token) setDonorToken(token);
              setCurrentTab('donor');
            }}
            showNewRequestModal={showNewRequestModal}
            setShowNewRequestModal={setShowNewRequestModal}
            evaluationDrawerOpen={evaluationDrawerOpen}
            setEvaluationDrawerOpen={setEvaluationDrawerOpen}
          />
        )}

        {currentTab === 'donor' && (
          <DonorSimulationPortal
            initialToken={donorToken}
            onNavigateToHospital={() => setCurrentTab('hospital')}
          />
        )}

        {currentTab === 'registry' && <DonorDirectory />}

        {currentTab === 'deck' && <SlideDeck />}

        {currentTab === 'architecture' && <ArchitectureGuide />}

        {currentTab === 'privacy' && (
          <PrivacyPolicy onBack={() => setCurrentTab('hospital')} />
        )}

        {currentTab === 'terms' && (
          <TermsConditions onBack={() => setCurrentTab('hospital')} />
        )}
      </main>

      <Footer setCurrentTab={setCurrentTab} />

    </div>
  );
}

export default App;
