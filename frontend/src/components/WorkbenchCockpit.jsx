import { useState, useRef } from 'react';
import CitySelector from './CitySelector.jsx';
import BuildingSearchQuery from './BuildingSearchQuery.jsx';

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
  allBuildings = [],
  onSelectBuilding,
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
      {/* ── Top Bar (Clean & Minimal Header with 3D ULPIN Query Engine) ──────── */}
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

          {/* Back Button to Earth Orbit (when a city is active) */}
          {city && (
            <button
              onClick={onResetOrbit}
              title="Return to Global Earth Space Orbit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#202024',
                border: '1px solid #3f3f46',
                color: '#f4f4f5',
                fontSize: 11.5,
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#27272a';
                e.currentTarget.style.borderColor = '#38bdf8';
                e.currentTarget.style.color = '#38bdf8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#202024';
                e.currentTarget.style.borderColor = '#3f3f46';
                e.currentTarget.style.color = '#f4f4f5';
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Earth Orbit</span>
            </button>
          )}

          {/* Pilot Selection Tabs (Earth Pilot Cities) */}
          <CitySelector city={city} onChange={onCityChange} />
        </div>

        {/* Right Header: When on Earth Orbit, show global search. When inside city, show clean tool actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!city ? (
            <BuildingSearchQuery
              buildings={allBuildings}
              currentCity={city}
              onSelectBuilding={onSelectBuilding}
              placeholder="Search structure or 3D ULPIN… [/]"
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={onOpenDisputes}
                title="Cadastre Conflict & Overlap Workflows"
                style={{
                  background: '#202024',
                  border: '1px solid #33343a',
                  color: '#d4d4d8',
                  padding: '5px 9px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#33343a'; e.currentTarget.style.color = '#d4d4d8'; }}
              >
                <span>Disputes</span>
              </button>

              <button
                onClick={onOpenStrata}
                title="3D Strata Parcel Breakdown"
                style={{
                  background: '#202024',
                  border: '1px solid #33343a',
                  color: '#d4d4d8',
                  padding: '5px 9px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#33343a'; e.currentTarget.style.color = '#d4d4d8'; }}
              >
                <span>Strata</span>
              </button>

              <button
                onClick={onOpenSandbox}
                title="OpenAPI Cadastre Endpoint Sandbox"
                style={{
                  background: '#202024',
                  border: '1px solid #33343a',
                  color: '#d4d4d8',
                  padding: '5px 9px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#33343a'; e.currentTarget.style.color = '#d4d4d8'; }}
              >
                <span>OpenAPI</span>
              </button>

              <button
                onClick={onOpenExport}
                title="Export 3D Cadastre (CityGML / IFC / GeoJSON)"
                style={{
                  background: '#202024',
                  border: '1px solid #33343a',
                  color: '#d4d4d8',
                  padding: '5px 9px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#33343a'; e.currentTarget.style.color = '#d4d4d8'; }}
              >
                <span>Export</span>
              </button>

              <button
                onClick={onOpenPhotogrammetry}
                title="Open UAV Survey & Photogrammetry Engine"
                style={{
                  background: '#0284c7',
                  border: 'none',
                  color: '#ffffff',
                  padding: '5px 10px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#0369a1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#0284c7'; }}
              >
                <span>UAV Drone</span>
              </button>
            </div>
          )}
        </div>
      </header>




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

      {/* Bottom Center: Primary Action Pill — removed per user request */}
      <div style={{ display: 'none' }}>
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
