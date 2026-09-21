import { useState, useRef } from 'react';
import CitySelector from './CitySelector.jsx';

const CITIES = [
  {
    id: 'mumbai',
    name: 'Mumbai (South Cluster)',
    shortName: 'MUMBAI CADASTRE',
    coords: '18.99°N, 72.83°E',
    tag: 'VERTICAL PILOT (117F)',
    country: 'India',
    desc: 'High-density coastal strata & supertalls up to 441.5m',
    color: '#38bdf8',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru (Tech Corridor)',
    shortName: 'BENGALURU CADASTRE',
    coords: '12.97°N, 77.59°E',
    tag: 'TECH & METRO STRATA',
    country: 'India',
    desc: 'Commercial campuses & subterranean metro alignment',
    color: '#34d399',
  },
  {
    id: 'singapore',
    name: 'Singapore (Marina Bay)',
    shortName: 'SINGAPORE CADASTRE',
    coords: '1.28°N, 103.85°E',
    tag: 'SKYBRIDGES & UTILITIES',
    country: 'Singapore',
    desc: 'Underground infrastructure & multi-tier land rights',
    color: '#a78bfa',
  },
  {
    id: 'netherlands',
    name: 'Rotterdam (Wilhelminapier)',
    shortName: 'ROTTERDAM CADASTRE',
    coords: '51.90°N, 4.49°E',
    tag: 'EU 3D BENCHMARK',
    country: 'Netherlands',
    desc: 'De Rotterdam vertical city & port maritime strata',
    color: '#f59e0b',
  },
];

