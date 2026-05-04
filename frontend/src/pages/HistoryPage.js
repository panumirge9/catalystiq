import React, { useState, useEffect } from 'react';
import { Clock, MessageSquare, Search, FlaskConical, RefreshCw, CheckCircle } from 'lucide-react';
import API from '../api';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ author: '', observation: '', follow_up: '', experiment_id: 'general' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [h, a] = await Promise.all([
        API.get('/api/history'),
        API.get('/api/annotations'),
      ]);
      setHistory(h.data.history);
      setAnnotations(a.data.annotations);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const typeIcon = (type) => {
    if (type === 'discovery') return <FlaskConical size={13} color="var(--accent)" />;
    if (type === 'experiment') return <Search size={13} color="var(--green)" />;
    if (type === 'retrain') return <RefreshCw size={13} color="var(--amber)" />;
    return <MessageSquare size={13} color="#6D28D9" />;
  };

  const submitAnnotation = async () => {
    if (!form.author || !form.observation) return;
    setSubmitting(true);
    try {
      await API.post('/api/annotate', form);
      setSuccess('Annotation added successfully.');
      setForm({ author: '', observation: '', follow_up: '', experiment_id: 'general' });
      await fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-breadcrumb">DISCOVERY / HISTORY</span>
          <span className="topbar-title">Version History & Annotations</span>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
          <div>
            <div className="panel">
              <div className="panel-header">
                <span className="panel-label">
                  <Clock size={12} style={{ marginRight: 6, display: 'inline' }} />
                  Activity Timeline ({history.length})
                </span>
              </div>
              <div className="panel-body">
                {loading && (
                  <div className="loading-row">
                    <div className="spinner" />
                    Loading history...
                  </div>
                )}

                {!loading && history.length === 0 && (
                  <div style={{ padding: '24px 0', textAlign: 'center' }}>
                    <Clock size={28} color="var(--border)" style={{ marginBottom: 10 }} />
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>No activity yet.</div>
                    <div style={{ fontSize: 11, marginTop: 4, fontFamily: 'var(--mono)', color: 'var(--faint)' }}>
                      Run a discovery to start tracking.
                    </div>
                  </div>
                )}

                {!loading && [...history].reverse().map((h) => (
                  <div key={h.id} className="timeline-row">
                    <div className="timeline-icon">{typeIcon(h.type)}</div>
                    <div className="timeline-content">
                      <div className="timeline-desc">{h.description}</div>
                      <div className="timeline-meta">{h.author} · {new Date(h.created_at).toLocaleString()}</div>
                    </div>
                    <span className={`badge ${
                      h.type === 'discovery' ? 'badge-blue' :
                      h.type === 'experiment' ? 'badge-green' :
                      h.type === 'retrain' ? 'badge-amber' :
                      'badge-purple'
                    }`}>
                      {h.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {!loading && annotations.length > 0 && (
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-label">
                    <MessageSquare size={12} style={{ marginRight: 6, display: 'inline' }} />
                    Researcher Annotations ({annotations.length})
                  </span>
                </div>
                <div className="panel-body">
                  {annotations.map((a) => (
                    <div key={a.id} className="hypothesis">
                      <div className="hypothesis-title">
                        {a.author}
                        <span style={{ fontSize: 10, color: 'var(--faint)', fontFamily: 'var(--mono)', fontWeight: 400 }}>
                          {new Date(a.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="hypothesis-body">{a.observation}</div>
                      {a.follow_up && (
                        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--mono)' }}>
                          → Follow-up: {a.follow_up}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="panel">
              <div className="panel-header">
                <span className="panel-label">
                  <MessageSquare size={12} style={{ marginRight: 6, display: 'inline' }} />
                  Add Researcher Note
                </span>
              </div>
              <div className="panel-body">
                <div className="alert alert-info" style={{ marginBottom: 16 }}>
                  Any team member can add observations. All annotations are versioned and attributed.
                </div>

                {success && (
                  <div className="alert alert-success" style={{ marginBottom: 16 }}>
                    <CheckCircle size={13} style={{ flexShrink: 0 }} />
                    {success}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input className="form-input" placeholder="e.g. Dr. Sharma"
                    value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label">Observation *</label>
                  <textarea className="form-textarea"
                    placeholder="What did you observe? Structural features, unexpected behaviour, correlations..."
                    value={form.observation} onChange={e => setForm({ ...form, observation: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label">Proposed Follow-up Experiment</label>
                  <textarea className="form-textarea" style={{ minHeight: 70 }}
                    placeholder="What experiment should be run next?"
                    value={form.follow_up} onChange={e => setForm({ ...form, follow_up: e.target.value })} />
                </div>

                <button className="btn btn-primary" onClick={submitAnnotation} disabled={submitting}
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 16px' }}>
                  {submitting ? (
                    <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Submitting...</>
                  ) : (
                    <><MessageSquare size={14} /> Submit Annotation</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}