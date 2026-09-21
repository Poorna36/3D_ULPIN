// LayerPanel — floating left drawer with animated toggles, dynamic stats, and standards stack
import { useMemo } from 'react';

const LAYER_DEFS = [
  { id: 'google3d',   label: 'Google Photorealistic 3D', icon: '◒', tag: 'MESH',   desc: 'Global photogrammetric 3D tile mesh', color: '#38bdf8' },
  { id: 'tileset3d',  label: '3D Buildings (LoD2 Geometry)', icon: '◈', tag: 'LOD2',   desc: 'OpenStreetMap & municipal LoD2 geometry', color: '#f59e0b' },
  { id: 'parcels',    label: 'NAKSHA Cadastral Parcels (Class S)', icon: '◻', tag: 'DoLR',   desc: '2D cadastre plots & statutory tolerance anchors', color: '#10b981' },
  { id: 'buildings',  label: 'LiDAR Envelopes (Class B)', icon: '⬡', tag: 'LiDAR',  desc: 'Airborne LiDAR (E1) extruded envelopes & ULPIN tags', color: '#00e5ff' },
  { id: 'volumes',    label: 'Vertical Storey Slabs (Class L)', icon: '⬢', tag: 'STRATA', desc: 'Volumetric storey plates & strata division bands', color: '#818cf8' },
  { id: 'interior',   label: 'BIM Interior Layout (Class U & C)', icon: '◫', tag: 'openBIM',desc: 'As-built BIM units, corridors & stairwells', color: '#c084fc' },
  { id: 'underground',label: 'Subterranean & Utilities (Class T & I)', icon: '⊗', tag: 'GPR',   desc: 'Deep metro tunnels & underground utility networks', color: '#f43f5e' },
  { id: 'shadows',    label: 'Sun & Shadow Analysis',    icon: '○', tag: 'SOLAR', desc: 'Real-time solar path & volumetric shadowing', color: '#facc15' },
];

