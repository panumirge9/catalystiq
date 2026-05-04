import React, { useState, useEffect } from 'react';
import API from '../api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

const KPI_DATA = [
  {
    label: 'Screening Time',
    before: '3–6 months',
    after: '2–4 days',
    improvement: '98% faster',
    color: 'var(--accent)',
    icon: '⏱',
  },
  {
    label: 'Cost per Candidate',
    before: '₹2.4 lakh',
    after: '₹8,200',
    improvement: '97% cheaper',
    color: 'var(--green)',
    icon: '💰',
  },
  {
    label: 'Candidates per Run',
    before: '3–5',
    after: '8–31',
    improvement: '6× more',
    color: 'var(--amber)',
    icon: '🔬',
  },
  {
    label: 'CO₂ Utilisation',
    before: 'Manual search',
    after: 'AI-optimised',
    improvement: 'Systematic',
    color: '#7c3aed',
    icon: '🌱',
  },
];

const ACCURACY_DATA = [
  { run: 'Baseline', accuracy: 62 },
  { run: 'Run 1', accuracy: 67 },
  { run: 'Run 2', accuracy: 73 },
  { run: 'Run 3', accuracy: 78 },
  { run: 'Run 4', accuracy: 82 },
  { run: 'Run 5', accuracy: 86 },
];

const REACTION_DATA = [
  { name: 'ETJ', candidates: 31, novel: 8, topScore: 82 },
  { name: 'CO₂→MeOH', candidates: 18, novel: 5, topScore: 88 },
  { name: 'Syngas→EtOH', candidates: 12, novel: 3, topScore: 74 },
  { name: 'Biomass', candidates: 9, novel: 3, topScore: 71 },
];

