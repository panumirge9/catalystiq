import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function RetrainPage() {
  const [feedback, setFeedback] = useState([]);
  const [selected, setSelected] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    axios.get('/api/feedback')
      .then(r => setFeedback(r.data.feedback))
      .catch(() => setFetchError('Could not fetch feedback. Log experiments first.'));
  }, []);

  const toggle = (id) => setSelected(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const runRetrain = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/retrain', { feedback_ids: selected });
      setAnalysis(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (s) => {
    if (s === 'exceeded') return <span className="badge badge-green">▲ Exceeded</span>;
    if (s === 'matched') return <span className="badge badge-blue">= Matched</span>;
    return <span className="badge" style={{ background: '#FEF2F2', color: '#991B1B', border: '0.5px solid #FECACA' }}>▼ Underperformed</span>;
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-breadcrumb">DISCOVERY / RETRAIN</span>
          <span className="topbar-title">Model Retraining & Analysis</span>
        </div>
      </div>

      <div className="page-content">
        {fetchError && <div className="alert alert-warning">{fetchError}</div>}

        {feedback.length === 0 && !fetchError && (
          <div className="alert alert-info">
            No experimental data logged yet. Go to "Log Experiments" first.
          </div>
        )}

        {feedback.length > 0 && (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-header">
                <span className="panel-label">Logged Experiments ({feedback.length})</span>
                <span className="panel-sublabel">{selected.length} selected</span>
              </div>
              {feedback.map(e => (
                <div key={e.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 18px', borderBottom: '1px solid var(--border)',
                    cursor: 'pointer', transition: 'background 0.1s',
                  }}
                  onClick={() => toggle(e.id)}
                  onMouseEnter={ev => ev.currentTarget.style.background = '#F7F5EF'}
                  onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                >
                  <input type="checkbox" checked={selected.includes(e.id)} onChange={() => toggle(e.id)}
                    style={{ accentColor: 'var(--accent)', width: 16, height: 16, cursor: 'pointer' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--mono)' }}>
                      {e.candidate_name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 2 }}>
                      Predicted: {(e.predicted_activity * 100).toFixed(0)}% · Measured: {(e.measured_activity * 100).toFixed(0)}% · Δ {(e.discrepancy * 100).toFixed(1)}%
                    </div>
                  </div>
                  {statusBadge(e.status)}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <button className="btn btn-ghost" onClick={() => setSelected(feedback.map(e => e.id))}>
                Select All
              </button>
              <button className="btn btn-primary" disabled={selected.length === 0 || loading} onClick={runRetrain}>
                {loading ? (
                  <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Analysing...</>
                ) : (
                  <><RefreshCw size={14} /> Retrain on {selected.length} selected</>
                )}
              </button>
            </div>
          </>
        )}

        {analysis && (
          <div>
            <div className="alert alert-success">
              <CheckCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                Model retrained on {analysis.entries_analysed} experiments at {new Date(analysis.retrained_at).toLocaleTimeString()}
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div className="panel">
                <div className="panel-body" style={{ textAlign: 'center', padding: '20px' }}>
                  <div className="stat-value stat-blue">{(analysis.analysis.overall_model_accuracy * 100).toFixed(0)}%</div>
                  <div className="stat-label" style={{ marginTop: 6 }}>Model Accuracy</div>
                </div>
              </div>
              <div className="panel">
                <div className="panel-body" style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500, color: 'var(--text)', marginTop: 4 }}>
                    {analysis.analysis.bias_direction}
                  </div>
                  <div className="stat-label" style={{ marginTop: 6 }}>Bias Direction</div>
                </div>
              </div>
            </div>

            <div className="panel" style={{ marginBottom: 14 }}>
              <div className="panel-header">
                <span className="panel-label">
                  <AlertTriangle size={13} style={{ marginRight: 6, display: 'inline' }} />
                  Hypotheses Surfaced
                </span>
              </div>
              <div className="panel-body">
                {analysis.analysis.hypotheses?.map((h, i) => (
                  <div key={i} className="hypothesis">
                    <div className="hypothesis-title">
                      {h.description}
                      <span className="badge badge-purple">{h.confidence}</span>
                    </div>
                    <div className="hypothesis-body">
                      <strong>Suggested follow-up:</strong> {h.suggested_follow_up}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel" style={{ marginBottom: 14 }}>
              <div className="panel-header">
                <span className="panel-label">
                  <TrendingUp size={13} style={{ marginRight: 6, display: 'inline' }} />
                  Feature Reweighting Recommendations
                </span>
              </div>
              <div style={{ padding: '0 18px' }}>
                {analysis.analysis.features_to_reweight?.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 16, padding: '12px 0',
                    borderBottom: '1px solid var(--border)', fontSize: 13
                  }}>
                    <div style={{ fontFamily: 'var(--mono)', color: 'var(--text)', flex: 1, fontWeight: 500 }}>{f.feature}</div>
                    <div style={{ color: 'var(--muted)', minWidth: 120 }}>
                      {f.current_weight} → <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{f.recommended_weight}</span>
                    </div>
                    <div style={{ color: 'var(--muted)', flex: 2 }}>{f.reason}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel" style={{ marginBottom: 14 }}>
              <div className="panel-header">
                <span className="panel-label">Retrain Recommendation</span>
              </div>
              <div className="panel-body">
                <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>
                  {analysis.analysis.retrain_recommendation}
                </div>
                {analysis.analysis.data_quality_flags?.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)', letterSpacing: '1.5px', marginBottom: 10 }}>
                      DATA QUALITY FLAGS
                    </div>
                    {analysis.analysis.data_quality_flags.map((f, i) => (
                      <div key={i} className="alert alert-warning" style={{ marginBottom: 8 }}>{f}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}