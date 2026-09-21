import { useState, useRef } from 'react';
import CitySelector from './CitySelector.jsx';

const CITIES = [
  {
    id: 'mumbai',
    name: 'Mumbai (South Cluster)',
    shortName: 'MUMBAI CADASTRE',
    coords: '18.99°N, 72.83°E',
    tag: 'VERTICAL PILOT (117F)',
    country: 'India 🇮🇳',
    desc: 'High-density coastal strata & supertalls up to 441.5m',
    color: '#38bdf8',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru (Tech Corridor)',
    shortName: 'BENGALURU CADASTRE',
    coords: '12.97°N, 77.59°E',
    tag: 'TECH & METRO STRATA',
    country: 'India 🇮🇳',
    desc: 'Commercial campuses & subterranean metro alignment',
    color: '#34d399',
  },
  {
    id: 'singapore',
    name: 'Singapore (Marina Bay)',
    shortName: 'SINGAPORE CADASTRE',
    coords: '1.28°N, 103.85°E',
    tag: 'SKYBRIDGES & UTILITIES',
    country: 'Singapore 🇸🇬',
    desc: 'Underground infrastructure & multi-tier land rights',
    color: '#a78bfa',
  },
  {
    id: 'netherlands',
    name: 'Rotterdam (Wilhelminapier)',
    shortName: 'ROTTERDAM CADASTRE',
    coords: '51.90°N, 4.49°E',
    tag: 'EU 3D BENCHMARK',
    country: 'Netherlands 🇳🇱',
    desc: 'De Rotterdam vertical city & port maritime strata',
    color: '#f59e0b',
  },
  {
    id: 'simulation',
    name: 'Night City (LOD4 Lab)',
    shortName: 'SIMULATION CADASTRE',
    coords: '18.88°N, 72.78°E',
    tag: '100% LOD4 TWIN (B4-78F)',
    country: 'Digital Twin Lab 🌆',
    desc: 'Authoritative IFC 4.3 BIM, sky-bridges & subsurface hyperloop',
    color: '#ec4899',
  },
];

export default function WorkbenchCockpit({
  city,
  activeRealm = 'globe',
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
  onOpenPhotogrammetry,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);

  const currentCityObj = CITIES.find(c => c.id === city) || CITIES[0];
  const isOrbit = !city;

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
              width: 12, height: 12,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #38bdf8 40%, #0369a1 80%, #000 100%)',
              boxShadow: '0 0 8px rgba(56,189,248,0.7)',
            }} />
          </div>

          {/* Pilot Selection Tabs (Earth Pilot Cities vs Off-Globe Night City) */}
          <CitySelector city={city} activeRealm={activeRealm} onChange={onCityChange} />
        </div>

        {/* Right side: 3D ULPIN Registry & Dispute Workflows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onOpenDisputes}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 999, height: 30, padding: '0 12px',
              color: '#f87171', fontSize: 11, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            title="Real-World 3D Cadastral Disputes (docs/decisions.md Section 9.4)"
          >
            <span>⚖</span>
            <span>Disputes</span>
          </button>

          <button
            onClick={onOpenStrata}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: 999, height: 30, padding: '0 12px',
              color: '#38bdf8', fontSize: 11, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            title="R1 Headline Query: What is Below / Above This Parcel? (docs/eval_results.md)"
          >
            <span>🏢</span>
            <span>Strata (R1)</span>
          </button>

          <button
            onClick={onOpenSandbox}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(168, 85, 247, 0.12)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              borderRadius: 999, height: 30, padding: '0 12px',
              color: '#c084fc', fontSize: 11, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            title="OpenAPI REST Registry Operations (docs/contracts.md)"
          >
            <span>⚡</span>
            <span>REST API</span>
          </button>

          <button
            onClick={onOpenPhotogrammetry}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: 999, height: 30, padding: '0 12px',
              color: '#38bdf8', fontSize: 11, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            title="UAV Photogrammetry & Ingestion (SVAMITVA / ODM SfM)"
          >
            <span>🚁</span>
            <span>Drone</span>
          </button>

          <button
            onClick={onOpenExport}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              borderRadius: 999, height: 30, padding: '0 12px',
              color: '#4ade80', fontSize: 11, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            title="Lossless Cadastre Export: ISO 19152 LADM, IFC 4.3, CityJSON 1.1"
          >
            <span>💾</span>
            <span>Export</span>
          </button>
        </div>
      </header>


      {/* ── Right Floating Status (Matching Voyage Pipeline: Ready LIVE) ── */}
      <div style={{
        position: 'fixed',
        right: 24, top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 85,
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(9, 11, 16, 0.82)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        borderRadius: 999,
        padding: '6px 14px',
        fontSize: 11, fontWeight: 600,
        color: '#ffffff',
        fontFamily: "'Space Grotesk', sans-serif",
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        userSelect: 'none',
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
            background: layerPanelOpen ? 'rgba(56, 189, 248, 0.15)' : 'rgba(10, 14, 22, 0.85)',
            border: layerPanelOpen ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.14)',
            color: layerPanelOpen ? '#38bdf8' : '#ffffff',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
            transition: 'all 0.15s',
          }}
        >
          <span style={{ fontSize: 13 }}>◫</span>
          <span>Layers</span>
        </button>
      </div>

      {/* Bottom Center: Primary Action Pill (Matching RUN CO-REGISTRATION) */}
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
              background: '#2563eb',
              border: '1px solid #3b82f6',
              color: '#ffffff',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13, fontWeight: 700,
              letterSpacing: '0.5px', cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(37, 99, 235, 0.5)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <span>⌖</span>
            <span>SELECT PILOT CITY ▾</span>
          </button>
        ) : (
          <button
            onClick={onResetOrbit}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 999,
              background: 'rgba(10, 14, 22, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12, fontWeight: 600,
              letterSpacing: '0.3px', cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.color = '#38bdf8'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'; e.currentTarget.style.color = '#fff'; }}
          >
            <span>🌐</span>
            <span>RETURN TO GLOBE</span>
          </button>
        )}
      </div>

      {/* Bottom Right: Zoom & Orientation Controls */}
      <div style={{
        position: 'fixed', right: 24, bottom: 20, zIndex: 90,
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'rgba(10, 14, 22, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 999, padding: '3px 6px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
      }}>
        <button
          onClick={onZoomIn}
          title="Zoom In"
          style={{
            background: 'none', border: 'none', color: '#fff',
            width: 28, height: 28, borderRadius: '50%',
            cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          +
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          style={{
            background: 'none', border: 'none', color: '#fff',
            width: 28, height: 28, borderRadius: '50%',
            cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          –
        </button>
        <button
          onClick={onResetCamera}
          title="Reset Orientation"
          style={{
            background: 'none', border: 'none', color: '#fff',
            width: 28, height: 28, borderRadius: '50%',
            cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ⟳
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
