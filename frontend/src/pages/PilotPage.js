import React, { useState } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const PILOT_PHASES = [
  {
    week: 'Week 1–2',
    title: 'Data Integration',
    tasks: [
      { task: 'GPS Renewables LIMS API connection setup' },
      { task: 'Secure data sandbox provisioned on GPS servers' },
      { task: 'Existing catalyst screening data imported (scrambled)' },
      { task: 'Research team onboarding (3 chemists, 1 engineer)' },
    ]
  },
  {
    week: 'Week 3–6',
    title: 'ETJ Catalyst Programme',
    tasks: [
      { task: 'Run CatalystIQ on GPS Renewables\' ETJ target reaction' },
      { task: 'Top 5 AI candidates synthesised by GPS lab team' },
      { task: 'Bench testing: activity, selectivity, stability measured' },
      { task: 'Experimental results logged back into platform' },
    ]
  },
  {
    week: 'Week 7–10',
    title: 'Feedback Loop Validation',
    tasks: [
      { task: 'Model retrained with GPS experimental data' },
      { task: 'Prediction accuracy measured vs bench results' },
      { task: 'Second round of AI candidates generated' },
      { task: 'Discrepancy hypotheses reviewed by GPS chemists' },
    ]
  },
  {
    week: 'Week 11–12',
    title: 'Pilot Evaluation',
    tasks: [
      { task: 'Final accuracy report vs traditional screening' },
      { task: 'Time and cost savings quantified' },
      { task: 'Pilot findings presented to GPS Renewables leadership' },
      { task: 'Decision: full deployment or extended pilot' },
    ]
  },
];

const REQUIREMENTS = [
  {
    category: 'Data Requirements',
    icon: '🗄️',
    color: 'var(--accent)',
    items: [
      'Existing catalyst screening results (anonymised OK)',
      'Target reaction conditions for ETJ and CO₂ hydrogenation',
      'Lab measurement formats (activity, selectivity, stability)',
      'LIMS system API documentation (optional)',
    ]
  },
  {
    category: 'Infrastructure',
    icon: '🖥️',
    color: 'var(--green)',
    items: [
      'Any laptop/server with Python 3.10+ and Node.js',
      'Internet access for AI API calls (Groq — free tier sufficient)',
      'No GPU required — runs on CPU',
      'GPS Renewables can host on their own servers for data privacy',
    ]
  },
  {
    category: 'Team Requirements',
    icon: '👥',
    color: 'var(--amber)',
    items: [
      '1 chemist to validate AI candidate quality',
      '1 lab technician to run synthesis and testing',
      '1 data coordinator to log experimental results',
      'No AI/ML expertise required from GPS team',
    ]
  },
  {
    category: 'Compliance',
    icon: '🔒',
    color: '#7c3aed',
    items: [
      'All GPS Renewables data stays on their infrastructure',
      'No proprietary formulas sent to external AI models',
      'AI receives only reaction parameters, not internal IP',
      'Full audit trail — every action logged with attribution',
    ]
  },
];

const RISK_MATRIX = [
  { risk: 'AI prediction accuracy below 70%', likelihood: 'Low', impact: 'Medium', mitigation: 'Feedback loop corrects within 2–3 experimental cycles' },
  { risk: 'Novel candidates fail synthesis', likelihood: 'Medium', impact: 'Low', mitigation: 'Known catalysts from literature serve as fallback benchmark' },
  { risk: 'Data privacy concerns', likelihood: 'Low', impact: 'High', mitigation: 'Self-hosted deployment — no external data transfer' },
  { risk: 'Lab integration complexity', likelihood: 'Medium', impact: 'Medium', mitigation: 'CSV import/export works without LIMS integration' },
];

