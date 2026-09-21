import { useState } from 'react';

export const CONFLICT_SCENARIOS = [
  {
    id: 'BLR_DRAIN',
    city: 'bengaluru',
    name: 'Bengaluru BZ-1: Storm Drain vs Property Basement',
    subtitle: 'Raja Kaluve (Storm Water Drain) encroachment without registered easement',
    coords: { lon: 77.5946, lat: 12.9716, height: 420, pitch: -35 },
    building_id: 'BLR-BLD-00001',
    classesInvolved: ['U (Unit)', 'P (Basement Parking)', 'I (Utility Drain)'],
    defectCode: 'DEFECT_23: UTILITY_WITHOUT_EASEMENT',
    severity: 'FAIL',
    statute: 'Indian Easements Act 1882 + K-RERA Title Verification',
    summary: 'A multi-storey residential basement intersects an unrecorded municipal storm drain corridor (raja kaluve) with 14.2 m³ volumetric overlap and no registered easement Right.',
    pipelineSteps: [
      '1. GET /resolve/IN-KA-BLR-0000-B0001-U00001-8 => Retreive U & P class solids',
      '2. GET /cover?bbox=77.593,12.970,77.596,12.973&cls=I => Detect intersecting Raja Kaluve segment',
      '3. Compute vol(U ∩ I) = 14.2 m³ > epsilon_v (0.00 m³)',
      '4. Query Rights: EASEMENT_UTILITY not found in registry ledger',
      '5. Output: Hard Cadastral FAIL with ExplainObject EXPLAIN-BLR-001'
    ]
  },
  {
    id: 'MUM_AQUA_LINE',
    city: 'mumbai',
    name: 'Mumbai MZ-1: Metro Aqua Line Tunnel vs Tower Basement',
    subtitle: 'Aqua Line 3 tunnel beneath Worli tower within 50m MMRC clearance zone',
    coords: { lon: 72.8306, lat: 18.9986, height: 350, pitch: -38 },
    building_id: 'MUM-BLD-00001',
    classesInvolved: ['B (Envelope)', 'P (Basement P3)', 'T (Metro Tunnel)'],
    defectCode: 'DEFECT_25: CORRIDOR_CLEARANCE_BREACH',
    severity: 'WARN',
    statute: 'Metro Railways (Construction of Works) Act 1978 — 50m Zone',
    summary: 'Tower basement approaches within 48.2m of MMRC Metro Aqua Line 3 tunnel (statutory clearance threshold: 50.0m). Registered RESTRICTION_METRO_PROXIMITY Right required.',
    pipelineSteps: [
      '1. GET /resolve/IN-MH-MUM-0000-B0001-B00001-7 => Resolve basement floor P3 at z = -3.5m',
      '2. GET /cover?bbox=72.828,18.996,72.833,19.001&cls=T => Locate Aqua Line tunnel centerline',
      '3. Compute min_distance(P3, T_tunnel) = 48.2m < 50.0m regulatory threshold',
      '4. Check Rights ledger: Verification confirms structural approval Right pending sign-off',
      '5. Output: Cadastral WARN with ExplainObject EXPLAIN-MUM-001'
    ]
  },
  {
    id: 'MUM_HERITAGE_STACK',
    city: 'mumbai',
    name: 'Mumbai MZ-4: Marine Drive Heritage over Stacked Tunnels',
    subtitle: 'Metro Line 3 directly above Coastal Road twin tunnels under heritage parcel',
    coords: { lon: 72.8210, lat: 18.9255, height: 380, pitch: -42 },
    building_id: 'MUM-BLD-00004',
    classesInvolved: ['S (Heritage Surface)', 'T1 (Metro Line 3)', 'T2 (Coastal Road)'],
    defectCode: 'T-OVER-T_MULTI_DEPTH_INFRASTRUCTURE',
    severity: 'PASS',
    statute: 'Heritage Regulations + Coastal Zone Notification',
    summary: 'Demonstration of why 2D cadastre fails: a single surface parcel with two independent subterranean transport corridors at different depths (z = -16m vs z = -32m).',
    pipelineSteps: [
      '1. GET /resolve/IN-MH-MUM-0004-B0000-S00001-X => Surface parcel column',
      '2. GET /cover?cls=T => Returns T1 (Metro 3, z=-16m) and T2 (Coastal Road, z=-32m)',
      '3. Compute vertical separation: delta_z = 12.8m > engineering safety envelope (10.0m)',
      '4. Volume intersection vol(T1 ∩ T2) = 0.00 m³',
      '5. Output: Multi-layer 3D Cadastral PASS with vertical clearance profile'
    ]
  },
  {
    id: 'BLR_MAJESTIC_STACK',
    city: 'bengaluru',
    name: 'Bengaluru BZ-1: Multi-Line Underground Stack at Majestic',
    subtitle: 'Triple metro line intersection (Purple, Green, and Pink Lines)',
    coords: { lon: 77.5720, lat: 12.9770, height: 480, pitch: -40 },
    building_id: 'BLR-BLD-00002',
    classesInvolved: ['T (Purple Line)', 'T (Green Line)', 'T (Pink Line Planned)'],
    defectCode: 'MULTI_TIER_TRANSIT_RECONCILIATION',
    severity: 'PASS',
    statute: 'Karnataka Town & Country Planning Act (Underground Corridors)',
    summary: 'Convergence of operational Purple (z = -12m) & Green (z = -18m) lines with planned Pink line (z = -28m). Demonstrates uncertainty propagation on planned infrastructure.',
    pipelineSteps: [
      '1. GET /cover?bbox=77.570,12.975,77.575,12.980&cls=T => 3 tunnel corridors',
      '2. Propagate geodetic covariance: sigma_z = 0.05m (operational) vs 0.35m (planned)',
      '3. Monte-Carlo collision test (N=200): P(violation) = 0.012 < 0.05',
      '4. Output: PASS with provenance badges (REAL for Purple/Green, SYNTHETIC for Pink)'
    ]
  }
];

