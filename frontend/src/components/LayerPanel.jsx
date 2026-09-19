// LayerPanel — left sidebar with animated toggles and DYNAMIC stats
import { useMemo } from 'react';

const LAYER_DEFS = [
  { id: 'google3d',   label: 'Google Photorealistic 3D', icon: '🌐', desc: 'Google 3D Photogrammetry Tileset' },
  { id: 'tileset3d',  label: '3D Real Buildings (OSM)', icon: '🏙', desc: 'Detailed architectural 3D structures' },
  { id: 'shadows',    label: 'Sun & Shadows',          icon: '☀', desc: 'Solar shadows & atmospheric lighting' },
  { id: 'parcels',    label: 'Parcel Boundaries',      icon: '◻', desc: '2D cadastral plots' },
  { id: 'buildings',  label: 'ULPIN Property Sheath',  icon: '⬡', desc: 'Cadastral glass volumes' },
  { id: 'interior',   label: 'Interior X-Ray',         icon: '🔬', desc: 'Corridors & floor slabs (selected)' },
  { id: 'volumes',    label: 'Floor Strata Volumes',   icon: '⬢', desc: 'Floor & unit property levels' },
  { id: 'underground',label: 'Underground Infrastructure', icon: '⊗', desc: 'Subsurface metro & utilities' },
];