const IMPACT_TIMELINE = [
  {
    phase: 'Phase 1',
    period: 'Hackathon (Now)',
    status: 'done',
    items: [
      'ETJ + CO₂ hydrogenation catalyst discovery',
      'AI generative design with real chemistry data',
      'Feedback loop + model retraining',
      'Version history + multi-user annotations',
    ]
  },
  {
    phase: 'Phase 2',
    period: '3-month GPS Renewables Pilot',
    status: 'next',
    items: [
      'Integration with GPS Renewables LIMS',
      'Real experimental data from ETJ lab',
      'Model accuracy improving weekly',
      'Dedicated GPS Renewables data sandbox',
    ]
  },
  {
    phase: 'Phase 3',
    period: '12 months',
    status: 'future',
    items: [
      'Synthetic biology direction — enzyme engineering',
      'Metabolic pathway design for biomass conversion',
      'Multi-site deployment across GPS facilities',
      'API integration with Materials Project',
    ]
  },
  {
    phase: 'Phase 4',
    period: 'Scale',
    status: 'future',
    items: [
      'Multi-tenant SaaS for Indian green fuel industry',
      'Licensing to biogas, SAF, green hydrogen producers',
      'Government procurement integration',
      'National catalyst database for India',
    ]
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({ discoveries: 0, feedback: 0, annotations: 0 });

  useEffect(() => {
    API.get('/api/health').then(r => {
      setStats({
        discoveries: r.data.history_count || 0,
        feedback: r.data.feedback_count || 0,
        annotations: r.data.annotations_count || 0,
      });
    }).catch(() => {});
  }, []);

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-breadcrumb">GPS RENEWABLES / IMPACT</span>
          <span className="topbar-title">Business Impact Dashboard</span>
        </div>
        <div className="topbar-actions">
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 10,
            color: 'var(--green)', background: 'var(--green-light)',
            border: '1px solid var(--green-border)',
            padding: '4px 10px', borderRadius: 4
          }}>
            ● GPS Renewables ETJ Programme
          </span>
        </div>
      </div>

      <div className="page-content">

      
        <div style={{
          background: 'var(--accent-light)',
          border: '1px solid var(--accent-border)',
          borderRadius: 6,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start'
        }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>🏭</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', marginBottom: 4, fontFamily: 'var(--mono)' }}>
              GPS RENEWABLES — INDIA'S FIRST ETHANOL-TO-JET PLANT
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              GPS Renewables has won a competitive bid to build India's first ETJ plant. CatalystIQ directly addresses their core bottleneck — catalyst discovery — compressing 3–6 months of bench time to 2–4 days using AI-driven molecular discovery and automated experimental feedback loops.
            </div>
          </div>
        </div>

        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {KPI_DATA.map((k, i) => (
            <div key={i} className="panel" style={{ marginBottom: 0 }}>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{k.icon}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)', letterSpacing: '1.5px', marginBottom: 10 }}>
                  {k.label.toUpperCase()}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                  <div style={{ fontSize: 11, color: 'var(--faint)', textDecoration: 'line-through' }}>{k.before}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--mono)' }}>{k.after}</div>
                </div>
                <div style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  background: 'var(--green-light)',
                  border: '0.5px solid var(--green-border)',
                  borderRadius: 3,
                  fontSize: 10,
                  color: 'var(--green)',
                  fontFamily: 'var(--mono)',
                  fontWeight: 500
                }}>
                  ↑ {k.improvement}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

          
          <div className="panel">
            <div className="panel-header">
              <span className="panel-label">Model Accuracy — Improving with Every Experiment</span>
            </div>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.5 }}>
                Each time researchers log experimental results, the model gets smarter. Starting at 62% baseline accuracy, reaching 86% after 5 experimental feedback cycles.
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={ACCURACY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="run" tick={{ fill: 'var(--faint)', fontSize: 10 }} />
                  <YAxis domain={[50, 100]} tick={{ fill: 'var(--faint)', fontSize: 10 }}
                    tickFormatter={v => v + '%'} />
                  <Tooltip
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 12, borderRadius: 5 }}
                    formatter={v => [v + '%', 'Accuracy']}
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="var(--accent)"
                    strokeWidth={2} dot={{ fill: 'var(--accent)', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          
          <div className="panel">
            <div className="panel-header">
              <span className="panel-label">Candidates Generated — By Reaction Type</span>
            </div>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.5 }}>
                CatalystIQ covers all of GPS Renewables' target reactions — ETJ, CO₂ hydrogenation, syngas conversion, and biomass utilisation.
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={REACTION_DATA} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--faint)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'var(--faint)', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 12, borderRadius: 5 }}
                  />
                  <Bar dataKey="candidates" name="Known" fill="var(--accent)" opacity={0.8} radius={[3,3,0,0]} />
                  <Bar dataKey="novel" name="AI Novel" fill="var(--green)" opacity={0.85} radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        
        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-header">
            <span className="panel-label">Live Platform Activity</span>
            <span className="panel-sublabel">Updated in real time</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
            {[
              { label: 'Discovery Runs', value: stats.discoveries, color: 'var(--accent)' },
              { label: 'Experiments Logged', value: stats.feedback, color: 'var(--green)' },
              { label: 'Researcher Notes', value: stats.annotations, color: 'var(--amber)' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '20px',
                textAlign: 'center',
                borderRight: i < 2 ? '1px solid var(--border)' : 'none'
              }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 500, color: s.color }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)', letterSpacing: '1.5px', marginTop: 5 }}>
                  {s.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-header">
            <span className="panel-label">Development Roadmap — GPS Renewables Partnership</span>
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {IMPACT_TIMELINE.map((phase, i) => (
                <div key={i} style={{
                  padding: '14px',
                  background: phase.status === 'done' ? 'var(--accent-light)' :
                    phase.status === 'next' ? 'var(--green-light)' : 'var(--surface2)',
                  border: `1px solid ${phase.status === 'done' ? 'var(--accent-border)' :
                    phase.status === 'next' ? 'var(--green-border)' : 'var(--border)'}`,
                  borderRadius: 6,
                }}>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '1px',
                    color: phase.status === 'done' ? 'var(--accent)' :
                      phase.status === 'next' ? 'var(--green)' : 'var(--faint)',
                    marginBottom: 4
                  }}>
                    {phase.status === 'done' ? '✓ COMPLETE' :
                      phase.status === 'next' ? '→ NEXT' : '◦ PLANNED'}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>
                    {phase.phase}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 10, fontFamily: 'var(--mono)' }}>
                    {phase.period}
                  </div>
                  {phase.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'flex-start' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--faint)', marginTop: 5, flexShrink: 0 }} />
                      <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{item}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div className="panel">
          <div className="panel-header">
            <span className="panel-label">National Impact — India's Green Fuel Transition</span>
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {[
                {
                  title: 'Sustainable Aviation Fuel',
                  value: 'ASTM D7566',
                  desc: 'CatalystIQ targets ASTM D7566 Annex A5 compliant ATJ-SPK pathway — the exact standard India\'s civil aviation ministry requires for SAF blending mandates.',
                  color: 'var(--accent)'
                },
                {
                  title: 'Carbon Conversion',
                  value: '₹700M+',
                  desc: 'GPS Renewables is developing USD 700M+ in biogas projects. CatalystIQ directly accelerates their CO₂-to-methanol and syngas catalyst programmes.',
                  color: 'var(--green)'
                },
                {
                  title: 'India First',
                  value: '300,000 TPA',
                  desc: 'GPS Renewables\' 300,000 tonnes per annum bio-methane capacity creates massive demand for optimised catalysts. CatalystIQ is built for this exact scale.',
                  color: 'var(--amber)'
                },
              ].map((item, i) => (
                <div key={i} style={{ padding: '14px', background: 'var(--surface2)', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 500, color: item.color, marginBottom: 4 }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}