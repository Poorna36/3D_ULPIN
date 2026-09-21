import React, { useState } from 'react';
import NightCityViewer from './NightCityViewer.jsx';
import SimCityViewer from './SimCityViewer.jsx';
import PhotogrammetryPanel from '../photogrammetry/PhotogrammetryPanel.jsx';
import AIPipelinePanel from './AIPipelinePanel.jsx';

const SPECIALIST_FILES = [
  {
    path: 'photogrammetry/api/routes.py',
    category: 'Photogrammetry API',
    desc: 'FastAPI endpoints for UAV drone ingestion, EXIF extraction, ODM triangulation, and SVAMITVA parcel mapping.',
    snippet: `@router.post("/process", response_model=DroneProcessResponse)
def process_drone_survey(request: DroneProcessRequest):
    """Executes Structure-from-Motion triangulation, elevation extraction,
    and 3D vertical slicing into ULPIN PropertyVolumes."""`
  },
  {
    path: 'photogrammetry/geometry/vertical_slicer.py',
    category: 'Computational Geometry',
    desc: '3D boundary slicer subdividing building solid meshes into discrete legal floor units (PropertyVolume) with monotonic Z bounds.',
    snippet: `class VerticalSlicer:
    def slice_building(self, footprint, total_height, floor_count):
        floor_height = total_height / max(1, floor_count)
        return [PropertyVolume(z_min=i*floor_height, z_max=(i+1)*floor_height) for i in range(floor_count)]`
  },
  {
    path: 'photogrammetry/adapters/india/svamitva_cadastre.py',
    category: 'Indian Cadastre',
    desc: 'SVAMITVA & Bhu-Aadhaar adapter matching drone-derived orthophoto polygons to official survey village parcel numbers.',
    snippet: `class SvamitvaCadastreAdapter:
    def match_parcel(self, polygon, state="KA"):
        # Matches WGS84 drone geometry to Survey of India village cadastre
        return {"parcel_id": f"IN-{state}-PARCEL-001", "scheme": "SVAMITVA"}`
  },
  {
    path: 'photogrammetry/ingestion/odm_client.py',
    category: 'Drone Ingestion',
    desc: 'OpenDroneMap (NodeODM) client executing aerial photogrammetry jobs for point clouds, DSMs, and textured 3D Tiles.',
    snippet: `class ODMClient:
    def dispatch_job(self, image_paths, options=None):
        # Dispatches aerial imagery to NodeODM worker nodes
        return {"task_id": "odm_task_99182", "status": "RUNNING"}`
  },
  {
    path: 'frontend/src/components/NightCityViewer.jsx',
    category: 'Digital Twin Sandbox',
    desc: 'Full-bleed Three.js 3D engine featuring 12 iconic LOD4 landmarks, Arasaka Tower, subsurface vaults, and smart contract telemetry.',
    snippet: `// Coordinates and visual anchors for all 12 iconic Night City landmarks
const NC_LOCATIONS = {
  'NC-BLD-00001': { x: 0, z: -50, name: 'Arasaka Tower', role: 'corpo_hq' },
  'NC-BLD-00002': { x: 120, z: -120, name: 'Megabuilding H10', role: 'megabuilding' }
};`
  },
  {
    path: 'frontend/src/components/SimCityViewer.jsx',
    category: 'Municipal Twin',
    desc: 'Three.js interactive city simulation with municipal R-C-I zoning overlays, power/water distribution, and tax valuation.',
    snippet: `// SimCity Dashboard State
const [timeOfDay, setTimeOfDay] = useState('day');
const [activeOverlay, setActiveOverlay] = useState('zoning'); // R-C-I zones`
  },
  {
    path: 'run.bat & run.ps1',
    category: 'Launcher Scripts',
    desc: 'One-click operational environment scripts for automated backend FastAPI, ODM worker, and Vite client execution.',
    snippet: `@echo off
echo Starting 3D ULPIN Full Stack with Photogrammetry Subsystem...
start "Backend" uvicorn backend.api.main:app --reload --port 8000
start "Frontend" npm run dev`
  }
];

