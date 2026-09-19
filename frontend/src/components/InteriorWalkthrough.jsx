import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ── Floor type metadata ─────────────────────────────────────────────────────
function floorMeta(label = '', idx = 0, total = 1) {
  const l = label.toLowerCase();
  if (l.includes('ground') || idx === 0) return { icon: '🚪', type: 'Ground Floor',   color: '#10b981' };
  if (l.includes('roof')  || idx === total - 1) return { icon: '🏗️', type: 'Rooftop',  color: '#f59e0b' };
  if (l.includes('park')  || l.includes('car'))  return { icon: '🅿️', type: 'Parking',  color: '#64748b' };
  if (l.includes('mech')  || l.includes('plant')) return { icon: '⚙️', type: 'Mechanical', color: '#94a3b8' };
  if (l.includes('lobby') || l.includes('recep')) return { icon: '🛎️', type: 'Lobby',    color: '#06b6d4' };
  if (l.includes('sky')   || l.includes('observ')) return { icon: '🔭', type: 'Sky Level', color: '#a855f7' };
  if (l.includes('pool')  || l.includes('club'))  return { icon: '🏊', type: 'Amenity',  color: '#0ea5e9' };
  if (l.includes('base')  || l.includes('sub') || idx < 0) return { icon: '⬇️', type: 'Basement', color: '#475569' };
  if (idx < total * 0.25) return { icon: '🏬', type: 'Commercial', color: '#0284c7' };
  if (idx < total * 0.55) return { icon: '🏢', type: 'Office',     color: '#6366f1' };
  return { icon: '🏠', type: 'Residential', color: '#a855f7' };
}

// ── Build a COMPLETE floor list from a building object ────────────────────────
// When building.floors has only key/representative floors (e.g., 8 out of 117),
// this synthesizes the full list using floor_count and overlays named data.
export function buildFullFloorList(building) {
  if (!building) return [];
  const totalAboveGround = building.floor_count || 10;
  const absH    = Math.abs(building.height || 40);
  const gElev   = building.ground_elevation || 0;
  const floorH  = absH / Math.max(totalAboveGround, 1);

  // Map from level_index → named floor object
  const namedByLevel = {};
  (building.floors || []).forEach(f => { namedByLevel[f.level_index] = f; });

  const result = [];

  // 1. Basements first (negative level_index, e.g. -3, -2, -1)
  const basementIdxs = Object.keys(namedByLevel)
    .map(Number)
    .filter(n => n < 0)
    .sort((a, b) => a - b); // B3 first, B1 last
  basementIdxs.forEach(idx => result.push(namedByLevel[idx]));

  // 2. Above-ground floors 0 → totalAboveGround-1
  for (let i = 0; i < totalAboveGround; i++) {
    if (namedByLevel[i]) {
      // Use named floor data (has real label, z_min, z_max)
      result.push(namedByLevel[i]);
    } else {
      // Synthesize from geometry
      const label = i === 0
        ? 'Ground Floor'
        : i === totalAboveGround - 1
        ? `Floor ${i} — Rooftop`
        : `Floor ${i}`;
      result.push({
        floor_id:    `${building.building_id}_GEN_F${i}`,
        level_index: i,
        label,
        z_min: gElev + i * floorH,
        z_max: gElev + (i + 1) * floorH,
        unit_count: 0,
        confidence: 'INFERRED',
        status: 'REVIEW',
      });
    }
  }

  return result;
}

