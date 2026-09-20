import { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge.jsx';
import { OBJECT_CLASSES } from '../utils/grammar.js';

const CITY_META = {
  mumbai: {
    label: 'Mumbai',
    country: 'India 🇮🇳',
    subtitle: 'South Mumbai & Worli Supertall Cluster',
    tag: 'VERTICAL PILOT',
    color: '#38bdf8',
  },
  bengaluru: {
    label: 'Bengaluru',
    country: 'India 🇮🇳',
    subtitle: 'Tech Corridor & Metro Alignment',
    tag: 'TECH & STRATA',
    color: '#34d399',
  },
  singapore: {
    label: 'Singapore',
    country: 'Singapore 🇸🇬',
    subtitle: 'Marina Bay Strata & Caverns',
    tag: 'STRATA & CAVERNS',
    color: '#a78bfa',
  },
  netherlands: {
    label: 'Rotterdam',
    country: 'Netherlands 🇳🇱',
    subtitle: 'Wilhelminapier Maritime Strata',
    tag: 'EU 3D BENCHMARK',
    color: '#f59e0b',
  },
  simulation: {
    label: 'Night City (LOD4 Lab)',
    country: 'Digital Twin Lab 🌆',
    subtitle: 'Offshore Arcology Bay & Megatower Strata',
    tag: '100% LOD4 TWIN',
    color: '#ec4899',
  },
};

// ThreeLayerIdentityCard — Section 3.2: RID, Natural Key, Spatial Address & Binding Record
function ThreeLayerIdentityCard({ building }) {
  const [copied, setCopied] = useState(false);
  const [showGrammar, setShowGrammar] = useState(false);

  const rid = building.canonical_rid || building.prototype_3d_id;
  const nk = building.natural_key || {
    digest: `NK-SHA256-${building.building_id}-B32-BV1`,
    locator: '0x1A2B3C4D5E6F7890',
    version: 1
  };
  const sa = building.spatial_address || {
    morton_63: nk.locator,
    lod: 'LOD2'
  };
  const binding = building.binding_record || {
    version: 1,
    record_hash: '0x7F2A9C1E5B3D4A80',
    sign_off: { examiner_id: 'EXAMINER-CAD-401' }
  };

  const copy = () => {
    navigator.clipboard.writeText(rid).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card ulpin-card" style={{ border: '1px solid rgba(56, 189, 248, 0.25)', background: 'rgba(15, 23, 42, 0.65)' }}>
      <div className="card-head">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-primary" style={{ fontSize: '9px', padding: '1px 5px' }}>THREE-LAYER IDENTITY</span>
            <span className="badge badge-valid" style={{ fontSize: '9px', padding: '1px 5px' }}>ISO 7064 VALID</span>
          </div>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '13px' }}>Layer 1: Registry ID (RID)</h3>
        </div>
        <button
          className="btn-ghost"
          style={{ fontSize: '10px', padding: '2px 6px', color: 'var(--accent)' }}
          onClick={() => setShowGrammar(!showGrammar)}
        >
          {showGrammar ? 'Hide Grammar' : 'Grammar Spec ▾'}
        </button>
      </div>

      <div className="ulpin-display" style={{ marginTop: '8px' }}>
        <span className="mono ulpin-code" style={{ fontSize: '12px', fontWeight: 600, color: '#38bdf8' }}>{rid}</span>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={copy}
          title="Copy canonical RID"
          aria-label="Copy canonical RID"
        >
          {copied
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          }
        </button>
      </div>

      {showGrammar && (
        <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', fontSize: '11px', lineHeight: 1.5 }}>
          <div className="mono" style={{ color: '#38bdf8' }}>3D-ULPIN := ULPIN14 - BLD - CLS SEQ - CHK</div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            • <strong>Parent ULPIN:</strong> {building.parent_ulpin || 'IN-KA-BLR-000101'}<br />
            • <strong>Class:</strong> {building.cls || 'B'} (Building Envelope)<br />
            • <strong>Check Symbol:</strong> Catches 100% single-character substitutions & adjacent transpositions.
          </div>
        </div>
      )}

      {/* Layer 2: Natural Key */}
      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
          <span>Layer 2: Natural Key (Deterministic Digest)</span>
          <span className="mono">v{nk.version}</span>
        </div>
        <div className="mono" style={{ fontSize: '10px', color: '#e2e8f0', marginTop: '2px', wordBreak: 'break-all' }}>
          {nk.digest}
        </div>
      </div>

      {/* Layer 3: Spatial Address */}
      <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
          <span>Layer 3: Spatial Address (63-Bit Morton)</span>
          <span className="badge badge-primary" style={{ fontSize: '9px' }}>{sa.lod}</span>
        </div>
        <div className="mono" style={{ fontSize: '10px', color: '#38bdf8', marginTop: '2px' }}>
          {sa.morton_63}
        </div>
      </div>
    </div>
  );
}

