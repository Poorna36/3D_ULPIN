import CitySelector from './CitySelector.jsx';
import SearchBar from './SearchBar.jsx';

export default function TopBar({ city, onCityChange, onBuildingSelect, aiStatus }) {
  return (
    <header className="topbar glass" id="main-topbar">
      {/* Logo / Brand */}
      <div className="topbar-brand">
        <div className="topbar-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="url(#logo-grad)"/>
            <path d="M8 20V10l6-4 6 4v10" stroke="#fff" strokeWidth="1.5" fill="none"/>
            <rect x="11" y="14" width="6" height="6" rx="1" fill="rgba(255,255,255,0.3)"/>
            <rect x="12.5" y="8" width="3" height="3" rx="0.5" fill="rgba(0,212,255,0.9)"/>
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="28" y2="28">
                <stop offset="0%" stopColor="#0a2a5e"/>
                <stop offset="100%" stopColor="#7c3aed"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div className="topbar-title">3D ULPIN</div>
          <div className="topbar-subtitle">Vertical Property Mapping • SIH 2026</div>
        </div>
      </div>

      {/* City Selector */}
      <CitySelector city={city} onChange={onCityChange} />

      {/* Search */}
      <SearchBar city={city} onSelect={onBuildingSelect} />

      {/* AI Status pill */}
      <div className="ai-status-pill" title="AI/ML pipeline status">
        <span className={`ai-dot ${aiStatus === 'idle' ? 'ai-dot--idle' : aiStatus === 'running' ? 'ai-dot--running' : 'ai-dot--done'}`} />
        <span className="ai-label">
          {aiStatus === 'idle' ? 'AI Pipeline Ready' : aiStatus === 'running' ? 'Processing…' : 'Pipeline Complete'}
        </span>
      </div>

      <style>{`
        .topbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: var(--topbar-h);
          display: flex; align-items: center; gap: var(--gap-lg);
          padding: 0 var(--gap-lg);
          border-radius: 0;
          border-left: none; border-right: none; border-top: none;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(7, 8, 10, 0.88);
          backdrop-filter: blur(20px) saturate(1.8);
        }
        .topbar-brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .topbar-logo { flex-shrink: 0; }
        .topbar-title {
          font-family: 'Syne', 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 800; letter-spacing: -0.4px;
          background: linear-gradient(90deg, #a78bfa, #06b6d4);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .topbar-subtitle {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 10px; color: #4b5563; letter-spacing: 0.3px; margin-top: 1px;
        }

        /* spacer */
        .topbar > .search-wrap { margin-left: auto; }

        .ai-status-pill {
          display: flex; align-items: center; gap: 7px;
          background: rgba(124,58,237,0.08);
          border: 1px solid rgba(124,58,237,0.20);
          border-radius: var(--r-pill);
          padding: 5px 12px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px; color: #9ca3af;
          flex-shrink: 0;
        }
        .ai-dot {
          width: 7px; height: 7px; border-radius: 50%;
          flex-shrink: 0;
        }
        .ai-dot--idle    { background: #4b5563; }
        .ai-dot--running { background: var(--cyan); animation: pulse-dot 1s ease infinite; }
        .ai-dot--done    { background: var(--green); }
      `}</style>
    </header>
  );
}