export default function InteriorWalkthrough({ building, currentFloorIdx, onFloorChange, onEnter, onExit, isActive }) {
  const [expanded, setExpanded]     = useState(false);
  const [animating, setAnimating]   = useState(false);
  const [jumpInput, setJumpInput]   = useState('');
  const [jumpError, setJumpError]   = useState('');
  const [jumpPreview, setJumpPreview] = useState(null);
  const jumpRef = useRef(null);

  // Build full floor list — always from floor_count, overlay named floors where defined
  const floors = useMemo(() => buildFullFloorList(building), [building]);

  const totalFloors  = floors.length;
  const clampedIdx   = Math.min(Math.max(currentFloorIdx ?? 0, 0), totalFloors - 1);
  const currentFloor = floors[clampedIdx];
  const meta = currentFloor ? floorMeta(currentFloor.label, clampedIdx, totalFloors) : null;

  const absH   = Math.abs(building?.height || 40);
  const floorH = absH / Math.max(totalFloors, 1);
  const elevPct = totalFloors > 1 ? (clampedIdx / (totalFloors - 1)) * 100 : 0;

  const doFloorChange = useCallback((idx) => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    onFloorChange(idx);
  }, [onFloorChange]);

  const goUp   = useCallback(() => { if (clampedIdx < totalFloors - 1) doFloorChange(clampedIdx + 1); }, [clampedIdx, totalFloors, doFloorChange]);
  const goDown = useCallback(() => { if (clampedIdx > 0) doFloorChange(clampedIdx - 1); }, [clampedIdx, doFloorChange]);

  // ── Jump textbox logic ─────────────────────────────────────────────────────
  // Match a typed floor number to a floor index.
  // Rules: "0" or "G" → ground (idx 0), negative numbers → basement search,
  // positive numbers → match level_index or label containing that number.
  const resolveFloorInput = useCallback((raw) => {
    const s = raw.trim().toLowerCase();
    if (!s) return null;

    // "g" or "ground" → floor 0
    if (s === 'g' || s === 'ground') return 0;
    // "r" or "roof" → top floor
    if (s === 'r' || s === 'roof' || s === 'rooftop') return totalFloors - 1;
    // "b1", "b2" etc → basement levels
    const basementMatch = s.match(/^b(\d+)$/);
    if (basementMatch) {
      const level = -parseInt(basementMatch[1], 10);
      const found = floors.findIndex(f => f.level_index === level);
      if (found !== -1) return found;
      // fallback: search label
      const lbFound = floors.findIndex(f => f.label.toLowerCase().includes(`b${Math.abs(level)}`));
      return lbFound !== -1 ? lbFound : null;
    }
    // Plain number → match level_index, then label
    const num = parseInt(s, 10);
    if (!isNaN(num)) {
      // Direct level_index match
      const byIndex = floors.findIndex(f => f.level_index === num);
      if (byIndex !== -1) return byIndex;
      // Array position (1-based for user: "1" → floors[0])
      const byPos = num - 1;
      if (byPos >= 0 && byPos < totalFloors) return byPos;
    }
    return null;
  }, [floors, totalFloors]);

  // Live preview as user types
  const handleJumpInput = useCallback((e) => {
    const val = e.target.value;
    setJumpInput(val);
    setJumpError('');
    if (!val.trim()) { setJumpPreview(null); return; }
    const idx = resolveFloorInput(val);
    if (idx !== null) {
      setJumpPreview({ idx, label: floors[idx]?.label || `Floor ${idx + 1}` });
    } else {
      setJumpPreview(null);
    }
  }, [resolveFloorInput, floors]);

  const executeJump = useCallback(() => {
    const idx = resolveFloorInput(jumpInput);
    if (idx === null) {
      setJumpError(`No floor "${jumpInput}" found`);
      return;
    }
    doFloorChange(idx);
    setJumpInput('');
    setJumpPreview(null);
    setJumpError('');
    jumpRef.current?.blur();
  }, [jumpInput, resolveFloorInput, doFloorChange]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isActive) return;
    const onKey = (e) => {
      // Don't intercept when typing in the jump box
      if (document.activeElement === jumpRef.current) {
        if (e.key === 'Enter') { e.preventDefault(); executeJump(); }
        if (e.key === 'Escape') { setJumpInput(''); setJumpPreview(null); jumpRef.current?.blur(); }
        return;
      }
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); goUp();   }
      if (e.key === 'ArrowDown' || e.key === 'PageDown')  { e.preventDefault(); goDown(); }
      if (e.key === 'Escape') onExit();
      // Press "/" to focus floor jump box
      if (e.key === '/') { e.preventDefault(); jumpRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isActive, goUp, goDown, onExit, executeJump]);

  // Quick-jump landmark floors
  const quickFloors = (() => {
    const landmarks = [];
    landmarks.push({ label: 'G', idx: 0, title: 'Ground Floor' });
    // Any named special floors
    floors.forEach((f, fi) => {
      const l = f.label.toLowerCase();
      if ((l.includes('sky') || l.includes('lounge') || l.includes('observ') || l.includes('pool')) && fi !== 0 && fi !== totalFloors - 1) {
        landmarks.push({ label: f.label.replace(/floor\s*/i, 'F').slice(0, 8), idx: fi, title: f.label });
      }
    });
    // Mid building
    const mid = Math.floor(totalFloors / 2);
    if (mid > 0 && mid < totalFloors - 1) landmarks.push({ label: `F${floors[mid]?.level_index ?? mid}`, idx: mid, title: floors[mid]?.label || `Floor ${mid + 1}` });
    // Top
    if (totalFloors > 1) landmarks.push({ label: 'Top', idx: totalFloors - 1, title: floors[totalFloors - 1]?.label || 'Rooftop' });
    // Deduplicate by idx
    return landmarks.filter((l, i, arr) => arr.findIndex(x => x.idx === l.idx) === i).slice(0, 5);
  })();

  if (!building) return null;

  return (
    <>
      {/* Enter / Exit button */}
      {!isActive ? (
        <button
          id="interior-enter-btn"
          className="interior-enter-btn"
          onClick={onEnter}
          title="Enter building interior walkthrough"
        >
          <span className="interior-enter-icon">🚶</span>
          <span>Walk Inside</span>
          <span className="interior-enter-badge">{totalFloors}F</span>
        </button>
      ) : (
        <div className="interior-hud glass">
          {/* Header */}
          <div className="ihud-header">
            <div className="ihud-building-name">{building.name}</div>
            <div className="ihud-subtitle">
              Interior Walkthrough · {totalFloors} floors · {absH.toFixed(0)}m
            </div>
            <button className="ihud-exit-btn" onClick={onExit} title="Exit interior mode (Esc)">
              ✕ Exit
            </button>
          </div>

          {/* Current floor readout */}
          <div className={`ihud-floor-display ${animating ? 'floor-animating' : ''}`}>
            <div className="ihud-floor-icon" style={{ color: meta?.color }}>{meta?.icon}</div>
            <div className="ihud-floor-info">
              <div className="ihud-floor-label">{currentFloor?.label || `Floor ${clampedIdx + 1}`}</div>
              <div className="ihud-floor-type" style={{ color: meta?.color }}>{meta?.type}</div>
              <div className="ihud-floor-elev">
                ↑ {(currentFloor?.z_min != null
                    ? Math.max(0, currentFloor.z_min - (building.ground_elevation || 0))
                    : floorH * clampedIdx
                  ).toFixed(1)}m – {(currentFloor?.z_max != null
                    ? Math.max(0, currentFloor.z_max - (building.ground_elevation || 0))
                    : floorH * (clampedIdx + 1)
                  ).toFixed(1)}m AGL
              </div>
            </div>
          </div>

          {/* ── Floor Jump Textbox ──────────────────────────────────────── */}
          <div className="ihud-jump-section">
            <div className="ihud-jump-row">
              <div className="ihud-jump-input-wrap">
                <span className="ihud-jump-icon">⌨</span>
                <input
                  ref={jumpRef}
                  id="floor-jump-input"
                  className="ihud-jump-input"
                  type="text"
                  value={jumpInput}
                  onChange={handleJumpInput}
                  onKeyDown={(e) => { if (e.key === 'Enter') executeJump(); }}
                  placeholder={`Floor 1–${totalFloors} or G / B1 / R`}
                  maxLength={6}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Jump to floor number"
                />
              </div>
              <button
                className={`ihud-jump-btn ${jumpPreview !== null ? 'ready' : ''}`}
                onClick={executeJump}
                disabled={!jumpInput.trim()}
                title="Go to floor (Enter)"
              >
                Go ↵
              </button>
            </div>
            {/* Live preview */}
            {jumpPreview !== null && !jumpError && (
              <div className="ihud-jump-preview">
                → {jumpPreview.label}
              </div>
            )}
            {jumpError && (
              <div className="ihud-jump-error">{jumpError}</div>
            )}
            {/* Quick-jump landmark buttons */}
            <div className="ihud-quickjump-row">
              {quickFloors.map(qf => (
                <button
                  key={qf.idx}
                  className={`ihud-qjump-btn ${qf.idx === clampedIdx ? 'active' : ''}`}
                  onClick={() => doFloorChange(qf.idx)}
                  title={qf.title}
                >
                  {qf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Elevator column + step nav */}
          <div className="ihud-elevator-row">
            <div className="ihud-nav-col">
              <button
                className="ihud-nav-btn ihud-nav-up"
                onClick={goUp}
                disabled={clampedIdx >= totalFloors - 1}
                title="Go up one floor (↑)"
              >▲</button>

              <div className="ihud-shaft">
                <div className="ihud-shaft-track">
                  {floors.map((f, fi) =>
                    (fi === 0 || fi === totalFloors - 1 || fi % Math.max(1, Math.floor(totalFloors / 6)) === 0) ? (
                      <button
                        key={f.floor_id}
                        className={`ihud-shaft-marker ${fi === clampedIdx ? 'active' : ''}`}
                        style={{ bottom: `${(fi / Math.max(totalFloors - 1, 1)) * 100}%` }}
                        onClick={() => doFloorChange(fi)}
                        title={f.label}
                      />
                    ) : null
                  )}
                  <div
                    className="ihud-cabin"
                    style={{ bottom: `${elevPct}%`, backgroundColor: meta?.color ?? '#06b6d4' }}
                  />
                </div>
                <div className="ihud-shaft-labels">
                  <span>R</span>
                  <span>G</span>
                </div>
              </div>

              <button
                className="ihud-nav-btn ihud-nav-down"
                onClick={goDown}
                disabled={clampedIdx <= 0}
                title="Go down one floor (↓)"
              >▼</button>
            </div>

            {/* Collapsible full floor list */}
            <div className="ihud-floor-list-wrap">
              <button className="ihud-list-toggle" onClick={() => setExpanded(v => !v)}>
                {expanded ? '▾ Hide floors' : '▸ All floors'}
              </button>
              {expanded && (
                <div className="ihud-floor-list">
                  {[...floors].reverse().map((f, ri) => {
                    const fi = totalFloors - 1 - ri;
                    const fm = floorMeta(f.label, fi, totalFloors);
                    return (
                      <button
                        key={f.floor_id}
                        className={`ihud-floor-item ${fi === clampedIdx ? 'active' : ''}`}
                        style={fi === clampedIdx ? { borderColor: fm.color, color: fm.color } : {}}
                        onClick={() => doFloorChange(fi)}
                      >
                        <span>{fm.icon}</span>
                        <span className="ihud-fi-label">{f.label}</span>
                        <span className="ihud-fi-elev">{(floorH * fi).toFixed(0)}m</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="ihud-hint">
            <kbd>↑↓</kbd> step &nbsp;·&nbsp; <kbd>/</kbd> jump &nbsp;·&nbsp; <kbd>Esc</kbd> exit
          </div>
        </div>
      )}

      <style>{`
        .interior-enter-btn {
          position: fixed;
          bottom: 80px;
          right: calc(var(--panel-w) + 16px);
          z-index: 160;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.50);
          border-radius: 999px;
          color: #06b6d4;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          backdrop-filter: blur(12px);
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.18);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .interior-enter-btn:hover {
          background: rgba(6, 182, 212, 0.22);
          box-shadow: 0 0 32px rgba(6, 182, 212, 0.38);
          transform: translateY(-2px);
        }
        .interior-enter-icon { font-size: 16px; }
        .interior-enter-badge {
          background: rgba(6, 182, 212, 0.25);
          border: 1px solid rgba(6, 182, 212, 0.4);
          border-radius: 4px;
          padding: 1px 6px;
          font-size: 11px;
          font-weight: 700;
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .interior-hud {
          position: fixed;
          right: calc(var(--panel-w) + 14px);
          bottom: 70px;
          z-index: 160;
          width: 290px;
          border-radius: 16px;
          border: 1px solid rgba(6, 182, 212, 0.35);
          background: rgba(2, 8, 23, 0.92);
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(6,182,212,0.08),
            0 8px 32px rgba(0,0,0,0.6),
            0 0 40px rgba(6,182,212,0.12);
          overflow: hidden;
          animation: hudSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes hudSlideIn {
          from { opacity: 0; transform: translateX(32px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        .ihud-header {
          padding: 14px 14px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          gap: 2px;
          position: relative;
        }
        .ihud-building-name {
          font-size: 13px; font-weight: 700; color: #f1f5f9;
          letter-spacing: -0.2px; padding-right: 50px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ihud-subtitle { font-size: 10px; color: #475569; font-weight: 500; }
        .ihud-exit-btn {
          position: absolute; top: 12px; right: 10px;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 6px; color: #f87171;
          font-size: 11px; font-weight: 600; padding: 3px 8px;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .ihud-exit-btn:hover { background: rgba(239,68,68,0.25); box-shadow: 0 0 12px rgba(239,68,68,0.3); }

        .ihud-floor-display {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: all 0.25s;
        }
        .floor-animating { transform: translateY(-3px); opacity: 0.6; }
        .ihud-floor-icon { font-size: 26px; flex-shrink: 0; filter: drop-shadow(0 0 6px currentColor); }
        .ihud-floor-info { flex: 1; min-width: 0; }
        .ihud-floor-label { font-size: 14px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.2px; }
        .ihud-floor-type { font-size: 11px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; margin-top: 1px; }
        .ihud-floor-elev { font-size: 10px; color: #475569; margin-top: 3px; font-variant-numeric: tabular-nums; }

        /* ── Floor Jump Section ──────────────────────────────────── */
        .ihud-jump-section {
          padding: 10px 14px 8px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ihud-jump-row {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .ihud-jump-input-wrap {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        .ihud-jump-icon {
          position: absolute;
          left: 8px;
          font-size: 11px;
          color: #334155;
          pointer-events: none;
          z-index: 1;
        }
        .ihud-jump-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 8px;
          color: #e2e8f0;
          font-size: 12px;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 500;
          padding: 6px 8px 6px 22px;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .ihud-jump-input::placeholder { color: #334155; font-size: 11px; }
        .ihud-jump-input:focus {
          border-color: rgba(6,182,212,0.55);
          box-shadow: 0 0 0 2px rgba(6,182,212,0.12);
          background: rgba(6,182,212,0.06);
        }
        .ihud-jump-btn {
          padding: 6px 10px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: #64748b;
          font-size: 11px; font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s;
          flex-shrink: 0;
        }
        .ihud-jump-btn:disabled { opacity: 0.25; cursor: not-allowed; }
        .ihud-jump-btn.ready,
        .ihud-jump-btn:not(:disabled):hover {
          background: rgba(6,182,212,0.18);
          border-color: rgba(6,182,212,0.55);
          color: #06b6d4;
          box-shadow: 0 0 10px rgba(6,182,212,0.25);
        }
        .ihud-jump-preview {
          font-size: 10px;
          color: #06b6d4;
          padding-left: 2px;
          font-weight: 500;
          animation: fadeIn 0.15s ease;
        }
        .ihud-jump-error {
          font-size: 10px;
          color: #f87171;
          padding-left: 2px;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Quick-jump landmark pills */
        .ihud-quickjump-row {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .ihud-qjump-btn {
          padding: 3px 8px;
          border-radius: 5px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: #64748b;
          font-size: 10px; font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          max-width: 70px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ihud-qjump-btn:hover {
          background: rgba(6,182,212,0.12);
          border-color: rgba(6,182,212,0.35);
          color: #06b6d4;
        }
        .ihud-qjump-btn.active {
          background: rgba(6,182,212,0.20);
          border-color: rgba(6,182,212,0.60);
          color: #06b6d4;
          box-shadow: 0 0 6px rgba(6,182,212,0.25);
        }

        .ihud-elevator-row { display: flex; gap: 10px; padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .ihud-nav-col { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; }
        .ihud-nav-btn {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.10);
          color: #94a3b8; font-size: 12px; font-family: inherit;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.18s;
        }
        .ihud-nav-btn:not(:disabled):hover {
          background: rgba(6,182,212,0.18); border-color: rgba(6,182,212,0.5);
          color: #06b6d4; box-shadow: 0 0 10px rgba(6,182,212,0.25);
        }
        .ihud-nav-btn:disabled { opacity: 0.25; cursor: not-allowed; }

        .ihud-shaft { display: flex; gap: 4px; height: 100px; }
        .ihud-shaft-track {
          width: 16px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; position: relative; overflow: visible;
        }
        .ihud-shaft-marker {
          position: absolute; left: 50%; transform: translateX(-50%);
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.15); border: none; cursor: pointer; padding: 0;
          transition: all 0.15s;
        }
        .ihud-shaft-marker.active { background: #06b6d4; box-shadow: 0 0 6px rgba(6,182,212,0.8); }
        .ihud-shaft-marker:hover { background: rgba(6,182,212,0.6); transform: translateX(-50%) scale(1.4); }
        .ihud-cabin {
          position: absolute; left: 1px; right: 1px; height: 10px;
          border-radius: 4px; margin-bottom: -5px;
          box-shadow: 0 0 8px currentColor;
          transition: bottom 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ihud-shaft-labels {
          display: flex; flex-direction: column; justify-content: space-between;
          font-size: 9px; font-weight: 700; color: #334155;
          padding-top: 2px; padding-bottom: 2px; letter-spacing: 0.5px;
        }

        .ihud-floor-list-wrap { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
        .ihud-list-toggle {
          background: none; border: 1px solid rgba(255,255,255,0.10);
          border-radius: 6px; color: #64748b; font-size: 11px; font-weight: 600;
          padding: 5px 8px; cursor: pointer; font-family: inherit;
          text-align: left; transition: all 0.18s; width: 100%;
        }
        .ihud-list-toggle:hover { border-color: rgba(6,182,212,0.35); color: #94a3b8; }
        .ihud-floor-list {
          flex: 1; overflow-y: auto; max-height: 80px;
          display: flex; flex-direction: column; gap: 2px;
          scrollbar-width: thin; scrollbar-color: rgba(6,182,212,0.3) transparent;
        }
        .ihud-floor-item {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 6px; border-radius: 6px; background: none;
          border: 1px solid transparent; color: #64748b;
          font-size: 10px; font-family: inherit; cursor: pointer; text-align: left;
          transition: all 0.15s; flex-shrink: 0;
        }
        .ihud-floor-item:hover { background: rgba(255,255,255,0.04); color: #94a3b8; }
        .ihud-floor-item.active { background: rgba(6,182,212,0.08); font-weight: 600; }
        .ihud-fi-label { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ihud-fi-elev { color: #334155; font-variant-numeric: tabular-nums; flex-shrink: 0; }

        .ihud-hint { padding: 7px 14px; font-size: 10px; color: #334155; text-align: center; }
        .ihud-hint kbd {
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 4px; padding: 1px 5px; font-family: inherit; font-size: 10px; color: #64748b;
        }
      `}</style>
    </>
  );
}
