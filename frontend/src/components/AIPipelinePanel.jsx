import { useState } from 'react';

const PIPELINE_STEPS = [
  { id: 'ingest',    label: 'Data Ingestion',          desc: 'Loading GIS parcels + OSM buildings', icon: '📥' },
  { id: 'extract',   label: 'Building Extraction',      desc: 'AI: detecting building footprints',   icon: '🏗' },
  { id: 'segment',   label: 'Floor Segmentation',       desc: 'ML: inferring floor boundaries',      icon: '📐' },
  { id: 'delineate', label: 'Vertical Delineation',     desc: 'Generating 3D property volumes',      icon: '📦' },
  { id: 'validate',  label: 'Topology Validation',      desc: 'Running geometry + logic checks',     icon: '✅' },
  { id: 'identify',  label: 'Identifier Assignment',    desc: 'Generating prototype 3D ULPINs',      icon: '🔑' },
];

export default function AIPipelinePanel({ onStatusChange }) {
  const [steps, setSteps] = useState(PIPELINE_STEPS.map(s => ({ ...s, progress: 0, status: 'idle' })));
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const runPipeline = () => {
    if (running || done) return;
    setRunning(true);
    onStatusChange?.('running');
    let i = 0;
    const runStep = () => {
      if (i >= PIPELINE_STEPS.length) {
        setRunning(false);
        setDone(true);
        onStatusChange?.('done');
        return;
      }
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running', progress: 0 } : s));
      let p = 0;
      const tick = setInterval(() => {
        p += Math.random() * 18 + 6;
        if (p >= 100) {
          p = 100;
          clearInterval(tick);
          setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, progress: 100, status: 'done' } : s));
          i++;
          setTimeout(runStep, 300);
        } else {
          setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, progress: p } : s));
        }
      }, 80);
    };
    runStep();
  };

  const reset = () => {
    setSteps(PIPELINE_STEPS.map(s => ({ ...s, progress: 0, status: 'idle' })));
    setRunning(false);
    setDone(false);
    onStatusChange?.('idle');
  };

  const overallProgress = steps.reduce((a, s) => a + s.progress, 0) / steps.length;

  return (
    <div className="ai-panel glass anim-fade-up" id="ai-pipeline-panel">
      <div className="ai-panel-header">
        <div>
          <h2>AI / ML Pipeline</h2>
          <div className="ai-panel-sub">Automated cadastral extraction engine</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!done
            ? <button className="btn btn-primary" onClick={runPipeline} disabled={running} id="run-pipeline-btn">
                {running ? 'Running…' : 'Run Pipeline'}
              </button>
            : <button className="btn" onClick={reset} id="reset-pipeline-btn">Reset</button>
          }
        </div>
      </div>

      {/* Overall progress */}
      <div style={{ marginBottom: '16px' }}>
        <div className="ai-overall-row">
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Overall progress</span>
          <span className="mono" style={{ fontSize: '12px' }}>{overallProgress.toFixed(0)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${overallProgress}%` }} />
        </div>
      </div>

      <div className="ai-steps">
        {steps.map((s, idx) => (
          <div key={s.id} className={`ai-step ${s.status}`}>
            <div className="ai-step-icon">{s.icon}</div>
            <div className="ai-step-body">
              <div className="ai-step-header">
                <span className="ai-step-label">{idx + 1}. {s.label}</span>
                <span className={`ai-step-status ai-step-status--${s.status}`}>
                  {s.status === 'idle' ? '—' : s.status === 'running' ? `${s.progress.toFixed(0)}%` : '✓'}
                </span>
              </div>
              <div className="ai-step-desc">{s.desc}</div>
              {s.status !== 'idle' && (
                <div className="progress-bar" style={{ marginTop: '5px' }}>
                  <div className="progress-fill" style={{ width: `${s.progress}%` }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="ai-disclaimer">
        ⚠ This pipeline is a <strong>mocked demo</strong>. Real AI/ML processing runs on the backend.
      </div>

      <style>{`
        .ai-panel {
          position: fixed;
          bottom: var(--gap-md);
          left: calc(var(--panel-w) + var(--gap-md));
          right: calc(var(--panel-w) + var(--gap-md));
          max-height: 340px;
          padding: var(--gap-md) var(--gap-lg);
          z-index: 60;
          display: flex; flex-direction: column; gap: var(--gap-md);
          overflow-y: auto;
        }
        .ai-panel-header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--gap-md); }
        .ai-panel-sub { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
        .ai-overall-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .ai-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap-sm); }
        .ai-step {
          display: flex; gap: 8px;
          background: rgba(255,255,255,0.02); border: 1px solid var(--border);
          border-radius: var(--r-md); padding: 10px;
          transition: border-color var(--t-normal), background var(--t-normal);
        }
        .ai-step.running { border-color: var(--cyan); background: var(--cyan-dim); }
        .ai-step.done    { border-color: rgba(16,217,126,0.3); background: rgba(16,217,126,0.05); }
        .ai-step-icon { font-size: 18px; flex-shrink: 0; }
        .ai-step-body { flex: 1; min-width: 0; }
        .ai-step-header { display: flex; justify-content: space-between; align-items: center; }
        .ai-step-label { font-size: 12px; font-weight: 600; color: var(--text-primary); }
        .ai-step-desc  { font-size: 10px; color: var(--text-dim); margin-top: 2px; }
        .ai-step-status { font-size: 11px; font-weight: 600; font-family: var(--font-mono); }
        .ai-step-status--idle    { color: var(--text-dim); }
        .ai-step-status--running { color: var(--cyan); }
        .ai-step-status--done    { color: var(--green); }
        .ai-disclaimer {
          font-size: 11px; color: var(--text-dim);
          border-top: 1px solid var(--border); padding-top: 8px;
        }
      `}</style>
    </div>
  );
}
