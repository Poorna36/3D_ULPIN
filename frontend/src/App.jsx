import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import TopBar              from './components/TopBar.jsx';
import WorkbenchCockpit    from './components/WorkbenchCockpit.jsx';
import LayerPanel          from './components/LayerPanel.jsx';
import CesiumViewer        from './components/CesiumViewer.jsx';
import DetailPanel         from './components/DetailPanel.jsx';
import AIPipelinePanel     from './components/AIPipelinePanel.jsx';
import PhotogrammetryPanel from './photogrammetry/PhotogrammetryPanel.jsx';
import InteriorWalkthrough, { buildFullFloorList } from './components/InteriorWalkthrough.jsx';
import LandingPage         from './components/LandingPage.jsx';
import ValidationConsole   from './components/ValidationConsole.jsx';
import ConflictWorkflowModal from './components/ConflictWorkflowModal.jsx';
import VerticalStrataExplorer from './components/VerticalStrataExplorer.jsx';
import OpenAPISandboxModal from './components/OpenAPISandboxModal.jsx';
import CadastreExportModal from './components/CadastreExportModal.jsx';
import SpecialistPage      from './components/SpecialistPage.jsx';
import { getBuildings, getParcels, getAllPilotData } from './mock/api.js';

const DEFAULT_LAYERS = {
  google3d:    true,
  tileset3d:   true,
  shadows:     false,
  parcels:     true,
  buildings:   true,
  interior:    true,
  volumes:     true,
  underground: true,
};

// City intro info shown on city change
const CITY_INFO = {
  bengaluru: {
    label: 'Bengaluru', country: 'India',
    desc: 'Primary engineering pilot — mixed-use high-rise urban context',
    color: '#00d4ff',
  },
  mumbai: {
    label: 'Mumbai', country: 'India',
    desc: 'Indian validation — vertical density & complex parcel relationships',
    color: '#10d97e',
  },
  netherlands: {
    label: 'Rotterdam', country: 'Netherlands',
    desc: 'Geospatial benchmark — BAG/AHN4 LiDAR, mixed-use cityscape',
    color: '#f59e0b',
  },
  singapore: {
    label: 'Singapore', country: 'Singapore',
    desc: 'International strata benchmark — 3D space parcels, volumetric titles',
    color: '#a855f7',
  },
};

