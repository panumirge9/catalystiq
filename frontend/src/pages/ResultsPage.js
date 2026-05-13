import React, { useState, useRef, useEffect } from 'react';
import { ScoreBar, RankBadge } from '../components/ScoreBar';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { Download, MessageSquarePlus, Search, Star, Info } from 'lucide-react';


let mol3DLoadingPromise = null;
function load3Dmol() {
  if (typeof window === 'undefined') return Promise.reject('no window');
  if (window.$3Dmol) return Promise.resolve(window.$3Dmol);
  if (mol3DLoadingPromise) return mol3DLoadingPromise;
  mol3DLoadingPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.0.3/3Dmol-min.js';
    s.onload = () => resolve(window.$3Dmol);
    s.onerror = () => reject(new Error('failed to load 3Dmol'));
    document.head.appendChild(s);
  });
  return mol3DLoadingPromise;
}


const REACTION_MAP = {
  ethanol: {
    reactants: [
      { name: 'Ethanol',  formula: 'C2H5OH', smiles: 'CCO' }
    ],
    product: { name: 'Jet hydrocarbons', formula: 'C8-C16' },
    pathway: 'Dehydration -> Oligomerization -> Cyclization'
  },
  co2: {
    reactants: [
      { name: 'Carbon Dioxide', formula: 'CO2', smiles: 'O=C=O' },
      { name: 'Hydrogen', formula: 'H2', smiles: '[H][H]' }
    ],
    product: { name: 'Methanol', formula: 'CH3OH' },
    pathway: 'CO2 + 3H2 -> CH3OH + H2O'
  },
  co: {
    reactants: [
      { name: 'Carbon Monoxide', formula: 'CO', smiles: '[C-]#[O+]' },
      { name: 'Hydrogen', formula: 'H2', smiles: '[H][H]' }
    ],
    product: { name: 'Ethanol', formula: 'C2H5OH' },
    pathway: 'CO + 2H2 -> C2H5OH'
  },
  glucose: {
    reactants: [
      { name: 'Glucose', formula: 'C6H12O6', smiles: 'OCC1OC(O)C(O)C(O)C1O' }
    ],
    product: { name: 'Syngas', formula: 'CO + H2' },
    pathway: 'Gasification + tar cracking'
  },
  methanol: {
    reactants: [
      { name: 'Methanol', formula: 'CH3OH', smiles: 'CO' }
    ],
    product: { name: 'Hydrocarbons', formula: 'CnH2n' },
    pathway: 'Dehydration -> olefin formation'
  }
};

function Catalyst3D({ meta, name }) {
  const ref = useRef(null);

  useEffect(() => {
    let cancelled = false;
    if (!ref.current) return;
    ref.current.innerHTML = '';

    load3Dmol().then(($3Dmol) => {
      if (cancelled || !ref.current) return;
      const container = document.createElement('div');
      container.style.cssText = 'width:100%;height:240px;position:relative;';
      ref.current.appendChild(container);

      const viewer = $3Dmol.createViewer(container, {
        backgroundColor: '#F5F3EC',
        antialias: true
      });

      buildCatalystLattice(viewer, meta, name);
      viewer.zoomTo();
      viewer.render();
      viewer.spin('y', 0.4);
    }).catch(() => {
      if (ref.current) {
        ref.current.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:240px;color:#9ca3af;font-family:monospace;font-size:12px;">3D viewer unavailable</div>';
      }
    });

    return () => { cancelled = true; if (ref.current) ref.current.innerHTML = ''; };
  }, [meta, name]);

  return <div ref={ref} style={{ width: '100%', height: 240, background: '#F5F3EC', borderRadius: 4 }} />;
}

