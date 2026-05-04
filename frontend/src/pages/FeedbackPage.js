import React, { useState } from 'react';
import { CheckCircle, PlusCircle } from 'lucide-react';
import API from '../api';

export default function FeedbackPage({ results, onDone }) {
  const [entries, setEntries] = useState([emptyEntry()]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const candidates = results?.candidates || [];

  function emptyEntry() {
    return { candidate_id: '', candidate_name: '', predicted_activity: '', measured_activity: '', measured_selectivity: '', notes: '' };
  }

  const updateEntry = (i, field, val) => {
    const updated = [...entries];
    updated[i] = { ...updated[i], [field]: val };
    if (field === 'candidate_id') {
      const c = candidates.find(x => x.uuid === val);
      if (c) {
        updated[i].candidate_name = c.name;
        updated[i].predicted_activity = c.predicted_activity;
      }
    }
    setEntries(updated);
  };

  const submitAll = async () => {
    setLoading(true);
    const results2 = [];
    for (const e of entries) {
      if (!e.candidate_id || !e.measured_activity) continue;
      try {
        const res = await API.post('/api/feedback', {
          candidate_id: e.candidate_id,
          candidate_name: e.candidate_name,
          predicted_activity: parseFloat(e.predicted_activity),
          measured_activity: parseFloat(e.measured_activity),
          measured_selectivity: parseFloat(e.measured_selectivity || 0),
          notes: e.notes,
        });
        results2.push(res.data.entry);
      } catch {}
    }
    setSuccess(`${results2.length} experiment result(s) logged successfully.`);
    setLoading(false);
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-breadcrumb">DISCOVERY / LOG EXPERIMENTS</span>
          <span className="topbar-title">Log Experimental Results</span>
        </div>
      </div>

      <div className="page-content">
        <div className="alert alert-info">
          <CheckCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            This is the <strong>feedback loop</strong> — your lab results retrain the AI model and surface prediction discrepancies.
          </div>
        </div>

        {success && (
          <div className="alert alert-success" style={{ marginBottom: 20 }}>
            <CheckCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              {success}
              <button className="btn btn-primary" style={{ marginLeft: 16 }} onClick={onDone}>
                Analyse Discrepancies →
              </button>
            </div>
          </div>
        )}

        {entries.map((e, i) => (
          <div className="panel" key={i} style={{ marginBottom: 16 }}>
            <div className="panel-header">
              <span className="panel-label">Experiment #{i + 1}</span>
              {entries.length > 1 && (
                <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 10 }}
                  onClick={() => setEntries(entries.filter((_, j) => j !== i))}>
                  Remove
                </button>
              )}
            </div>
            <div className="panel-body">
              <div className="grid-2" style={{ marginBottom: 4 }}>
                <div className="form-group">
                  <label className="form-label">Catalyst Tested</label>
                  <select className="form-select" value={e.candidate_id}
                    onChange={ev => updateEntry(i, 'candidate_id', ev.target.value)}>
                    <option value="">Select candidate...</option>
                    {candidates.map(c => (
                      <option key={c.uuid} value={c.uuid}>{c.name} ({c.type})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Predicted Activity (AI)</label>
                  <input className="form-input" value={e.predicted_activity} readOnly
                    style={{ opacity: 0.6, background: 'var(--surface2)' }} />
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: 4 }}>
                <div className="form-group">
                  <label className="form-label">Measured Activity (0–1) *</label>
                  <input className="form-input" type="number" min="0" max="1" step="0.01"
                    placeholder="e.g. 0.74" value={e.measured_activity}
                    onChange={ev => updateEntry(i, 'measured_activity', ev.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Measured Selectivity (0–1)</label>
                  <input className="form-input" type="number" min="0" max="1" step="0.01"
                    placeholder="e.g. 0.85" value={e.measured_selectivity}
                    onChange={ev => updateEntry(i, 'measured_selectivity', ev.target.value)} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Notes / Observations</label>
                <textarea className="form-textarea"
                  placeholder="Any unexpected behaviour, side reactions, deactivation observed..."
                  value={e.notes}
                  onChange={ev => updateEntry(i, 'notes', ev.target.value)} />
              </div>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
          <button className="btn btn-ghost" onClick={() => setEntries([...entries, emptyEntry()])}>
            <PlusCircle size={14} /> Add Another Experiment
          </button>
          <button className="btn btn-primary" onClick={submitAll} disabled={loading}>
            {loading ? (
              <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Logging...</>
            ) : (
              'Submit Experimental Results'
            )}
          </button>
        </div>
      </div>
    </>
  );
}