import { useState } from 'react';
import { allocateULPIN, verifyCandidateGeometry, getLineage, resolveRID } from '../mock/api.js';
import { OBJECT_CLASSES } from '../utils/grammar.js';

export default function OpenAPISandboxModal({ building, onClose }) {
  const [activeTab, setActiveTab] = useState('allocate');

  // Allocate State
  const [allocUlpin, setAllocUlpin] = useState(building?.parent_ulpin || 'IN-KA-BLR-000101');
  const [allocBld, setAllocBld] = useState('B0001');
  const [allocCls, setAllocCls] = useState('U');
  const [allocBoundary, setAllocBoundary] = useState('INNER_FACE');
  const [allocProvenance, setAllocProvenance] = useState('REAL');
  const [allocResult, setAllocResult] = useState(null);
  const [allocLoading, setAllocLoading] = useState(false);

  // Verify State
  const [verifyRid, setVerifyRid] = useState(building?.canonical_rid || 'IN-KA-BLR-0000-B0001-B00001-8');
  const [verifyIou, setVerifyIou] = useState(0.94);
  const [verifyShift, setVerifyShift] = useState(0.04);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Lineage State
  const [lineageRid, setLineageRid] = useState(building?.canonical_rid || 'IN-MH-MUM-0000-B0001-B00001-7');
  const [lineageResult, setLineageResult] = useState(null);
  const [lineageLoading, setLineageLoading] = useState(false);

  const handleAllocate = async (e) => {
    e.preventDefault();
    setAllocLoading(true);
    try {
      const res = await allocateULPIN({
        parent_ulpin: allocUlpin,
        building_seq: allocBld,
        cls: allocCls,
        boundary_convention: allocBoundary,
        data_provenance: allocProvenance
      });
      setAllocResult(res);
    } finally {
      setAllocLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifyLoading(true);
    try {
      const res = await verifyCandidateGeometry(verifyRid, { iou: verifyIou, shift: verifyShift });
      setVerifyResult(res);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleLoadLineage = async () => {
    setLineageLoading(true);
    try {
      const res = await getLineage(lineageRid);
      setLineageResult(res);
    } finally {
      setLineageLoading(false);
    }
  };

  return (
    <div className="modal-backdrop anim-fade-in" onClick={onClose}>
      <div className="modal-container glass anim-scale-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '820px', width: '92vw' }}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary">REST API SANDBOX</span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>docs/contracts.md Section 8.4</span>
            </div>
            <h2 style={{ margin: '6px 0 0 0', fontSize: '18px' }}>OpenAPI REST Registry Operations</h2>
          </div>
          <button className="btn-icon" onClick={onClose} title="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginTop: '12px' }}>
          <button className={`btn ${activeTab === 'allocate' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('allocate')} style={{ fontSize: '12px' }}>
            POST /allocate
          </button>
          <button className={`btn ${activeTab === 'verify' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('verify')} style={{ fontSize: '12px' }}>
            POST /verify
          </button>
          <button className={`btn ${activeTab === 'lineage' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setActiveTab('lineage'); if (!lineageResult) handleLoadLineage(); }} style={{ fontSize: '12px' }}>
            GET /lineage/:rid
          </button>
        </div>

        <div style={{ marginTop: '16px', maxHeight: '420px', overflowY: 'auto' }}>
          {/* TAB 1: ALLOCATE */}
          {activeTab === 'allocate' && (
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Allocate a new 3D ULPIN (RID) under an authorized cadastral session with ISO 7064 check symbol and Natural Key binding.
              </div>

              <form onSubmit={handleAllocate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Parent 14-char ULPIN</label>
                  <input
                    type="text"
                    className="input-search"
                    style={{ width: '100%', fontSize: '12px', padding: '6px 10px' }}
                    value={allocUlpin}
                    onChange={e => setAllocUlpin(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Building Sequence (B + 4 B32)</label>
                  <input
                    type="text"
                    className="input-search"
                    style={{ width: '100%', fontSize: '12px', padding: '6px 10px' }}
                    value={allocBld}
                    onChange={e => setAllocBld(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Object Class (10 Types)</label>
                  <select
                    className="input-search"
                    style={{ width: '100%', fontSize: '12px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.8)' }}
                    value={allocCls}
                    onChange={e => setAllocCls(e.target.value)}
                  >
                    {Object.values(OBJECT_CLASSES).map(c => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Boundary Convention</label>
                  <select
                    className="input-search"
                    style={{ width: '100%', fontSize: '12px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.8)' }}
                    value={allocBoundary}
                    onChange={e => setAllocBoundary(e.target.value)}
                  >
                    <option value="INNER_FACE">INNER_FACE (RERA Carpet Area Default)</option>
                    <option value="WALL_CENTRE">WALL_CENTRE</option>
                    <option value="OUTER_FACE">OUTER_FACE (Gross Volume)</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <button type="submit" className="btn btn-primary" disabled={allocLoading} style={{ width: '100%', fontSize: '12px' }}>
                    {allocLoading ? 'Allocating 3D ULPIN…' : 'POST /allocate (Execute Allocation)'}
                  </button>
                </div>
              </form>

              {allocResult && (
                <div className="card anim-fade-in" style={{ marginTop: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-valid">201 CREATED</span>
                    <span className="mono" style={{ fontSize: '11px' }}>Version {allocResult.version}</span>
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '12px' }}>
                    <div><strong>Allocated RID:</strong> <span className="mono" style={{ color: '#38bdf8', fontWeight: 600 }}>{allocResult.rid}</span></div>
                    <div style={{ marginTop: '4px' }}><strong>Natural Key Digest:</strong> <span className="mono" style={{ fontSize: '11px' }}>{allocResult.nk_digest}</span></div>
                    <div style={{ marginTop: '4px' }}><strong>Morton 3D Locator:</strong> <span className="mono" style={{ fontSize: '11px' }}>{allocResult.nk_locator}</span></div>
                    <div style={{ marginTop: '4px' }}><strong>Binding Record Hash:</strong> <span className="mono" style={{ fontSize: '11px' }}>{allocResult.binding_record_hash}</span></div>
                    <div style={{ marginTop: '4px' }}><strong>ICT Result:</strong> <span className="badge badge-primary">{allocResult.ict_result}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VERIFY */}
          {activeTab === 'verify' && (
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Verify a candidate 3D geometry against a registered RID using 3D IoU and Survey of India CORS error propagation.
              </div>

              <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Target RID to Verify</label>
                  <input
                    type="text"
                    className="input-search"
                    style={{ width: '100%', fontSize: '12px', padding: '6px 10px' }}
                    value={verifyRid}
                    onChange={e => setVerifyRid(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Candidate 3D IoU (0.00 – 1.00)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      className="input-search"
                      style={{ width: '100%', fontSize: '12px', padding: '6px 10px' }}
                      value={verifyIou}
                      onChange={e => setVerifyIou(parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Centroid Shift (meters)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="input-search"
                      style={{ width: '100%', fontSize: '12px', padding: '6px 10px' }}
                      value={verifyShift}
                      onChange={e => setVerifyShift(parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={verifyLoading} style={{ fontSize: '12px' }}>
                  {verifyLoading ? 'Evaluating Geometry…' : 'POST /verify (Run Verification)'}
                </button>
              </form>

              {verifyResult && (
                <div className="card anim-fade-in" style={{ marginTop: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-valid">200 OK</span>
                    <span className={`badge badge-${verifyResult.result === 'MATCH' ? 'valid' : 'review'}`}>{verifyResult.result}</span>
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '12px' }}>
                    <div><strong>ICT Score:</strong> {verifyResult.ict_score} (Threshold: 0.85)</div>
                    <div><strong>3D IoU:</strong> {(verifyResult.iou3d * 100).toFixed(1)}%</div>
                    <div><strong>Uncertainty Propagated:</strong> σ_xy = {verifyResult.uncertainty.sigma_xy}m, σ_z = {verifyResult.uncertainty.sigma_z}m</div>
                    <div><strong>Policy Anchor:</strong> {verifyResult.policy_reference}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LINEAGE */}
          {activeTab === 'lineage' && (
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Full hash-chained tamper-evident version history of the RID binding record.
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  className="input-search"
                  style={{ flex: 1, fontSize: '12px', padding: '6px 10px' }}
                  value={lineageRid}
                  onChange={e => setLineageRid(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleLoadLineage} disabled={lineageLoading} style={{ fontSize: '12px' }}>
                  {lineageLoading ? 'Loading…' : 'GET /lineage'}
                </button>
              </div>

              {lineageResult && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {lineageResult.versions?.map(v => (
                    <div key={v.version} className="card" style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid #38bdf8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="badge badge-primary">Version {v.version}</span>
                        <span className="mono" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{v.timestamp}</span>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '11px', lineHeight: 1.5 }}>
                        <div><strong>Natural Key Digest:</strong> <span className="mono">{v.nk_digest}</span></div>
                        <div><strong>Record Hash:</strong> <span className="mono">{v.record_hash}</span></div>
                        <div><strong>Previous Hash:</strong> <span className="mono">{v.prev_hash}</span></div>
                        <div><strong>Examiner Sign-Off:</strong> {v.sign_off?.examiner_id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose}>Close Sandbox</button>
        </div>
      </div>
    </div>
  );
}
