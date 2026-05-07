import React, { useState, useRef, useEffect } from 'react';
import { ScoreBar, RankBadge } from '../components/ScoreBar';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { Download, MessageSquarePlus, Search, Star, Info } from 'lucide-react';

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

  const { candidates, reaction_summary, reaction_energy_profile, query } = results;
  const known = candidates.filter(c => c.type === 'Known');
  const novel = candidates.filter(c => c.type === 'Novel');
  const top = candidates[0];

  const substrate = detectSubstrate(query?.reaction || reaction_summary || '');

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
                <div className="panel-header">
                  <span className="panel-label">Catalyst Identity — {selected.name}</span>
                </div>
                <div style={{ padding: '14px 18px 16px' }}>
                  <CatalystIdentityPanel
                    formula={selected.formula}
                    name={selected.name}
                    type={selected.type}
                    substrate={substrate}
                  />
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


function CatalystIdentityPanel({ formula, name, type, substrate }) {
  const meta = analyseCatalyst(name, formula);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14,
      alignItems: 'stretch'
    }}>
      
      <div style={{
        background: '#F5F3EC',
        borderRadius: 6,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '8px 12px',
          borderBottom: '1px solid var(--border)',
          fontFamily: 'var(--mono)',
          fontSize: 9,
          color: 'var(--faint)',
          letterSpacing: '1.5px',
          background: '#FDFCF8'
        }}>
          SUBSTRATE · {substrate.label.toUpperCase()}
        </div>
        <SubstrateViewer substrate={substrate} />
        <div style={{
          padding: '6px 12px 8px',
          fontSize: 10,
          color: 'var(--faint)',
          fontFamily: 'var(--mono)',
          textAlign: 'center'
        }}>
          {substrate.formula} · 3D from PubChem
        </div>
      </div>

      
      <div style={{
        background: '#FDFCF8',
        borderRadius: 6,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '8px 12px',
          borderBottom: '1px solid var(--border)',
          fontFamily: 'var(--mono)',
          fontSize: 9,
          color: 'var(--faint)',
          letterSpacing: '1.5px',
          background: '#F5F3EC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>CATALYST · {meta.classLabel.toUpperCase()}</span>
          {type === 'Novel' && (
            <span style={{
              fontSize: 8,
              padding: '1px 5px',
              background: 'var(--green-light, #DCFCE7)',
              color: 'var(--green, #166534)',
              border: '0.5px solid var(--green-border, #BBF7D0)',
              borderRadius: 2,
              letterSpacing: '0.5px'
            }}>AI NOVEL</span>
          )}
        </div>

        
        <div style={{ padding: '10px 12px 4px', display: 'flex', justifyContent: 'center' }}>
          <ActiveSiteSchematic meta={meta} />
        </div>

        
        <div style={{
          padding: '6px 12px 4px',
          fontFamily: 'var(--mono)',
          fontSize: 13,
          color: 'var(--text)',
          fontWeight: 500,
          textAlign: 'center'
        }}>
          {formula}
        </div>

        
        <div style={{
          padding: '8px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          fontSize: 11,
          flex: 1
        }}>
          <Row label="Active phase" value={meta.activePhase} color="var(--accent)" />
          <Row label="Support" value={meta.support} color="var(--muted)" />
          <Row label="Active sites" value={meta.activeSites} color="var(--muted)" />
          {meta.framework && <Row label="Framework" value={meta.framework} color="var(--muted)" />}
        </div>

        <div style={{
          padding: '6px 12px 8px',
          fontSize: 9,
          color: 'var(--faint)',
          fontFamily: 'var(--mono)',
          borderTop: '1px solid var(--border)',
          background: '#F5F3EC',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <Info size={10} style={{ flexShrink: 0 }} />
          <span style={{ lineHeight: 1.4 }}>
            Heterogeneous catalyst — no single-molecule structure. Crystal lattice rendering: Phase 2.
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, color }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
      <span style={{
        fontFamily: 'var(--mono)',
        fontSize: 9,
        color: 'var(--faint)',
        letterSpacing: '1px',
        minWidth: 78,
        flexShrink: 0
      }}>
        {label.toUpperCase()}
      </span>
      <span style={{ fontSize: 11, color, lineHeight: 1.4 }}>
        {value}
      </span>
    </div>
  );
}

function detectSubstrate(reactionText) {
  const t = (reactionText || '').toLowerCase();
  if (t.includes('co2') || t.includes('co₂') || t.includes('carbon dioxide')) {
    return { key: 'co2', label: 'Carbon Dioxide', formula: 'CO₂', smiles: 'O=C=O' };
  }
  if (t.includes('methanol')) {
    return { key: 'methanol', label: 'Methanol', formula: 'CH₃OH', smiles: 'CO' };
  }
  if (t.includes('syngas') || t.includes('fischer')) {
    return { key: 'co', label: 'Carbon Monoxide', formula: 'CO', smiles: '[C-]#[O+]' };
  }
  if (t.includes('biomass') || t.includes('cellulose') || t.includes('glucose')) {
    return { key: 'glucose', label: 'Glucose', formula: 'C₆H₁₂O₆', smiles: 'OCC1OC(O)C(O)C(O)C1O' };
  }

  return { key: 'ethanol', label: 'Ethanol', formula: 'C₂H₅OH', smiles: 'CCO' };
}

function SubstrateViewer({ substrate }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    let cancelled = false;
    ref.current.innerHTML = '';

    const loadViewer = () => {
      if (cancelled || !window.$3Dmol || !ref.current) return;
      ref.current.innerHTML = '';
      const container = document.createElement('div');
      container.style.cssText = 'width:100%;height:170px;position:relative;overflow:hidden;';
      ref.current.appendChild(container);

      const viewer = window.$3Dmol.createViewer(container, {
        backgroundColor: '#F5F3EC',
        antialias: true
      });

      fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(substrate.smiles)}/SDF?record_type=3d`)
        .then(r => r.text())
        .then(sdf => {
          if (cancelled) return;
          if (!sdf.includes('V2000') && !sdf.includes('V3000')) throw new Error('no sdf');
          viewer.addModel(sdf, 'sdf');
          viewer.setStyle({}, {
            stick: { radius: 0.18, colorscheme: 'Jmol' },
            sphere: { scale: 0.28, colorscheme: 'Jmol' }
          });
          viewer.zoomTo();
          viewer.render();
          viewer.spin('y', 0.6);
        })
        .catch(() => {
          if (cancelled || !ref.current) return;
          ref.current.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:170px;flex-direction:column;gap:6px;">
              <div style="font-family:var(--mono);font-size:22px;color:var(--accent);font-weight:500;">${substrate.formula}</div>
              <div style="font-size:10px;color:var(--faint);font-family:var(--mono);">3D unavailable — showing formula</div>
            </div>`;
        });
    };

    if (window.$3Dmol) {
      loadViewer();
    } else {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.0.3/3Dmol-min.js';
      s.onload = loadViewer;
      s.onerror = () => {
        if (ref.current) {
          ref.current.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:170px;">
              <div style="font-family:var(--mono);font-size:22px;color:var(--accent);">${substrate.formula}</div>
            </div>`;
        }
      };
      document.head.appendChild(s);
    }

    return () => {
      cancelled = true;
      if (ref.current) ref.current.innerHTML = '';
    };
  }, [substrate.key, substrate.smiles, substrate.formula]);

  return (
    <div
      ref={ref}
      style={{ width: '100%', height: 170, background: '#F5F3EC', isolation: 'isolate', flex: 1 }}
    />
  );
}

function analyseCatalyst(name, formula) {
  const n = (name || '').toLowerCase();
  const f = (formula || '');

  if (n.includes('zsm-5') || n.includes('zsm5') || n.includes('hzsm')) {
    const isModified = n.includes('ga') || n.includes('p-') || n.includes('p ') || n.includes('cu-co');
    return {
      classLabel: 'Zeolite',
      framework: 'MFI (10-MR pores, ~5.5 Å)',
      activePhase: isModified ? extractDopants(name) || 'Brønsted + modifier sites' : 'Brønsted acid sites (H⁺)',
      support: 'Aluminosilicate framework',
      activeSites: 'Si–O(H)–Al bridging hydroxyls',
      schematic: 'zeolite'
    };
  }
  if (n.includes('beta') || n.includes('bea')) {
    return {
      classLabel: 'Zeolite',
      framework: 'BEA (12-MR pores, ~7 Å)',
      activePhase: f.match(/^[A-Z][a-z]?/)?.[0] || 'Brønsted sites',
      support: 'Aluminosilicate framework',
      activeSites: 'Acid sites + metal NPs in pores',
      schematic: 'zeolite'
    };
  }
  if (n.includes('mcm-41') || n.includes('mcm41')) {
    return {
      classLabel: 'Mesoporous silica',
      framework: 'MCM-41 (hexagonal, ~3 nm pores)',
      activePhase: extractDopants(name) || 'Promoted metal sites',
      support: 'Mesoporous SiO₂',
      activeSites: 'Metal NPs in mesopores',
      schematic: 'mesoporous'
    };
  }

  if (n.includes('cu/zno') || n.includes('cu/zno/al') || n.includes('cu-zno')) {
    return {
      classLabel: 'Industrial mixed oxide',
      activePhase: 'Cu nanoparticles',
      support: 'ZnO / Al₂O₃',
      activeSites: 'Cu–ZnO interface (formate route)',
      schematic: 'supportedMetal'
    };
  }
  if (n.includes('in2o3') || n.includes('in₂o₃') || n.includes('in-zr')) {
    return {
      classLabel: 'Mixed oxide',
      activePhase: 'In₂O₃ surface',
      support: 'ZrO₂',
      activeSites: 'Oxygen vacancies (Vo)',
      schematic: 'oxideSurface'
    };
  }
  if (n.includes('zno-zro') || n.includes('zno/zro')) {
    return {
      classLabel: 'Solid solution oxide',
      activePhase: 'Zn-substituted ZrO₂',
      support: 'ZrO₂ matrix',
      activeSites: 'Lewis acid + oxygen vacancies',
      schematic: 'oxideSurface'
    };
  }
  if (n.includes('cu/ceo') || n.includes('cu-ceo')) {
    return {
      classLabel: 'Supported metal / redox oxide',
      activePhase: 'Cu nanoparticles',
      support: 'CeO₂ (fluorite)',
      activeSites: 'Cu–CeO₂ interface (Ce³⁺/Ce⁴⁺)',
      schematic: 'supportedMetal'
    };
  }


  if (n.includes('fe-k') || n.includes('fischer') || n.includes('fe/k')) {
    return {
      classLabel: 'Fischer-Tropsch',
      activePhase: 'Fe carbide (χ-Fe₅C₂)',
      support: 'SiO₂',
      activeSites: 'Fe carbide + K promoter',
      schematic: 'supportedMetal'
    };
  }
  if (n.includes('mos2') || n.includes('mos₂')) {
    return {
      classLabel: 'Sulfide catalyst',
      activePhase: 'MoS₂ edges',
      support: 'Al₂O₃',
      activeSites: 'Mo–S vacancy edges (K-promoted)',
      schematic: 'oxideSurface'
    };
  }
  if (n.includes('rh/sio')) {
    return {
      classLabel: 'Supported precious metal',
      activePhase: 'Rh nanoparticles',
      support: 'SiO₂',
      activeSites: 'Rh ensembles (CO insertion)',
      schematic: 'supportedMetal'
    };
  }

  if (/cu.*co/i.test(name) || /cu-co/i.test(name)) {
    return {
      classLabel: 'Bimetallic / oxide',
      activePhase: 'Cu-Co alloy',
      support: 'ZnO–Al₂O₃',
      activeSites: 'Surface carbide (C–C coupling)',
      schematic: 'supportedMetal'
    };
  }
  if (/ni\/al/i.test(name) || n.includes('ni/al')) {
    return {
      classLabel: 'Bifunctional',
      activePhase: 'Ni nanoparticles',
      support: 'Al₂O₃–SiO₂',
      activeSites: 'Ni metal + acid sites',
      schematic: 'supportedMetal'
    };
  }

 
  const metalMatch = formula.match(/^([A-Z][a-z]?)(?:\(|\d|$)/);
  if (metalMatch) {
    return {
      classLabel: 'Supported metal',
      activePhase: `${metalMatch[1]} nanoparticles`,
      support: extractSupport(formula) || 'Oxide support',
      activeSites: 'Metal–support interface',
      schematic: 'supportedMetal'
    };
  }

  return {
    classLabel: 'Heterogeneous catalyst',
    activePhase: '—',
    support: '—',
    activeSites: '—',
    schematic: 'generic'
  };
}

function extractDopants(name) {
  
  const match = name.match(/([A-Z][a-z]?)[-/ ]([A-Z][a-z]?)/);
  if (match) return `${match[1]}–${match[2]} dopants`;
  return null;
}

function extractSupport(formula) {
  if (/sio2|sio₂/i.test(formula)) return 'SiO₂';
  if (/al2o3|al₂o₃/i.test(formula)) return 'Al₂O₃';
  if (/zro2|zro₂/i.test(formula)) return 'ZrO₂';
  if (/zno/i.test(formula)) return 'ZnO';
  if (/ceo2|ceo₂/i.test(formula)) return 'CeO₂';
  if (/tio2|tio₂/i.test(formula)) return 'TiO₂';
  return null;
}

function ActiveSiteSchematic({ meta }) {
  const W = 200, H = 110;
  const common = {
    width: '100%',
    height: 110,
    viewBox: `0 0 ${W} ${H}`,
    style: { maxWidth: 220 }
  };

  switch (meta.schematic) {
    case 'zeolite':
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          
          <defs>
            <pattern id="mfi" x="0" y="0" width="22" height="19" patternUnits="userSpaceOnUse">
              <polygon points="11,0 22,5.5 22,16.5 11,22 0,16.5 0,5.5"
                fill="none" stroke="#9ca3af" strokeWidth="0.7" opacity="0.6" />
            </pattern>
          </defs>
          <rect x="10" y="10" width={W - 20} height={H - 20} fill="url(#mfi)" rx="4" />
          
          <circle cx={W / 2} cy={H / 2} r="14" fill="#1E5FAD" opacity="0.15" />
          <circle cx={W / 2} cy={H / 2} r="6" fill="#1E5FAD" />
          <text x={W / 2} y={H / 2 + 3} fontSize="8" fill="#FDFCF8" textAnchor="middle" fontFamily="monospace" fontWeight="600">H⁺</text>
          {/* Pore label */}
          <text x={W / 2} y={H - 14} fontSize="8" fill="#6b7280" textAnchor="middle" fontFamily="monospace">10-MR pore</text>
        </svg>
      );

    case 'mesoporous':
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          
          {[0, 1, 2].map(row =>
            [0, 1, 2, 3].map(col => {
              const cx = 30 + col * 40 + (row % 2) * 20;
              const cy = 25 + row * 30;
              return (
                <g key={`${row}-${col}`}>
                  <circle cx={cx} cy={cy} r="12" fill="none" stroke="#9ca3af" strokeWidth="1" opacity="0.7" />
                  <circle cx={cx} cy={cy} r="6" fill="#1E5FAD" opacity="0.25" />
                </g>
              );
            })
          )}
          <text x={W / 2} y={H - 6} fontSize="8" fill="#6b7280" textAnchor="middle" fontFamily="monospace">~3 nm channels</text>
        </svg>
      );

    case 'supportedMetal':
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          
          <rect x="10" y={H - 30} width={W - 20} height="20" fill="#9ca3af" opacity="0.25" rx="2" />
          <rect x="10" y={H - 30} width={W - 20} height="20" fill="none" stroke="#9ca3af" strokeWidth="0.8" rx="2" />
          
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} cx={20 + i * 20} cy={H - 20} r="1.5" fill="#6b7280" opacity="0.6" />
          ))}
          
          <ellipse cx="55" cy={H - 30} rx="14" ry="14" fill="#1E5FAD" opacity="0.85" />
          <ellipse cx="55" cy={H - 30} rx="6" ry="3" fill="#FDFCF8" opacity="0.3" />
          <ellipse cx="110" cy={H - 30} rx="18" ry="18" fill="#1E5FAD" opacity="0.85" />
          <ellipse cx="110" cy={H - 30} rx="8" ry="4" fill="#FDFCF8" opacity="0.3" />
          <ellipse cx="160" cy={H - 30} rx="11" ry="11" fill="#1E5FAD" opacity="0.85" />
          
          <rect x="0" y={H - 30} width={W} height="20" fill="#FDFCF8" />
          <rect x="10" y={H - 30} width={W - 20} height="20" fill="#9ca3af" opacity="0.25" rx="2" />
          <rect x="10" y={H - 30} width={W - 20} height="20" fill="none" stroke="#9ca3af" strokeWidth="0.8" rx="2" />
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={`d${i}`} cx={20 + i * 20} cy={H - 20} r="1.5" fill="#6b7280" opacity="0.6" />
          ))}
          
          <path d="M 41,80 A 14,14 0 0 1 69,80 Z" fill="#1E5FAD" />
          <path d="M 92,80 A 18,18 0 0 1 128,80 Z" fill="#1E5FAD" />
          <path d="M 149,80 A 11,11 0 0 1 171,80 Z" fill="#1E5FAD" />
          
          <ellipse cx="50" cy="74" rx="4" ry="2" fill="#FDFCF8" opacity="0.4" />
          <ellipse cx="105" cy="72" rx="5" ry="2.5" fill="#FDFCF8" opacity="0.4" />
          <ellipse cx="156" cy="75" rx="3" ry="1.5" fill="#FDFCF8" opacity="0.4" />
          <text x={W / 2} y="20" fontSize="8" fill="#6b7280" textAnchor="middle" fontFamily="monospace">Metal NPs on oxide support</text>
        </svg>
      );

    case 'oxideSurface':
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          {[0, 1, 2, 3].map(row =>
            [0, 1, 2, 3, 4, 5, 6, 7].map(col => {
              const cx = 20 + col * 22;
              const cy = 25 + row * 20;
              const isMetal = (row + col) % 2 === 0;
              const hasVacancy = (row === 1 && col === 4) || (row === 2 && col === 2);
              if (hasVacancy) {
                return (
                  <g key={`${row}-${col}`}>
                    <circle cx={cx} cy={cy} r="6" fill="none" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="2,2" />
                    <text x={cx} y={cy + 2} fontSize="6" fill="#dc2626" textAnchor="middle" fontFamily="monospace" fontWeight="600">Vo</text>
                  </g>
                );
              }
              return (
                <circle
                  key={`${row}-${col}`}
                  cx={cx}
                  cy={cy}
                  r={isMetal ? 6 : 4}
                  fill={isMetal ? '#1E5FAD' : '#dc7f46'}
                  opacity={isMetal ? 0.85 : 0.7}
                />
              );
            })
          )}
          <text x={W / 2} y={H - 6} fontSize="8" fill="#6b7280" textAnchor="middle" fontFamily="monospace">M–O lattice with O-vacancies</text>
        </svg>
      );

    default:
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="30" width={W - 40} height="50" fill="#9ca3af" opacity="0.2" rx="4" />
          <text x={W / 2} y={H / 2 + 4} fontSize="11" fill="#6b7280" textAnchor="middle" fontFamily="monospace">Heterogeneous catalyst</text>
        </svg>
      );
  }
}