export default function LayerPanel({
  layers = {},
  onToggle,
  buildings = [],
  currentCity,
  onCityChange,
  onResetOrbit,
  onClose,
}) {
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

  const activeCount = useMemo(() => {
    return LAYER_DEFS.filter(l => layers[l.id] ?? true).length;
  }, [layers]);

  const handleToggleAll = (enable) => {
    LAYER_DEFS.forEach(l => {
      const current = layers[l.id] ?? true;
      if (current !== enable && onToggle) {
        onToggle(l.id);
      }
    });
  };

  return (
    <aside className="layer-panel anim-slide-left" id="layer-panel" aria-label="Cadastral Layer Controls">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="lp-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="lp-header-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div>
            <h3 className="lp-title">Cadastral Layers</h3>
            <div className="lp-subtitle">{activeCount} of {LAYER_DEFS.length} active feeds</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {onClose && (
            <button
              onClick={onClose}
              className="lp-close-btn"
              title="Close Layers Panel"
              aria-label="Close Layers Panel"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Quick Layer Action Bar ──────────────────────────────────────── */}
      <div className="lp-quick-actions">
        <button
          className="lp-btn-action"
          onClick={() => handleToggleAll(true)}
          title="Enable all layers"
        >
          Enable All
        </button>
        <button
          className="lp-btn-action"
          onClick={() => handleToggleAll(false)}
          title="Disable all layers"
        >
          Clear All
        </button>
        {onResetOrbit && (
          <button
            className="lp-btn-action"
            onClick={onResetOrbit}
            title="Reset to Global Earth space orbit"
            style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" />
            </svg>
            <span>Orbit</span>
          </button>
        )}
      </div>

      <div className="lp-scroll-area">
        {/* ── Layer Toggles List ────────────────────────────────────────── */}
        <div className="lp-section-header">
          <span>SPATIAL DATASETS</span>
          <span className="lp-count-badge">{activeCount}/{LAYER_DEFS.length}</span>
        </div>

        <div className="lp-layer-list">
          {LAYER_DEFS.map(l => {
            const isChecked = layers[l.id] ?? (l.id !== 'shadows');
            return (
              <label
                key={l.id}
                className={`lp-toggle-row ${isChecked ? 'lp-toggle-row--active' : ''}`}
                htmlFor={`layer-toggle-${l.id}`}
              >
                <div className="lp-layer-info">
                  <span className="lp-layer-icon" style={{ color: l.color }}>{l.icon}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="lp-layer-label">{l.label}</span>
                      <span className="lp-tag" style={{ color: l.color, borderColor: `${l.color}40`, background: `${l.color}15` }}>
                        {l.tag}
                      </span>
                    </div>
                    <div className="lp-layer-desc">{l.desc}</div>
                  </div>
                </div>

                <div className="lp-switch-wrapper">
                  <input
                    id={`layer-toggle-${l.id}`}
                    type="checkbox"
                    className="lp-switch-input"
                    checked={isChecked}
                    onChange={() => onToggle && onToggle(l.id)}
                  />
                  <div className={`lp-switch-slider ${isChecked ? 'lp-switch-slider--on' : ''}`}>
                    <div className="lp-switch-thumb" />
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* ── Pilot Cities Quick Jump ─────────────────────────────────── */}
        <div className="lp-divider" />
        <div className="lp-section-header">
          <span>PILOT CITIES</span>
          {currentCity && <span className="lp-active-city-tag">{currentCity.toUpperCase()}</span>}
        </div>

        <div className="lp-city-grid">
          {[
            { id: 'bengaluru', name: 'Bengaluru', code: 'BLR', desc: 'Urban High-Rise Cadastre', color: '#00d4ff' },
            { id: 'mumbai',    name: 'Mumbai',    code: 'BOM', desc: 'Vertical Density & Podiums', color: '#10d97e' },
            { id: 'netherlands', name: 'Rotterdam (NL)', code: 'RTM', desc: 'BAG 3D & AHN4 LiDAR', color: '#f59e0b' },
            { id: 'singapore', name: 'Singapore', code: 'SIN', desc: 'Strata Benchmarks & Caverns', color: '#a855f7' },
          ].map(city => (
            <button
              key={city.id}
              className={`lp-pilot-card ${currentCity === city.id ? 'lp-pilot-card--active' : ''}`}
              onClick={() => onCityChange && onCityChange(city.id)}
              title={`Fly to ${city.name}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span className="lp-pilot-code" style={{ color: city.color }}>{city.code}</span>
                <span className="lp-pilot-name">{city.name}</span>
              </div>
              <div className="lp-pilot-desc">{city.desc}</div>
            </button>
          ))}
        </div>

        {/* ── Cadastral Statistics ────────────────────────────────────── */}
        {stats.total > 0 && (
          <>
            <div className="lp-divider" />
            <div className="lp-section-header">
              <span>ACTIVE CITY REGISTRY</span>
              <span className="lp-count-badge">{stats.total} PARCELS</span>
            </div>

            <div className="lp-stat-grid">
              <div className="lp-stat-card">
                <div className="lp-stat-val" style={{ color: '#38bdf8' }}>{stats.total}</div>
                <div className="lp-stat-lbl">Structures</div>
              </div>
              <div className="lp-stat-card">
                <div className="lp-stat-val" style={{ color: '#34d399' }}>{stats.valid}</div>
                <div className="lp-stat-lbl">VALID</div>
              </div>
              <div className="lp-stat-card">
                <div className="lp-stat-val" style={{ color: '#fbbf24' }}>{stats.review}</div>
                <div className="lp-stat-lbl">REVIEW</div>
              </div>
              <div className="lp-stat-card">
                <div className="lp-stat-val" style={{ color: '#c084fc' }}>{stats.underground}</div>
                <div className="lp-stat-lbl">Underground</div>
              </div>
            </div>

            {/* Validation bar */}
            <div style={{ marginTop: '10px' }}>
              <div className="lp-val-bar">
                <div className="lp-val-fill" style={{ width: `${(stats.valid / stats.total) * 100}%`, background: '#34d399' }} />
                <div className="lp-val-fill" style={{ width: `${(stats.review / stats.total) * 100}%`, background: '#fbbf24' }} />
                <div className="lp-val-fill" style={{ width: `${(stats.invalid / stats.total) * 100}%`, background: '#ef4444' }} />
              </div>
              <div className="lp-val-legend">
                <span><span className="lp-dot" style={{ background: '#34d399' }} />Valid</span>
                <span><span className="lp-dot" style={{ background: '#fbbf24' }} />Review</span>
                {stats.invalid > 0 && <span><span className="lp-dot" style={{ background: '#ef4444' }} />Invalid</span>}
              </div>
            </div>
          </>
        )}

        {/* ── Standards & Evidence Stack ──────────────────────────────── */}
        <div className="lp-divider" />
        <div className="lp-section-header">
          <span>STANDARDS & EVIDENCE</span>
        </div>
        <div className="lp-evidence-list">
          <div className="lp-evidence-row">
            <span>NAKSHA 5% Precedent</span>
            <span className="lp-evidence-mono" style={{ color: '#34d399' }}>2σ_c = 0.34m</span>
          </div>
          <div className="lp-evidence-row">
            <span>Airborne LiDAR (E1)</span>
            <span className="lp-evidence-mono" style={{ color: '#38bdf8' }}>KPConv / U-Net</span>
          </div>
          <div className="lp-evidence-row">
            <span>BIM / As-Built (E4)</span>
            <span className="lp-evidence-mono" style={{ color: '#a78bfa' }}>IFC 4.3 Space</span>
          </div>
          <div className="lp-evidence-row">
            <span>SoI CORS Covariance</span>
            <span className="lp-evidence-mono" style={{ color: '#f59e0b' }}>σ_xy: 2.4cm</span>
          </div>
          <div className="lp-evidence-row">
            <span>Subsurface GPR (E5)</span>
            <span className="lp-evidence-mono" style={{ color: '#f43f5e' }}>Tunnels & Drains</span>
          </div>
        </div>
      </div>

      <style>{`
        .layer-panel {
          position: fixed;
          top: 60px;
          left: 16px;
          bottom: 68px;
          width: 340px;
          max-width: calc(100vw - 32px);
          display: flex;
          flex-direction: column;
          background: #18181b !important;
          border: 1px solid #27272a !important;
          border-radius: 12px !important;
          z-index: 95;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.2);
          user-select: none;
          overflow: hidden;
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .lp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-bottom: 1px solid #27272a;
          background: #141416;
        }

        .lp-header-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lp-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #f4f4f5;
          margin: 0;
          line-height: 1.2;
        }

        .lp-subtitle {
          font-size: 11px;
          color: #71717a;
          margin-top: 1px;
        }

        .lp-close-btn {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: #27272a;
          border: 1px solid #3f3f46;
          color: #a1a1aa;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.15s ease;
        }

        .lp-close-btn:hover {
          background: #3f3f46;
          color: #ffffff;
          border-color: #52525b;
        }

        .lp-quick-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-bottom: 1px solid #27272a;
          background: #18181b;
        }

        .lp-btn-action {
          background: #27272a;
          border: 1px solid #3f3f46;
          border-radius: 6px;
          color: #d4d4d8;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 9px;
          cursor: pointer;
          transition: all 0.12s;
        }

        .lp-btn-action:hover {
          background: #38bdf8;
          color: #09090b;
          border-color: #38bdf8;
        }

        .lp-scroll-area {
          flex: 1;
          overflow-y: auto;
          padding: 10px 14px;
          scrollbar-width: thin;
          scrollbar-color: #3f3f46 transparent;
        }

        .lp-scroll-area::-webkit-scrollbar {
          width: 5px;
        }
        .lp-scroll-area::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 3px;
        }

        .lp-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.6px;
          color: #71717a;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .lp-count-badge {
          background: #27272a;
          color: #a1a1aa;
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 9.5px;
          font-family: monospace;
        }

        .lp-active-city-tag {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 9.5px;
          font-weight: 700;
        }

        .lp-layer-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .lp-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          border-radius: 8px;
          background: #1f1f23;
          border: 1px solid #27272a;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .lp-toggle-row:hover {
          background: #27272a;
          border-color: #3f3f46;
        }

        .lp-toggle-row--active {
          border-color: rgba(255, 255, 255, 0.15);
        }

        .lp-layer-info {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          flex: 1;
        }

        .lp-layer-icon {
          font-size: 15px;
          width: 18px;
          text-align: center;
          flex-shrink: 0;
        }

        .lp-layer-label {
          font-size: 12px;
          font-weight: 600;
          color: #f4f4f5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lp-tag {
          font-size: 8.5px;
          font-weight: 700;
          padding: 0.5px 4px;
          border-radius: 3px;
          border: 1px solid transparent;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .lp-layer-desc {
          font-size: 10px;
          color: #71717a;
          margin-top: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Switch Slider ─────────────────────────────────────────── */
        .lp-switch-wrapper {
          position: relative;
          width: 36px;
          height: 20px;
          flex-shrink: 0;
          margin-left: 8px;
        }

        .lp-switch-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .lp-switch-slider {
          position: absolute;
          inset: 0;
          background: #27272a;
          border: 1px solid #3f3f46;
          border-radius: 999px;
          transition: all 0.18s ease;
        }

        .lp-switch-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 14px;
          height: 14px;
          background: #71717a;
          border-radius: 50%;
          transition: transform 0.18s ease, background 0.18s ease;
        }

        .lp-switch-slider--on {
          background: #0284c7;
          border-color: #38bdf8;
          box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
        }

        .lp-switch-slider--on .lp-switch-thumb {
          transform: translateX(16px);
          background: #ffffff;
        }

        .lp-divider {
          height: 1px;
          background: #27272a;
          margin: 12px 0 10px 0;
        }

        /* ── City Grid ─────────────────────────────────────────────── */
        .lp-city-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .lp-pilot-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          background: #1f1f23;
          border: 1px solid #27272a;
          border-radius: 8px;
          padding: 7px 9px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .lp-pilot-card:hover {
          background: #27272a;
          border-color: #38bdf8;
        }

        .lp-pilot-card--active {
          background: rgba(56, 189, 248, 0.12);
          border-color: #38bdf8;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
        }

        .lp-pilot-code {
          font-family: monospace;
          font-size: 9.5px;
          font-weight: 700;
        }

        .lp-pilot-name {
          font-size: 11.5px;
          font-weight: 600;
          color: #f4f4f5;
        }

        .lp-pilot-desc {
          font-size: 9.5px;
          color: #71717a;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        /* ── Stats ─────────────────────────────────────────────────── */
        .lp-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        .lp-stat-card {
          background: #1f1f23;
          border: 1px solid #27272a;
          border-radius: 6px;
          padding: 6px 4px;
          text-align: center;
        }

        .lp-stat-val {
          font-size: 16px;
          font-weight: 700;
          font-family: monospace;
          line-height: 1.1;
        }

        .lp-stat-lbl {
          font-size: 8.5px;
          color: #71717a;
          text-transform: uppercase;
          margin-top: 2px;
          letter-spacing: 0.4px;
        }

        .lp-val-bar {
          display: flex;
          height: 4px;
          border-radius: 999px;
          overflow: hidden;
          background: #27272a;
        }

        .lp-val-fill {
          transition: width 0.3s ease;
        }

        .lp-val-legend {
          display: flex;
          gap: 12px;
          margin-top: 5px;
          font-size: 10px;
          color: #71717a;
        }

        .lp-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-right: 4px;
          vertical-align: middle;
        }

        /* ── Evidence ──────────────────────────────────────────────── */
        .lp-evidence-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .lp-evidence-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 7px;
          background: #1f1f23;
          border: 1px solid #27272a;
          border-radius: 4px;
          font-size: 10.5px;
          color: #a1a1aa;
        }

        .lp-evidence-mono {
          font-family: monospace;
          font-size: 10px;
          font-weight: 600;
        }
      `}</style>
    </aside>
  );
}