function buildCatalystLattice(viewer, meta, name) {
  const schematic = meta.schematic;
  const nameLower = (name || '').toLowerCase();
  let atoms = [];

  if (schematic === 'zeolite') {
    const a = 2.5;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 3; k++) {
          const x = i * a, y = j * a, z = k * a;
          atoms.push({ elem: 'Si', x, y, z });
          atoms.push({ elem: 'O', x: x + a/2, y, z });
          atoms.push({ elem: 'O', x, y: y + a/2, z });
          atoms.push({ elem: 'O', x, y, z: z + a/2 });
        }
      }
    }
    atoms.push({ elem: 'H', x: 4, y: 4, z: 2.5 });

    if (nameLower.includes('ga')) {
      atoms.push({ elem: 'Ga', x: 2.5, y: 5, z: 2.5 });
      atoms.push({ elem: 'Ga', x: 5, y: 2.5, z: 2.5 });
    }
    if (nameLower.includes('p ') || nameLower.includes('-p') || nameLower.includes('/p')) {
      atoms.push({ elem: 'P', x: 5, y: 5, z: 2.5 });
    }
    if (nameLower.includes('pd')) {
      atoms.push({ elem: 'Pd', x: 4, y: 4, z: 2.5 });
    }
    if (nameLower.includes('cu-co') || nameLower.includes('cu/co')) {
      atoms.push({ elem: 'Cu', x: 3.5, y: 4, z: 2.5 });
      atoms.push({ elem: 'Co', x: 4.5, y: 4, z: 2.5 });
    }
  }
  else if (schematic === 'mesoporous') {
    const a = 2.0;
    for (let ring = 0; ring < 3; ring++) {
      const r = ring * 1.5 + 2;
      const n = 6 + ring * 2;
      for (let t = 0; t < n; t++) {
        const ang = (t / n) * Math.PI * 2;
        for (let z = 0; z < 5; z++) {
          atoms.push({ elem: 'Si', x: r * Math.cos(ang), y: r * Math.sin(ang), z: z * a });
          if (z < 4) {
            atoms.push({ elem: 'O', x: r * Math.cos(ang), y: r * Math.sin(ang), z: z * a + a/2 });
          }
        }
      }
    }
    for (let z = 0; z < 5; z++) {
      atoms.push({ elem: 'Fe', x: 0, y: 0, z: z * 2 });
    }
  }
  else if (schematic === 'supportedMetal') {
    const a = 2.2;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        const x = i * a, y = j * a;
        atoms.push({ elem: 'Al', x, y, z: 0 });
        atoms.push({ elem: 'O', x: x + a/2, y, z: 0 });
        atoms.push({ elem: 'O', x, y: y + a/2, z: 0 });
        if (i < 5 && j < 5) {
          atoms.push({ elem: 'Al', x: x + a/2, y: y + a/2, z: -a/2 });
        }
      }
    }
    const metalSym = extractFirstMetal(name) || 'Ni';
    const clusterCenters = [[3, 3, 2.5], [8, 4, 2.5], [4, 8, 2.5]];
    clusterCenters.forEach(([cx, cy, cz]) => {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = 0; dz <= 1; dz++) {
            
            atoms.push({ elem: metalSym, x: cx + dx * 1.6, y: cy + dy * 1.6, z: cz + dz * 1.6 });
          }
        }
      }
    });
  }
  else if (schematic === 'oxideSurface') {
    const a = 2.4;
    const metalSym = extractFirstMetal(name) || 'In';
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        for (let k = 0; k < 3; k++) {
          const x = i * a, y = j * a, z = k * a;
          atoms.push({ elem: metalSym, x, y, z });
          const isVacancy = (i === 2 && j === 2 && k === 1) || (i === 3 && j === 1 && k === 1);
          if (!isVacancy) {
            atoms.push({ elem: 'O', x: x + a/2, y, z });
            atoms.push({ elem: 'O', x, y: y + a/2, z });
          }
        }
      }
    }
  }
  else {
    const metalSym = extractFirstMetal(name) || 'Fe';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 3; k++) {
          atoms.push({ elem: metalSym, x: i * 2.2, y: j * 2.2, z: k * 2.2 });
        }
      }
    }
  }

  const xyz = atoms.length + '\ncatalyst\n' +
    atoms.map(a => `${a.elem} ${a.x.toFixed(3)} ${a.y.toFixed(3)} ${a.z.toFixed(3)}`).join('\n');

  viewer.addModel(xyz, 'xyz');
  viewer.setStyle({}, {
    sphere: { scale: 0.35, colorscheme: 'Jmol' }
  });
  viewer.setStyle({ elem: 'Ga' }, { sphere: { scale: 0.55, color: '#4ECDC4' } });
  viewer.setStyle({ elem: 'P' },  { sphere: { scale: 0.5, color: '#FFB627' } });
  viewer.setStyle({ elem: 'Pd' }, { sphere: { scale: 0.6, color: '#D4AC0D' } });
}

