import ModelEarth from './ModelEarth.jsx';

export default function LandingPage({ onEnter, isExiting = false }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 90,
      background: '#090d16',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      color: '#f8fafc',
      pointerEvents: isExiting ? 'none' : 'auto',
      opacity: isExiting ? 0 : 1,
      transition: isExiting ? 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
    }}>
      {/* ── Top Navigation ─────────────────────────────────────── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 54,
        borderBottom: '1px solid #1e293b',
        background: 'rgba(9, 13, 22, 0.92)',
        backdropFilter: 'blur(12px)',
        flexShrink: 0,
        position: 'relative', zIndex: 10,
      }}>
        {/* Logo */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontWeight: 700, fontSize: 16, letterSpacing: '-0.2px',
            color: '#f8fafc',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
          TESSERACT
          <span style={{
            fontSize: 10,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: 4,
            background: '#1e293b',
            color: '#94a3b8',
            border: '1px solid #334155'
          }}>
            3D Cadastre
          </span>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            id="landing-launch-btn"
            onClick={() => onEnter()}
            style={{
              padding: '7px 18px', borderRadius: 6,
              background: '#2563eb',
              border: '1px solid #1d4ed8',
              color: '#ffffff',
              fontFamily: 'inherit', fontWeight: 600, fontSize: 12.5,
              cursor: 'pointer', letterSpacing: '0.2px',
              transition: 'background 0.15s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; }}
          >
            Launch Map
          </button>
        </div>
      </nav>

      {/* ── Main Hero Content ────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: 'minmax(460px, 1fr) 1.25fr',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}>
          {/* Left: Text & Metrics */}
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '0 32px 0 54px',
            position: 'relative', zIndex: 2,
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 600, letterSpacing: '0.6px',
              textTransform: 'uppercase', color: '#38bdf8',
              marginBottom: 12,
            }}>
              <span>National Spatial Cadastre Platform</span>
            </div>

            <h1 style={{
              fontWeight: 700,
              fontSize: 'clamp(32px, 3.8vw, 48px)',
              lineHeight: 1.12, letterSpacing: '-1.2px',
              margin: 0, marginBottom: 6,
              color: '#f8fafc',
            }}>
              Vertical 3D Urban
            </h1>
            <h1 style={{
              fontWeight: 700,
              fontSize: 'clamp(32px, 3.8vw, 48px)',
              lineHeight: 1.12, letterSpacing: '-1.2px',
              margin: 0, marginBottom: 20,
              color: '#94a3b8',
            }}>
              Cadastre Mapping
            </h1>

            <p style={{
              fontSize: 14, lineHeight: 1.65,
              color: '#94a3b8',
              marginBottom: 28, maxWidth: 480,
              fontWeight: 400,
            }}>
              Tesseract delineates authoritative vertical 3D cadastral parcels
              for multi-storey structures, individual units, and subterranean infrastructure across Bengaluru, Mumbai, Singapore, and Rotterdam.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
              <button
                id="landing-hero-launch-btn"
                onClick={() => onEnter()}
                style={{
                  padding: '11px 24px', borderRadius: 6,
                  background: '#2563eb', border: '1px solid #1d4ed8',
                  color: '#ffffff',
                  fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
                  cursor: 'pointer', letterSpacing: '0.1px',
                  transition: 'background 0.15s ease',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; }}
              >
                Launch 3D Cadastre
              </button>
            </div>

            {/* Bottom 3-Metric Bar */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 32,
              paddingTop: 24, borderTop: '1px solid #1e293b',
              maxWidth: 480,
            }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.3px' }}>
                  &lt; 0.05 m
                </div>
                <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2, fontWeight: 500 }}>
                  Spatial Precision
                </div>
              </div>
              <div style={{ width: 1, height: 36, background: '#1e293b' }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.3px' }}>
                  ISO 19152
                </div>
                <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2, fontWeight: 500 }}>
                  LADM Standard
                </div>
              </div>
              <div style={{ width: 1, height: 36, background: '#1e293b' }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.3px' }}>
                  100%
                </div>
                <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2, fontWeight: 500 }}>
                  Watertight Solids
                </div>
              </div>
            </div>
          </div>

          {/* Right: Model 3D Earth Globe */}
          <div style={{
            flex: 1,
            height: '100%',
            width: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ModelEarth />
          </div>
        </div>
      </div>
    </div>
  );
}
