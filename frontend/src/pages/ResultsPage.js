import React, { useState, useRef, useEffect } from 'react';
import { ScoreBar, RankBadge } from '../components/ScoreBar';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { Download, MessageSquarePlus, Search, Star } from 'lucide-react';

export default function ResultsPage({ results, onFeedback, onNewSearch }) {
  const [selected, setSelected] = useState(null);

  if (!results) {
    return (
      <>
        <div className="topbar">
          <div className="topbar-left">
            <span className="topbar-breadcrumb">DISCOVERY / RESULTS</span>
            <span className="topbar-title">No results yet</span>
          </div>
        </div>
        <div className="page-content">
          <div className="alert alert-info">No results yet. Run a discovery first.</div>
          <button className="btn btn-primary" onClick={onNewSearch}><Search size={14} /> New Discovery</button>
        </div>
      </>
    );
  }

  const { candidates, reaction_summary, reaction_energy_profile } = results;
  const known = candidates.filter(c => c.type === 'Known');
  const novel = candidates.filter(c => c.type === 'Novel');
  const top = candidates[0];

  const radarData = selected ? [
    { subject: 'Activity', value: selected.predicted_activity },
    { subject: 'Selectivity', value: selected.predicted_selectivity },
    { subject: 'Stability', value: selected.predicted_stability },
    { subject: 'Composite', value: selected.composite_score },
  ] : [];

  const exportCSV = () => {
    const header = 'Rank,Name,Formula,Type,Activity,Selectivity,Stability,Composite\n';
    const rows = candidates.map(c =>
      `${c.rank},"${c.name}","${c.formula}",${c.type},${c.predicted_activity},${c.predicted_selectivity},${c.predicted_stability},${c.composite_score}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'catalystiq_results.csv'; a.click();
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-breadcrumb">DISCOVERY / RESULTS</span>
          <span className="topbar-title">{reaction_summary?.slice(0, 60) || 'Discovery Results'}</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost" onClick={exportCSV}><Download size={13} /> Export CSV</button>
          <button className="btn btn-secondary" onClick={onNewSearch}><Search size={13} /> New Search</button>
          <button className="btn btn-primary" onClick={onFeedback}><MessageSquarePlus size={13} /> Log Experiments</button>
        </div>
      </div>

      <div className="page-content">

        <div className="stats-row">
          <div className="stat-card"><div className="stat-value">{candidates.length}</div><div className="stat-label">Total Candidates</div></div>
          <div className="stat-card"><div className="stat-value stat-green">{novel.length}</div><div className="stat-label">AI Novel Designs</div></div>
          <div className="stat-card"><div className="stat-value stat-blue">{top ? (top.composite_score * 100).toFixed(0) + '%' : '—'}</div><div className="stat-label">Top Score</div></div>
          <div className="stat-card"><div className="stat-value stat-amber">{reaction_energy_profile?.estimated_conversion_percent || '—'}%</div><div className="stat-label">Est. Conversion</div></div>
        </div>


        {top && (
          <div className="alert alert-info">
            <Star size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <strong>Top recommendation:</strong> {top.name} ({top.formula}) — Composite Score {(top.composite_score * 100).toFixed(0)}%
            </div>
          </div>
        )}

        <div className="grid-results">

          <div>
            <div className="panel">
              <div className="panel-header">
                <span className="panel-label">Candidate Rankings</span>
                <span className="panel-sublabel">{known.length} known · {novel.length} novel AI</span>
              </div>
              {candidates.map(c => (
                <div
                  key={c.uuid}
                  className={`candidate-row ${selected?.uuid === c.uuid ? 'selected' : ''} ${c.rank === 1 ? 'top-candidate' : ''}`}
                  onClick={() => setSelected(c)}
                >
                  <div className="candidate-rank">#{c.rank}</div>
                  <div className="candidate-info">
                    <div className="candidate-name">
                      {c.name}
                      {c.type === 'Novel' && <span className="ai-badge">AI NOVEL</span>}
                    </div>
                    <div className="candidate-formula">{c.formula} · {c.source} · {c.temperature_range}</div>
                  </div>
                  <div className="candidate-scores">
                    <div className="score-row">
                      <span className="score-key">A</span>
                      <div className="score-track"><div className="score-fill fill-activity" style={{ width: `${c.predicted_activity * 100}%` }} /></div>
                    </div>
                    <div className="score-row">
                      <span className="score-key">S</span>
                      <div className="score-track"><div className="score-fill fill-selectivity" style={{ width: `${c.predicted_selectivity * 100}%` }} /></div>
                    </div>
                    <div className="score-row">
                      <span className="score-key">T</span>
                      <div className="score-track"><div className="score-fill fill-stability" style={{ width: `${c.predicted_stability * 100}%` }} /></div>
                    </div>
                  </div>
                  <div className="candidate-pct">{(c.composite_score * 100).toFixed(0)}%</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="panel">
              <div className="panel-header"><span className="panel-label">Activity vs Selectivity</span></div>
              <div className="panel-body" style={{ padding: '14px 18px' }}>
                <ResponsiveContainer width="100%" height={180}>
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0DDD4" />
                    <XAxis dataKey="x" name="Activity" type="number" domain={[0, 1]}
                      ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                      tick={{ fill: '#B5B2A7', fontSize: 10 }}
                      label={{ value: 'Activity', fill: '#B5B2A7', fontSize: 10, position: 'insideBottom', offset: -10 }} />
                    <YAxis dataKey="y" name="Selectivity" type="number" domain={[0, 1]}
                      ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                      tick={{ fill: '#B5B2A7', fontSize: 10 }}
                      label={{ value: 'Selectivity', fill: '#B5B2A7', fontSize: 10, angle: -90, position: 'insideLeft', offset: 10 }} />
                    <Tooltip contentStyle={{ background: '#FDFCF8', border: '1px solid #E0DDD4', fontSize: 12, borderRadius: 5 }}
                      formatter={(value) => [value.toFixed(2)]} />
                    <Scatter name="Known" data={known.map(c => ({ x: c.predicted_activity, y: c.predicted_selectivity, name: c.name }))} fill="#1E5FAD" opacity={0.8} />
                    <Scatter name="Novel" data={novel.map(c => ({ x: c.predicted_activity, y: c.predicted_selectivity, name: c.name }))} fill="#166534" opacity={0.85} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {selected && (
              <div className="panel">
                <div className="panel-header"><span className="panel-label">{selected.name} — Profile</span></div>
                <div className="panel-body" style={{ padding: '14px 18px' }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#E0DDD4" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#B5B2A7', fontSize: 11 }} />
                      <Radar dataKey="value" stroke="#1E5FAD" fill="#1E5FAD" fillOpacity={0.12} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="divider" />
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                    {selected.design_rationale || selected.mechanism}
                  </div>
                  {selected.key_properties && (
                    <div className="tags">
                      {selected.key_properties.map((p, i) => <span key={i} className="tag">{p}</span>)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selected && (
              <div className="panel">
                <div className="panel-header"><span className="panel-label">Catalyst Identity — {selected.name}</span></div>
                <div style={{ padding: '0 18px 14px' }}>
                  <CatalystIdentityPanel formula={selected.formula} name={selected.name} type={selected.type} />
                </div>
              </div>
            )}

            {reaction_energy_profile && (
              <div className="panel">
                <div className="panel-header"><span className="panel-label">Reaction Energy Profile</span></div>
                <div className="energy-row">
                  <div className="energy-cell">
                    <div className="energy-value stat-blue">{reaction_energy_profile.activation_energy_kJ_mol}</div>
                    <div className="energy-label">Ea kJ/mol</div>
                  </div>
                  <div className="energy-cell">
                    <div className="energy-value stat-green">{reaction_energy_profile.reaction_enthalpy_kJ_mol}</div>
                    <div className="energy-label">ΔH kJ/mol</div>
                  </div>
                  <div className="energy-cell">
                    <div className="energy-value stat-amber">{reaction_energy_profile.estimated_conversion_percent}%</div>
                    <div className="energy-label">Conversion</div>
                  </div>
                </div>
              </div>
            )}

            <div className="panel">
              <div className="panel-header"><span className="panel-label">Score Weights</span></div>
              <div className="legend">
                <div className="legend-row"><div className="legend-bar" style={{ background: 'var(--accent)' }} />Activity — 40% weight</div>
                <div className="legend-row"><div className="legend-bar" style={{ background: 'var(--green)' }} />Selectivity — 35% weight</div>
                <div className="legend-row"><div className="legend-bar" style={{ background: 'var(--amber)' }} />Stability — 25% weight</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// CatalystIdentityPanel — replaces the old MolViewer.
// Catalysts in our database (HZSM-5, Pd/Beta, Cu-Co/ZnO, etc.) are heterogeneous
// supported metals and zeolite frameworks. They don't have a single small-molecule
// SMILES. Showing benzene SMILES for HZSM-5 is misleading. So:
//   - For substrates / small molecules (methanol, ethanol, CO2): render real 3D via PubChem
//   - For catalysts (everything else): show the formula card with mechanism context
// This is honest and matches the deck's "Catalyst identity panel" framing.
function CatalystIdentityPanel({ formula, name, type }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';

    // Only render 3D for small molecules we can confidently represent
    const SMALL_MOLECULE_SMILES = {
      'methanol': 'CO',
      'ethanol': 'CCO',
      'co2': 'O=C=O',
    };

    const lowerName = name.toLowerCase();
    const matchKey = Object.keys(SMALL_MOLECULE_SMILES).find(k => lowerName.includes(k));

    // For catalysts (which is everything in our results), show identity card instead of fake 3D
    if (!matchKey) {
      ref.current.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:180px;flex-direction:column;gap:6px;background:#F5F3EC;border-radius:5px;padding:12px;text-align:center;">
          <div style="font-family:var(--mono);font-size:18px;color:var(--accent);font-weight:500;">${formula}</div>
          <div style="font-size:11px;color:var(--muted);max-width:80%;">Heterogeneous catalyst — supported metal / zeolite framework</div>
          <div style="font-size:10px;color:var(--faint);font-family:var(--mono);margin-top:4px;">${type === 'Novel' ? 'AI-designed structure' : 'Crystal structure rendering: Phase 2'}</div>
        </div>`;
      return;
    }

    const smiles = SMALL_MOLECULE_SMILES[matchKey];

    const loadViewer = () => {
      if (!window.$3Dmol || !ref.current) return;
      ref.current.innerHTML = '';
      const container = document.createElement('div');
      container.style.cssText = 'width:100%;height:180px;position:relative;overflow:hidden;';
      ref.current.appendChild(container);
      const viewer = window.$3Dmol.createViewer(container, { backgroundColor: '#F5F3EC', antialias: true });
      fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/SDF?record_type=3d`)
        .then(r => r.text())
        .then(sdf => {
          if (!sdf.includes('V2000') && !sdf.includes('V3000')) throw new Error('no sdf');
          viewer.addModel(sdf, 'sdf');
          viewer.setStyle({}, { stick: { radius: 0.15, colorscheme: 'Jmol' }, sphere: { scale: 0.25, colorscheme: 'Jmol' } });
          viewer.zoomTo();
          viewer.render();
          viewer.spin('y', 0.5);
        })
        .catch(() => {
          if (!ref.current) return;
          ref.current.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:180px;flex-direction:column;gap:8px;background:#F5F3EC;border-radius:5px;">
            <div style="font-family:var(--mono);font-size:22px;color:var(--accent)">${formula}</div>
            <div style="font-size:11px;color:var(--faint)">Chemical formula</div></div>`;
        });
    };

    if (window.$3Dmol) { loadViewer(); }
    else {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.0.3/3Dmol-min.js';
      s.onload = loadViewer;
      document.head.appendChild(s);
    }

    return () => { if (ref.current) ref.current.innerHTML = ''; };
  }, [formula, name, type]);

  return <div ref={ref} style={{ width: '100%', height: 180, borderRadius: 5, overflow: 'hidden', background: '#F5F3EC', isolation: 'isolate', marginTop: 14 }} />;
}