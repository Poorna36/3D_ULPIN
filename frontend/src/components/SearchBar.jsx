import { useState, useRef } from 'react';
import { searchBuildings } from '../mock/api.js';

export default function SearchBar({ city, onSelect }) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timer.current);
    if (!val.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    timer.current = setTimeout(async () => {
      const res = await searchBuildings(city, val);
      setResults(res);
      setOpen(true);
      setLoading(false);
    }, 250);
  };

  const handlePick = (b) => {
    setQuery(b.name);
    setOpen(false);
    onSelect(b);
  };

  return (
    <div className="search-wrap" style={{ position: 'relative' }}>
      <div className="search-input-wrap">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          id="search-building-input"
          className="search-input"
          placeholder="Search building or ULPIN…"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          autoComplete="off"
        />
        {loading && <div className="search-spinner" />}
      </div>

      {open && results.length > 0 && (
        <div className="search-dropdown glass anim-fade-up">
          {results.map(b => (
            <button key={b.building_id} className="search-result-item" onMouseDown={() => handlePick(b)}>
              <div className="search-result-name">{b.name}</div>
              <div className="search-result-id mono">{b.prototype_3d_id}</div>
            </button>
          ))}
        </div>
      )}
      {open && results.length === 0 && !loading && query.trim() && (
        <div className="search-dropdown glass" style={{ padding: '12px 16px', color: 'var(--text-dim)', fontSize: '13px' }}>
          No buildings found
        </div>
      )}

      <style>{`
        .search-wrap { min-width: 240px; }
        .search-input-wrap {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: var(--r-pill);
          padding: 6px 14px;
          color: var(--text-dim);
          transition: border-color var(--t-fast), box-shadow var(--t-fast);
        }
        .search-input-wrap:focus-within {
          border-color: var(--cyan);
          box-shadow: var(--cyan-glow);
          color: var(--cyan);
        }
        .search-input {
          background: none; border: none; outline: none;
          font-family: var(--font-ui); font-size: 13px;
          color: var(--text-primary);
          width: 100%;
        }
        .search-input::placeholder { color: var(--text-dim); }
        .search-spinner {
          width: 12px; height: 12px; flex-shrink: 0;
          border: 2px solid var(--border);
          border-top-color: var(--cyan);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .search-dropdown {
          position: absolute; top: calc(100% + 8px); left: 0; right: 0;
          z-index: 300;
          overflow: hidden;
          border-radius: var(--r-md) !important;
        }
        .search-result-item {
          display: block; width: 100%; text-align: left;
          background: none; border: none;
          padding: 10px 16px; cursor: pointer;
          border-bottom: 1px solid var(--border);
          transition: background var(--t-fast);
        }
        .search-result-item:last-child { border-bottom: none; }
        .search-result-item:hover { background: var(--cyan-dim); }
        .search-result-name { font-size: 13px; color: var(--text-primary); font-weight: 500; }
        .search-result-id   { font-size: 11px; margin-top: 2px; opacity: 0.7; }
      `}</style>
    </div>
  );
}
