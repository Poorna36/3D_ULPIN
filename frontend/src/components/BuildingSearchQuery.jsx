import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { searchBuildingsQuery } from '../utils/ulpinGenerator.js';

export default function BuildingSearchQuery({
  buildings = [],
  currentCity,
  onSelectBuilding,
  placeholder = "Search structure or 3D ULPIN… [/]",
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [copiedId, setCopiedId] = useState(null);

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
      limit: 15,
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
      setHighlightIdx(prev => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(prev => (prev - 1 + results.length) % Math.max(1, results.length));
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
    navigator.clipboard?.writeText(ulpin).catch(() => {});
    setCopiedId(ulpin);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // City meta badges
  const cityBadges = {
    bengaluru:   { label: 'Bengaluru', flag: '🇮🇳', color: '#34d399' },
    mumbai:      { label: 'Mumbai',    flag: '🇮🇳', color: '#38bdf8' },
    netherlands: { label: 'Rotterdam', flag: '🇳🇱', color: '#f59e0b' },
    singapore:   { label: 'Singapore', flag: '🇸🇬', color: '#a78bfa' },
  };

  return (
    <div style={{ position: 'relative', width: 340, maxWidth: '100%' }}>
      {/* Search Input Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          background: 'rgba(10, 15, 26, 0.78)',
          border: open
            ? '1px solid rgba(56, 189, 248, 0.55)'
            : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 24,
          padding: '6px 14px',
          backdropFilter: 'blur(16px)',
          boxShadow: open
            ? '0 0 20px rgba(56, 189, 248, 0.22), inset 0 0 12px rgba(56, 189, 248, 0.08)'
            : '0 2px 10px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Search Icon */}
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke={open ? '#38bdf8' : 'rgba(255, 255, 255, 0.55)'}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'stroke 0.18s', flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        {/* Input */}
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
            color: '#ffffff',
            fontSize: 12.5,
            fontFamily: "'Space Grotesk', -apple-system, sans-serif",
            fontWeight: 500,
            padding: 0,
            letterSpacing: '0.1px',
          }}
        />

        {/* Clear Button / Shortcut Badge */}
        {query ? (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
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
              fontFamily: "'JetBrains Mono', monospace",
              padding: '2px 5px',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.40)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              letterSpacing: '0.5px',
              userSelect: 'none',
            }}
          >
            /
          </span>
        )}
      </div>

      {/* Query Results Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            width: 440,
            maxWidth: '92vw',
            maxHeight: 460,
            background: 'rgba(10, 14, 23, 0.94)',
            backdropFilter: 'blur(28px)',
            border: '1px solid rgba(56, 189, 248, 0.28)',
            borderRadius: 14,
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.85), 0 0 24px rgba(56, 189, 248, 0.15)',
            zIndex: 999,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Filter Chips Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              background: 'rgba(0, 0, 0, 0.35)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
              overflowX: 'auto',
              flexShrink: 0,
            }}
          >
            {[
              { id: 'all', label: 'All Structures' },
              { id: 'supertall', label: 'Supertalls (>100m)' },
              { id: 'commercial', label: 'Commercial' },
              { id: 'tech', label: 'Tech Campuses' },
              { id: 'underground', label: 'Subterranean' },
            ].map((chip) => {
              const active = category === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setCategory(chip.id)}
                  style={{
                    padding: '3px 9px',
                    borderRadius: 12,
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: "'Space Grotesk', sans-serif",
                    border: active
                      ? '1px solid rgba(56, 189, 248, 0.65)'
                      : '1px solid rgba(255, 255, 255, 0.09)',
                    background: active
                      ? 'rgba(56, 189, 248, 0.18)'
                      : 'rgba(255, 255, 255, 0.03)',
                    color: active ? '#38bdf8' : 'rgba(255, 255, 255, 0.65)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
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
              padding: '6px',
            }}
          >
            {results.length > 0 ? (
              results.map((b, idx) => {
                const isSelected = idx === highlightIdx;
                const cityMeta = cityBadges[b.city?.toLowerCase()] || {
                  label: b.city || 'Cadastre',
                  flag: '🌐',
                  color: '#38bdf8',
                };
                const ulpin = b.canonical_rid || b.ulpin || b.prototype_3d_id || 'ULPIN-UNKNOWN';
                const isCopied = copiedId === ulpin;

                return (
                  <div
                    key={b.building_id || idx}
                    onMouseEnter={() => setHighlightIdx(idx)}
                    onClick={() => handlePick(b)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 9,
                      background: isSelected
                        ? 'rgba(56, 189, 248, 0.14)'
                        : 'transparent',
                      border: isSelected
                        ? '1px solid rgba(56, 189, 248, 0.30)'
                        : '1px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      transition: 'background 0.12s',
                    }}
                  >
                    {/* Top Row: Building Name + City Tag + Status */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          color: '#ffffff',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}
                      >
                        {b.name}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        {/* City Badge */}
                        <span
                          style={{
                            fontSize: 9.5,
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 4,
                            background: `rgba(${cityMeta.color === '#34d399' ? '52, 211, 153' : cityMeta.color === '#38bdf8' ? '56, 189, 248' : cityMeta.color === '#f59e0b' ? '245, 158, 11' : '167, 139, 250'}, 0.15)`,
                            color: cityMeta.color,
                            border: `1px solid ${cityMeta.color}35`,
                            letterSpacing: '0.4px',
                          }}
                        >
                          {cityMeta.flag} {cityMeta.label}
                        </span>

                        {/* Status Badge */}
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: 4,
                            background: b.validation_status === 'VALID'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                            color: b.validation_status === 'VALID' ? '#10b981' : '#f59e0b',
                            border: b.validation_status === 'VALID'
                              ? '1px solid rgba(16, 185, 129, 0.3)'
                              : '1px solid rgba(245, 158, 11, 0.3)',
                          }}
                        >
                          {b.validation_status || 'VALID'}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: 3D ULPIN Code */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: '0.6px',
                          color: 'rgba(255, 255, 255, 0.35)',
                          textTransform: 'uppercase',
                        }}
                      >
                        3D-ULPIN:
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10.5,
                          fontWeight: 600,
                          color: '#38bdf8',
                          letterSpacing: '0.3px',
                          background: 'rgba(56, 189, 248, 0.08)',
                          padding: '1px 6px',
                          borderRadius: 4,
                          border: '1px solid rgba(56, 189, 248, 0.16)',
                        }}
                      >
                        {ulpin}
                      </span>
                      <button
                        onClick={(e) => copyULPIN(e, ulpin)}
                        title="Copy 3D ULPIN"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isCopied ? '#34d399' : 'rgba(255, 255, 255, 0.40)',
                          cursor: 'pointer',
                          padding: 2,
                          fontSize: 10,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {isCopied ? '✓ copied' : '📋'}
                      </button>
                    </div>

                    {/* Bottom Row: Stats (Height, Floors, Class) */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        fontSize: 10,
                        color: 'rgba(255, 255, 255, 0.45)',
                        marginTop: 1,
                      }}
                    >
                      <span>{b.floor_count || 1} Floors</span>
                      <span>•</span>
                      <span>↑ {Number(b.height || 0).toFixed(1)}m Height</span>
                      {b.is_underground && (
                        <>
                          <span>•</span>
                          <span style={{ color: '#a78bfa' }}>Subsurface Facility</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.45)',
                  fontSize: 12,
                }}
              >
                No matching structures or ULPINs found
              </div>
            )}
          </div>

          {/* Footer Bar: Quick tip */}
          <div
            style={{
              padding: '6px 12px',
              background: 'rgba(0, 0, 0, 0.45)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 10,
              color: 'rgba(255, 255, 255, 0.35)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <span>↑↓ Navigate • ↵ Jump & Inspect • Esc Close</span>
            <span style={{ color: '#38bdf8' }}>{results.length} results</span>
          </div>
        </div>
      )}
    </div>
  );
}
