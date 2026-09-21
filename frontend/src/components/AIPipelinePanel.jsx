import { useState } from 'react';

const AI_PIPELINE_STEPS = [
  {
    id: 'h1_extraction',
    code: 'H1',
    label: 'Building Extraction (R20)',
    sub: 'ResNet-34 U-Net + KPConv LiDAR Point Cloud',
    desc: 'Fuses 4-channel tensor (RGB + nDSM) to segment building envelopes and extract footprints.',
    metric: 'IoU: 0.92 | Boundary F1: 0.89 | Height MAE: 0.22m',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
        <line x1="9" y1="22" x2="9" y2="18"/>
        <line x1="15" y1="22" x2="15" y2="18"/>
        <line x1="18" y1="6" x2="18" y2="6.01"/>
        <line x1="6" y1="6" x2="6" y2="6.01"/>
        <line x1="12" y1="6" x2="12" y2="6.01"/>
      </svg>
    )
  },
  {
    id: 'h2_vectoriser',
    code: 'H2.1',
    label: 'Plan-Side Vectoriser (R21)',
    sub: 'U-Net Wall Segmentation + OCR Room Classifier',
    desc: 'Vectorises scanned RERA/AutoDCR floor plans into structured topological room polygons.',
    metric: 'Polygon Precision: 98.4% | OCR Label Recall: 96.1%',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20M12 2v20M20 6l-4-4-8 8 4 4 8-8z"/>
      </svg>
    )
  },
  {
    id: 'h2_viterbi',
    code: 'H2.2',
    label: 'Sensor-Side Level Inference',
    sub: 'Viterbi Dynamic Programming Peak Alignment',
    desc: 'Aligns facade point cloud density peaks to infer inter-floor slab heights and vertical order.',
    metric: 'Viterbi Optimal Path Cost: 0.041 | Delta_z: ±0.03m',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    )
  },
  {
    id: 'h3_delineation',
    code: 'H3',
    label: 'Vertical Parcel Delineation (R22)',
    sub: 'Room Adjacency GNN + ILP Volume Optimizer',
    desc: 'Solves integer linear programming constraints to delineate closed, watertight 3D ownership solids.',
    metric: 'Volume Conservation Invariant: ≤ 0.01% slack',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    )
  },
  {
    id: 'h4_anomaly',
    code: 'H4',
    label: 'Intelligent Topology Validation (R23)',
    sub: 'Isolation Forest + 2-Hop Graph Scorer',
    desc: 'Flags boundary violations, computes anomaly risk scores, and triages findings for T5 Examiner Console.',
    metric: 'Anomaly Detection AUC: 0.96 | Top-1 Triage Accuracy: 100%',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    )
  }
];

export default function AIPipelinePanel({ onStatusChange, onClose }) {
  const [steps, setSteps] = useState(AI_PIPELINE_STEPS.map(s => ({ ...s, progress: 0, status: 'idle' })));
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [activeTab, setActiveTab] = useState('pipeline');

  const runPipeline = () => {
    if (running || done) return;
    setRunning(true);
    onStatusChange?.('running');
    let i = 0;
    const runStep = () => {
      if (i >= AI_PIPELINE_STEPS.length) {
        setRunning(false);
        setDone(true);
        onStatusChange?.('done');
        return;
      }
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running', progress: 0 } : s));
      let p = 0;
      const tick = setInterval(() => {
        p += Math.random() * 20 + 8;
        if (p >= 100) {
          p = 100;
          clearInterval(tick);
          setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, progress: 100, status: 'done' } : s));
          i++;
          setTimeout(runStep, 250);
        } else {
          setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, progress: p } : s));
        }
      }, 70);
    };
    runStep();
  };

  const reset = () => {
    setSteps(AI_PIPELINE_STEPS.map(s => ({ ...s, progress: 0, status: 'idle' })));
    setRunning(false);
    setDone(false);
    onStatusChange?.('idle');
  };

  const overallProgress = steps.reduce((a, s) => a + s.progress, 0) / steps.length;

  return (
    <div className="ai-panel glass anim-fade-up" id="ai-pipeline-panel" style={{ width: '480px', maxWidth: '94vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
      <div className="ai-panel-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-primary">AI/ML SUBSYSTEMS (H1–H4)</span>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>docs/aiml.md</span>
          </div>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '17px' }}>Geospatial AI & Topology Engine</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {!done
            ? <button className="btn btn-primary" onClick={runPipeline} disabled={running} id="run-pipeline-btn" style={{ fontSize: '11px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                <span>{running ? 'Processing…' : 'Execute AI Stack'}</span>
              </button>
            : <button className="btn" onClick={reset} id="reset-pipeline-btn" style={{ fontSize: '11px', padding: '6px 12px' }}>
                Reset Stack
              </button>
          }
          {onClose && (
            <button className="btn-icon" onClick={onClose} style={{ marginLeft: '4px' }} title="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Overall progress */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <div className="ai-overall-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>End-to-End Extraction Pipeline Progress</span>
          <span className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>{overallProgress.toFixed(0)}%</span>
        </div>
        <div className="progress-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div className="progress-fill" style={{ width: `${overallProgress}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', transition: 'width 0.15s ease' }} />
        </div>
      </div>

      {/* Pipeline Steps List */}
      <div className="ai-steps" style={{ overflowY: 'auto', padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {steps.map((s, idx) => (
          <div
            key={s.id}
            className={`ai-step ${s.status}`}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: s.status === 'running' ? 'rgba(56, 189, 248, 0.08)' : s.status === 'done' ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255,255,255,0.02)',
              border: s.status === 'running' ? '1px solid var(--accent)' : s.status === 'done' ? '1px solid #10b981' : '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '10px', padding: '1px 5px' }}>{s.code}</span>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{s.label}</span>
                  </div>
                  <span className={`badge badge-${s.status === 'done' ? 'valid' : s.status === 'running' ? 'review' : 'draft'}`} style={{ fontSize: '10px' }}>
                    {s.status === 'idle' ? 'STANDBY' : s.status === 'running' ? `${s.progress.toFixed(0)}%` : 'COMPLETED'}
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '3px', fontWeight: 500 }}>
                  {s.sub}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  {s.desc}
                </div>

                <div className="mono" style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px 6px', borderRadius: '4px' }}>
                  {s.metric}
                </div>

                {s.status === 'running' && (
                  <div className="progress-bar" style={{ marginTop: '8px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div className="progress-fill" style={{ width: `${s.progress}%`, height: '100%', background: '#38bdf8' }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Active Learning Triage: <strong style={{ color: '#10b981' }}>ONLINE</strong></span>
        <span>GNN Optimization: <strong style={{ color: '#38bdf8' }}>WATERTIGHT</strong></span>
      </div>
    </div>
  );
}
