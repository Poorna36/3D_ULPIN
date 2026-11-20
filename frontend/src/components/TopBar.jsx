import CitySelector from './CitySelector.jsx';
import SearchBar from './SearchBar.jsx';

export default function TopBar({ city, onCityChange, onBuildingSelect }) {
  return (
    <header className="topbar glass" id="main-topbar">
      {/* Logo / Brand */}
      <div className="topbar-brand">
        <div className="topbar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
        </div>
        <div>
          <div className="topbar-title">Tesseract</div>
          <div className="topbar-subtitle">Vertical 3D Cadastre Mapping</div>
        </div>
      </div>

      {/* City Selector */}
      <CitySelector city={city} onChange={onCityChange} />

      {/* Search */}
      <SearchBar city={city} onSelect={onBuildingSelect} />

      <style>{`
        .topbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: var(--topbar-h);
          display: flex; align-items: center; gap: var(--gap-lg);
          padding: 0 var(--gap-lg);
          border-radius: 0;
          border-left: none; border-right: none; border-top: none;
          border-bottom: 1px solid #1e293b;
          background: rgba(15, 23, 42, 0.94);
          backdrop-filter: blur(12px);
        }
        .topbar-brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .topbar-logo { flex-shrink: 0; display: flex; align-items: center; }
        .topbar-title {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 14.5px; font-weight: 700; letter-spacing: -0.2px;
          color: #f8fafc;
        }
        .topbar-subtitle {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10.5px; color: #64748b; letter-spacing: 0.1px; margin-top: 1px;
        }

        /* spacer */
        .topbar > .search-wrap { margin-left: auto; }
      `}</style>
    </header>
  );
}
