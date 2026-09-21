import { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge.jsx';
import { OBJECT_CLASSES } from '../utils/grammar.js';

// ── Building Type Classifier ────────────────────────────────────────────────
// Derives visual identity from building name using keyword matching.
// Returns: { type, label, accent, dimAccent, icon }
function classifyBuilding(name = '', height = 0, floorCount = 0) {
  const n = name.toLowerCase();
  // Drone / Photogrammetry
  if (/drone|uav|photogrammetry|cadastre hub|sfm/.test(n)) {
    return {
      type: 'drone',
      label: 'UAV SURVEY',
      accent: '#06b6d4',
      dimAccent: 'rgba(6, 182, 212, 0.12)',
      borderAccent: 'rgba(6, 182, 212, 0.35)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M5 5l4 4m6 0l4-4M5 19l4-4m6 0l4 4" />
          <line x1="3" y1="5" x2="7" y2="5" />
          <line x1="17" y1="5" x2="21" y2="5" />
          <line x1="3" y1="19" x2="7" y2="19" />
          <line x1="17" y1="19" x2="21" y2="19" />
        </svg>
      ),
    };
  }

  // Metro / Underground Infrastructure
  if (/metro|underground|station|viaduct|tunnel|railway|rail|airport|flyover/.test(n)) {
    return {
      type: 'metro',
      label: 'METRO / INFRA',
      accent: '#f59e0b',
      dimAccent: 'rgba(245, 158, 11, 0.12)',
      borderAccent: 'rgba(245, 158, 11, 0.30)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2"/>
          <path d="M12 2v8M2 6h20M5 20l3-4h8l3 4M8 16h8"/>
        </svg>
      ),
    };
  }

  // Hotel / Hospitality / Ritz / Luxury Club
  if (/hotel|ritz|marriott|hyatt|intercontinental|hilton|residences|palace|suites|resort|club/.test(n)) {
    return {
      type: 'hotel',
      label: 'HOSPITALITY',
      accent: '#a78bfa',
      dimAccent: 'rgba(167, 139, 250, 0.10)',
      borderAccent: 'rgba(167, 139, 250, 0.28)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 20V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v13"/>
          <path d="M3 20h18M8 11h8M8 15h8M12 7v4"/>
        </svg>
      ),
    };
  }

  // Government / Municipal / MMRDA / Authority / Court / Ministry
  if (/government|municipal|mmrda|authority|court|ministry|secretariat|collectorate|panchayat|bmrcl|bbmp|mcgm|niti|aiims|police|defence|military/.test(n)) {
    return {
      type: 'government',
      label: 'GOVT / CIVIC',
      accent: '#34d399',
      dimAccent: 'rgba(52, 211, 153, 0.10)',
      borderAccent: 'rgba(52, 211, 153, 0.28)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M4 21V8l8-5 8 5v13"/>
          <path d="M9 21v-5h6v5M12 3v5M6 11h2M16 11h2M6 15h2M16 15h2"/>
        </svg>
      ),
    };
  }

  // Bank / Financial / ICICI / HDFC / RBI / NSE / BSE / Exchange
  if (/bank|icici|hdfc|rbi|sbi|kotak|nse|bse|exchange|financial|capital|invest|fintech|nbfc/.test(n)) {
    return {
      type: 'financial',
      label: 'FINANCIAL',
      accent: '#10b981',
      dimAccent: 'rgba(16, 185, 129, 0.10)',
      borderAccent: 'rgba(16, 185, 129, 0.28)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11"/>
        </svg>
      ),
    };
  }

  // Tech / IT / Infosys / Wipro / TCS / Embassy / Salarpuria / RMZ / Campus
  if (/infosys|wipro|tcs|tech|itpb|cessna|manyata|embassy|ecospace|ey |accenture|deloitte|campus|software|it park|tech park|knowledge park/.test(n)) {
    return {
      type: 'tech',
      label: 'TECH CAMPUS',
      accent: '#38bdf8',
      dimAccent: 'rgba(56, 189, 248, 0.10)',
      borderAccent: 'rgba(56, 189, 248, 0.28)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <path d="M8 21h8M12 17v4"/>
          <path d="M7 8l3 3-3 3M14 14h3"/>
        </svg>
      ),
    };
  }

  // Commercial / BKC / Business / Trade / World Trade / Office / Centre / Complex / Towers
  if (/commercial|world trade|business park|trade centre|trade center|office|complex|centre|center|bkc|tower [a-z]|block [a-z]/.test(n) && !/residential|appartment|flat/.test(n)) {
    return {
      type: 'commercial',
      label: 'COMMERCIAL',
      accent: '#60a5fa',
      dimAccent: 'rgba(96, 165, 250, 0.10)',
      borderAccent: 'rgba(96, 165, 250, 0.28)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="1"/>
          <path d="M3 9h18M9 21V9M15 21V9"/>
        </svg>
      ),
    };
  }

  // Mixed-use / Jio / NMACC / Cultural / Theatre / Mall / Arena / Sports
  if (/jio|nmacc|cultural|theatre|mall|arena|sports|stadium|convention|museum|heritage|art/.test(n)) {
    return {
      type: 'mixed',
      label: 'CULTURAL / MIXED',
      accent: '#f472b6',
      dimAccent: 'rgba(244, 114, 182, 0.10)',
      borderAccent: 'rgba(244, 114, 182, 0.28)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10"/>
          <path d="M8 12l4-6 4 6M8 16h8"/>
        </svg>
      ),
    };
  }

  // Hospital / Medical / Health / Clinic / AIIMS / Apollo / Fortis
  if (/hospital|medical|health|clinic|aiims|apollo|fortis|care|wellness/.test(n)) {
    return {
      type: 'hospital',
      label: 'HEALTHCARE',
      accent: '#fb7185',
      dimAccent: 'rgba(251, 113, 133, 0.10)',
      borderAccent: 'rgba(251, 113, 133, 0.28)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
    };
  }

  // Supertall / Sky / Ultra-luxury Residential (height > 150m or keywords)
  if (height > 150 || floorCount > 40 || /sky|imperial|antilia|ultra|pinnacle|altitude|summit|apex|zenith|sovereign|prestige|lodha|palais|luxury|royale|minerva|avighna|indiabulls/.test(n)) {
    return {
      type: 'supertall',
      label: 'SUPERTALL TOWER',
      accent: '#e2e8f0',
      dimAccent: 'rgba(226, 232, 240, 0.07)',
      borderAccent: 'rgba(226, 232, 240, 0.22)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18"/>
          <path d="M6 12H4a1 1 0 0 0-1 1v8M18 12h2a1 1 0 0 1 1 1v8"/>
          <path d="M10 7h4M10 12h4M10 17h4"/>
        </svg>
      ),
    };
  }

  // Default — generic building
  return {
    type: 'general',
    label: 'URBAN STRUCTURE',
    accent: 'rgba(255,255,255,0.40)',
    dimAccent: 'rgba(255, 255, 255, 0.04)',
    borderAccent: 'rgba(255, 255, 255, 0.14)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="1"/>
        <path d="M9 22v-4h6v4M8 7h.01M16 7h.01M8 12h.01M16 12h.01M8 17h.01M16 17h.01"/>
      </svg>
    ),
  };
}

