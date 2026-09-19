import { useState, useRef } from 'react';

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
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
        {/* Left: Brand + Target Selector Pill */}
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

          {/* Target City Selector Pill */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 999,
              height: 32, padding: '0 4px',
            }}>
              {/* City target dropdown trigger */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  background: 'none', border: 'none',
                  color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '4px 14px', cursor: 'pointer',
                  borderRadius: 999,
                }}
              >
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: isOrbit ? '#a855f7' : currentCityObj.color,
                  boxShadow: `0 0 8px ${isOrbit ? '#a855f7' : currentCityObj.color}`,
                }} />
                <span>{isOrbit ? 'Global Orbit (All Pilots)' : currentCityObj.name}</span>
                <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 2 }}>▼</span>
              </button>
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: 40, left: 0, zIndex: 200,
                width: 290, background: '#090a0f',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: 12, padding: 6,
                boxShadow: '0 16px 40px rgba(0,0,0,0.85)',
                display: 'flex', flexDirection: 'column', gap: 2,
              }}>
                <button
                  onClick={() => handleSelectCity('orbit')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', borderRadius: 8,
                    background: isOrbit ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    border: 'none', color: '#fff', cursor: 'pointer',
                    textAlign: 'left', fontFamily: 'inherit', fontSize: 12,
                  }}
                >
                  <span style={{ fontSize: 15 }}>🌍</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>Global Earth Orbit</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Inspect all 4 pilot zones from space</div>
                  </div>
                </button>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />

                {CITIES.map(c => {
                  const isSelected = city === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCity(c.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', borderRadius: 8,
                        background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                        border: isSelected ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                        color: '#fff', cursor: 'pointer',
                        textAlign: 'left', fontFamily: 'inherit', fontSize: 12,
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{c.tag}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right side is intentionally minimal & clear */}
        <div />
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
