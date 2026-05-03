import React from 'react';

const colorForScore = (score) => {
  if (score >= 0.75) return 'var(--green)';
  if (score >= 0.5) return 'var(--accent)';
  if (score >= 0.3) return 'var(--amber)';
  return 'var(--red)';
};

export function ScoreBar({ label, value }) {
  const pct = Math.round(value * 100);
  return (
    <div className="score-bar-row">
      <span className="score-label">{label}</span>
      <div className="score-bar-bg">
        <div
          className="score-bar-fill"
          style={{ width: `${pct}%`, background: colorForScore(value) }}
        />
      </div>
      <span className="score-val">{pct}%</span>
    </div>
  );
}

export function RankBadge({ rank }) {
  const cls = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-n';
  return <div className={`rank ${cls}`}>#{rank}</div>;
}