// BuildingListCard — smart visual card with type-based identity
function BuildingListCard({ building, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { label, accent, dimAccent, borderAccent, icon } = classifyBuilding(
    building.name,
    building.height,
    building.floor_count
  );

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: 'left', cursor: 'pointer', width: '100%',
        background: hovered ? `rgba(0,0,0,0.60)` : `rgba(0,0,0,0.35)`,
        border: `1px solid ${hovered ? borderAccent : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '10px',
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: hovered ? `0 4px 20px rgba(0,0,0,0.5), inset 0 0 0 1px ${borderAccent}` : 'none',
      }}
    >
      {/* Left color bar */}
      <div style={{
        width: '3px', flexShrink: 0,
        background: accent,
        opacity: hovered ? 1 : 0.6,
        transition: 'opacity 0.18s',
      }} />

      {/* Card body */}
      <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Top row: icon + name + category badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          {/* Icon bubble */}
          <div style={{
            width: 32, height: 32, borderRadius: '8px', flexShrink: 0,
            background: dimAccent,
            border: `1px solid ${borderAccent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: accent,
            transition: 'all 0.18s',
          }}>
            {icon}
          </div>

          {/* Name + Badge */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 600, fontSize: '12.5px', color: '#ffffff',
              lineHeight: 1.3, wordBreak: 'break-word',
            }}>
              {building.name}
            </div>
            <div style={{ marginTop: '3px' }}>
              <span style={{
                fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.6px',
                padding: '1px 5px', borderRadius: '4px',
                background: dimAccent,
                color: accent,
                border: `1px solid ${borderAccent}`,
              }}>
                {label}
              </span>
            </div>
          </div>
        </div>

        {/* 3D ULPIN RID */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9.5px', color: accent,
          opacity: 0.75,
          letterSpacing: '0.2px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {building.canonical_rid || building.prototype_3d_id}
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)',
          paddingTop: '4px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Floors */}
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="4" y="2" width="16" height="20" rx="1"/>
              <path d="M9 22v-4h6v4"/>
            </svg>
            {building.floor_count}F
          </span>
          {/* Height */}
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="12" y1="2" x2="12" y2="22"/>
              <polyline points="17 7 12 2 7 7"/>
              <polyline points="17 17 12 22 7 17"/>
            </svg>
            {building.height}m
          </span>
          {/* City */}
          <span style={{ marginLeft: 'auto', opacity: 0.6, textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.4px' }}>
            {building.city}
          </span>
        </div>
      </div>
    </button>
  );
}

