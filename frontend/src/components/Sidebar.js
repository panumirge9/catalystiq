import React from 'react';
import { FlaskConical, Search, BarChart3, MessageSquarePlus, RefreshCw, Clock, TrendingUp, Rocket } from 'lucide-react';

const workspaceNav = [
  { id: 'discover', icon: Search, label: 'Discover' },
  { id: 'results', icon: BarChart3, label: 'Results' },
  { id: 'feedback', icon: MessageSquarePlus, label: 'Log Experiments' },
  { id: 'retrain', icon: RefreshCw, label: 'Retrain Model' },
  { id: 'history', icon: Clock, label: 'History & Notes' },
];

const gpsNav = [
  { id: 'dashboard', icon: TrendingUp, label: 'Impact Dashboard' },
  { id: 'pilot', icon: Rocket, label: 'Pilot Readiness' },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-row">
          <div className="sidebar-logo-icon">
            <FlaskConical size={16} color="#4a80b8" />
          </div>
          <h1>CatalystIQ</h1>
        </div>
        <span className="sidebar-logo-sub">MOLECULAR DISCOVERY</span>
        <div className="status-chip">
          <div className="status-dot" />
          <span>ONLINE</span>
        </div>
      </div>

      <div className="nav-section">
        <span className="nav-section-label">WORKSPACE</span>
        <nav>
          {workspaceNav.map(({ id, icon: Icon, label }) => (
            <div
              key={id}
              className={`nav-item ${activePage === id ? 'active' : ''}`}
              onClick={() => onNavigate(id)}
            >
              <Icon size={15} />
              {label}
            </div>
          ))}
        </nav>

        <span className="nav-section-label" style={{ marginTop: 16 }}>GPS RENEWABLES</span>
        <nav>
          {gpsNav.map(({ id, icon: Icon, label }) => (
            <div
              key={id}
              className={`nav-item ${activePage === id ? 'active' : ''}`}
              onClick={() => onNavigate(id)}
            >
              <Icon size={15} />
              {label}
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <span className="sidebar-footer-label">CLIENT</span>
        <div className="sidebar-footer-company">GPS Renewables</div>
        <div className="sidebar-footer-sub">Ethanol-to-Jet Programme</div>
        <div className="sidebar-footer-sub">PAN IIT Summit · May 2026</div>
        <div className="sidebar-footer-tag">● THEME 4</div>
      </div>
    </div>
  );
}