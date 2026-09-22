// CitySelector — multi-city tab switcher for real Earth pilots
const EARTH_CITIES = [
  { id: 'bengaluru',   label: 'Bengaluru',      code: 'BLR', desc: 'Primary Indian Pilot — High-rise urban cadastre' },
  { id: 'netherlands', label: 'Rotterdam (NL)', code: 'RTM', desc: 'European Geospatial Benchmark — BAG 3D & AHN4 LiDAR' },
  { id: 'mumbai',      label: 'Mumbai',         code: 'BOM', desc: 'Indian Validation City — Vertical density' },
  { id: 'singapore',   label: 'Singapore',      code: 'SIN', desc: 'International Strata Benchmark' },
];

export default function CitySelector({ city, onChange }) {
  return (
    <div className="city-selector-bar" role="tablist" aria-label="Cadastre realm selector">
      <div className="city-group earth-group">
        <span className="realm-tag">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: '-1px', marginRight: 4 }}>
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20"/>
          </svg>
          PILOTS
        </span>
        {EARTH_CITIES.map(c => {
          const isActive = city === c.id;
          return (
            <button
              key={c.id}
              id={`city-tab-${c.id}`}
              role="tab"
              aria-selected={isActive}
              className={`city-tab ${isActive ? 'city-tab--active' : ''}`}
              onClick={() => onChange(c.id, 'globe')}
              title={c.desc}
            >
              <span className="city-code-tag">{c.code}</span>
              <span className="city-name">{c.label}</span>
              {isActive && <span className="city-active-dot" />}
            </button>
          );
        })}
      </div>

      <style>{`
        .city-selector-bar {
          display: flex; align-items: center;
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--r-pill);
          padding: 3px 6px; gap: 4px;
          flex-shrink: 0;
          backdrop-filter: blur(16px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.8);
        }
        .city-group {
          display: flex; align-items: center; gap: 2px;
        }
        .realm-tag {
          font-size: 9px; font-weight: 800;
          color: rgba(255, 255, 255, 0.50); letter-spacing: 0.6px;
          padding: 2px 6px; margin-right: 2px;
        }
        .city-tab {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px;
          border-radius: var(--r-pill);
          border: 1px solid transparent; background: transparent;
          color: rgba(255, 255, 255, 0.65);
          font-family: var(--font-ui);
          font-size: 12px; font-weight: 500;
          cursor: pointer;
          transition: all var(--t-fast);
          position: relative;
          white-space: nowrap;
        }
        .city-tab:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }
        .city-tab--active {
          background: #0e0e11;
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.25);
        }
        .city-code-tag {
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 1px 5px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.70);
        }
        .city-tab--active .city-code-tag {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
        }
        .city-active-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.85);
          animation: pulse-dot 2s ease infinite;
        }
      `}</style>
    </div>
  );
}