export default function SpecialistPage({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFile, setSelectedFile] = useState(SPECIALIST_FILES[0]);
  const [activeSubView, setActiveSubView] = useState(null); // 'night_city' | 'simcity' | 'drone_modal' | 'ai_modal'
  const [selectedSimBuilding, setSelectedSimBuilding] = useState(null);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 400,
      background: '#07090e',
      color: '#f3f4f6',
      fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <header style={{
        height: 58,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'rgba(9, 11, 17, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(20px)',
        flexShrink: 0,
        zIndex: 50
      }}>
        {/* Left: Back button & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#0d111a',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: 999,
              height: 32,
              padding: '0 14px',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1a2030'; e.currentTarget.style.borderColor = '#38bdf8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0d111a'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'; }}
            title="Return to the 3D Cesium Earth Globe"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Return to Globe</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#c084fc',
              boxShadow: '0 0 10px #c084fc'
            }} />
            <h1 style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.4px',
              color: '#ffffff',
              fontFamily: "'Syne', sans-serif"
            }}>
              SPECIALIST BRANCH LAB
            </h1>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 999,
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#d8b4fe'
            }}>
              origin/specialist
            </span>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[
            { id: 'overview', label: 'HUB OVERVIEW', icon: '◈' },
            { id: 'drone', label: 'DRONE PHOTOGRAMMETRY', icon: '🚁' },
            { id: 'night_city', label: 'LOD4 NIGHT CITY', icon: '🌆' },
            { id: 'simcity', label: 'SIMCITY TWIN', icon: '🏙️' },
            { id: 'aiml', label: 'AI/ML STACK', icon: '🧠' },
            { id: 'code', label: 'CODE & DOCS', icon: '📄' },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'night_city') setActiveSubView('night_city');
                  else if (tab.id === 'simcity') setActiveSubView('simcity');
                  else setActiveSubView(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 13px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  border: isActive ? '1px solid #c084fc' : '1px solid transparent',
                  background: isActive ? 'rgba(192, 132, 252, 0.15)' : 'transparent',
                  color: isActive ? '#f3e8ff' : 'rgba(255, 255, 255, 0.65)',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Badge & Folder Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            fontSize: 11,
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span>📂</span>
            <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>specialist_branch/</span>
          </div>
        </div>
      </header>

      {/* ── Main View Area ──────────────────────────────────────── */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* TAB 1: HUB OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{
            height: '100%',
            overflowY: 'auto',
            padding: '36px 48px',
            maxWidth: 1240,
            margin: '0 auto'
          }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#c084fc',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: 6
              }}>
                Isolated Advanced Features Subsystem
              </div>
              <h2 style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: "'Syne', sans-serif"
              }}>
                Specialist Branch Modules & Experimental Labs
              </h2>
              <p style={{
                margin: '8px 0 0 0',
                fontSize: 14,
                color: '#9ca3af',
                maxWidth: 820,
                lineHeight: 1.6
              }}>
                This dedicated portal houses the complete, uncompromised features from the <strong style={{ color: '#ffffff' }}>origin/specialist</strong> branch. 
                Everything below is fully extracted and accessible locally on your system inside <code style={{ color: '#38bdf8' }}>specialist_branch/</code>.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 20,
              marginBottom: 40
            }}>
              {/* Card 1: Drone Photogrammetry */}
              <div
                onClick={() => setActiveTab('drone')}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: 14,
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 28 }}>🚁</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                    13 PASSING TESTS
                  </span>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#ffffff' }}>Drone Photogrammetry & Slicing</h3>
                  <p style={{ margin: '6px 0 0 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                    Structure-from-Motion (SfM), EXIF parsing, OpenDroneMap REST integration, SVAMITVA cadastre matching, and 3D vertical slicing into ULPIN volumes.
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#38bdf8', fontWeight: 600 }}>
                  <span>Launch Drone Ingestion Studio</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 2: LOD4 Night City */}
              <div
                onClick={() => { setActiveTab('night_city'); setActiveSubView('night_city'); }}
                style={{
                  background: 'rgba(24, 13, 33, 0.65)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  borderRadius: 14,
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 28 }}>🌆</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
                    100% LOD4 TWIN LAB
                  </span>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#ffffff' }}>Night City Digital Twin</h3>
                  <p style={{ margin: '6px 0 0 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                    Full 3D Three.js environment demonstrating authoritative IFC 4.3 BIM, sky-bridges, subterranean hyperloop vaults (B1-B4), and live IoT feeds.
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#f472b6', fontWeight: 600 }}>
                  <span>Enter 3D Night City Sandbox</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 3: SimCity Municipal Twin */}
              <div
                onClick={() => { setActiveTab('simcity'); setActiveSubView('simcity'); }}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 14,
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 28 }}>🏙️</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                    MUNICIPAL PLANNING
                  </span>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#ffffff' }}>Riverview Metropolis (SimCity)</h3>
                  <p style={{ margin: '6px 0 0 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                    Municipal zoning cadastre with R-C-I strata layers, infrastructure utility networks, day/night cycles, and fiscal property tax evaluation.
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#60a5fa', fontWeight: 600 }}>
                  <span>Enter 3D SimCity Sandbox</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 4: AI/ML Stack */}
              <div
                onClick={() => setActiveTab('aiml')}
                style={{
                  background: 'rgba(18, 14, 30, 0.65)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: 14,
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 28 }}>🧠</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                    H1–H4 MODELS
                  </span>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#ffffff' }}>AI/ML Cadastral Pipeline</h3>
                  <p style={{ margin: '6px 0 0 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                    Deep learning building footprint extractor, architectural plan vectoriser, Viterbi level alignment, and manifold topology ranker.
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#c084fc', fontWeight: 600 }}>
                  <span>Execute AI Pipeline</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 5: Code & Docs */}
              <div
                onClick={() => setActiveTab('code')}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 14,
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 28 }}>📄</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                    FULL AUDIT LOG
                  </span>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#ffffff' }}>Specialist Codebase & Specs</h3>
                  <p style={{ margin: '6px 0 0 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                    Inspect files directly from the extracted specialist directory, examine API definitions, review architectural ADRs, and view startup scripts.
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#34d399', fontWeight: 600 }}>
                  <span>Browse Specialist Files</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Terminal Commands Card */}
            <div style={{
              background: '#0d111a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
              padding: 20
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚡</span>
                <span>Direct Local Commands (Run from your project root)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'monospace', fontSize: 12 }}>
                <div style={{ background: '#05070c', padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#9ca3af' }}># Run all 13 Photogrammetry tests:</span><br/>
                  <span style={{ color: '#38bdf8' }}>python -m unittest discover photogrammetry/tests</span>
                </div>
                <div style={{ background: '#05070c', padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#9ca3af' }}># Launch specialist batch automation:</span><br/>
                  <span style={{ color: '#c084fc' }}>.\run.bat</span> <span style={{ color: '#9ca3af' }}>or</span> <span style={{ color: '#c084fc' }}>.\run.ps1</span>
                </div>
                <div style={{ background: '#05070c', padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#9ca3af' }}># Switch git branch to specialist locally:</span><br/>
                  <span style={{ color: '#34d399' }}>git checkout specialist</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DRONE PHOTOGRAMMETRY */}
        {activeTab === 'drone' && (
          <div style={{ height: '100%', position: 'relative', background: '#05070d' }}>
            <PhotogrammetryPanel
              currentCity="bengaluru"
              onClose={() => setActiveTab('overview')}
              onBuildingGenerated={(bld) => {
                alert(`3D Building Generated: ${bld.name} (${bld.building_id}) with ${bld.units?.length || 0} vertical strata units.`);
              }}
            />
          </div>
        )}

        {/* TAB 3: NIGHT CITY 3D TWIN */}
        {activeTab === 'night_city' && (
          <div style={{ height: '100%', position: 'relative', width: '100%' }}>
            <NightCityViewer
              selectedBuilding={selectedSimBuilding}
              onSelectBuilding={setSelectedSimBuilding}
              onReturnToEarth={() => setActiveTab('overview')}
            />
          </div>
        )}

        {/* TAB 4: SIMCITY MUNICIPAL TWIN */}
        {activeTab === 'simcity' && (
          <div style={{ height: '100%', position: 'relative', width: '100%' }}>
            <SimCityViewer
              selectedBuilding={selectedSimBuilding}
              onSelectBuilding={setSelectedSimBuilding}
              onReturnToEarth={() => setActiveTab('overview')}
            />
          </div>
        )}

        {/* TAB 5: AI/ML STACK */}
        {activeTab === 'aiml' && (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05070d' }}>
            <AIPipelinePanel
              onClose={() => setActiveTab('overview')}
            />
          </div>
        )}

        {/* TAB 6: SPECIALIST CODE & DOCS EXPLORER */}
        {activeTab === 'code' && (
          <div style={{
            height: '100%',
            display: 'flex',
            overflow: 'hidden'
          }}>
            {/* Left file sidebar */}
            <div style={{
              width: 380,
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#090c14',
              overflowY: 'auto',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.5px' }}>
                Key Specialist Files
              </div>
              {SPECIALIST_FILES.map(file => {
                const isSel = selectedFile.path === file.path;
                return (
                  <div
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: isSel ? 'rgba(192, 132, 252, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSel ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#c084fc', textTransform: 'uppercase' }}>
                        {file.category}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#ffffff', fontFamily: 'monospace' }}>
                      {file.path}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, lineHeight: 1.4 }}>
                      {file.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right code preview */}
            <div style={{
              flex: 1,
              background: '#06080e',
              padding: 24,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}>
              <div>
                <div style={{ fontSize: 11, color: '#c084fc', fontWeight: 700, textTransform: 'uppercase' }}>
                  {selectedFile.category}
                </div>
                <h3 style={{ margin: '4px 0', fontSize: 18, color: '#ffffff', fontFamily: 'monospace' }}>
                  {selectedFile.path}
                </h3>
                <p style={{ margin: '6px 0 0 0', fontSize: 13, color: '#9ca3af' }}>
                  {selectedFile.desc}
                </p>
              </div>

              <div style={{
                background: '#0c0f18',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 8,
                padding: 16,
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: 12,
                color: '#e2e8f0',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                overflowX: 'auto'
              }}>
                {selectedFile.snippet}
              </div>

              <div style={{
                marginTop: 'auto',
                padding: 16,
                borderRadius: 8,
                background: 'rgba(56, 189, 248, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: 12, color: '#38bdf8' }}>
                  Complete source file is extracted on your disk at: <strong>specialist_branch/{selectedFile.path}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
