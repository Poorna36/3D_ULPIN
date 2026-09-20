import { useState } from 'react';

const AI_PIPELINE_STEPS = [
  {
    id: 'h1_extraction',
    code: 'H1',
    label: 'Building Extraction (R20)',
    sub: 'ResNet-34 U-Net + KPConv LiDAR Point Cloud',
    desc: 'Fuses 4-channel tensor (RGB + nDSM) to segment building envelopes and extract footprints.',
    metric: 'IoU: 0.92 | Boundary F1: 0.89 | Height MAE: 0.22m',
    icon: '🏗'
  },
  {
    id: 'h2_vectoriser',
    code: 'H2.1',
    label: 'Plan-Side Vectoriser (R21)',
    sub: 'U-Net Wall Segmentation + OCR Room Classifier',
    desc: 'Vectorises scanned RERA/AutoDCR floor plans into structured topological room polygons.',
    metric: 'Polygon Precision: 98.4% | OCR Label Recall: 96.1%',
    icon: '📐'
  },
  {
    id: 'h2_viterbi',
    code: 'H2.2',
    label: 'Sensor-Side Level Inference',
    sub: 'Viterbi Dynamic Programming Peak Alignment',
    desc: 'Aligns facade point cloud density peaks to infer inter-floor slab heights and vertical order.',
    metric: 'Viterbi Optimal Path Cost: 0.041 | Delta_z: ±0.03m',
    icon: '📊'
  },
  {
    id: 'h3_delineation',
    code: 'H3',
    label: 'Vertical Parcel Delineation (R22)',
    sub: 'Room Adjacency GNN + ILP Volume Optimizer',
    desc: 'Solves integer linear programming constraints to delineate closed, watertight 3D ownership solids.',
    metric: 'Volume Conservation Invariant: ≤ 0.01% slack',
    icon: '📦'
  },
  {
    id: 'h4_anomaly',
    code: 'H4',
    label: 'Intelligent Topology Validation (R23)',
    sub: 'Isolation Forest + 2-Hop Graph Scorer',
    desc: 'Flags boundary violations, computes anomaly risk scores, and triages findings for T5 Examiner Console.',
    metric: 'Anomaly Detection AUC: 0.96 | Top-1 Triage Accuracy: 100%',
    icon: '🛡'
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
            ? <button className="btn btn-primary" onClick={runPipeline} disabled={running} id="run-pipeline-btn" style={{ fontSize: '11px', padding: '6px 12px' }}>
                {running ? 'Processing…' : '▶ Execute AI Stack'}
              </button>
            : <button className="btn" onClick={reset} id="reset-pipeline-btn" style={{ fontSize: '11px', padding: '6px 12px' }}>
                Reset Stack
              </button>
          }
          {onClose && (
            <button className="btn-icon" onClick={onClose} style={{ marginLeft: '4px' }}>✕</button>
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
              <span style={{ fontSize: '20px', lineHeight: 1 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '10px', padding: '1px 5px' }}>{s.code}</span>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{s.label}</span>
                  </div>
                  <span className={`badge badge-${s.status === 'done' ? 'valid' : s.status === 'running' ? 'review' : 'draft'}`} style={{ fontSize: '10px' }}>
                    {s.status === 'idle' ? 'STANDBY' : s.status === 'running' ? `${s.progress.toFixed(0)}%` : '✓ COMPLETED'}
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
