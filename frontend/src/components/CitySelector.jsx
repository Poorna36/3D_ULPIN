// CitySelector — multi-city tab switcher separating real Earth pilots from the off-globe Night City twin
const EARTH_CITIES = [
  { id: 'bengaluru',   label: 'Bengaluru',      flag: '🇮🇳', desc: 'Primary Indian Pilot — High-rise urban cadastre' },
  { id: 'netherlands', label: 'Rotterdam (NL)', flag: '🇳🇱', desc: 'European Geospatial Benchmark — BAG 3D & AHN4 LiDAR' },
  { id: 'mumbai',      label: 'Mumbai',         flag: '🇮🇳', desc: 'Indian Validation City — Vertical density' },
  { id: 'singapore',   label: 'Singapore',      flag: '🇸🇬', desc: 'International Strata Benchmark' },
];

export default function CitySelector({ city, activeRealm = 'globe', onChange }) {
  const isSimCityActive   = activeRealm === 'simcity' || city === 'simcity';
  const isNightCityActive = activeRealm === 'night_city' || city === 'simulation';

  return (
    <div className="city-selector-bar" role="tablist" aria-label="Cadastre realm selector">
      {/* 1. Earth Pilot Cities Group */}
      <div className="city-group earth-group">
        <span className="realm-tag">🌍 EARTH</span>
        {EARTH_CITIES.map(c => {
          const isActive = !isSimCityActive && !isNightCityActive && city === c.id;
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
              <span className="city-flag">{c.flag}</span>
              <span className="city-name">{c.label}</span>
              {isActive && <span className="city-active-dot" />}
            </button>
          );
        })}
      </div>

      <div className="realm-divider" />

      {/* 2. Off-Globe Simulation Twin Labs */}
      <div className="city-group simcity-group">
        <button
          id="city-tab-simcity"
          role="tab"
          aria-selected={isSimCityActive}
          className={`city-tab city-tab--simcity ${isSimCityActive ? 'city-tab--simcity-active' : ''}`}
          onClick={() => onChange('simcity', 'simcity')}
          title="Explore the Riverview Metropolis 3D SimCity Urban Planning & Zoning Twin"
        >
          <span className="city-flag">🎮</span>
          <span className="city-name">SimCity (Twin Lab)</span>
          {isSimCityActive && <span className="simcity-pulse-indicator" />}
        </button>

        <button
          id="city-tab-night-city"
          role="tab"
          aria-selected={isNightCityActive}
          className={`city-tab city-tab--sim ${isNightCityActive ? 'city-tab--sim-active' : ''}`}
          onClick={() => onChange('simulation', 'night_city')}
          title="Cyberpunk Matrix"
        >
          <span className="city-flag">🌆</span>
          <span className="city-name">Night City</span>
        </button>
      </div>

      <style>{`
        .city-selector-bar {
          display: flex; align-items: center;
          background: rgba(10, 14, 26, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--r-pill);
          padding: 3px 6px; gap: 4px;
          flex-shrink: 0;
          backdrop-filter: blur(16px);
        }
        .city-group {
          display: flex; align-items: center; gap: 2px;
        }
        .realm-tag {
          font-size: 9px; font-weight: 800;
          color: #38bdf8; letter-spacing: 0.6px;
          padding: 2px 6px; margin-right: 2px;
          opacity: 0.8;
        }
        .realm-divider {
          width: 1px; height: 18px;
          background: rgba(255, 255, 255, 0.12);
          margin: 0 4px;
        }
        .city-tab {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px;
          border-radius: var(--r-pill);
          border: none; background: transparent;
          color: var(--text-secondary);
          font-family: var(--font-ui);
          font-size: 12px; font-weight: 500;
          cursor: pointer;
          transition: background var(--t-normal), color var(--t-normal), box-shadow var(--t-normal);
          position: relative;
          white-space: nowrap;
        }
        .city-tab:hover { color: var(--text-primary); background: rgba(255,255,255,0.06); }
        .city-tab--active {
          background: var(--cyan-dim);
          color: var(--cyan);
          box-shadow: var(--cyan-glow);
        }
        .city-flag { font-size: 13px; line-height: 1; }
        .city-active-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 6px var(--cyan);
          animation: pulse-dot 2s ease infinite;
        }

        /* SimCity Tab Styling */
        .city-tab--simcity {
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.35);
          background: rgba(37, 99, 235, 0.1);
        }
        .city-tab--simcity:hover {
          background: rgba(37, 99, 235, 0.22);
          color: #ffffff;
          box-shadow: 0 0 14px rgba(59, 130, 246, 0.4);
        }
        .city-tab--simcity-active {
          background: rgba(37, 99, 235, 0.35) !important;
          color: #ffffff !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 18px rgba(59, 130, 246, 0.6) !important;
        }
        .simcity-pulse-indicator {
          width: 6px; height: 6px; border-radius: 50%;
          background: #38bdf8; box-shadow: 0 0 8px #38bdf8;
          animation: pulse-dot 1.8s infinite;
        }

        /* Distinct Night City Tab Styling */
        .city-tab--sim {
          color: #f472b6;
          border: 1px solid rgba(236, 72, 153, 0.25);
          background: rgba(236, 72, 153, 0.06);
        }
        .city-tab--sim:hover {
          background: rgba(236, 72, 153, 0.15);
          color: #ffffff;
          box-shadow: 0 0 12px rgba(236, 72, 153, 0.35);
        }
        .city-tab--sim-active {
          background: rgba(236, 72, 153, 0.28) !important;
          color: #ffffff !important;
          border-color: #ec4899 !important;
          box-shadow: 0 0 16px rgba(236, 72, 153, 0.5) !important;
        }
        .sim-pulse-indicator {
          width: 6px; height: 6px; border-radius: 50%;
          background: #ec4899;
          box-shadow: 0 0 8px #ec4899;
          animation: pulse-dot 1.5s ease infinite;
        }
      `}</style>
    </div>
  );
}
