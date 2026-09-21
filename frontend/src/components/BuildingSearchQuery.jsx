import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { searchBuildingsQuery, getFloorULPIN } from '../utils/ulpinGenerator.js';
import { buildFullFloorList } from './InteriorWalkthrough.jsx';

// Archetype classifier for clean subtitles and badges
function getBuildingCategoryLabel(name = '', height = 0, floorCount = 0) {
  const n = name.toLowerCase();
  if (/drone|uav|photogrammetry|cadastre hub|sfm/.test(n)) return 'UAV Survey';
  if (/metro|underground|station|viaduct|tunnel|railway|rail|airport|flyover/.test(n)) return 'Metro / Infra';
  if (/hotel|ritz|marriott|hyatt|intercontinental|hilton|residences|palace|suites|resort|club/.test(n)) return 'Hospitality';
  if (/government|municipal|mmrda|authority|court|ministry|secretariat|collectorate|panchayat|bmrcl|bbmp|mcgm|niti|aiims|police|defence|military/.test(n)) return 'Govt / Civic';
  if (/bank|icici|hdfc|rbi|sbi|kotak|nse|bse|exchange|financial|capital|invest|fintech|nbfc/.test(n)) return 'Financial';
  if (/infosys|wipro|tcs|tech|itpb|cessna|manyata|embassy|ecospace|ey |accenture|deloitte|campus|software|it park|tech park|knowledge park/.test(n)) return 'Tech Campus';
  if (/commercial|world trade|business park|trade centre|trade center|office|complex|centre|center|bkc|tower [a-z]|block [a-z]/.test(n)) return 'Commercial';
  if (/jio|nmacc|cultural|theatre|mall|arena|sports|stadium|convention|museum|heritage|art/.test(n)) return 'Cultural / Mixed';
  if (/hospital|medical|health|clinic|aiims|apollo|fortis|care|wellness/.test(n)) return 'Healthcare';
  if (height > 150 || floorCount > 40 || /sky|imperial|antilia|ultra|pinnacle|altitude|summit|apex|zenith|sovereign|prestige|lodha|palais|luxury|royale|minerva|avighna|indiabulls/.test(n)) return 'Supertall Tower';
  return 'Urban Structure';
}