export default function PilotPage() {
  const [checkedTasks, setCheckedTasks] = useState({});

  const toggleTask = (phaseIdx, taskIdx) => {
    const key = `${phaseIdx}-${taskIdx}`;
    setCheckedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalTasks = PILOT_PHASES.reduce((sum, p) => sum + p.tasks.length, 0);
  const doneTasks = Object.values(checkedTasks).filter(Boolean).length;
  const progress = Math.round((doneTasks / totalTasks) * 100);

  const downloadPDF = () => {
    const content = `
CATALYSTIQ — GPS RENEWABLES PILOT PLAN
=======================================
Generated: ${new Date().toLocaleDateString()}

COMMITMENT
----------
Team CatalystIQ commits to a 3-month pilot with GPS Renewables
for joint development of the CatalystIQ platform.

PHASE 1 — Week 1-2: Data Integration
- GPS Renewables LIMS API connection setup
- Secure data sandbox provisioned on GPS servers
- Existing catalyst screening data imported
- Research team onboarding (3 chemists, 1 engineer)

PHASE 2 — Week 3-6: ETJ Catalyst Programme
- Run CatalystIQ on GPS Renewables ETJ target reaction
- Top 5 AI candidates synthesised by GPS lab team
- Bench testing: activity, selectivity, stability measured
- Experimental results logged back into platform

PHASE 3 — Week 7-10: Feedback Loop Validation
- Model retrained with GPS experimental data
- Prediction accuracy measured vs bench results
- Second round of AI candidates generated
- Discrepancy hypotheses reviewed by GPS chemists

PHASE 4 — Week 11-12: Pilot Evaluation
- Final accuracy report vs traditional screening
- Time and cost savings quantified
- Pilot findings presented to GPS Renewables leadership
- Decision: full deployment or extended pilot

REQUIREMENTS
------------
- Any laptop with Python 3.10+ and Node.js
- Internet access for Groq API (free tier)
- No GPU required
- GPS Renewables hosts their own data

IMPACT
------
- Screening time: 3-6 months → 2-4 days (98% faster)
- Cost per candidate: Rs 2.4 lakh → Rs 8,200 (97% cheaper)
- Candidates per run: 3-5 → 8-31 (6x more)
- ASTM D7566 ATJ-SPK compliant target

Contact: pilot@catalystiq.in
PAN IIT Bangalore Summit 2026 — Theme 4
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CatalystIQ_GPS_Renewables_Pilot_Plan.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const requestEngagement = () => {
    window.open(
      'mailto:pilot@catalystiq.in?subject=CatalystIQ Pilot Engagement — GPS Renewables&body=Hi,%0A%0AWe are interested in starting the 3-month CatalystIQ pilot for the GPS Renewables Ethanol-to-Jet programme.%0A%0APlease send us the deployment guide.%0A%0AThank you.',
      '_blank'
    );
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-breadcrumb">GPS RENEWABLES / PILOT</span>
          <span className="topbar-title">3-Month Pilot Readiness Plan</span>
        </div>
        <div className="topbar-actions">
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10,
            color: 'var(--accent)', background: 'var(--accent-light)',
            border: '1px solid var(--accent-border)',
            padding: '4px 12px', borderRadius: 4,
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <div style={{ fontWeight: 500 }}>{progress}%</div>
            <div style={{ color: 'var(--faint)' }}>pilot readiness</div>
          </div>
        </div>
      </div>

      <div className="page-content">

        <div style={{
          background: '#f0fdf4', border: '1px solid #86efac',
          borderRadius: 6, padding: '16px 20px', marginBottom: 20,
          display: 'flex', gap: 14, alignItems: 'flex-start'
        }}>
          <CheckCircle size={18} color="var(--green)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--green)', marginBottom: 4 }}>
              PILOT ENGAGEMENT COMMITMENT
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              Team CatalystIQ expresses full willingness to engage in a longer-term pilot with GPS Renewables for joint development of this platform beyond the hackathon. We are ready to deploy within 2 weeks of approval, support the GPS research team throughout the 3-month pilot, and iterate based on real experimental feedback from the ETJ catalyst programme.
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-header">
            <span className="panel-label">Pilot Readiness Checklist — {doneTasks}/{totalTasks} tasks complete</span>
            <span className="panel-sublabel">{progress}% ready</span>
          </div>
          <div style={{ padding: '8px 18px 20px' }}>
            <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: 'var(--green)', borderRadius: 3,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {PILOT_PHASES.map((phase, pi) => (
                <div key={pi}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)', letterSpacing: '1px', marginBottom: 4 }}>
                    {phase.week}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 10 }}>
                    {phase.title}
                  </div>
                  {phase.tasks.map((t, ti) => {
                    const key = `${pi}-${ti}`;
                    const done = checkedTasks[key];
                    return (
                      <div key={ti} onClick={() => toggleTask(pi, ti)}
                        style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start', cursor: 'pointer' }}
                      >
                        <div style={{
                          width: 14, height: 14, borderRadius: 3, flexShrink: 0, marginTop: 1,
                          border: `1px solid ${done ? 'var(--green)' : 'var(--border2)'}`,
                          background: done ? 'var(--green)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s'
                        }}>
                          {done && (
                            <svg width="8" height="8" viewBox="0 0 10 10">
                              <polyline points="1,5 4,8 9,2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                        <div style={{
                          fontSize: 11, color: done ? 'var(--faint)' : 'var(--muted)',
                          lineHeight: 1.4, textDecoration: done ? 'line-through' : 'none',
                          transition: 'all 0.15s'
                        }}>
                          {t.task}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-header">
            <span className="panel-label">Deployment Requirements</span>
            <span className="panel-sublabel">What GPS Renewables needs to provide</span>
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {REQUIREMENTS.map((req, i) => (
                <div key={i} style={{
                  padding: '14px', background: 'var(--surface2)',
                  border: '1px solid var(--border)', borderRadius: 6
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 16 }}>{req.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{req.category}</span>
                  </div>
                  {req.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 7, alignItems: 'flex-start' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: req.color, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>{item}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-header">
            <span className="panel-label">
              <AlertTriangle size={12} style={{ marginRight: 6, display: 'inline' }} />
              Risk Assessment & Mitigation
            </span>
          </div>
          <div style={{ padding: '0 18px' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr',
              gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--faint)', letterSpacing: '1px'
            }}>
              <div>RISK</div><div>LIKELIHOOD</div><div>IMPACT</div><div>MITIGATION</div>
            </div>
            {RISK_MATRIX.map((r, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr',
                gap: 12, padding: '12px 0',
                borderBottom: i < RISK_MATRIX.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'start'
              }}>
                <div style={{ fontSize: 13, color: 'var(--text)' }}>{r.risk}</div>
                <div>
                  <span style={{
                    padding: '2px 8px', borderRadius: 3, fontSize: 10, fontFamily: 'var(--mono)',
                    background: r.likelihood === 'Low' ? 'var(--green-light)' : '#FFFBEB',
                    color: r.likelihood === 'Low' ? 'var(--green)' : 'var(--amber)',
                    border: `0.5px solid ${r.likelihood === 'Low' ? 'var(--green-border)' : '#FCD34D'}`
                  }}>{r.likelihood}</span>
                </div>
                <div>
                  <span style={{
                    padding: '2px 8px', borderRadius: 3, fontSize: 10, fontFamily: 'var(--mono)',
                    background: r.impact === 'High' ? '#FEF2F2' : r.impact === 'Medium' ? '#FFFBEB' : 'var(--green-light)',
                    color: r.impact === 'High' ? 'var(--red)' : r.impact === 'Medium' ? 'var(--amber)' : 'var(--green)',
                    border: `0.5px solid ${r.impact === 'High' ? '#FECACA' : r.impact === 'Medium' ? '#FCD34D' : 'var(--green-border)'}`
                  }}>{r.impact}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{r.mitigation}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'var(--sidebar)', borderRadius: 6,
          padding: '24px 28px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 16, color: '#ECE9E1', marginBottom: 6 }}>
              Ready to start the GPS Renewables pilot?
            </div>
            <div style={{ fontSize: 13, color: '#6b8fa8', lineHeight: 1.5 }}>
              CatalystIQ can be deployed within 2 weeks. No GPU, no cloud dependency, full data ownership.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button onClick={downloadPDF} style={{
              padding: '10px 20px', border: '1px solid #2a4060', borderRadius: 4,
              fontFamily: 'var(--mono)', fontSize: 10, color: '#6b8fa8',
              background: 'transparent', cursor: 'pointer'
            }}>
              ↓ Download Pilot Plan
            </button>
            <button onClick={requestEngagement} style={{
              padding: '10px 20px', background: 'var(--accent)', borderRadius: 4,
              fontFamily: 'var(--mono)', fontSize: 10, color: '#000',
              fontWeight: 500, cursor: 'pointer', border: 'none'
            }}>
              Request Pilot Engagement →
            </button>
          </div>
        </div>

      </div>
    </>
  );
}