export default function ConflictWorkflowModal({ onClose, onTriggerScenario }) {
  const [selectedId, setSelectedId] = useState(CONFLICT_SCENARIOS[0].id);

  const current = CONFLICT_SCENARIOS.find(s => s.id === selectedId) || CONFLICT_SCENARIOS[0];

  const handleLaunch = () => {
    onTriggerScenario(current);
    onClose();
  };

  return (
    <div className="modal-backdrop anim-fade-in" onClick={onClose}>
      <div className="modal-container glass anim-scale-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '820px', width: '92vw' }}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary">REAL-WORLD DISPUTE WORKFLOWS</span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>docs/decisions.md Section 9.4</span>
            </div>
            <h2 style={{ margin: '6px 0 0 0', fontSize: '18px' }}>Real-World 3D Cadastral Conflict Simulation</h2>
          </div>
          <button className="btn-icon" onClick={onClose} title="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Scenario Selection Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', margin: '16px 0' }}>
          {CONFLICT_SCENARIOS.map(s => (
            <button
              key={s.id}
              className={`card ${selectedId === s.id ? 'card--active' : ''}`}
              style={{
                textAlign: 'left',
                padding: '10px',
                cursor: 'pointer',
                border: selectedId === s.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                background: selectedId === s.id ? 'rgba(56, 189, 248, 0.08)' : '#090a0f'
              }}
              onClick={() => setSelectedId(s.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--accent)' }}>{s.city.toUpperCase()}</span>
                <span className={`badge badge-${s.severity.toLowerCase()}`} style={{ fontSize: '9px', padding: '1px 5px' }}>{s.severity}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '12px', marginTop: '4px', lineHeight: 1.2 }}>
                {s.name.split(':')[1] || s.name}
              </div>
            </button>
          ))}
        </div>

        {/* Active Scenario Details */}
        <div className="card" style={{ background: '#07080d', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc' }}>{current.name}</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{current.subtitle}</div>
            </div>
            <span className={`badge badge-${current.severity.toLowerCase()}`} style={{ fontSize: '11px' }}>
              RESULT: {current.severity}
            </span>
          </div>

          <div style={{ margin: '12px 0', padding: '10px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontSize: '12px', lineHeight: 1.5 }}>
            {current.summary}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', margin: '12px 0' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Classes Involved:</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                {current.classesInvolved.map(c => (
                  <span key={c} className="badge badge-primary" style={{ fontSize: '10px' }}>{c}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Statutory Authority & Act:</div>
              <div style={{ fontWeight: 500, marginTop: '4px', color: '#38bdf8' }}>{current.statute}</div>
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <div style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Execution Pipeline & Query Resolution:
            </div>
            <div className="mono" style={{ background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '6px', fontSize: '11px', lineHeight: 1.6, color: '#e2e8f0' }}>
              {current.pipelineSteps.map((step, idx) => (
                <div key={idx} style={{ color: step.includes('FAIL') ? '#ef4444' : step.includes('WARN') ? '#f59e0b' : '#38bdf8' }}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Camera will fly to conflict location, activate vertical cutaway, and load explain findings.
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleLaunch} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
              <span>Fly & Resolve Dispute in 3D</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
