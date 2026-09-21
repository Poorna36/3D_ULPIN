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
  const [mlSteps, setMlSteps] = useState(AI_PIPELINE_STEPS.map(s => ({ ...s, progress: 0, status: 'idle' })));
  const [mlRunning, setMlRunning] = useState(false);
  const [mlDone, setMlDone] = useState(false);

  // Run ML Pipeline
  const runMlPipeline = () => {
    if (mlRunning || mlDone) return;
    setMlRunning(true);
    onStatusChange?.('running');
    let i = 0;
    const runStep = () => {
      if (i >= AI_PIPELINE_STEPS.length) {
        setMlRunning(false);
        setMlDone(true);
        onStatusChange?.('done');
        return;
      }
      setMlSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running', progress: 0 } : s));
      let p = 0;
      const tick = setInterval(() => {
        p += Math.random() * 20 + 8;
        if (p >= 100) {
          p = 100;
          clearInterval(tick);
          setMlSteps(prev => prev.map((s, idx) => idx === i ? { ...s, progress: 100, status: 'done' } : s));
          i++;
          setTimeout(runStep, 250);
        } else {
          setMlSteps(prev => prev.map((s, idx) => idx === i ? { ...s, progress: p } : s));
        }
      }, 70);
    };
    runStep();
  };

  const resetMl = () => {
    setMlSteps(AI_PIPELINE_STEPS.map(s => ({ ...s, progress: 0, status: 'idle' })));
    setMlRunning(false);
    setMlDone(false);
    onStatusChange?.('idle');
  };

  const mlOverallProgress = mlSteps.reduce((a, s) => a + s.progress, 0) / mlSteps.length;

  return (
    <div className="ai-panel glass anim-fade-up" id="ai-pipeline-panel" style={{ width: '560px', maxWidth: '95vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div className="ai-panel-header" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '18px' }}>🧠</span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>AI/ML Cadastral Pipeline (H1–H4)</h2>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Deep Learning Extractor &bull; Plan-Side Vectoriser &bull; Viterbi Alignment &bull; Topology Validation
          </div>
        </div>
        {onClose && (
          <button className="btn-icon" onClick={onClose} title="Close AI Engine">✕</button>
        )}
      </div>

      {/* Controls Bar */}
      <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span className="badge badge-primary" style={{ fontSize: '10px', marginRight: '6px' }}>H1–H4 DEEP MODELS</span>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>docs/aiml.md</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!mlDone ? (
            <button className="btn btn-primary" onClick={runMlPipeline} disabled={mlRunning} id="run-pipeline-btn" style={{ fontSize: '11px', padding: '6px 14px' }}>
              {mlRunning ? 'Executing Stack…' : '▶ Execute AI Stack'}
            </button>
          ) : (
            <button className="btn" onClick={resetMl} id="reset-pipeline-btn" style={{ fontSize: '11px', padding: '6px 14px' }}>
              Reset Stack
            </button>
          )}
        </div>
      </div>

      {/* Progress row */}
      <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>AI Extraction Stack Progress</span>
          <span className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>{mlOverallProgress.toFixed(0)}%</span>
        </div>
        <div className="progress-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div className="progress-fill" style={{ width: `${mlOverallProgress}%`, height: '100%', background: 'linear-gradient(90deg, #818cf8, #38bdf8)', transition: 'width 0.15s ease' }} />
        </div>
      </div>

      {/* ML Steps List */}
      <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
        {mlSteps.map((s) => (
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

      <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Active Learning Triage: <strong style={{ color: '#10b981' }}>ONLINE</strong></span>
        <span>GNN Optimization: <strong style={{ color: '#38bdf8' }}>WATERTIGHT</strong></span>
      </div>
    </div>
  );
}