export default function BuildingSearchQuery({
  buildings = [],
  currentCity,
  onSelectBuilding,
  placeholder = 'Search structure or 3D ULPIN… [/]',
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedBuildingId, setExpandedBuildingId] = useState(null);
  const [copiedFloorId, setCopiedFloorId] = useState(null);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Global hotkey: press "/" or "Ctrl+K" / "Cmd+K" anywhere to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered results using high-performance spatial query engine
  const results = useMemo(() => {
    return searchBuildingsQuery(buildings, query, {
      city: null, // Allow searching globally across all cities
      category,
      limit: 20,
    });
  }, [buildings, query, category]);

  // Keep highlighted item in bounds
  useEffect(() => {
    setHighlightIdx(0);
  }, [results]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePick = useCallback((b) => {
    if (!b) return;
    setOpen(false);
    setQuery(b.name || '');
    onSelectBuilding?.(b);
  }, [onSelectBuilding]);

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[highlightIdx]) {
        handlePick(results[highlightIdx]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const copyULPIN = (e, ulpin) => {
    e.stopPropagation();
    if (ulpin && navigator.clipboard) {
      navigator.clipboard.writeText(ulpin).catch(() => {});
      setCopiedId(ulpin);
      setTimeout(() => setCopiedId(null), 1600);
    }
  };

  const copyFloorULPIN = (e, ulpin) => {
    e.stopPropagation();
    if (ulpin && navigator.clipboard) {
      navigator.clipboard.writeText(ulpin).catch(() => {});
      setCopiedFloorId(ulpin);
      setTimeout(() => setCopiedFloorId(null), 1600);
    }
  };

  const handleBackToMap = (e) => {
    e?.stopPropagation();
    setOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  return (
    <div style={{ position: 'relative', width: 360, maxWidth: '100%' }}>
      {/* Search Input Bar (Google Maps / Linear Standard) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#202024',
          border: open ? '1px solid #38bdf8' : '1px solid #27272a',
          borderRadius: 8,
          padding: '6px 12px',
          boxShadow: open ? '0 0 12px rgba(56, 189, 248, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.15s ease',
        }}
      >
        {/* Left Icon: Back Button when Open/Searching, Search Icon when Idle */}
        {open || query ? (
          <button
            onClick={handleBackToMap}
            title="Back to map / Close search (Esc)"
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a1a1aa"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}

        {/* Input Text */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#f4f4f5',
            fontSize: 12.5,
            fontFamily: 'inherit',
            fontWeight: 500,
            padding: 0,
          }}
        />

        {/* Right Action: Clear Button or "/" shortcut tag */}
        {query ? (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            title="Clear search"
            style={{
              background: '#27272a',
              border: 'none',
              borderRadius: '50%',
              width: 17,
              height: 17,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a1a1aa',
              cursor: 'pointer',
              fontSize: 10,
              padding: 0,
            }}
          >
            ✕
          </button>
        ) : (
          <span
            style={{
              fontSize: 10,
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              padding: '1px 5px',
              borderRadius: 4,
              background: '#27272a',
              color: '#71717a',
              border: '1px solid #3f3f46',
              userSelect: 'none',
            }}
          >
            /
          </span>
        )}
      </div>

      {/* Query Results Dropdown (Google Maps / Apple Maps Solid Standard) */}
      {open && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: 420,
            maxWidth: '92vw',
            maxHeight: 520,
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: 10,
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.75)',
            zIndex: 999,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header Row: Back Button + Count */}
          <div
            style={{
              padding: '9px 12px',
              borderBottom: '1px solid #27272a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#141416',
            }}
          >
            <button
              onClick={handleBackToMap}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: 0,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Back to Map</span>
            </button>
            <span style={{ fontSize: '11px', color: '#71717a', fontWeight: 500 }}>
              {results.length} structures
            </span>
          </div>

          {/* Filter Chips Bar (Google Maps style) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '8px 12px',
              borderBottom: '1px solid #27272a',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              background: '#18181b',
              flexShrink: 0,
            }}
          >
            {[
              { id: 'all', label: 'All' },
              { id: 'supertall', label: 'Supertall (>100m)' },
              { id: 'commercial', label: 'Commercial' },
              { id: 'tech', label: 'Tech' },
              { id: 'underground', label: 'Subterranean' },
            ].map((chip) => {
              const active = category === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setCategory(chip.id)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 5,
                    fontSize: 10.5,
                    fontWeight: 500,
                    border: active ? '1px solid #ffffff' : '1px solid #3f3f46',
                    background: active ? '#f4f4f5' : '#27272a',
                    color: active ? '#18181b' : '#a1a1aa',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.12s',
                  }}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Results Scroll Container */}
          <div
            style={{
              overflowY: 'auto',
              flex: 1,
              maxHeight: 380,
            }}
          >
            {results.length > 0 ? (
              results.map((b, idx) => {
                const isSelected = idx === highlightIdx;
                const ulpin = b.canonical_rid || b.prototype_3d_id || b.ulpin || 'ULPIN-UNKNOWN';
                const isCopied = copiedId === ulpin;
                const label = getBuildingCategoryLabel(b.name, b.height, b.floor_count);
                const isExpanded = expandedBuildingId === b.building_id;
                const floors = isExpanded ? buildFullFloorList(b) : [];

                return (
                  <div
                    key={b.building_id || idx}
                    onMouseEnter={() => setHighlightIdx(idx)}
                    onClick={() => handlePick(b)}
                    style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid #27272a',
                      background: isSelected ? '#27272a' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      transition: 'background 0.12s',
                    }}
                  >
                    {/* Top Row: Building Name + Floor/Height Pill */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          color: '#f4f4f5',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}
                      >
                        {b.name}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: '#a1a1aa',
                          background: '#202024',
                          border: '1px solid #3f3f46',
                          padding: '1px 5px',
                          borderRadius: 4,
                          flexShrink: 0,
                        }}
                      >
                        {b.floor_count || 1}F · {Number(b.height || 0).toFixed(0)}m
                      </span>
                    </div>

                    {/* Subtitle: Archetype + City */}
                    <div style={{ fontSize: 11, color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{label}</span>
                      <span style={{ color: '#52525b' }}>•</span>
                      <span>{b.city}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 9.5, color: '#10b981', fontWeight: 500 }}>
                        Verified
                      </span>
                    </div>

                    {/* Primary ULPIN Row */}
                    <div
                      style={{
                        marginTop: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#141416',
                        border: '1px solid #27272a',
                        borderRadius: 5,
                        padding: '3px 7px',
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                          fontSize: 10,
                          color: '#38bdf8',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {ulpin}
                      </span>
                      <button
                        onClick={(e) => copyULPIN(e, ulpin)}
                        title="Copy ULPIN"
                        style={{
                          background: isCopied ? '#10b981' : 'transparent',
                          border: isCopied ? 'none' : '1px solid #3f3f46',
                          color: isCopied ? '#ffffff' : '#a1a1aa',
                          padding: '1px 6px',
                          borderRadius: 3,
                          fontSize: 9,
                          fontWeight: 600,
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'all 0.12s',
                        }}
                      >
                        {isCopied ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    {/* Quick Action Buttons */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePick(b);
                        }}
                        style={{
                          flex: 1,
                          padding: '4px 8px',
                          background: '#0284c7',
                          border: 'none',
                          borderRadius: 4,
                          color: '#ffffff',
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4,
                        }}
                      >
                        <span>Walk Inside 3D</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedBuildingId((prev) => (prev === b.building_id ? null : b.building_id));
                        }}
                        style={{
                          padding: '4px 8px',
                          background: '#27272a',
                          border: '1px solid #3f3f46',
                          borderRadius: 4,
                          color: '#d4d4d8',
                          fontSize: 10,
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        {isExpanded ? 'Hide Floors' : `Floors (${b.floor_count || 1})`}
                      </button>
                    </div>

                    {/* Inline Floor List with Authentic Floor ULPINs */}
                    {isExpanded && (
                      <div
                        style={{
                          marginTop: 6,
                          maxHeight: 160,
                          overflowY: 'auto',
                          background: '#141416',
                          border: '1px solid #27272a',
                          borderRadius: 5,
                          padding: 4,
                        }}
                      >
                        {[...floors].reverse().map((f) => {
                          const floorUlpin = f.ulpin || f.canonical_rid || getFloorULPIN(b, f.level_index);
                          const isCopiedF = copiedFloorId === floorUlpin;
                          return (
                            <div
                              key={f.floor_id || f.level_index}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePick(b);
                              }}
                              style={{
                                padding: '4px 6px',
                                borderBottom: '1px solid #202024',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 6,
                                fontSize: 9.5,
                              }}
                            >
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                  <span style={{ fontWeight: 700, color: '#a1a1aa', fontFamily: 'monospace' }}>
                                    L{f.level_index >= 0 ? f.level_index : `B${Math.abs(f.level_index)}`}
                                  </span>
                                  <span style={{ color: '#f4f4f5', fontWeight: 500 }}>{f.label}</span>
                                  <span style={{ color: '#71717a', fontSize: 8.5 }}>{Number(f.z_min).toFixed(0)}m</span>
                                </div>
                                <div
                                  style={{
                                    color: '#38bdf8',
                                    fontFamily: 'monospace',
                                    fontSize: 9,
                                    marginTop: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {floorUlpin}
                                </div>
                              </div>
                              <button
                                onClick={(e) => copyFloorULPIN(e, floorUlpin)}
                                style={{
                                  background: isCopiedF ? '#10b981' : 'transparent',
                                  border: '1px solid #3f3f46',
                                  color: isCopiedF ? '#ffffff' : '#a1a1aa',
                                  padding: '1px 5px',
                                  borderRadius: 3,
                                  fontSize: 8,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                {isCopiedF ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: '#71717a',
                  fontSize: 12,
                }}
              >
                No matching structures or ULPINs found
              </div>
            )}
          </div>

          {/* Footer Bar: Keyboard Hints */}
          <div
            style={{
              padding: '6px 12px',
              background: '#141416',
              borderTop: '1px solid #27272a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 10,
              color: '#71717a',
            }}
          >
            <span>↑↓ Navigate • ↵ Select • Esc Close</span>
            <span style={{ color: '#38bdf8' }}>3D Cadastre Query</span>
          </div>
        </div>
      )}
    </div>
  );
}