function extractFirstMetal(name) {
  if (!name) return null;
  const metals = ['Ni','Cu','Co','Fe','Ru','Rh','Pd','Pt','Mn','Mo','Zn','In','Ce','Zr','Ti','Al'];
  for (const m of metals) {
    const re = new RegExp('\\b' + m + '\\b', 'i');
    if (re.test(name)) return m;
  }
  return null;
}

function Reactants3D({ substrate }) {
  const ref = useRef(null);
  const rxn = REACTION_MAP[substrate.key] || REACTION_MAP.ethanol;

  useEffect(() => {
    let cancelled = false;
    if (!ref.current) return;
    ref.current.innerHTML = '';

    load3Dmol().then(async ($3Dmol) => {
      if (cancelled || !ref.current) return;
      const container = document.createElement('div');
      container.style.cssText = 'width:100%;height:240px;position:relative;';
      ref.current.appendChild(container);

      const viewer = $3Dmol.createViewer(container, {
        backgroundColor: '#FDFCF8',
        antialias: true
      });

      let offsetX = 0;
      for (const r of rxn.reactants) {
        try {
          const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(r.smiles)}/SDF?record_type=3d`;
          const res = await fetch(url);
          const sdf = await res.text();
          if (cancelled) return;
          if (sdf.includes('V2000') || sdf.includes('V3000')) {
            const model = viewer.addModel(sdf, 'sdf');
            const atoms = model.selectedAtoms({});
            
            
            let minX = Infinity, maxX = -Infinity;
            let minY = Infinity, maxY = -Infinity;
            let minZ = Infinity, maxZ = -Infinity;

            atoms.forEach(at => {
              if (at.x < minX) minX = at.x;
              if (at.x > maxX) maxX = at.x;
              if (at.y < minY) minY = at.y;
              if (at.y > maxY) maxY = at.y;
              if (at.z < minZ) minZ = at.z;
              if (at.z > maxZ) maxZ = at.z;
            });

            const shiftY = -((minY + maxY) / 2);
            const shiftZ = -((minZ + maxZ) / 2);
            const shiftX = offsetX - minX;

            atoms.forEach(at => { 
              at.x += shiftX;
              at.y += shiftY;
              at.z += shiftZ;
            });
            
            
            offsetX += (maxX - minX) + 4;
          }
        } catch (e) {  }
      }

      viewer.setStyle({}, {
        stick: { radius: 0.18, colorscheme: 'Jmol' },
        sphere: { scale: 0.28, colorscheme: 'Jmol' }
      });
      viewer.zoomTo();
      viewer.render();
      viewer.spin('y', 0.5);
    }).catch(() => {
      if (ref.current) {
        ref.current.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:240px;color:#9ca3af;font-family:monospace;font-size:12px;">3D viewer unavailable</div>';
      }
    });

    return () => { cancelled = true; if (ref.current) ref.current.innerHTML = ''; };
  }, [substrate.key]);

  return <div ref={ref} style={{ width: '100%', height: 240, background: '#FDFCF8', borderRadius: 4 }} />;
}

function Reaction3D({ substrate, meta, name }) {
  const ref = useRef(null);
  const rxn = REACTION_MAP[substrate.key] || REACTION_MAP.ethanol;

  useEffect(() => {
    let cancelled = false;
    if (!ref.current) return;
    ref.current.innerHTML = '';

    load3Dmol().then(async ($3Dmol) => {
      if (cancelled || !ref.current) return;
      const container = document.createElement('div');
      container.style.cssText = 'width:100%;height:240px;position:relative;';
      ref.current.appendChild(container);

      const viewer = $3Dmol.createViewer(container, {
        backgroundColor: '#F5F3EC',
        antialias: true
      });

      const slab = [];
      const a = 2.4;
      const metalSym = extractFirstMetal(name) ||
        (meta.schematic === 'zeolite' ? 'Si' : 'Ni');
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          slab.push(`${metalSym} ${(i*a).toFixed(2)} ${(j*a).toFixed(2)} 0.00`);
          slab.push(`O ${(i*a + a/2).toFixed(2)} ${(j*a).toFixed(2)} 0.00`);
          slab.push(`O ${(i*a).toFixed(2)} ${(j*a + a/2).toFixed(2)} 0.00`);
        }
      }
      slab.push(`Au 0.00 0.00 1.50`); 

      const slabXYZ = slab.length + '\nslab\n' + slab.join('\n');
      viewer.addModel(slabXYZ, 'xyz');
      viewer.setStyle({ model: 0 }, {
        sphere: { scale: 0.4, colorscheme: 'Jmol' }
      });
      viewer.setStyle({ model: 0, elem: 'Au' }, {
        sphere: { scale: 0.6, color: '#F59E0B' }
      });

      try {
        const r = rxn.reactants[0];
        const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(r.smiles)}/SDF?record_type=3d`;
        const res = await fetch(url);
        const sdf = await res.text();
        if (cancelled) return;
        if (sdf.includes('V2000') || sdf.includes('V3000')) {
          const model = viewer.addModel(sdf, 'sdf');
          const atoms = model.selectedAtoms({});

          
          let minX = Infinity, maxX = -Infinity;
          let minY = Infinity, maxY = -Infinity;
          let minZ = Infinity;

          atoms.forEach(at => {
            if (at.x < minX) minX = at.x;
            if (at.x > maxX) maxX = at.x;
            if (at.y < minY) minY = at.y;
            if (at.y > maxY) maxY = at.y;
            if (at.z < minZ) minZ = at.z;
          });

        
          const shiftX = -((minX + maxX) / 2);
          const shiftY = -((minY + maxY) / 2);
          const shiftZ = 3.0 - minZ; 
          
          atoms.forEach(at => { 
            at.x += shiftX; 
            at.y += shiftY;
            at.z += shiftZ; 
          });

          viewer.setStyle({ model: 1 }, {
            stick: { radius: 0.2, colorscheme: 'Jmol' },
            sphere: { scale: 0.3, colorscheme: 'Jmol' }
          });
        }
      } catch (e) {  }

      viewer.zoomTo();
      viewer.render();
      viewer.spin('y', 0.4);
    }).catch(() => {
      if (ref.current) {
        ref.current.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:240px;color:#9ca3af;font-family:monospace;font-size:12px;">3D viewer unavailable</div>';
      }
    });

    return () => { cancelled = true; if (ref.current) ref.current.innerHTML = ''; };
  }, [substrate.key, meta.schematic, name]);

  return <div ref={ref} style={{ width: '100%', height: 240, background: '#F5F3EC', borderRadius: 4 }} />;
}

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
  const rxn = REACTION_MAP[substrate.key] || REACTION_MAP.ethanol;

  const panelStyle = {
    background: '#FDFCF8',
    borderRadius: 6,
    border: '1px solid var(--border)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };
  const headerStyle = {
    padding: '7px 10px',
    borderBottom: '1px solid var(--border)',
    background: '#F5F3EC',
    fontFamily: 'var(--mono)',
    fontSize: 9,
    color: 'var(--faint)',
    letterSpacing: '1.5px'
  };
  const footerStyle = {
    padding: '6px 10px',
    borderTop: '1px solid var(--border)',
    background: '#F5F3EC',
    textAlign: 'center'
  };

  return (
    <div>
      
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 10, fontFamily: 'var(--mono)', fontSize: 9,
        color: 'var(--faint)', letterSpacing: '1.5px'
      }}>
        <span>3D MOLECULAR VIEW</span>
        {type === 'Novel' && (
          <span style={{
            fontSize: 8, padding: '2px 7px', borderRadius: 2,
            background: 'var(--green-light,#DCFCE7)',
            color: 'var(--green,#166534)',
            border: '0.5px solid var(--green-border,#BBF7D0)'
          }}>AI NOVEL</span>
        )}
      </div>

      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 12
      }}>

        
        <div style={panelStyle}>
          <div style={headerStyle}>1 · CATALYST STRUCTURE</div>
          <div style={{ padding: 8 }}>
            <Catalyst3D meta={meta} name={name} />
          </div>
          <div style={footerStyle}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: 'var(--text)', wordBreak: 'break-word' }}>{formula}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)', marginTop: 2 }}>{meta.classLabel}</div>
          </div>
        </div>

        
        <div style={panelStyle}>
          <div style={headerStyle}>2 · REACTANT MOLECULES</div>
          <div style={{ padding: 8 }}>
            <Reactants3D substrate={substrate} />
          </div>
          <div style={footerStyle}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: 'var(--text)', wordBreak: 'break-word' }}>
              {rxn.reactants.map(r => r.formula).join(' + ')}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)', marginTop: 2 }}>3D from PubChem</div>
          </div>
        </div>

        
        <div style={panelStyle}>
          <div style={headerStyle}>3 · REACTION ON SURFACE</div>
          <div style={{ padding: 8 }}>
            <Reaction3D substrate={substrate} meta={meta} name={name} />
          </div>
          <div style={footerStyle}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: '#166534', wordBreak: 'break-word' }}>
              → {rxn.product.formula}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)', marginTop: 2 }}>{rxn.product.name}</div>
          </div>
        </div>
      </div>

      
      <div style={{
        marginTop: 12, padding: '10px 14px',
        background: '#FDFCF8', borderRadius: 6,
        border: '1px solid var(--border)'
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)',
          letterSpacing: '1.5px', marginBottom: 8
        }}>
          CATALYST PROPERTIES
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 8
        }}>
          <Row label="Active phase" value={meta.activePhase} color="var(--accent)" />
          <Row label="Support" value={meta.support} color="var(--muted)" />
          <Row label="Active sites" value={meta.activeSites} color="var(--muted)" />
          {meta.framework && <Row label="Framework" value={meta.framework} color="var(--muted)" />}
        </div>
        <div style={{
          marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 10,
          color: 'var(--faint)', fontFamily: 'var(--mono)'
        }}>
          <Info size={10} />
          All 3 viewers are interactive — drag to rotate, scroll to zoom
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, color }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', minWidth: 0 }}>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)',
        letterSpacing: '1px', minWidth: 80, flexShrink: 0
      }}>
        {label.toUpperCase()}
      </span>
      <span style={{
        fontSize: 11, color, lineHeight: 1.4,
        wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0, flex: 1
      }}>
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
  if (t.includes('syngas') || t.includes('fischer') || t.includes('co ') || t.includes('co+')) {
    return { key: 'co', label: 'Carbon Monoxide', formula: 'CO', smiles: '[C-]#[O+]' };
  }
  if (t.includes('biomass') || t.includes('cellulose') || t.includes('glucose')) {
    return { key: 'glucose', label: 'Glucose', formula: 'C₆H₁₂O₆', smiles: 'OCC1OC(O)C(O)C(O)C1O' };
  }
  return { key: 'ethanol', label: 'Ethanol', formula: 'C₂H₅OH', smiles: 'CCO' };
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
  if (n.includes('in2o3') || n.includes('in₂o₃') || (n.includes('zro2') && !n.includes('/')) || (n.includes('zro₂') && !n.includes('/'))) {
    return {
      classLabel: 'Mixed oxide',
      activePhase: 'Oxygen vacancies + metal Lewis sites',
      support: extractSupport(formula) || 'Oxide phase',
      activeSites: 'O-vacancies on oxide surface',
      schematic: 'oxideSurface'
    };
  }
  if (n.includes('dolomite') || n.includes('cao')) {
    return {
      classLabel: 'Basic oxide',
      activePhase: 'CaO–MgO basic sites',
      support: 'Mineral lattice',
      activeSites: 'Surface oxide ions',
      schematic: 'oxideSurface'
    };
  }
  if (n.includes('olivine')) {
    return {
      classLabel: 'Mineral support',
      activePhase: extractDopants(name) || 'Ni nanoparticles',
      support: '(Mg,Fe)₂SiO₄ olivine',
      activeSites: 'Fe-Ni alloy + lattice Fe sites',
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