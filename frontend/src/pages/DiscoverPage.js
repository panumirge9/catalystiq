import React, { useState } from 'react';
import { Search, Zap, FlaskConical, Thermometer, Gauge, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';

const PRESETS = [
  { label: 'Ethanol → Jet Fuel', reaction: 'ethanol → petroleum-grade hydrocarbons (Ethanol-to-Jet)', temp: '300-450°C', pressure: '10-50 bar' },
  { label: 'CO₂ + H₂ → Methanol', reaction: 'CO₂ + green H₂ → methanol', temp: '200-300°C', pressure: '50-100 bar' },
  { label: 'Syngas → Ethanol', reaction: 'syngas (CO + H₂) → ethanol via Fischer-Tropsch', temp: '250-350°C', pressure: '20-80 bar' },
  { label: 'Biomass → Fuels', reaction: 'cellulose hydrolysis → bio-based hydrocarbons', temp: '150-250°C', pressure: '5-30 bar' },
];

export default function DiscoverPage({ onResults }) {
  const [form, setForm] = useState({ reaction: '', temperature: '', pressure: '', constraints: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const applyPreset = (p) => setForm({ reaction: p.reaction, temperature: p.temp, pressure: p.pressure, constraints: '' });

  const handleSubmit = async () => {
    if (!form.reaction.trim()) { setError('Please enter a target reaction.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/discover', form);
      onResults(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || 'Discovery failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-breadcrumb">DISCOVERY</span>
          <span className="topbar-title">Catalyst Discovery Engine</span>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, alignItems: 'start' }}>

          
          <div>
            <div className="panel">
              <div className="panel-header">
                <span className="panel-label">
                  <FlaskConical size={12} style={{ marginRight: 6, display: 'inline', verticalAlign: 'middle' }} />
                  Target Reaction
                </span>
                <span className="panel-sublabel">Enter reaction parameters below</span>
              </div>
              <div className="panel-body">

                
                <div className="form-group">
                  <label className="form-label">
                    Reaction Description
                    <span style={{ color: 'var(--red)', marginLeft: 3 }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="form-input"
                      placeholder="e.g. ethanol → petroleum-grade hydrocarbons"
                      value={form.reaction}
                      onChange={e => setForm({ ...form, reaction: e.target.value })}
                      style={{ paddingLeft: 14 }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 5, fontFamily: 'var(--mono)' }}>
                    Use → to separate reactants and products. Include catalyst class if known.
                  </div>
                </div>

                
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      <Thermometer size={11} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
                      Temperature
                    </label>
                    <input
                      className="form-input"
                      placeholder="e.g. 300-450°C"
                      value={form.temperature}
                      onChange={e => setForm({ ...form, temperature: e.target.value })}
                    />
                    <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 4, fontFamily: 'var(--mono)' }}>
                      Reaction temperature range
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <Gauge size={11} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
                      Pressure
                    </label>
                    <input
                      className="form-input"
                      placeholder="e.g. 10-50 bar"
                      value={form.pressure}
                      onChange={e => setForm({ ...form, pressure: e.target.value })}
                    />
                    <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 4, fontFamily: 'var(--mono)' }}>
                      Operating pressure range
                    </div>
                  </div>
                </div>

                
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label">
                    <SlidersHorizontal size={11} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
                    Additional Constraints
                  </label>
                  <textarea
                    className="form-textarea"
                    placeholder="e.g. avoid precious metals, prefer earth-abundant materials, target >90% selectivity, sulfur-tolerant..."
                    value={form.constraints}
                    onChange={e => setForm({ ...form, constraints: e.target.value })}
                    style={{ minHeight: 90 }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 5, fontFamily: 'var(--mono)' }}>
                    Optional — material preferences, selectivity targets, cost constraints, safety requirements
                  </div>
                </div>

                {error && (
                  <div className="alert alert-warning" style={{ marginBottom: 16 }}>
                    {error}
                  </div>
                )}

                
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '13px 16px', fontSize: 11 }}
                >
                  {loading ? (
                    <>
                      <div className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} />
                      Running AI Discovery...
                    </>
                  ) : (
                    <>
                      <Search size={14} />
                      Run Catalyst Discovery
                    </>
                  )}
                </button>

                {loading && (
                  <div className="alert alert-info" style={{ marginTop: 14, marginBottom: 0 }}>
                    <Search size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div style={{ fontSize: 12 }}>
                      <strong>CatalystIQ is working...</strong><br />
                      Querying Open Catalyst Project & BRENDA → Generating novel candidates → Ranking by predicted performance
                    </div>
                  </div>
                )}
              </div>
            </div>

            
            {(form.reaction || form.temperature || form.pressure) && !loading && (
              <div className="panel" style={{ marginBottom: 0 }}>
                <div className="panel-header">
                  <span className="panel-label">Current Parameters</span>
                </div>
                <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {form.reaction && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)', letterSpacing: '1px', minWidth: 80, paddingTop: 2 }}>REACTION</span>
                      <span style={{ fontSize: 12, color: 'var(--text)' }}>{form.reaction}</span>
                    </div>
                  )}
                  {form.temperature && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)', letterSpacing: '1px', minWidth: 80 }}>TEMPERATURE</span>
                      <span style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'var(--mono)' }}>{form.temperature}</span>
                    </div>
                  )}
                  {form.pressure && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)', letterSpacing: '1px', minWidth: 80 }}>PRESSURE</span>
                      <span style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'var(--mono)' }}>{form.pressure}</span>
                    </div>
                  )}
                  {form.constraints && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)', letterSpacing: '1px', minWidth: 80, paddingTop: 2 }}>CONSTRAINTS</span>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{form.constraints}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          
          <div>
            
            <div className="panel">
              <div className="panel-header">
                <span className="panel-label">Quick Presets</span>
                <span className="panel-sublabel">Click to auto-fill</span>
              </div>
              <div style={{ padding: '8px 0' }}>
                {PRESETS.map((p, i) => (
                  <div
                    key={i}
                    onClick={() => applyPreset(p)}
                    style={{
                      padding: '13px 18px',
                      cursor: 'pointer',
                      borderBottom: i < PRESETS.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F7F5EF'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Zap size={12} color="var(--accent)" />
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{p.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginLeft: 20 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--faint)' }}>
                        🌡 {p.temp}
                      </span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--faint)' }}>
                        ⚡ {p.pressure}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <span className="panel-label">Discovery Pipeline</span>
              </div>
              <div className="panel-body">
                {[
                  ['01', 'Retrieve known catalysts from Open Catalyst Project & BRENDA databases', 'var(--accent)'],
                  ['02', 'Generate novel candidates via LLM-based generative design', 'var(--green)'],
                  ['03', 'Rank all candidates by weighted composite score (A·40% + S·35% + T·25%)', 'var(--amber)'],
                  ['04', 'Export results and feed experimental data back to retrain model', 'var(--muted)'],
                ].map(([n, t, c]) => (
                  <div key={n} style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: 10, color: c,
                      background: 'var(--surface2)', border: `1px solid var(--border)`,
                      borderRadius: 3, padding: '2px 7px', flexShrink: 0,
                      minWidth: 28, textAlign: 'center'
                    }}>{n}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{t}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <span className="panel-label">Scoring Methodology</span>
              </div>
              <div className="panel-body" style={{ padding: '12px 18px' }}>
                {[
                  ['Activity', '40%', 'var(--accent)', 'Catalytic conversion rate at target conditions'],
                  ['Selectivity', '35%', 'var(--green)', 'Product distribution toward desired compounds'],
                  ['Stability', '25%', 'var(--amber)', 'Resistance to deactivation, coking, sintering'],
                ].map(([label, weight, color, desc]) => (
                  <div key={label} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: 3, background: color, opacity: 0.15, flexShrink: 0, marginTop: 1 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{label}</span>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: color }}>{weight}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--faint)' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}