// TenClassesBreakdownCard — Section 3.5: 10 Canonical Object Classes
function TenClassesBreakdownCard({ building, onOpenStrata }) {
  const classes = building.classes_10 || [];

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 className="card-head-title" style={{ margin: 0 }}>10 Property Classes (Section 3.5)</h3>
        <button className="btn-ghost" style={{ fontSize: '11px', color: '#38bdf8', padding: '2px 6px' }} onClick={onOpenStrata}>
          Vertical Strata ▾
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflowY: 'auto' }}>
        {classes.map(c => {
          const meta = OBJECT_CLASSES[c.cls] || { color: '#38bdf8', name: c.name };
          return (
            <div key={c.cls} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', fontSize: '11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-block', width: '18px', height: '18px', lineHeight: '18px',
                  textAlign: 'center', borderRadius: '3px', background: meta.color, color: '#000',
                  fontWeight: 700, fontSize: '10px'
                }}>
                  {c.cls}
                </span>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div className="mono" style={{ fontSize: '9px', color: 'var(--text-dim)' }}>{c.rid}</div>
                </div>
              </div>
              <span className={`badge badge-${c.status.toLowerCase()}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                {c.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// LegalRRRCard — Rights, Restrictions, Responsibilities & Legacy ID Crosswalk
function LegalRRRCard({ building }) {
  const rrr = building.rrr_rights || [];
  const legacy = building.legacy_ids || [];

  return (
    <div className="card">
      <h3 className="card-head-title">Statutory Rights (RRR) & Crosswalk</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {rrr.map((r, i) => (
          <div key={i} style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#38bdf8' }}>{r.type}</span>
              {r.undivided_share && <span className="mono" style={{ color: '#10b981', fontWeight: 600 }}>UDS: {r.undivided_share}</span>}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>{r.statute}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', fontSize: '9px', color: 'var(--text-dim)' }}>
              <span>Holder: {r.holder}</span>
              <span className="badge badge-valid" style={{ fontSize: '8px', padding: '0 4px' }}>{r.legal_basis_status}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
          Legacy Identifier Crosswalk (Section 5.4)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {legacy.map((leg, i) => (
            <div key={i} style={{ padding: '4px 6px', background: 'rgba(0,0,0,0.25)', borderRadius: '4px', fontSize: '10px' }}>
              <span className="badge badge-primary" style={{ fontSize: '8px', padding: '1px 4px' }}>{leg.id_system}</span>
              <div className="mono" style={{ marginTop: '2px', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {leg.legacy_value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// FloorUnitList — list of floors for selected building
function FloorUnitList({ building, explodedFloor, onFloorClick, onEnterInterior }) {
  const floors = [...(building.floors ?? [])].sort((a, b) => b.level_index - a.level_index);
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 className="card-head-title" style={{ margin: 0 }}>Floors & Units ({floors.length})</h3>
        {onEnterInterior && (
          <button className="btn btn-primary" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={onEnterInterior}>
            🚶 Interior Mode
          </button>
        )}
      </div>
      <div className="floor-list" style={{ maxHeight: '240px', overflowY: 'auto' }}>
        {floors.map(f => (
          <button
            key={f.floor_id}
            className={`floor-item ${explodedFloor === f.floor_id ? 'floor-item--active' : ''}`}
            onClick={() => onFloorClick(f.floor_id === explodedFloor ? null : f.floor_id)}
          >
            <div className="floor-level">
              {f.level_index >= 0 ? `L${f.level_index}` : `B${Math.abs(f.level_index)}`}
            </div>
            <div className="floor-details">
              <div className="floor-label">{f.label}</div>
              <div className="floor-z mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                z {f.z_min.toFixed(1)} — {f.z_max.toFixed(1)} m
              </div>
            </div>
            <StatusBadge status={f.status} />
          </button>
        ))}
      </div>
    </div>
  );
}

// DigitalTwinTelemetryCard — 100% LOD4 BIM Twin telemetry & vision proof
function DigitalTwinTelemetryCard({ building }) {
  if (building.data_provenance !== '100%_LOD4_DIGITAL_TWIN' && !building.telemetry) return null;
  const t = building.telemetry || {
    occupancy_current: 1200,
    occupancy_capacity: 1500,
    power_demand_kw: 280.4,
    hvac_status: 'OPTIMAL',
    smart_contract_status: 'AUTOMATED_TAX_SETTLEMENT_ACTIVE',
    structural_drift_mm: 1.2
  };
  const occPct = Math.round((t.occupancy_current / (t.occupancy_capacity || 1)) * 100);

  return (
    <div className="card" style={{ border: '1px solid rgba(236, 72, 153, 0.4)', background: 'rgba(236, 72, 153, 0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.25)', color: '#f472b6', border: '1px solid #f472b6', fontSize: '9px', padding: '1px 6px' }}>
            100% LOD4 BIM TWIN
          </span>
          <span className="badge badge-valid" style={{ fontSize: '9px', padding: '1px 5px' }}>AUTHORITATIVE</span>
        </div>
        <span style={{ fontSize: '10px', color: '#f472b6', fontWeight: 600 }}>LIVE TELEMETRY</span>
      </div>

      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '10px' }}>
        Native IFC 4.3 BIM with micro-spatial cadastre, sky-bridge rights, and subsurface strata.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
        <div style={{ padding: '6px 8px', background: 'rgba(0,0,0,0.35)', borderRadius: '6px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '10px' }}>Occupancy Load</div>
          <div style={{ color: '#fff', fontWeight: 700, marginTop: '2px' }}>
            {t.occupancy_current?.toLocaleString()} / {t.occupancy_capacity?.toLocaleString()}
          </div>
          <div style={{ fontSize: '10px', color: occPct > 85 ? '#f87171' : '#34d399', marginTop: '2px' }}>{occPct}% Capacity</div>
        </div>

        <div style={{ padding: '6px 8px', background: 'rgba(0,0,0,0.35)', borderRadius: '6px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '10px' }}>Power Demand</div>
          <div style={{ color: '#fff', fontWeight: 700, marginTop: '2px' }}>
            {t.power_demand_kw} kW
          </div>
          <div style={{ fontSize: '10px', color: '#38bdf8', marginTop: '2px' }}>HVAC: {t.hvac_status}</div>
        </div>

        <div style={{ padding: '6px 8px', background: 'rgba(0,0,0,0.35)', borderRadius: '6px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '10px' }}>Structural Drift</div>
          <div style={{ color: '#fff', fontWeight: 700, marginTop: '2px' }}>
            {t.structural_drift_mm} mm
          </div>
          <div style={{ fontSize: '10px', color: '#34d399', marginTop: '2px' }}>Nominal (IoT Strain)</div>
        </div>

        <div style={{ padding: '6px 8px', background: 'rgba(0,0,0,0.35)', borderRadius: '6px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '10px' }}>Smart Contract</div>
          <div style={{ color: '#f472b6', fontWeight: 600, fontSize: '10px', marginTop: '4px', textTransform: 'capitalize' }}>
            {t.smart_contract_status?.replace(/_/g, ' ').toLowerCase()}
          </div>
        </div>
      </div>
    </div>
  );
}

// BuildingInfoCard — main summary card
function BuildingInfoCard({ building }) {
  const infoRows = [
    { label: 'Building ID',  value: <span className="mono" style={{ fontSize: '11px' }}>{building.building_id}</span> },
    { label: 'Parent ULPIN', value: <span className="mono" style={{ fontSize: '11px', color: '#38bdf8' }}>{building.parent_ulpin || 'IN-KA-BLR-000101'}</span> },
    { label: 'Height',       value: `${Math.abs(building.height || 0).toFixed(1)} m` },
    { label: 'Floors',       value: building.floor_count },
    { label: 'Ground Elev.', value: `${building.ground_elevation || 0} m` },
    { label: 'Sensors / Evid',value: <span style={{ fontSize: '10px', color: '#38bdf8' }}>LiDAR (E1) + BIM (E4)</span> },
    { label: 'Tolerance Ref', value: <span style={{ fontSize: '10px', color: '#34d399' }}>NAKSHA 5% Adapt.</span> },
    { label: 'SoI CORS σ',   value: <span className="mono" style={{ fontSize: '10px', color: '#f59e0b' }}>±0.024m xy / ±0.045m z</span> },
    { label: 'Provenance',   value: <StatusBadge status={building.data_provenance || 'REAL'} /> },
  ];
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="building-name">{building.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{building.city?.toUpperCase()}</div>
        </div>
        <StatusBadge status={building.validation_status || 'VALID'} dot />
      </div>
      <table className="info-table" style={{ marginTop: '8px' }}>
        <tbody>
          {infoRows.map(r => (
            <tr key={r.label}>
              <td className="prov-label">{r.label}</td>
              <td className="prov-value">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// DetailPanel — right sidebar, main container
export default function DetailPanel({
  city,
  buildings = [],
  building,
  onSelectBuilding,
  explodedFloor,
  onFloorClick,
  onClose,
  onEnterInterior,
  isCollapsed,
  onToggleCollapse,
  onOpenValidationConsole,
  onOpenStrata,
  onOpenExport
}) {
  const [activeTab, setActiveTab] = useState('identity');

  if (!city) return null;

  if (isCollapsed) {
    return (
      <div className="detail-panel-collapsed glass anim-fade-in">
        <button
          className="btn-icon panel-expand-btn"
          onClick={onToggleCollapse}
          title="Expand Details Panel"
          aria-label="Expand Details Panel"
        >
          ◀
        </button>
      </div>
    );
  }

  const meta = CITY_META[city] || CITY_META.bengaluru;

  return (
    <aside className="detail-panel glass anim-slide-left" id="detail-panel" aria-label="3D Cadastre details">
      {/* Panel Header */}
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn-icon"
            onClick={onToggleCollapse}
            title="Collapse panel"
            aria-label="Collapse panel"
            style={{ fontSize: '12px' }}
          >
            ▶
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge badge-primary" style={{ fontSize: '9px', padding: '1px 5px' }}>{meta.tag}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{meta.country}</span>
            </div>
            <h2 className="panel-title" style={{ fontSize: '15px', marginTop: '2px' }}>
              {building ? building.name : `${meta.label} 3D Cadastre`}
            </h2>
          </div>
        </div>
        {building && (
          <button className="btn-icon" onClick={onClose} title="Deselect building">✕</button>
        )}
      </div>

      {/* Building Selected Content */}
      {building ? (
        <div className="panel-scroll" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }}
              onClick={onOpenValidationConsole}
            >
              🛡 T0–T5 Validation
            </button>
            <button
              className="btn btn-ghost"
              style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }}
              onClick={onOpenStrata}
            >
              🏢 Strata (R1)
            </button>
            <button
              className="btn btn-ghost"
              style={{ fontSize: '11px', padding: '6px 8px' }}
              onClick={onOpenExport}
              title="Export LADM / IFC / CityJSON"
            >
              💾 Export
            </button>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
            <button
              className={`btn ${activeTab === 'identity' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '11px', padding: '4px 8px', flex: 1 }}
              onClick={() => setActiveTab('identity')}
            >
              3-Layer Identity
            </button>
            <button
              className={`btn ${activeTab === 'classes' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '11px', padding: '4px 8px', flex: 1 }}
              onClick={() => setActiveTab('classes')}
            >
              10 Classes
            </button>
            <button
              className={`btn ${activeTab === 'legal' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '11px', padding: '4px 8px', flex: 1 }}
              onClick={() => setActiveTab('legal')}
            >
              Legal & RRR
            </button>
            <button
              className={`btn ${activeTab === 'floors' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '11px', padding: '4px 8px', flex: 1 }}
              onClick={() => setActiveTab('floors')}
            >
              Floors
            </button>
          </div>

          {activeTab === 'identity' && (
            <>
              <DigitalTwinTelemetryCard building={building} />
              <ThreeLayerIdentityCard building={building} />
              <BuildingInfoCard building={building} />
            </>
          )}

          {activeTab === 'classes' && (
            <TenClassesBreakdownCard building={building} onOpenStrata={onOpenStrata} />
          )}

          {activeTab === 'legal' && (
            <LegalRRRCard building={building} />
          )}

          {activeTab === 'floors' && (
            <FloorUnitList
              building={building}
              explodedFloor={explodedFloor}
              onFloorClick={onFloorClick}
              onEnterInterior={onEnterInterior}
            />
          )}
        </div>
      ) : (
        /* No Building Selected: City Overview List */
        <div className="panel-scroll" style={{ padding: '12px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            Select a parcel or building to inspect its 3D ULPIN identity, 10 property classes, and statutory rights.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {buildings.map(b => (
              <button
                key={b.building_id}
                className="card"
                style={{ textAlign: 'left', cursor: 'pointer', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
                onClick={() => onSelectBuilding(b.building_id, b)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{b.name}</span>
                  <StatusBadge status={b.validation_status || 'VALID'} />
                </div>
                <div className="mono" style={{ fontSize: '10px', color: '#38bdf8', marginTop: '4px' }}>
                  {b.canonical_rid || b.prototype_3d_id}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                  <span>{b.floor_count} Floors • {b.height}m</span>
                  <span>{b.data_provenance || 'REAL'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