export default function App() {
  const { allBuildings, allParcels }      = useMemo(() => getAllPilotData(), []);
  const [city, setCity]                   = useState(null); // Starts on full Earth space orbit view
  const [flyTimestamp, setFlyTimestamp]   = useState(0);
  const [buildings, setBuildings]         = useState([]);
  const [parcels, setParcels]             = useState([]);
  const [loading, setLoading]             = useState(false);
  const [selectedBuilding, setSelected]   = useState(null);
  const [layers, setLayers]               = useState(DEFAULT_LAYERS);
  const [explodedFloor, setExplodedFloor] = useState(null);
  const [aiStatus, setAIStatus]           = useState('idle');
  const [showAI, setShowAI]               = useState(false);
  const [showPhotogrammetry, setShowPhotogrammetry] = useState(false);
  const [showSpecialist, setShowSpecialist]         = useState(false);
  const [cityBanner, setCityBanner]       = useState(null);
  const [showLanding, setShowLanding]     = useState(true);
  const [landingExiting, setLandingExiting] = useState(false);
  // Interior walkthrough state
  const [interiorActive, setInteriorActive] = useState(false);
  const [currentFloorIdx, setCurrentFloorIdx] = useState(0);
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMode, setActiveMode] = useState('globe');
  // 3D ULPIN Registry & Dispute Modals
  const [showValidation, setShowValidation] = useState(false);
  const [showConflicts, setShowConflicts]   = useState(false);
  const [showStrata, setShowStrata]         = useState(false);
  const [showSandbox, setShowSandbox]       = useState(false);
  const [showExport, setShowExport]         = useState(false);
  const cameraControlsRef = useRef(null);
  const flyToFloorFnRef = useRef(null);
  const bannerTimer = useRef(null);

  // Sync --panel-w CSS variable so overlays align automatically
  useEffect(() => {
    if (!city || sidebarCollapsed) {
      document.documentElement.style.setProperty('--panel-w', '0px');
    } else {
      document.documentElement.style.setProperty('--panel-w', '380px');
    }
  }, [city, sidebarCollapsed]);

  const handleCameraControlsReady = useCallback((controls) => {
    cameraControlsRef.current = controls;
  }, []);

  // Dedicated city selector callback ensuring camera flight
  const handleCitySelect = useCallback((nextCity) => {
    setCity(nextCity);
    setSidebarCollapsed(false);
    setFlyTimestamp(Date.now());
  }, []);

  const handleReturnToEarth = useCallback(() => {
    setCity(null);
    setSelected(null);
    setFlyTimestamp(Date.now());
  }, []);

  // Real-world conflict scenario launcher
  const handleTriggerConflict = useCallback((scenario) => {
    if (scenario.city && scenario.city !== city) {
      handleCitySelect(scenario.city, 'globe');
    }
    const targetBld = allBuildings.find(b => b.building_id === scenario.building_id) || null;
    if (targetBld) {
      setSelected(targetBld);
    }
    if (scenario.coords) {
      cameraControlsRef.current?.flyToCoords(scenario.coords);
    }
    setShowConflicts(false);
    setTimeout(() => {
      setShowValidation(true);
    }, 2200);
  }, [city, allBuildings, handleCitySelect]);

  const handleEnterApp = useCallback((targetCity) => {
    if (targetCity && typeof targetCity === 'string') {
      handleCitySelect(targetCity);
    } else {
      // Do NOT fly to any city unless explicitly selected — stay in Earth space orbit
      setCity(null);
    }
    // Animate landing page out first, then unmount after transition completes
    setLandingExiting(true);
    setTimeout(() => {
      setShowLanding(false);
      setLandingExiting(false);
    }, 520);
  }, [handleCitySelect]);

  // Load buildings & parcels when city changes — instant preloaded resolution prevents flight lag
  useEffect(() => {
    setSelected(null);
    setExplodedFloor(null);
    if (!city) {
      setBuildings([]);
      setParcels([]);
      setCityBanner(null);
      return;
    }

    // Immediately supply preloaded dataset for active city (0ms latency, zero flight jank)
    const localB = allBuildings.filter(b => b.city === city);
    const localP = allParcels.filter(p => p.city === city);
    setBuildings(localB);
    setParcels(localP);

    // Show city intro banner
    clearTimeout(bannerTimer.current);
    setCityBanner(CITY_INFO[city]);
    bannerTimer.current = setTimeout(() => setCityBanner(null), 3200);

    // Background asynchronous refresh from backend if available
    Promise.all([getBuildings(city), getParcels(city)]).then(([bData, pData]) => {
      if (bData && bData.length) setBuildings(bData);
      if (pData && pData.length) setParcels(pData);
    }).catch(() => {});

    return () => clearTimeout(bannerTimer.current);
  }, [city, allBuildings, allParcels]);

  const handleBuildingClick = useCallback((buildingId, buildingObj) => {
    if (!buildingId) { setSelected(null); setExplodedFloor(null); setInteriorActive(false); return; }
    // buildingObj is provided for OSM virtual buildings not in the buildings state array
    const b = buildingObj ?? buildings.find(b => b.building_id === buildingId);
    setSelected(b ?? null);
    setExplodedFloor(null);
    setInteriorActive(false);
    setCurrentFloorIdx(0);
  }, [buildings]);

  const handleToggleLayer = useCallback((id) => {
    setLayers(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleBuildingSelectFromSearch = useCallback((b) => {
    if (b && b.city && b.city !== city) {
      handleCitySelect(b.city);
    }
    setSelected(b);
    setInteriorActive(false);
    setCurrentFloorIdx(0);
  }, [city, handleCitySelect]);

  // Interior walkthrough handlers
  const handleEnterInterior = useCallback(() => {
    if (!selectedBuilding) return;
    setInteriorActive(true);
    setCurrentFloorIdx(0);
    // buildFullFloorList synthesizes ALL floors from floor_count, not just named key floors
    const floorList = buildFullFloorList(selectedBuilding);
    flyToFloorFnRef.current?.(selectedBuilding, 0, floorList);
  }, [selectedBuilding]);

  const handleExitInterior = useCallback(() => {
    setInteriorActive(false);
    setCurrentFloorIdx(0);
  }, []);

  const handleFloorChange = useCallback((idx) => {
    setCurrentFloorIdx(idx);
    if (!selectedBuilding) return;
    const floorList = buildFullFloorList(selectedBuilding);
    flyToFloorFnRef.current?.(selectedBuilding, idx, floorList);
  }, [selectedBuilding]);

  const handleFlyToFloorReady = useCallback((fn) => {
    flyToFloorFnRef.current = fn;
  }, []);

  return (
    <>
      {/* 1. Landing Page (Rendered directly over the live Cesium Globe) */}
      {(showLanding || landingExiting) && (
        <LandingPage
          onEnter={handleEnterApp}
          onOpenSpecialist={() => { setShowLanding(false); setShowSpecialist(true); }}
          isExiting={landingExiting}
        />
      )}

      {/* 2. Inner App Cockpit (Shown once user enters the 3D Cadastre) */}
      {!showLanding && (
        <WorkbenchCockpit
          city={city}
          sidebarOpen={Boolean(city && !sidebarCollapsed)}
          onCityChange={handleCitySelect}
          onResetOrbit={handleReturnToEarth}
          onZoomIn={() => cameraControlsRef.current?.zoomIn()}
          onZoomOut={() => cameraControlsRef.current?.zoomOut()}
          onResetCamera={() => cameraControlsRef.current?.resetCamera()}
          onToggleLayerPanel={() => setLayerPanelOpen(prev => !prev)}
          layerPanelOpen={layerPanelOpen}
          onToggleLayer={handleToggleLayer}
          layers={layers}
          activeMode={activeMode}
          onModeChange={setActiveMode}
          onReturnToLanding={() => { handleReturnToEarth(); setShowLanding(true); }}
          onOpenDisputes={() => setShowConflicts(true)}
          onOpenStrata={() => setShowStrata(true)}
          onOpenSandbox={() => setShowSandbox(true)}
          onOpenExport={() => setShowExport(true)}
          onOpenAtlas={() => setShowAtlas(true)}
          onOpenPhotogrammetry={() => setShowPhotogrammetry(true)}
          onOpenSpecialist={() => setShowSpecialist(true)}
        />
      )}

      {!showLanding && layerPanelOpen && (
        <LayerPanel
          layers={layers}
          onToggle={handleToggleLayer}
          buildings={buildings}
          currentCity={city}
          onCityChange={handleCitySelect}
          onResetOrbit={() => handleCitySelect(null)}
        />
      )}

      {/* 3. Full-Bleed 3D Cesium Engine (Earth Globe) */}
      <div style={{ width: '100%', height: '100%' }}>
        <CesiumViewer
          city={city}
          flyTimestamp={flyTimestamp}
          buildings={buildings}
          parcels={parcels}
          allBuildings={allBuildings}
          allParcels={allParcels}
          layers={layers}
          selectedBuilding={selectedBuilding}
          onBuildingClick={handleBuildingClick}
          onCitySelect={handleCitySelect}
          explodedFloor={explodedFloor}
          onFlyToFloorReady={handleFlyToFloorReady}
          interiorMode={interiorActive}
          currentFloorIdx={currentFloorIdx}
          onCameraControlsReady={handleCameraControlsReady}
        />
      </div>

      {/* 4. City Cadastre Sidebar (Available only inside pilot cities) */}
      {!showLanding && city && (
        <DetailPanel
          city={city}
          buildings={buildings}
          building={selectedBuilding}
          onSelectBuilding={handleBuildingClick}
          explodedFloor={explodedFloor}
          onFloorClick={setExplodedFloor}
          onClose={() => { setSelected(null); setExplodedFloor(null); setInteriorActive(false); }}
          onEnterInterior={handleEnterInterior}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
          onOpenValidationConsole={() => setShowValidation(true)}
          onOpenStrata={() => setShowStrata(true)}
          onOpenExport={() => setShowExport(true)}
        />
      )}

      {/* 5. 3D ULPIN Registry & Dispute Workflows Modals */}
      {showValidation && (selectedBuilding || (buildings && buildings[0]) || (allBuildings && allBuildings[0])) && (
        <ValidationConsole
          building={selectedBuilding || buildings[0] || allBuildings[0]}
          onClose={() => setShowValidation(false)}
        />
      )}

      {showConflicts && (
        <ConflictWorkflowModal
          onClose={() => setShowConflicts(false)}
          onTriggerScenario={handleTriggerConflict}
        />
      )}

      {showStrata && (selectedBuilding || (buildings && buildings[0]) || (allBuildings && allBuildings[0])) && (
        <VerticalStrataExplorer
          building={selectedBuilding || buildings[0] || allBuildings[0]}
          onClose={() => setShowStrata(false)}
        />
      )}

      {showSandbox && (
        <OpenAPISandboxModal
          building={selectedBuilding || (buildings && buildings[0]) || (allBuildings && allBuildings[0])}
          onClose={() => setShowSandbox(false)}
        />
      )}

      {showExport && (selectedBuilding || (buildings && buildings[0]) || (allBuildings && allBuildings[0])) && (
        <CadastreExportModal
          building={selectedBuilding || buildings[0] || allBuildings[0]}
          onClose={() => setShowExport(false)}
        />
      )}

      {!showLanding && (
        <InteriorWalkthrough
          building={selectedBuilding}
          currentFloorIdx={currentFloorIdx}
          onFloorChange={handleFloorChange}
          onEnter={handleEnterInterior}
          onExit={handleExitInterior}
          isActive={interiorActive}
        />
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="city-loading">
          <div className="city-loading-spinner" />
          <span>Loading city data…</span>
        </div>
      )}


      {/* City intro banner */}
      {cityBanner && (
        <div className="city-banner" style={{ '--banner-color': cityBanner.color }}>
          <div className="city-banner-name">{cityBanner.label}</div>
          <div className="city-banner-country">{cityBanner.country}</div>
          <div className="city-banner-desc">{cityBanner.desc}</div>
        </div>
      )}

      {/* Floating Action Buttons: AI Pipeline & Photogrammetry */}
      <div style={{
        position: 'fixed',
        bottom: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 70,
        display: 'flex', gap: '10px', alignItems: 'center'
      }}>
        <button
          id="ai-panel-toggle-btn"
          className="btn ai-fab"
          onClick={() => setShowAI(v => !v)}
          title="Toggle AI/ML Pipeline panel (H1–H4)"
          style={{ position: 'static', transform: 'none' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-1px' }}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>AI Pipeline</span>
        </button>

        <button
          id="photogrammetry-toggle-btn"
          className="btn photogrammetry-fab"
          onClick={() => setShowPhotogrammetry(v => !v)}
          title="Toggle Photogrammetry & Drone Ingestion panel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-1px' }}>
            <circle cx="12" cy="12" r="3" />
            <path d="M5 5l4 4m6 0l4-4M5 19l4-4m6 0l4 4" />
            <line x1="3" y1="5" x2="7" y2="5" />
            <line x1="17" y1="5" x2="21" y2="5" />
            <line x1="3" y1="19" x2="7" y2="19" />
            <line x1="17" y1="19" x2="21" y2="19" />
          </svg>
          <span>Photogrammetry</span>
        </button>
      </div>

      {showAI && (
        <AIPipelinePanel
          onStatusChange={setAIStatus}
          onClose={() => setShowAI(false)}
        />
      )}

      {showPhotogrammetry && (
        <PhotogrammetryPanel
          currentCity={city}
          onClose={() => setShowPhotogrammetry(false)}
          onBuildingGenerated={(bld) => {
            setSelected(bld);
            setBuildings(prev => [bld, ...prev.filter(b => b.building_id !== bld.building_id)]);
          }}
        />
      )}

      {showSpecialist && (
        <SpecialistPage
          onBack={() => setShowSpecialist(false)}
        />
      )}

      <style>{`
        .ai-fab {
          position: fixed;
          bottom: 24px; left: 50%; transform: translateX(-50%);
          z-index: 70;
          background: var(--violet-dim);
          border-color: var(--violet);
          color: var(--text-primary);
          padding: 8px 20px;
          font-size: 13px; font-weight: 500;
          box-shadow: var(--violet-glow);
          transition: all var(--t-normal);
        }
        .ai-fab:hover {
          background: rgba(124,58,237,0.25);
          box-shadow: 0 0 28px rgba(124,58,237,0.5);
        }

        .photogrammetry-fab {
          background: rgba(56, 189, 248, 0.15);
          border-color: #38bdf8;
          color: #38bdf8;
          padding: 8px 20px;
          font-size: 13px; font-weight: 500;
          border-radius: var(--r-pill);
          box-shadow: 0 0 16px rgba(56, 189, 248, 0.3);
          transition: all var(--t-normal);
          cursor: pointer;
          display: flex; align-items: center; gap: 8px;
        }
        .photogrammetry-fab:hover {
          background: rgba(56, 189, 248, 0.28);
          box-shadow: 0 0 28px rgba(56, 189, 248, 0.5);
        }

        /* City loading indicator */
        .city-loading {
          position: fixed;
          top: calc(var(--topbar-h) + 16px);
          left: 50%; transform: translateX(-50%);
          z-index: 200;
          display: flex; align-items: center; gap: 10px;
          background: rgba(10,22,40,0.92);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-strong);
          border-radius: var(--r-pill);
          padding: 8px 18px;
          font-size: 13px; color: var(--cyan);
          box-shadow: var(--cyan-glow);
          animation: fadeInUp var(--t-fast) forwards;
        }
        .city-loading-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(0,212,255,0.25);
          border-top-color: var(--cyan);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* City intro banner */
        .city-banner {
          position: fixed;
          bottom: 80px; left: 50%; transform: translateX(-50%);
          z-index: 150;
          background: rgba(5,10,20,0.9);
          backdrop-filter: blur(20px);
          border: 1px solid var(--banner-color, var(--cyan));
          border-radius: var(--r-lg);
          padding: 16px 28px;
          text-align: center;
          box-shadow: 0 0 32px color-mix(in srgb, var(--banner-color, var(--cyan)) 40%, transparent);
          animation: bannerIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards,
                     bannerOut 0.4s ease forwards 2.8s;
          pointer-events: none;
          min-width: 280px;
        }
        @keyframes bannerIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes bannerOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        .city-banner-name {
          font-size: 22px; font-weight: 700; letter-spacing: -0.4px;
          color: var(--banner-color, var(--cyan));
          margin-bottom: 2px;
        }
        .city-banner-country {
          font-size: 12px; color: var(--text-secondary);
          margin-bottom: 8px;
        }
        .city-banner-desc {
          font-size: 12px; color: var(--text-dim); line-height: 1.5;
          max-width: 280px;
        }

        /* Earth Space Orbit Guide */
        .space-orbit-guide {
          position: fixed;
          bottom: 28px; left: calc(var(--panel-w) + 24px);
          z-index: 80;
          display: flex; align-items: center; gap: 14px;
          padding: 12px 20px;
          border-radius: var(--r-md);
          border: 1px solid rgba(0, 212, 255, 0.25);
          background: rgba(3, 7, 18, 0.85);
          backdrop-filter: blur(16px);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 212, 255, 0.15);
          pointer-events: none;
          max-width: 440px;
        }
        .space-orbit-guide-icon {
          font-size: 24px;
          filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.6));
        }
        .space-orbit-guide-title {
          font-size: 13px; font-weight: 600;
          color: var(--cyan);
          letter-spacing: 0.2px;
          margin-bottom: 2px;
        }
        .space-orbit-guide-desc {
          font-size: 11px; color: var(--text-secondary);
          line-height: 1.4;
        }

      `}</style>
    </>
  );
}
