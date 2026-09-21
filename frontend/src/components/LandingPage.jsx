import { useState } from 'react';
import ModelEarth from './ModelEarth.jsx';

export default function LandingPage({ onEnter, isExiting = false }) {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [showDossier, setShowDossier] = useState(false);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 90,
      background: activeTab === 'OVERVIEW' ? '#000000' : 'rgba(2, 4, 8, 0.94)',
      backdropFilter: activeTab === 'OVERVIEW' ? 'none' : 'blur(24px)',
      fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      color: '#ffffff',
      pointerEvents: isExiting ? 'none' : 'auto',
      opacity: isExiting ? 0 : 1,
      transition: isExiting ? 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'background 0.3s ease',
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
          onClick={() => setActiveTab('OVERVIEW')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontWeight: 800, fontSize: 17, letterSpacing: '-0.4px',
            color: '#ffffff', cursor: 'pointer',
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

        {/* Center nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {[
            { id: 'OVERVIEW', label: 'OVERVIEW' },
            { id: 'ARCHITECTURE', label: 'ARCHITECTURE' },
            { id: 'CITIES', label: 'CITIES' },
            { id: 'PIPELINE', label: 'PIPELINE' },
            { id: 'TEAM', label: 'TEAM' },
          ].map(n => {
            const isActive = activeTab === n.id;
            return (
              <span
                key={n.id}
                onClick={() => setActiveTab(n.id)}
                style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.8px',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.38)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  borderBottom: isActive ? '1px solid #ffffff' : '1px solid transparent',
                  paddingBottom: 2,
                }}
                onMouseEnter={e => { if (!isActive) e.target.style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={e => { if (!isActive) e.target.style.color = 'rgba(255,255,255,0.38)'; }}
              >
                {n.label}
              </span>
            );
          })}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setShowDossier(true)}
            style={{
              padding: '6px 16px', borderRadius: 999,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
              cursor: 'pointer', letterSpacing: '0.3px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
          >
            DOSSIER
          </button>
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

      {/* ── Main Content Area (Tab Driven) ──────────────────────── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex' }}>

        {/* ── TAB 1: OVERVIEW (HERO) ────────────────────────────── */}
        {activeTab === 'OVERVIEW' && (
          <div style={{
            flex: 1, display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            position: 'relative', overflow: 'hidden',
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
                  Launch 3D Workbench
                </button>
                <button
                  onClick={() => setActiveTab('PIPELINE')}
                  style={{
                    padding: '12px 0', background: 'none', border: 'none',
                    color: '#38bdf8', fontFamily: 'inherit', fontWeight: 600,
                    fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'gap 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.gap = '10px'; }}
                  onMouseLeave={e => { e.currentTarget.style.gap = '6px'; }}
                >
                  Explore the pipeline <span style={{ fontSize: 16 }}>›</span>
                </button>
              </div>

              {/* Bottom 3-Metric Bar from Voyage design */}
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

            {/* Right: Model 3D Earth Globe with subtle orbital satellite */}
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'visible',
            }}>
              <ModelEarth />
            </div>
          </div>
        )}

        {/* ── TAB 2: ARCHITECTURE ───────────────────────────────── */}
        {activeTab === 'ARCHITECTURE' && (
          <div style={{
            flex: 1, padding: '36px 48px', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 28,
            maxWidth: 1200, margin: '0 auto', width: '100%',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: '#38bdf8', textTransform: 'uppercase', marginBottom: 6 }}>
                Technical Specification & Data Standards
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
                Vertical 3D Cadastre Architecture
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 700, margin: '6px 0 0 0', lineHeight: 1.6 }}>
                Full compliance with ISO 19152 Land Administration Domain Model (LADM) for volumetric property registration and 3D spatial units.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                {
                  tag: 'ISO 19152 LADM',
                  title: 'Volumetric Spatial Units',
                  desc: 'Defines LA_SpatialUnit for 3D parcels including subterranean strata, basement vaults, podium levels, and airspace property rights with strict topological boundaries.',
                  points: ['3D B-Rep Watertight Geometries', 'Subterranean Infrastructure Layers', 'Strata Title Rights & Encumbrances'],
                },
                {
                  tag: 'CRS & GEODESY',
                  title: 'Vertical Coordinate System',
                  desc: 'Uses EPSG:4979 (3D Geographic WGS84) with orthometric elevation referenced to Mean Sea Level (MSL) datum for sub-centimeter vertical layer delineation.',
                  points: ['WGS84 Ellipsoidal + MSL Datum', 'Sub-Centimeter Floor Accuracy', 'Universal EPSG:4979 Coordinate Hash'],
                },
                {
                  tag: 'IDENTIFIER ALGORITHM',
                  title: '24-Char 3D ULPIN Schema',
                  desc: 'Extends India’s 14-digit standard 2D Bhu-Aadhaar into a vertical 24-character volumetric identifier encompassing tower, floor elevation, and unit volume.',
                  points: ['ST(2)-DST(3)-SBD(3)-VIL(4)', 'PLT(6)-TWR(2)-FLR(2)-UNT(2)', 'Collision-Proof Spatial Hash'],
                },
              ].map(card => (
                <div key={card.title} style={{
                  background: '#090a0f',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: 24,
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.8px' }}>{card.tag}</span>
                  <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{card.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{card.desc}</div>
                  <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {card.points.map(pt => (
                      <div key={pt} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#38bdf8' }} />
                        {pt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Live ULPIN Sample Decomposition */}
            <div style={{
              background: '#07080c', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.5px' }}>SAMPLE SYNTHESIZED 3D ULPIN</div>
                <div style={{ fontFamily: 'monospace', fontSize: 18, color: '#ffffff', fontWeight: 700, marginTop: 4, letterSpacing: '1px' }}>
                  <span style={{ color: '#60a5fa' }}>MH</span>·<span style={{ color: '#93c5fd' }}>MUM</span>·<span style={{ color: '#a78bfa' }}>001</span>·<span style={{ color: '#38bdf8' }}>0042</span>·<span style={{ color: '#f43f5e' }}>000108</span>·<span style={{ color: '#34d399' }}>T1</span>·<span style={{ color: '#fbbf24' }}>F42</span>·<span style={{ color: '#f472b6' }}>U02</span>
                </div>
              </div>
              <button
                onClick={() => onEnter('mumbai')}
                style={{
                  padding: '8px 18px', borderRadius: 999, background: '#2563eb', border: 'none',
                  color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Inspect in 3D Viewer ›
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 3: CITIES ─────────────────────────────────────── */}
        {activeTab === 'CITIES' && (
          <div style={{
            flex: 1, padding: '36px 48px', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 24,
            maxWidth: 1200, margin: '0 auto', width: '100%',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: '#38bdf8', textTransform: 'uppercase', marginBottom: 6 }}>
                Multi-Tier Spatial Testbeds
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
                Benchmarked Pilot Cities
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 650, margin: '6px 0 0 0', lineHeight: 1.6 }}>
                Four contrasting urban typologies testing coastal supertalls, tech corridors, subterranean transport hubs, and mixed-use vertical port infrastructures.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {[
                {
                  id: 'mumbai',
                  name: 'Mumbai, India',
                  badge: 'PRIMARY HIGH-RISE PILOT',
                  badgeColor: '#38bdf8',
                  desc: 'High-density vertical urbanism featuring supertalls up to 441.5m (World One) with 117 floors, complex coastal reclaimed strata, and multi-owner floor strata.',
                  stats: [
                    { label: 'Buildings', val: '24+' },
                    { label: 'Max Height', val: '441.5m' },
                    { label: 'Max Floors', val: '117F' },
                    { label: 'Type', val: 'Coastal Supertalls' },
                  ],
                },
                {
                  id: 'bengaluru',
                  name: 'Bengaluru, India',
                  badge: 'TECH CORRIDOR PILOT',
                  badgeColor: '#34d399',
                  desc: 'Dynamic commercial IT campuses, podium complexes, UB City, and subterranean metro underground infrastructure integrated with surface cadastral parcels.',
                  stats: [
                    { label: 'Buildings', val: '18+' },
                    { label: 'Max Height', val: '128.0m' },
                    { label: 'Max Floors', val: '32F' },
                    { label: 'Type', val: 'Tech & Metro Strata' },
                  ],
                },
                {
                  id: 'singapore',
                  name: 'Singapore',
                  badge: 'GLOBAL BENCHMARK',
                  badgeColor: '#a78bfa',
                  desc: 'Marina Bay high-density financial core featuring subterranean pedestrian connectors, common service tunnels, and multi-tier skybridge land parcel integration.',
                  stats: [
                    { label: 'Buildings', val: '26+' },
                    { label: 'Max Height', val: '280.0m' },
                    { label: 'Max Floors', val: '68F' },
                    { label: 'Type', val: 'Underground & Skyways' },
                  ],
                },
                {
                  id: 'netherlands',
                  name: 'Rotterdam, Netherlands',
                  badge: 'EU 3D STANDARD REFERENCE',
                  badgeColor: '#f43f5e',
                  desc: 'Wilhelminapier architectural cadastre featuring De Rotterdam "Vertical City", multi-owner volumetric boundaries, and European 3D land administration standards.',
                  stats: [
                    { label: 'Buildings', val: '25+' },
                    { label: 'Max Height', val: '151.3m' },
                    { label: 'Max Floors', val: '44F' },
                    { label: 'Type', val: 'Mixed-Use Vertical City' },
                  ],
                },
              ].map(city => {
                return (
                  <div key={city.id} style={{
                    background: '#090a0f',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14,
                    padding: 24,
                    display: 'flex', flexDirection: 'column', gap: 14,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>{city.name}</div>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                        background: `${city.badgeColor}20`, color: city.badgeColor,
                        border: `1px solid ${city.badgeColor}50`, letterSpacing: 0.6,
                      }}>
                        {city.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{city.desc}</div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {city.stats.map(s => (
                        <div key={s.label}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: "'Syne', sans-serif" }}>{s.val}</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => onEnter(city.id, 'globe')}
                      style={{
                        marginTop: 4, padding: '10px 16px', borderRadius: 8,
                        background: 'rgba(37,99,235,0.15)',
                        border: '1px solid #2563eb',
                        color: '#60a5fa',
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#2563eb';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(37,99,235,0.15)';
                        e.currentTarget.style.color = '#60a5fa';
                      }}
                    >
                      Launch {city.name.split(',')[0]} in 3D Viewer <span style={{ fontSize: 14 }}>›</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 4: PIPELINE ───────────────────────────────────── */}
        {activeTab === 'PIPELINE' && (
          <div style={{
            flex: 1, padding: '36px 48px', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 28,
            maxWidth: 1200, margin: '0 auto', width: '100%',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: '#38bdf8', textTransform: 'uppercase', marginBottom: 6 }}>
                Processing Workflow & Geocoding Pipeline
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
                End-to-End 3D Cadastral Pipeline
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 700, margin: '6px 0 0 0', lineHeight: 1.6 }}>
                Automated ingestion of heterogeneous 2D/3D spatial sources, vertical stratification, algorithmic ULPIN assignment, and OGC 3D Tiles streaming.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                {
                  step: '01',
                  title: 'Multi-Source Spatial Ingestion',
                  tech: 'CityGML LoD1–LoD3 · Drone Photogrammetry · BIM/IFC Schemas',
                  desc: 'Ingests building boundary footprints, terrain elevation models, and architectural structural data with coordinate harmonization into WGS84 EPSG:4979.',
                },
                {
                  step: '02',
                  title: 'Vertical Stratification & Floor Decomposition',
                  tech: 'Algorithmic Slab Slicing · Subterranean Basement Estimation',
                  desc: 'Computes floor-to-floor elevation profiles based on building heights, standard slab thickness (3.2m–3.8m), and podium vs. tower floor geometry splits.',
                },
                {
                  step: '03',
                  title: 'Algorithmic 3D ULPIN Assignment',
                  tech: '24-Character Volumetric Hashes · Centroid Elevation Coding',
                  desc: 'Generates tamper-evident 3D ULPIN codes encoding State, District, Plot, Tower, Floor Elevation, and Sub-Unit centroid coordinates into standard Bhu-Aadhaar.',
                },
                {
                  step: '04',
                  title: 'Automated QA/QC & Validation Checks',
                  tech: 'Euler Watertightness · Overlap Detection · Provenance Tagging',
                  desc: 'Executes 6-phase geometric compliance checks ensuring meshes are watertight, non-self-intersecting, and correctly tagged with DERIVED/SYNTHETIC provenance.',
                },
                {
                  step: '05',
                  title: 'OGC 3D Tiles & Quantized Mesh Delivery',
                  tech: 'Cesium b3dm · Draco Compression · Dynamic LOD Streaming',
                  desc: 'Packages stratified 3D building meshes into high-performance 3D Tiles streamed in real-time to the WebGL Cesium viewer for smooth 60fps interaction.',
                },
              ].map(p => (
                <div key={p.step} style={{
                  background: '#090a0f', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 24,
                }}>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800,
                    color: '#38bdf8', opacity: 0.9, width: 44, flexShrink: 0,
                  }}>
                    {p.step}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: "'Syne', sans-serif" }}>{p.title}</div>
                      <span style={{ fontSize: 10, color: '#a78bfa', fontWeight: 600, background: 'rgba(167,139,250,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                        {p.tech}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4, lineHeight: 1.5 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: TEAM ───────────────────────────────────────── */}
        {activeTab === 'TEAM' && (
          <div style={{
            flex: 1, padding: '36px 48px', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 28,
            maxWidth: 1200, margin: '0 auto', width: '100%',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: '#38bdf8', textTransform: 'uppercase', marginBottom: 6 }}>
                Smart India Hackathon 2024 · Ministry of Rural Development
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
                Problem Statement SIH26011
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 750, margin: '6px 0 0 0', lineHeight: 1.6 }}>
                Autonomous 3D Urban Cadastre & Vertical Property Identity System for High-Density Environments.
                Department of Land Resources (DoLR), Government of India.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                {
                  role: 'GEOSPATIAL ARCHITECTURE',
                  title: '3D Cadastral Framework',
                  desc: 'Designed ISO 19152 compliant volumetric parcel data models, elevation datum harmonizations, and vertical boundary delineation algorithms.',
                },
                {
                  role: 'FULL-STACK 3D ENGINE',
                  title: 'Cesium Digital Twin',
                  desc: 'Engineered WebGL real-time 3D tile rendering, floor-by-floor camera navigation, and interior structural visualization.',
                },
                {
                  role: 'STANDARDS & PROVENANCE',
                  title: 'Regulatory & QA/QC Validator',
                  desc: 'Formulated strict provenance protocols ensuring all synthetic/derived parcel geometries conform to Ministry of Rural Development standards.',
                },
              ].map(card => (
                <div key={card.title} style={{
                  background: '#090a0f', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.8px' }}>{card.role}</span>
                  <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{card.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{card.desc}</div>
                </div>
              ))}
            </div>

            {/* Compliance Note */}
            <div style={{
              background: '#07080c', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Compliance Status: PROTOTYPE VERIFIED</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  All architectural components, floor strata models, and 3D ULPIN codes validated against DoLR 2026 guidelines.
                </div>
              </div>
              <button
                onClick={() => onEnter()}
                style={{
                  padding: '10px 20px', borderRadius: 999, background: '#2563eb', border: 'none',
                  color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Launch Workbench ›
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── Stats Row (Persistent across tabs) ─────────────────── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'stretch',
        flexShrink: 0,
        position: 'relative', zIndex: 2,
      }}>
        {[
          { value: '93+',    unit: '',   label: 'Buildings Mapped' },
          { value: '441.5',  unit: 'm',  label: 'Tallest Tower' },
          { value: '4',      unit: '',   label: 'Pilot Cities' },
          { value: '117',    unit: 'F',  label: 'Max Floors' },
        ].map((s, i) => (
          <div key={s.label} style={{
            flex: 1, padding: '16px 28px',
            borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            display: 'flex', flexDirection: 'column', gap: 3,
          }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800, fontSize: 26, letterSpacing: '-1px',
              color: '#ffffff', lineHeight: 1,
            }}>
              {s.value}<span style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{s.unit}</span>
            </div>
            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,0.35)',
              fontWeight: 500, letterSpacing: '0.3px',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 40px',
        flexShrink: 0, position: 'relative', zIndex: 2,
      }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.3px' }}>
          Problem Statement SIH26011 • 3D Cadastral Engine • Data labelled DERIVED / SYNTHETIC
        </span>
        <button
          onClick={() => onEnter()}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 11, color: 'rgba(255,255,255,0.35)',
            fontFamily: 'inherit', letterSpacing: '0.3px',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
        >
          Next: Launch 3D Viewer <span style={{ fontSize: 14 }}>›</span>
        </button>
      </div>

      {/* Subtle starfield dots */}
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

      {/* ── DOSSIER Modal ──────────────────────────────────────── */}
      {showDossier && (
        <div
          onClick={() => setShowDossier(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#07080d', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 16, width: '100%', maxWidth: 680, padding: 32,
              display: 'flex', flexDirection: 'column', gap: 20,
              boxShadow: '0 24px 64px rgba(0,0,0,0.9)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', letterSpacing: '1px' }}>TECHNICAL DOSSIER</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginTop: 2 }}>
                  Tesseract Project Specifications
                </div>
              </div>
              <button
                onClick={() => setShowDossier(false)}
                title="Close Dossier"
                style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', borderRadius: 999, width: 28, height: 28,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ margin: 0 }}>
                This prototype demonstrates an end-to-end 3D vertical cadastre system in response to Smart India Hackathon Problem Statement SIH26011, under the Department of Land Resources (DoLR), Ministry of Rural Development.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Core Compliance Attributes:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
                  <div>• ISO 19152 LADM 3D Spatial Units</div>
                  <div>• EPSG:4979 3D WGS84 + MSL Datum</div>
                  <div>• 24-Character Vertical ULPIN Schema</div>
                  <div>• OGC 3D Tiles (b3dm) & Cesium Engine</div>
                  <div>• Subterranean Infrastructure Mapping</div>
                  <div>• Synthetic & Derived Data Auditing</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setShowDossier(false)}
                style={{
                  padding: '8px 18px', borderRadius: 8, background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Close
              </button>
              <button
                onClick={() => { setShowDossier(false); onEnter(); }}
                style={{
                  padding: '8px 20px', borderRadius: 8, background: '#2563eb',
                  border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Launch 3D Viewer ›
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
