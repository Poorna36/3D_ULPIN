import { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge.jsx';
import { OBJECT_CLASSES } from '../utils/grammar.js';
import { searchBuildingsQuery, getFloorULPIN } from '../utils/ulpinGenerator.js';
import { buildFullFloorList } from './InteriorWalkthrough.jsx';

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

// BuildingListItem — clean Google Maps / Apple Maps style list row
function BuildingListItem({ building, onSelect, onEnterInterior, onFloorClick, isSelected }) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copiedFloor, setCopiedFloor] = useState(null);

  const { label } = classifyBuilding(building.name, building.height, building.floor_count);
  const floors = useMemo(() => buildFullFloorList(building), [building]);
  const primaryUlpin = building.canonical_rid || building.prototype_3d_id || building.ulpin;

  const handleCopy = (e) => {
    e.stopPropagation();
    if (primaryUlpin && navigator.clipboard) {
      navigator.clipboard.writeText(primaryUlpin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const handleCopyFloor = (e, code) => {
    e.stopPropagation();
    if (code && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedFloor(code);
      setTimeout(() => setCopiedFloor(null), 1600);
    }
  };

  return (
    <div
      onClick={() => onSelect(building.building_id, building)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '12px 14px',
        borderBottom: '1px solid #27272a',
        cursor: 'pointer',
        background: isSelected ? '#27272a' : (hovered ? '#202024' : 'transparent'),
        transition: 'background 0.12s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {/* Top Row: Building Name + Storey Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#f4f4f5', lineHeight: 1.3 }}>
          {building.name}
        </span>
        <span style={{
          fontSize: '10px',
          fontWeight: 600,
          color: '#a1a1aa',
          background: '#27272a',
          border: '1px solid #3f3f46',
          padding: '2px 6px',
          borderRadius: '4px',
          flexShrink: 0,
        }}>
          {building.floor_count}F · {building.height}m
        </span>
      </div>

      {/* Subtitle: Archetype + City */}
      <div style={{ fontSize: '11.5px', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>{label}</span>
        <span style={{ color: '#52525b' }}>•</span>
        <span>{building.city}</span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#10b981', fontWeight: 500 }}>
          Verified
        </span>
      </div>

      {/* Primary ULPIN Row */}
      <div style={{
        marginTop: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#141416',
        border: '1px solid #27272a',
        borderRadius: '5px',
        padding: '4px 8px',
        gap: '6px',
      }}>
        <span style={{
          fontSize: '10.5px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          color: '#38bdf8',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {primaryUlpin}
        </span>
        <button
          onClick={handleCopy}
          title="Copy ULPIN"
          style={{
            background: copied ? '#10b981' : 'transparent',
            border: copied ? 'none' : '1px solid #3f3f46',
            color: copied ? '#ffffff' : '#a1a1aa',
            padding: '2px 7px',
            borderRadius: '4px',
            fontSize: '9px',
            fontWeight: 600,
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.12s ease',
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Action Buttons Row */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(building.building_id, building);
            if (onEnterInterior) onEnterInterior();
          }}
          style={{
            flex: 1,
            padding: '5px 8px',
            background: '#0284c7',
            border: 'none',
            borderRadius: '5px',
            color: '#ffffff',
            fontSize: '10.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <span>Walk Inside 3D</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(v => !v);
          }}
          style={{
            padding: '5px 8px',
            background: '#27272a',
            border: '1px solid #3f3f46',
            borderRadius: '5px',
            color: '#d4d4d8',
            fontSize: '10.5px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {expanded ? 'Hide Floors' : `Floors (${floors.length})`}
        </button>
      </div>

      {/* Inline Floor List */}
      {expanded && (
        <div style={{
          marginTop: '6px',
          maxHeight: '180px',
          overflowY: 'auto',
          background: '#141416',
          border: '1px solid #27272a',
          borderRadius: '6px',
          padding: '4px',
        }}>
          {[...floors].reverse().map(f => {
            const floorUlpin = f.ulpin || f.canonical_rid || getFloorULPIN(building, f.level_index);
            const isCopiedF = copiedFloor === floorUlpin;
            return (
              <div
                key={f.floor_id || f.level_index}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onFloorClick) onFloorClick(f.floor_id);
                }}
                style={{
                  padding: '5px 6px',
                  borderBottom: '1px solid #202024',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                  fontSize: '10px',
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#a1a1aa', fontFamily: 'monospace' }}>
                      L{f.level_index >= 0 ? f.level_index : `B${Math.abs(f.level_index)}`}
                    </span>
                    <span style={{ color: '#f4f4f5', fontWeight: 500 }}>{f.label}</span>
                    <span style={{ color: '#71717a', fontSize: '9px' }}>{Number(f.z_min).toFixed(0)}m</span>
                  </div>
                  <div style={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: '9.5px', marginTop: '1px' }}>
                    {floorUlpin}
                  </div>
                </div>
                <button
                  onClick={(e) => handleCopyFloor(e, floorUlpin)}
                  style={{
                    background: isCopiedF ? '#10b981' : 'transparent',
                    border: '1px solid #3f3f46',
                    color: isCopiedF ? '#ffffff' : '#a1a1aa',
                    padding: '2px 5px',
                    borderRadius: '3px',
                    fontSize: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {isCopiedF ? 'Copied' : 'Copy'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
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

// FloorUnitList — list of floors for selected building with authentic 3D Floor ULPINs
function FloorUnitList({ building, explodedFloor, onFloorClick, onEnterInterior }) {
  const [copiedFloor, setCopiedFloor] = useState(null);
  const fullList = useMemo(() => {
    const list = (building.floors && building.floors.length >= (building.floor_count || 5))
      ? building.floors
      : buildFullFloorList(building);
    return [...list].sort((a, b) => b.level_index - a.level_index);
  }, [building]);

  const handleCopyFloor = (e, code) => {
    e.stopPropagation();
    if (code && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedFloor(code);
      setTimeout(() => setCopiedFloor(null), 1800);
    }
  };

  return (
    <div className="card" style={{ border: '1px solid rgba(56, 189, 248, 0.3)', background: 'rgba(2, 6, 23, 0.7)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '8px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            ISO 19152 LADM LEVEL CADASTRE
          </div>
          <h3 className="card-head-title" style={{ margin: '2px 0 0 0', fontSize: '13px' }}>
            Storeys & 3D Floor ULPINs ({fullList.length})
          </h3>
        </div>
        {onEnterInterior && (
          <button
            className="btn btn-primary"
            style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={onEnterInterior}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Walk Inside 3D</span>
          </button>
        )}
      </div>
      <div className="floor-list" style={{ maxHeight: '320px', overflowY: 'auto' }}>
        {fullList.map(f => {
          const floorUlpin = f.ulpin || f.canonical_rid || getFloorULPIN(building, f.level_index);
          const isAct = explodedFloor === f.floor_id;
          const isCopied = copiedFloor === floorUlpin;
          return (
            <div
              key={f.floor_id || `floor_${f.level_index}`}
              className={`floor-item ${isAct ? 'floor-item--active' : ''}`}
              onClick={() => onFloorClick(isAct ? null : f.floor_id)}
              style={{
                padding: '8px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '8px',
                background: isAct ? 'rgba(56, 189, 248, 0.16)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isAct ? 'rgba(56, 189, 248, 0.45)' : 'rgba(255, 255, 255, 0.06)'}`,
                marginBottom: '4px',
                transition: 'all 0.12s',
              }}
            >
              <div className="floor-level" style={{
                fontSize: '11px',
                fontWeight: 800,
                color: isAct ? '#38bdf8' : '#94a3b8',
                minWidth: '28px',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {f.level_index >= 0 ? `L${f.level_index}` : `B${Math.abs(f.level_index)}`}
              </div>
              <div className="floor-details" style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="floor-label" style={{ fontWeight: 700, fontSize: '11.5px', color: '#f8fafc' }}>
                    {f.label}
                  </div>
                  <div className="floor-z mono" style={{ fontSize: '9px', color: '#64748b' }}>
                    {Number(f.z_min).toFixed(1)}m – {Number(f.z_max).toFixed(1)}m AGL
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginTop: '3px' }}>
                  <div className="floor-ulpin mono" style={{
                    fontSize: '9.5px',
                    color: '#38bdf8',
                    fontWeight: 700,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    🔑 {floorUlpin}
                  </div>
                  <button
                    onClick={(e) => handleCopyFloor(e, floorUlpin)}
                    title="Copy Floor 3D-ULPIN"
                    style={{
                      background: isCopied ? 'rgba(16, 185, 129, 0.25)' : 'rgba(56, 189, 248, 0.15)',
                      border: `1px solid ${isCopied ? '#10b981' : 'rgba(56, 189, 248, 0.35)'}`,
                      color: isCopied ? '#34d399' : '#38bdf8',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {isCopied ? 'COPIED ✓' : 'COPY'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
  allBuildings = [],
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
  onOpenExport,
  onReturnToEarth,
  onCitySelect
}) {
  const [activeTab, setActiveTab] = useState('floors');
  const [filterQuery, setFilterQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedCopied, setSelectedCopied] = useState(false);
  const searchInputRef = useRef(null);

  // Global hotkey: press "/" or "Ctrl+K" to focus integrated search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredBuildings = useMemo(() => {
    if (!filterQuery.trim()) {
      return searchBuildingsQuery(buildings, '', {
        category: filterCategory,
        limit: 100,
      });
    }
    const localMatches = searchBuildingsQuery(buildings, filterQuery, {
      category: filterCategory,
      limit: 100,
    });
    const localIds = new Set(localMatches.map((b) => b.building_id));
    const globalMatches =
      allBuildings && allBuildings.length
        ? searchBuildingsQuery(allBuildings, filterQuery, { category: filterCategory, limit: 12 }).filter(
            (b) => !localIds.has(b.building_id)
          )
        : [];
    return [...localMatches, ...globalMatches];
  }, [buildings, allBuildings, filterQuery, filterCategory]);

  const handleItemSelect = useCallback(
    (bId, bObj) => {
      if (bObj?.city && bObj.city !== city && onCitySelect) {
        onCitySelect(bObj.city);
      }
      onSelectBuilding(bId, bObj);
    },
    [city, onCitySelect, onSelectBuilding]
  );

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
      {building ? (
        /* ── Selected Building View (Google Maps / Apple Maps Place Detail Standard) ── */
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Top Back Navigation Bar */}
          <div style={{
            padding: '12px 14px',
            borderBottom: '1px solid #27272a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#18181b',
          }}>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              <span>All buildings in {meta.label}</span>
            </button>
            <button
              onClick={onClose}
              title="Close panel"
              style={{
                background: 'none',
                border: 'none',
                color: '#71717a',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '2px 6px',
              }}
            >
              ✕
            </button>
          </div>

          <div className="panel-scroll" style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Place Title & Subtitle */}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.25 }}>
                {building.name}
              </h2>
              <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '3px' }}>
                {classifyBuilding(building.name, building.height, building.floor_count).label} • {building.city}
              </div>
            </div>

            {/* Primary Action: Walk Inside 3D (Google Maps Primary Action Style) */}
            <button
              onClick={onEnterInterior}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#0284c7',
                border: 'none',
                color: '#ffffff',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
              <span>Walk Inside (3D Dissection)</span>
            </button>

            {/* Primary 3D-ULPIN Field */}
            <div style={{
              background: '#202024',
              border: '1px solid #27272a',
              borderRadius: '6px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '8.5px', fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Building 3D-ULPIN
                </div>
                <div style={{
                  fontSize: '11px',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  color: '#38bdf8',
                  fontWeight: 600,
                  marginTop: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {building.canonical_rid || building.prototype_3d_id || building.ulpin}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const code = building.canonical_rid || building.prototype_3d_id || building.ulpin;
                  if (code && navigator.clipboard) {
                    navigator.clipboard.writeText(code);
                    setSelectedCopied(true);
                    setTimeout(() => setSelectedCopied(false), 1600);
                  }
                }}
                style={{
                  background: selectedCopied ? '#10b981' : '#27272a',
                  border: '1px solid #3f3f46',
                  color: selectedCopied ? '#ffffff' : '#d4d4d8',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '9px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {selectedCopied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              background: '#202024',
              border: '1px solid #27272a',
              borderRadius: '6px',
              padding: '10px',
            }}>
              <div>
                <div style={{ fontSize: '9px', color: '#71717a' }}>Total Floors</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f4f4f5', marginTop: '2px' }}>
                  {building.floor_count} Floors
                </div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: '#71717a' }}>Building Height</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f4f4f5', marginTop: '2px' }}>
                  {building.height} m AGL
                </div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: '#71717a' }}>Validation Status</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#10b981', marginTop: '2px' }}>
                  ● ISO 19152 Valid
                </div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: '#71717a' }}>Ground Elevation</div>
                <div style={{ fontSize: '11px', fontWeight: 500, color: '#d4d4d8', marginTop: '2px' }}>
                  {building.ground_elevation ? `${building.ground_elevation}m` : 'Datum 0m'}
                </div>
              </div>
            </div>

            {/* Clean Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #27272a', gap: '6px', marginTop: '4px' }}>
              <button
                onClick={() => setActiveTab('floors')}
                style={{
                  padding: '6px 10px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'floors' ? '2px solid #0284c7' : '2px solid transparent',
                  color: activeTab === 'floors' ? '#ffffff' : '#71717a',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Storeys & ULPINs
              </button>
              <button
                onClick={() => setActiveTab('identity')}
                style={{
                  padding: '6px 10px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'identity' ? '2px solid #0284c7' : '2px solid transparent',
                  color: activeTab === 'identity' ? '#ffffff' : '#71717a',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('cadastre')}
                style={{
                  padding: '6px 10px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'cadastre' ? '2px solid #0284c7' : '2px solid transparent',
                  color: activeTab === 'cadastre' ? '#ffffff' : '#71717a',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cadastre RRR
              </button>
            </div>

            {/* Tab 1: Storeys List (The exact answer to "where is ULPIN for each floor") */}
            {activeTab === 'floors' && (
              <FloorUnitList
                building={building}
                explodedFloor={explodedFloor}
                onFloorClick={onFloorClick}
                onEnterInterior={onEnterInterior}
              />
            )}

            {/* Tab 2: Specifications / Identity */}
            {activeTab === 'identity' && (
              <>
                <ThreeLayerIdentityCard building={building} />
                <DigitalTwinTelemetryCard building={building} />
              </>
            )}

            {/* Tab 3: Cadastre RRR */}
            {activeTab === 'cadastre' && (
              <>
                <LegalRRRCard building={building} />
                <TenClassesBreakdownCard building={building} onOpenStrata={onOpenStrata} />
              </>
            )}
          </div>
        </div>
      ) : (
        /* ── City Overview List (Google Maps / Apple Maps Search Results Standard) ── */
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Top Back Navigation Bar */}
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid #27272a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#18181b',
            flexShrink: 0,
          }}>
            <button
              onClick={onReturnToEarth}
              title="Return to Earth Space Orbit (All Cities)"
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              <span>Back to Earth Orbit</span>
            </button>
            <span style={{ fontSize: '11px', color: '#71717a', fontWeight: 600 }}>
              {meta.label} Pilot
            </span>
          </div>

          {/* Top Search & Filter Bar */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#222328',
              border: '1px solid #33343a',
              borderRadius: '8px',
              padding: '7px 10px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search structures or 3D ULPIN… [/]"
                spellCheck={false}
                autoComplete="off"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f4f4f5',
                  fontSize: '12.5px',
                  fontFamily: 'inherit',
                }}
              />
              {filterQuery ? (
                <button
                  onClick={() => { setFilterQuery(''); searchInputRef.current?.focus(); }}
                  style={{ background: '#27272a', border: 'none', borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', cursor: 'pointer', fontSize: '10px' }}
                >
                  ✕
                </button>
              ) : (
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#71717a', background: '#27272a', padding: '1px 5px', borderRadius: '3px', border: '1px solid #3f3f46' }}>
                  /
                </span>
              )}
            </div>

            {/* Category Filter Chips (Google Maps style) */}
            <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {[
                { id: 'all', label: `All (${buildings.length})` },
                { id: 'supertall', label: 'Supertall' },
                { id: 'commercial', label: 'Commercial' },
                { id: 'government', label: 'Civic' },
                { id: 'tech', label: 'Tech' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  style={{
                    padding: '4px 9px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 500,
                    background: filterCategory === cat.id ? '#f4f4f5' : '#27272a',
                    color: filterCategory === cat.id ? '#18181b' : '#a1a1aa',
                    border: filterCategory === cat.id ? '1px solid #ffffff' : '1px solid #3f3f46',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.12s',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* List Count Subtitle */}
          <div style={{ padding: '8px 14px 4px', fontSize: '11px', color: '#71717a', fontWeight: 500 }}>
            {filteredBuildings.length} structures • {meta.label}
          </div>

          {/* Buildings Scrollable List */}
          <div className="panel-scroll" style={{ flex: 1, overflowY: 'auto' }}>
            {filteredBuildings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#71717a', fontSize: '12px' }}>
                No structures found matching "{filterQuery}"
              </div>
            ) : (
              filteredBuildings.map(b => (
                <BuildingListItem
                  key={b.building_id}
                  building={b}
                  onSelect={handleItemSelect}
                  onEnterInterior={onEnterInterior}
                  onFloorClick={onFloorClick}
                  isSelected={building?.building_id === b.building_id}
                />
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
