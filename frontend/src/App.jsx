import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import WorkbenchCockpit    from './components/WorkbenchCockpit.jsx';
import LayerPanel          from './components/LayerPanel.jsx';
// CesiumViewer lazy-loaded: defers the ~12MB Cesium bundle until first render
// Cuts initial page load time by 70-80% — Landing Page appears instantly.
const CesiumViewer = lazy(() => import('./components/CesiumViewer.jsx'));
import DetailPanel         from './components/DetailPanel.jsx';
import InteriorWalkthrough from './components/InteriorWalkthrough.jsx';
import { buildFullFloorList } from './utils/floorLayouts.js';
import LandingPage         from './components/LandingPage.jsx';
import ValidationConsole   from './components/ValidationConsole.jsx';
import ConflictWorkflowModal from './components/ConflictWorkflowModal.jsx';
import VerticalStrataExplorer from './components/VerticalStrataExplorer.jsx';
import OpenAPISandboxModal from './components/OpenAPISandboxModal.jsx';
import CadastreExportModal from './components/CadastreExportModal.jsx';
import PhotogrammetryPage  from './components/PhotogrammetryPage.jsx';
import { getBuildings, getParcels, getAllPilotDataAsync, ALL_FALLBACK_PARCELS } from './mock/api.js';

// Read quality preset from URL — mirrors the same logic in CesiumViewer.jsx so
// DEFAULT_LAYERS.tileset3d is consistent with what CesiumViewer initializes.
const _appQuality = new URLSearchParams(window.location.search).get('quality');
const _osmDefault = _appQuality === 'balanced' ? false : true; // high (default) → true

