// CitySelector — multi-city tab switcher with focus on Bengaluru & Rotterdam (Netherlands)
const CITY_TABS = [
  { id: 'bengaluru',   label: 'Bengaluru',         flag: '🇮🇳', desc: 'Primary Indian Pilot — High-rise urban cadastre' },
  { id: 'netherlands', label: 'Rotterdam (NL)',    flag: '🇳🇱', desc: 'European Geospatial Benchmark — BAG 3D & AHN4 LiDAR' },
  { id: 'mumbai',      label: 'Mumbai',            flag: '🇮🇳', desc: 'Indian Validation City — Vertical density' },
  { id: 'singapore',   label: 'Singapore',         flag: '🇸🇬', desc: 'International Strata Benchmark' },
];

export default function CitySelector({ city, onChange }) {
  return (
    <div className="city-selector" role="tablist" aria-label="City selector">
      {CITY_TABS.map(c => (
        <button
          key={c.id}
          id={`city-tab-${c.id}`}
          role="tab"
          aria-selected={city === c.id}
          className={`city-tab ${city === c.id ? 'city-tab--active' : ''}`}
          onClick={() => onChange(c.id)}
          title={c.desc}
        >
          <span className="city-flag">{c.flag}</span>
          <span className="city-name">{c.label}</span>
          {city === c.id && <span className="city-active-dot" />}
        </button>
      ))}
      <style>{`
        .city-selector {
          display: flex; align-items: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: var(--r-pill);
          padding: 3px; gap: 2px;
          flex-shrink: 0;
        }
        .city-tab {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 14px;
          border-radius: var(--r-pill);
          border: none; background: transparent;
          color: var(--text-secondary);
          font-family: var(--font-ui);
          font-size: 13px; font-weight: 500;
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
        .city-flag { font-size: 14px; line-height: 1; }
        .city-active-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 6px var(--cyan);
          animation: pulse-dot 2s ease infinite;
        }
      `}</style>
    </div>
  );
}