export default function LayerPanel({ layers, onToggle, buildings, currentCity, onCityChange, onResetOrbit }) {
  const stats = useMemo(() => {
    if (!buildings?.length) return { total: 0, valid: 0, review: 0, invalid: 0, underground: 0 };
    return {
      total:       buildings.length,
      valid:       buildings.filter(b => b.validation_status === 'VALID').length,
      review:      buildings.filter(b => b.validation_status === 'REVIEW').length,
      invalid:     buildings.filter(b => b.validation_status === 'INVALID').length,
      underground: buildings.filter(b => b.is_underground).length,
    };
  }, [buildings]);

  const hasSynthetic = buildings?.some(b => b.data_label === 'SYNTHETIC');

  return (
    <aside className="layer-panel glass anim-slide-left" id="layer-panel" aria-label="Layer controls">
      {/* Pilot Cities section on the side */}
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Pilot Cities</h3>
        {onResetOrbit && (
          <button
            className="btn-orbit-reset"
            onClick={onResetOrbit}
            title="Reset view to full Earth space orbit"
          >
            🌍 Space View
          </button>
        )}
      </div>
      <div className="city-pilot-grid">
        <button
          className={`pilot-card ${currentCity === 'bengaluru' ? 'pilot-card--active' : ''}`}
          onClick={() => onCityChange('bengaluru')}
          title="Zoom to Bengaluru Pilot (India)"
        >
          <div className="pilot-card-top">
            <span className="pilot-flag">🇮🇳</span>
            <span className="pilot-name">Bengaluru</span>
          </div>
          <div className="pilot-desc">Primary Pilot • Urban High-Rise Cadastre</div>
        </button>

        <button
          className={`pilot-card ${currentCity === 'mumbai' ? 'pilot-card--active' : ''}`}
          onClick={() => onCityChange('mumbai')}
          title="Zoom to Mumbai Pilot (India)"
        >
          <div className="pilot-card-top">
            <span className="pilot-flag">🇮🇳</span>
            <span className="pilot-name">Mumbai</span>
          </div>
          <div className="pilot-desc">Indian Validation • Vertical Density & Podiums</div>
        </button>

        <button
          className={`pilot-card ${currentCity === 'netherlands' ? 'pilot-card--active' : ''}`}
          onClick={() => onCityChange('netherlands')}
          title="Zoom to Rotterdam Pilot (Netherlands)"
        >
          <div className="pilot-card-top">
            <span className="pilot-flag">🇳🇱</span>
            <span className="pilot-name">Rotterdam (NL)</span>
          </div>
          <div className="pilot-desc">BAG 3D & AHN4 LiDAR Benchmark</div>
        </button>

        <button
          className={`pilot-card ${currentCity === 'singapore' ? 'pilot-card--active' : ''}`}
          onClick={() => onCityChange('singapore')}
          title="Zoom to Singapore Pilot (Singapore)"
        >
          <div className="pilot-card-top">
            <span className="pilot-flag">🇸🇬</span>
            <span className="pilot-name">Singapore</span>
          </div>
          <div className="pilot-desc">International Benchmark • Strata & Caverns</div>
        </button>
      </div>

      <div className="divider" style={{ margin: '12px 0 10px 0' }} />

      <div className="panel-header">
        <h3>Layers</h3>
      </div>
      <div className="divider" style={{ margin: '0 0 8px 0' }} />

      <div className="layer-list">
        {LAYER_DEFS.map(l => (
          <label key={l.id} className="toggle-wrap" htmlFor={`layer-toggle-${l.id}`}>
            <div className="layer-info">
              <span className="layer-icon">{l.icon}</span>
              <div>
                <div className="layer-label">{l.label}</div>
                <div className="layer-desc">{l.desc}</div>
              </div>
            </div>
            <span className="toggle">
              <input
                id={`layer-toggle-${l.id}`}
                type="checkbox"
                checked={layers[l.id] ?? true}
                onChange={() => onToggle(l.id)}
              />
              <span className="toggle-track" />
              <span className="toggle-thumb" />
            </span>
          </label>
        ))}
      </div>

      <div className="divider" />
      <div className="panel-header"><h3>Statistics</h3></div>
      <div className="stat-grid">
        <div className="stat-item">
          <div className="stat-value cyan">{stats.total}</div>
          <div className="stat-label">Buildings</div>
        </div>
        <div className="stat-item">
          <div className="stat-value green">{stats.valid}</div>
          <div className="stat-label">VALID</div>
        </div>
        <div className="stat-item">
          <div className="stat-value amber">{stats.review}</div>
          <div className="stat-label">REVIEW</div>
        </div>
        <div className="stat-item">
          <div className="stat-value violet">{stats.underground}</div>
          <div className="stat-label">Underground</div>
        </div>
      </div>

      {/* Validation summary bar */}
      {stats.total > 0 && (
        <div style={{ padding: '8px 0 4px' }}>
          <div className="section-label" style={{ marginBottom: '6px' }}>Validation</div>
          <div className="val-bar-wrap">
            <div
              className="val-bar-fill val-valid"
              style={{ width: `${(stats.valid / stats.total) * 100}%` }}
              title={`Valid: ${stats.valid}`}
            />
            <div
              className="val-bar-fill val-review"
              style={{ width: `${(stats.review / stats.total) * 100}%` }}
              title={`Review: ${stats.review}`}
            />
            <div
              className="val-bar-fill val-invalid"
              style={{ width: `${(stats.invalid / stats.total) * 100}%` }}
              title={`Invalid: ${stats.invalid}`}
            />
          </div>
          <div className="val-legend">
            <span><span className="legend-dot" style={{ background: 'var(--green)' }} />Valid</span>
            <span><span className="legend-dot" style={{ background: 'var(--amber)' }} />Review</span>
            {stats.invalid > 0 && <span><span className="legend-dot" style={{ background: 'var(--red)' }} />Invalid</span>}
          </div>
        </div>
      )}

      {hasSynthetic && (
        <>
          <div className="divider" />
          <div className="panel-footer-note">
            <span className="badge badge-synthetic" style={{ fontSize: '10px' }}>SYNTHETIC</span>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginLeft: '6px' }}>
              Underground volumes are demo fixtures
            </span>
          </div>
        </>
      )}

      <style>{`
        .layer-panel {
          position: fixed;
          top: var(--topbar-h); left: 0; bottom: 0;
          width: var(--panel-w);
          display: flex; flex-direction: column;
          padding: var(--gap-md);
          overflow-y: auto;
          border-radius: 0; border-left: none; border-top: none; border-bottom: none;
          border-right: 1px solid var(--border);
          z-index: 50;
        }
        .panel-header { margin-bottom: 4px; }
        .layer-list { display: flex; flex-direction: column; gap: 2px; }
        .layer-info { display: flex; align-items: center; gap: 10px; }
        .layer-icon { font-size: 16px; color: var(--cyan); width: 20px; text-align: center; }
        .layer-label { font-size: 13px; font-weight: 500; color: var(--text-primary); }
        .layer-desc  { font-size: 11px; color: var(--text-dim); margin-top: 1px; }
        .stat-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: var(--gap-sm);
          margin-top: var(--gap-sm);
        }
        .stat-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          padding: 10px;
          text-align: center;
          transition: border-color var(--t-fast);
        }
        .stat-item:hover { border-color: var(--border-strong); }
        .stat-value { font-size: 22px; font-weight: 700; font-family: var(--font-mono); }
        .stat-label { font-size: 10px; color: var(--text-dim); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
        .cyan   { color: var(--cyan); }
        .green  { color: var(--green); }
        .amber  { color: var(--amber); }
        .violet { color: var(--violet); }
        .panel-footer-note { display: flex; align-items: center; flex-wrap: wrap; }

        /* Validation bar */
        .val-bar-wrap {
          display: flex; height: 6px;
          border-radius: var(--r-pill);
          overflow: hidden;
          background: rgba(255,255,255,0.05);
        }
        .val-bar-fill { transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
        .val-valid  { background: var(--green); }
        .val-review { background: var(--amber); }
        .val-invalid{ background: var(--red); }
        .val-legend {
          display: flex; gap: 10px; margin-top: 5px;
          font-size: 10px; color: var(--text-dim);
        }
        .legend-dot {
          display: inline-block; width: 6px; height: 6px;
          border-radius: 50%; margin-right: 3px;
          vertical-align: middle;
        }
        .city-pilot-grid {
          display: flex; flex-direction: column; gap: 6px;
          margin-top: 6px;
        }
        .pilot-card {
          display: flex; flex-direction: column; align-items: flex-start;
          width: 100%; text-align: left;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          padding: 8px 10px;
          cursor: pointer;
          transition: all var(--t-fast);
        }
        .pilot-card:hover {
          background: rgba(0,212,255,0.08);
          border-color: var(--cyan);
        }
        .pilot-card--active {
          background: rgba(0,212,255,0.12);
          border-color: var(--cyan);
          box-shadow: 0 0 12px rgba(0,212,255,0.25);
        }
        .pilot-card-top {
          display: flex; align-items: center; gap: 6px;
        }
        .pilot-flag { font-size: 14px; }
        .pilot-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .pilot-card--active .pilot-name { color: var(--cyan); }
        .pilot-desc { font-size: 10px; color: var(--text-dim); margin-top: 2px; }

        .btn-orbit-reset {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: var(--r-pill);
          color: var(--text-secondary);
          font-size: 11px; font-weight: 500;
          padding: 3px 8px; cursor: pointer;
          transition: all var(--t-fast);
        }
        .btn-orbit-reset:hover {
          background: rgba(0,212,255,0.12);
          border-color: var(--cyan);
          color: var(--cyan);
        }
      `}</style>
    </aside>
  );
}
