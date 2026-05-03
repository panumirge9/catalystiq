import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DiscoverPage from './pages/DiscoverPage';
import ResultsPage from './pages/ResultsPage';
import FeedbackPage from './pages/FeedbackPage';
import RetrainPage from './pages/RetrainPage';
import HistoryPage from './pages/HistoryPage';
import DashboardPage from './pages/DashboardPage';
import PilotPage from './pages/PilotPage';
import './App.css';

export default function App() {
  const [page, setPage] = useState('discover');

  const [results, setResults] = useState(() => {
    try {
      const saved = sessionStorage.getItem('catalystiq_results');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const saveResults = (r) => {
    try { sessionStorage.setItem('catalystiq_results', JSON.stringify(r)); } catch {}
    setResults(r);
  };

  const renderPage = () => {
    switch (page) {
      case 'discover':
        return <DiscoverPage onResults={(r) => { saveResults(r); setPage('results'); }} />;
      case 'results':
        return <ResultsPage results={results} onFeedback={() => setPage('feedback')} onNewSearch={() => setPage('discover')} />;
      case 'feedback':
        return <FeedbackPage results={results} onDone={() => setPage('retrain')} />;
      case 'retrain':
        return <RetrainPage />;
      case 'history':
        return <HistoryPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'pilot':
        return <PilotPage />;
      default:
        return <DiscoverPage onResults={(r) => { saveResults(r); setPage('results'); }} />;
    }
  };

  return (
    <div className="app">
      <Sidebar activePage={page} onNavigate={setPage} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}