export default function WorkbenchCockpit({
  city,
  onCityChange,
  onResetOrbit,
  onZoomIn,
  onZoomOut,
  onResetCamera,
  onToggleLayerPanel,
  layerPanelOpen,
  onToggleLayer,
  layers,
  onUploadCadastre,
  activeMode,
  onModeChange,
  onReturnToLanding,
  onOpenDisputes,
  onOpenStrata,
  onOpenSandbox,
  onOpenExport,
  sidebarOpen = false,
  onOpenPhotogrammetry,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);

  const currentCityObj = CITIES.find(c => c.id === city) || CITIES[0];
  const isOrbit = !city;
  const rightOffset = sidebarOpen ? 408 : 24;

  const handleSelectCity = (targetId) => {
    setDropdownOpen(false);
    if (targetId === 'orbit') {
      onResetOrbit();
    } else {
      onCityChange(targetId);
    }
  };

  return (
    <>
      {/* ── Top Bar (Clean & Minimal Header) ────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 90,
        height: 52, padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        userSelect: 'none',
      }}>
        {/* Left: Brand + Pilot Selection Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Logo */}
          <div
            onClick={onReturnToLanding || onResetOrbit}
            title="Return to Landing Page & Earth Orbit"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'Syne', 'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px',
              color: '#ffffff', cursor: 'pointer',
            }}
          >
            3D ULPIN
            <span style={{
              display: 'inline-block',
              width: 8, height: 8,
              borderRadius: '50%',
              background: '#000000',
              border: '1.5px solid rgba(255, 255, 255, 0.70)',
              boxShadow: '0 0 8px rgba(0, 0, 0, 0.9)',
            }} />
          </div>

          {/* Pilot Selection Tabs (Earth Pilot Cities) */}
          <CitySelector city={city} onChange={onCityChange} />
        </div>

        {/* Right side: 3D ULPIN Registry & Dispute Workflows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onOpenDisputes}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: '#0a0a0c',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 999, height: 30, padding: '0 13px',
              color: '#f3f4f6', fontSize: 11, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#141418'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0a0a0c'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)'; }}
            title="Real-World 3D Cadastral Disputes (docs/decisions.md Section 9.4)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
              <path d="M12 3v18M6 8l6-5 6 5M6 8v4a6 6 0 0 0 12 0V8"/>
              <path d="M4 14h4M16 14h4"/>
            </svg>
            <span>Disputes</span>
          </button>

          <button
            onClick={onOpenStrata}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: '#0a0a0c',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 999, height: 30, padding: '0 13px',
              color: '#f3f4f6', fontSize: 11, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#141418'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0a0a0c'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)'; }}
            title="R1 Headline Query: What is Below / Above This Parcel? (docs/eval_results.md)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
              <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>
            </svg>
            <span>Strata (R1)</span>
          </button>

          <button
            onClick={onOpenSandbox}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: '#0a0a0c',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 999, height: 30, padding: '0 13px',
              color: '#f3f4f6', fontSize: 11, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#141418'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0a0a0c'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)'; }}
            title="OpenAPI REST Registry Operations (docs/contracts.md)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <span>REST API</span>
          </button>

          <button
            onClick={onOpenPhotogrammetry}
            id="photogrammetry-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: '#0a0a0c',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              borderRadius: 999, height: 30, padding: '0 13px',
              color: '#38bdf8', fontSize: 11, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.20)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#141418'; e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.boxShadow = '0 0 18px rgba(56, 189, 248, 0.40)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0a0a0c'; e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.45)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(56, 189, 248, 0.20)'; }}
            title="UAV Drone Photogrammetry, ODM SfM Triangulation & 3D Vertical Slicing"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
              <circle cx="12" cy="12" r="3" />
              <path d="M5 5l4 4m6 0l4-4M5 19l4-4m6 0l4 4" />
              <line x1="3" y1="5" x2="7" y2="5" />
              <line x1="17" y1="5" x2="21" y2="5" />
              <line x1="3" y1="19" x2="7" y2="19" />
              <line x1="17" y1="19" x2="21" y2="19" />
            </svg>
            <span>Photogrammetry</span>
          </button>

          <button
            onClick={onOpenExport}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: '#0a0a0c',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 999, height: 30, padding: '0 13px',
              color: '#f3f4f6', fontSize: 11, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#141418'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0a0a0c'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)'; }}
            title="Lossless Cadastre Export: ISO 19152 LADM, IFC 4.3, CityJSON 1.1"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            <span>Export</span>
          </button>
        </div>
      </header>


      {/* ── Right Floating Status (Matching Voyage Pipeline: Ready LIVE) ── */}
      <div style={{
        position: 'fixed',
        right: rightOffset, top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 85,
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 999,
        padding: '6px 14px',
        fontSize: 11, fontWeight: 600,
        color: '#ffffff',
        fontFamily: "'Space Grotesk', sans-serif",
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
        userSelect: 'none',
        transition: 'right 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#22c55e',
          boxShadow: '0 0 10px #22c55e',
        }} />
        <span>Cadastre Engine: <strong>Ready</strong></span>
        <span style={{
          fontSize: 9, fontWeight: 800, padding: '2px 6px',
          borderRadius: 4, background: 'rgba(34, 197, 94, 0.15)',
          color: '#22c55e', letterSpacing: '0.6px',
        }}>
          LIVE
        </span>
      </div>

      {/* ── Bottom Controls ─────────────────────────────────────── */}
      {/* Bottom Left: Layers Toggle Pill */}
      <div style={{ position: 'fixed', left: 24, bottom: 20, zIndex: 90 }}>
        <button
          onClick={onToggleLayerPanel}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 999,
            background: layerPanelOpen ? '#000000' : '#0a0a0c',
            border: layerPanelOpen ? '1px solid rgba(255, 255, 255, 0.40)' : '1px solid rgba(255, 255, 255, 0.14)',
            color: '#ffffff',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = layerPanelOpen ? 'rgba(255, 255, 255, 0.40)' : 'rgba(255, 255, 255, 0.14)'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
          <span>Layers</span>
        </button>
      </div>

      {/* Bottom Center: Primary Action Pill */}
      <div style={{
        position: 'fixed',
        bottom: 20, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 90,
      }}>
        {isOrbit ? (
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', borderRadius: 999,
              background: '#09090b',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              color: '#ffffff',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13, fontWeight: 700,
              letterSpacing: '0.5px', cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.8)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#18181b'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#09090b'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="22" y1="12" x2="18" y2="12"/>
              <line x1="6" y1="12" x2="2" y2="12"/>
              <line x1="12" y1="6" x2="12" y2="2"/>
              <line x1="12" y1="22" x2="12" y2="18"/>
            </svg>
            <span>SELECT PILOT CITY ▾</span>
          </button>
        ) : (
          <button
            onClick={onResetOrbit}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 999,
              background: '#09090b',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12, fontWeight: 600,
              letterSpacing: '0.3px', cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.40)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20"/>
            </svg>
            <span>RETURN TO GLOBE</span>
          </button>
        )}
      </div>

      {/* Bottom Right: Zoom & Orientation Controls */}
      <div style={{
        position: 'fixed', right: rightOffset, bottom: 20, zIndex: 90,
        display: 'flex', alignItems: 'center', gap: 4,
        background: '#090a0f',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 999, padding: '3px 6px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
        transition: 'right 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <button
          onClick={onZoomIn}
          title="Zoom In"
          style={{
            background: 'none', border: 'none', color: '#fff',
            width: 28, height: 28, borderRadius: '50%',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          style={{
            background: 'none', border: 'none', color: '#fff',
            width: 28, height: 28, borderRadius: '50%',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <button
          onClick={onResetCamera}
          title="Reset Orientation"
          style={{
            background: 'none', border: 'none', color: '#fff',
            width: 28, height: 28, borderRadius: '50%',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19"/>
          </svg>
        </button>
      </div>

      {/* Reticle Pulse Animation */}
      <style>{`
        @keyframes reticlePulse {
          0%   { transform: scale(1); opacity: 0.85; }
          100% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </>
  );
}