const DEFAULT_LAYERS = {
  google3d:    true,
  tileset3d:   _osmDefault, // `high`: true (original); `balanced`: false (perf opt-in)
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
  const [allBuildings, setAllBuildings]   = useState([]);
  const [allParcels, setAllParcels]       = useState(ALL_FALLBACK_PARCELS || []);

  useEffect(() => {
    getAllPilotDataAsync().then(({ allBuildings: ab, allParcels: ap }) => {
      setAllBuildings(ab);
      setAllParcels(ap);
    }).catch(() => {});
  }, []);

  const [city, setCity]                   = useState(null); // Starts on full Earth space orbit view
  const [flyTimestamp, setFlyTimestamp]   = useState(0);
  const [buildings, setBuildings]         = useState([]);
  const [parcels, setParcels]             = useState([]);
  const [loading, setLoading]             = useState(false);
  const [selectedBuilding, setSelected]   = useState(null);
  const [layers, setLayers]               = useState(DEFAULT_LAYERS);
  const [explodedFloor, setExplodedFloor] = useState(null);
  const [showPhotogrammetryPage, setShowPhotogrammetryPage] = useState(false);
  const [cityBanner, setCityBanner]       = useState(null);
  const [showLanding, setShowLanding]     = useState(true);
  const [landingExiting, setLandingExiting] = useState(false);

  // Prefetch CesiumViewer chunk while landing page is visible without creating a WebGL context
  useEffect(() => {
    const id = typeof requestIdleCallback !== 'undefined'
      ? requestIdleCallback(() => import('./components/CesiumViewer.jsx'))
      : setTimeout(() => import('./components/CesiumViewer.jsx'), 1500);
    return () => (typeof cancelIdleCallback !== 'undefined' ? cancelIdleCallback(id) : clearTimeout(id));
  }, []);
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

  // Seamless jump from Photogrammetry reconstruction to live 3D Cesium globe
  const handleFlyToBuilding = useCallback((bld) => {
    if (!bld) return;
    const targetCity = bld.city || 'bengaluru';
    if (city !== targetCity) {
      setCity(targetCity);
      setFlyTimestamp(Date.now());
    }
    setBuildings(prev => [bld, ...prev.filter(b => b.building_id !== bld.building_id)]);
    setSelected(bld);
    setShowLanding(false);
    setShowPhotogrammetryPage(false);
    setSidebarCollapsed(false);
  }, [city]);

  // Reset selection & synchronize cached data when switching to a different city during render
  const [prevCity, setPrevCity] = useState(city);
  if (city !== prevCity) {
    setPrevCity(city);
    if (selected && selected.city !== city) {
      setSelected(null);
    }
    setExplodedFloor(null);
    if (!city) {
      setBuildings([]);
      setParcels([]);
      setCityBanner(null);
      setLoading(false);
    } else {
      const localB = allBuildings.filter(b => b.city === city);
      const localP = allParcels.filter(p => p.city === city);
      setBuildings(localB);
      setParcels(localP);
      setLoading(!localB.length);
      setCityBanner(CITY_INFO[city]);
    }
  }

  // Load buildings & parcels asynchronously when city changes — dynamic loading fallback
  useEffect(() => {
    if (!city) return;

    // Clear city intro banner after timeout
    clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setCityBanner(null), 3200);

    // Asynchronously ensure city buildings & parcels are loaded from dynamic chunks or backend
    Promise.all([getBuildings(city), getParcels(city)]).then(([bData, pData]) => {
      if (bData && bData.length) {
        setBuildings(prev => (prev.length === bData.length && prev[0]?.building_id === bData[0]?.building_id ? prev : bData));
        setAllBuildings(prev => {
          const hasCity = prev.some(b => b.city === city);
          if (hasCity && prev.filter(b => b.city === city).length === bData.length) return prev;
          const withoutCity = prev.filter(b => b.city !== city);
          return [...withoutCity, ...bData];
        });
      }
      if (pData && pData.length) {
        setParcels(prev => (prev.length === pData.length && prev[0]?.parcel_id === pData[0]?.parcel_id ? prev : pData));
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    return () => clearTimeout(bannerTimer.current);
  }, [city, allBuildings, allParcels]);

  const handleBuildingClick = useCallback((buildingId, buildingObj, _floorIdx = 0) => {
    if (!buildingId) { setSelected(null); setExplodedFloor(null); setInteriorActive(false); return; }
    // buildingObj is provided for dynamic virtual buildings not in the buildings state array
    const b = buildingObj ?? buildings.find(b => b.building_id === buildingId) ?? allBuildings.find(b => b.building_id === buildingId);
    if (!b) return;
    setSelected(b);
    setExplodedFloor(null);
    // Interior mode is NOT auto-entered on building click.
    // User must explicitly press the "Walk Inside 3D" button to enter interior.
    setInteriorActive(false);
  }, [buildings, allBuildings]);

  const handleToggleLayer = useCallback((id) => {
    setLayers(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleBuildingSelectFromSearch = useCallback((b) => {
    if (b && b.city && b.city !== city) {
      handleCitySelect(b.city);
    }
    setSelected(b);
    // Interior mode is NOT auto-entered on search selection.
    // User must explicitly press the "Walk Inside 3D" button.
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
          onSlantView={() => cameraControlsRef.current?.slantView()}
          onTopView={() => cameraControlsRef.current?.topView()}
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
          onOpenPhotogrammetry={() => setShowPhotogrammetryPage(true)}
          allBuildings={allBuildings}
          onSelectBuilding={handleBuildingSelectFromSearch}
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
          onClose={() => setLayerPanelOpen(false)}
        />
      )}

      {/* 3. Full-Bleed 3D Cesium Engine (Earth Globe) */}
      <div style={{ width: '100%', height: '100%' }}>
        {(!showLanding || landingExiting) && (
          <Suspense fallback={<div style={{ width: '100%', height: '100%', background: '#020912' }} />}>
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
          </Suspense>
        )}
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
          onReturnToEarth={handleReturnToEarth}
          onCitySelect={handleCitySelect}
          allBuildings={allBuildings}
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

      {showPhotogrammetryPage && (
        <PhotogrammetryPage
          onBack={() => setShowPhotogrammetryPage(false)}
          onBuildingGenerated={(bld) => {
            const targetCity = bld.city || 'bengaluru';
            if (city !== targetCity) {
              setCity(targetCity);
              setFlyTimestamp(Date.now());
            }
            setSelected(bld);
            setBuildings(prev => [bld, ...prev.filter(b => b.building_id !== bld.building_id)]);
          }}
          onFlyToBuilding={handleFlyToBuilding}
        />
      )}

      <style>{`
        .photogrammetry-fab {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.4);
          color: #38bdf8;
          padding: 8px 18px;
          font-size: 13px; font-weight: 500;
          border-radius: var(--r-pill);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          transition: all var(--t-normal);
          cursor: pointer;
          display: flex; align-items: center; gap: 8px;
        }
        .photogrammetry-fab:hover {
          background: rgba(56, 189, 248, 0.2);
          border-color: #38bdf8;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
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
          background: rgba(5,10,20,0.92);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-strong);
          border-radius: var(--r-lg);
          padding: 16px 28px;
          text-align: center;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7);
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
      `}</style>
    </>
  );
}
