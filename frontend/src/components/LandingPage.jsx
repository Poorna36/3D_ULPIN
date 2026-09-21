import ModelEarth from './ModelEarth.jsx';

export default function LandingPage({ onEnter, isExiting = false }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 90,
      background: '#000000',
      fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      color: '#ffffff',
      pointerEvents: isExiting ? 'none' : 'auto',
      opacity: isExiting ? 0 : 1,
      transition: isExiting ? 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
    }}>
      {/* ── Top Navigation ─────────────────────────────────────── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 52,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(16px)',
        flexShrink: 0,
        position: 'relative', zIndex: 10,
      }}>
        {/* Logo */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontWeight: 800, fontSize: 17, letterSpacing: '-0.4px',
            color: '#ffffff',
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
          }}
        >
          TESSERACT
          <span style={{
            display: 'inline-block',
            width: 14, height: 14,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #38bdf8 40%, #0369a1 80%, #000 100%)',
            boxShadow: '0 0 8px rgba(56,189,248,0.6)',
          }} />
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            id="landing-launch-btn"
            onClick={() => onEnter()}
            style={{
              padding: '6px 18px', borderRadius: 999,
              background: '#2563eb',
              border: '1px solid #2563eb',
              color: '#ffffff',
              fontFamily: 'inherit', fontWeight: 700, fontSize: 12,
              cursor: 'pointer', letterSpacing: '0.3px',
              transition: 'all 0.15s',
              boxShadow: '0 2px 12px rgba(37,99,235,0.4)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.boxShadow = '0 2px 20px rgba(37,99,235,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(37,99,235,0.4)'; }}
          >
            LAUNCH
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
            <h1 style={{
              fontFamily: "'Syne', 'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(36px, 4.4vw, 54px)',
              lineHeight: 1.05, letterSpacing: '-2px',
              margin: 0, marginBottom: 4,
              color: '#ffffff',
            }}>
              Vertical 3D Urban
            </h1>
            <h1 style={{
              fontFamily: "'Syne', 'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(36px, 4.4vw, 54px)',
              lineHeight: 1.05, letterSpacing: '-2px',
              margin: 0, marginBottom: 20,
              color: 'rgba(255,255,255,0.38)',
            }}>
              Cadastre Mapping.
            </h1>

            <p style={{
              fontSize: 14, lineHeight: 1.65,
              color: 'rgba(255,255,255,0.60)',
              marginBottom: 28, maxWidth: 460,
              fontWeight: 400,
            }}>
              Tesseract creates unique vertical 3D cadastral spatial identities
              for every floor, unit, and subterranean layer. Bengaluru, Mumbai, Singapore
              and Rotterdam — mapped in full cadastral 3D.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 40 }}>
              <button
                id="landing-hero-launch-btn"
                onClick={() => onEnter()}
                style={{
                  padding: '12px 26px', borderRadius: 999,
                  background: '#ffffff', border: 'none',
                  color: '#000000',
                  fontFamily: 'inherit', fontWeight: 700, fontSize: 13,
                  cursor: 'pointer', letterSpacing: '-0.2px',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 24px rgba(255,255,255,0.15)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Launch
              </button>
            </div>

            {/* Bottom 3-Metric Bar */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 32,
              paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)',
              maxWidth: 480,
            }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#ffffff', letterSpacing: '-0.5px' }}>
                  &lt; 0.05 m
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2, fontWeight: 500 }}>
                  Spatial Precision
                </div>
              </div>
              <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.10)' }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#ffffff', letterSpacing: '-0.5px' }}>
                  ISO 19152
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2, fontWeight: 500 }}>
                  LADM Standard
                </div>
              </div>
              <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.10)' }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#ffffff', letterSpacing: '-0.5px' }}>
                  100%
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2, fontWeight: 500 }}>
                  Watertight Solids
                </div>
              </div>
            </div>
          </div>

          {/* Right: Model 3D Earth Globe - Completely unrestricted, zero box clipping */}
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

      {/* ── Background Subtle Cosmic Starfield Overlay ──────────── */}
      <svg style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0, opacity: 0.35,
      }}>
        {Array.from({ length: 60 }, (_, i) => (
          <circle
            key={i}
            cx={`${(i * 37 + 13) % 100}%`}
            cy={`${(i * 53 + 7) % 100}%`}
            r={(i % 3) + 0.5}
            fill="white"
            opacity={(i % 5) * 0.12 + 0.05}
          />
        ))}
      </svg>
    </div>
  );
}