const CITY_META = {
  mumbai: {
    label: 'Mumbai',
    country: 'India',
    subtitle: 'South Mumbai & Worli Supertall Cluster',
    tag: 'VERTICAL PILOT',
    color: '#38bdf8',
  },
  bengaluru: {
    label: 'Bengaluru',
    country: 'India',
    subtitle: 'Tech Corridor & Metro Alignment',
    tag: 'TECH & STRATA',
    color: '#34d399',
  },
  singapore: {
    label: 'Singapore',
    country: 'Singapore',
    subtitle: 'Marina Bay Strata & Caverns',
    tag: 'STRATA & CAVERNS',
    color: '#a78bfa',
  },
  netherlands: {
    label: 'Rotterdam',
    country: 'Netherlands',
    subtitle: 'Wilhelminapier Maritime Strata',
    tag: 'EU 3D BENCHMARK',
    color: '#f59e0b',
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
          <button className="btn btn-primary" style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={onEnterInterior}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Walkthrough</span>
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
      <div className="detail-panel-collapsed anim-fade-in">
        <button
          className="panel-expand-btn"
          onClick={onToggleCollapse}
          title="Expand Details Panel"
          aria-label="Expand Details Panel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      </div>
    );
  }

  const meta = CITY_META[city] || CITY_META.bengaluru;

  return (
    <aside className="detail-panel anim-slide-left" id="detail-panel" aria-label="3D Cadastre details">
      {/* Panel Header */}
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn-icon"
            onClick={onToggleCollapse}
            title="Collapse panel"
            aria-label="Collapse panel"
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.50)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <h2 className="panel-title" style={{ fontSize: '16px', fontWeight: 700, margin: 0, letterSpacing: '-0.2px' }}>
            {building ? building.name : meta.label}
          </h2>
        </div>
        {building && (
          <button className="btn-icon" onClick={onClose} title="Deselect building">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
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
              T0–T5 Validation
            </button>
            <button
              className="btn btn-ghost"
              style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }}
              onClick={onOpenStrata}
            >
              Strata (R1)
            </button>
            <button
              className="btn btn-ghost"
              style={{ fontSize: '11px', padding: '6px 8px' }}
              onClick={onOpenExport}
              title="Export LADM / IFC / CityJSON"
            >
              Export
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
          {buildings.length > 0 && (
            <div style={{
              fontSize: '9px', fontWeight: 700, letterSpacing: '1px',
              color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase',
              marginBottom: '8px', paddingLeft: '2px',
            }}>
              {buildings.length} Structures · {CITY_META[Object.keys(CITY_META).find(k => buildings[0]?.city === k) || 'mumbai']?.label || 'City'}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {buildings.map(b => (
              <BuildingListCard
                key={b.building_id}
                building={b}
                onClick={() => onSelectBuilding(b.building_id, b)}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
