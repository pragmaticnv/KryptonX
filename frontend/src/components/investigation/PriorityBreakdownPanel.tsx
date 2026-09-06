import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { PriorityBreakdown } from '../../types/event';

interface PriorityBreakdownPanelProps {
  priorityScore: number;
  priorityLevel: string;
  breakdown?: PriorityBreakdown;
}

export const PriorityBreakdownPanel: React.FC<PriorityBreakdownPanelProps> = ({
  priorityScore,
  priorityLevel,
  breakdown,
}) => {
  const isCritical = priorityLevel === 'CRITICAL';
  const isHigh = priorityLevel === 'HIGH';

  const defaultBreakdown: PriorityBreakdown = {
    thermal_severity: 96.4,
    anomaly_score: 87.0,
    persistence_score: 52.5,
    exposure_score: 76.0,
    industrial_relevance: 94.0,
  };

  const b = breakdown || defaultBreakdown;

  const factors = [
    { label: 'Thermal Severity', weight: '30%', score: b.thermal_severity, color: 'bg-warning' },
    { label: 'Anomaly Deviation', weight: '25%', score: b.anomaly_score, color: 'bg-critical' },
    { label: 'Temporal Persistence', weight: '20%', score: b.persistence_score, color: 'bg-cyan' },
    { label: 'Infrastructure Exposure', weight: '15%', score: b.exposure_score, color: 'bg-kxblue' },
    { label: 'Industrial Relevance', weight: '10%', score: b.industrial_relevance, color: 'bg-purple-400' },
  ];

  return (
    <div className="bg-bg-panel border border-border-subtle rounded p-3.5 space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-critical" />
          <span className="text-xs font-bold tracking-wider text-text-primary uppercase">
            PRIORITY ENGINE BREAKDOWN
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-text-primary">
            {priorityScore} <span className="text-xs font-normal text-text-muted">/ 100</span>
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
              isCritical
                ? 'bg-critical/20 text-critical border-critical/50 animate-pulse'
                : isHigh
                ? 'bg-warning/20 text-warning border-warning/50'
                : 'bg-kxblue/20 text-kxblue border-kxblue/50'
            }`}
          >
            {priorityLevel}
          </span>
        </div>
      </div>

      <div className="text-[10px] text-text-dim">
        Priority measures operational urgency; strictly decoupled from classifier confidence.
      </div>

      {/* 5 Factors Progress Breakdown */}
      <div className="space-y-2.5 pt-1 border-t border-border-subtle/60">
        {factors.map((f) => (
          <div key={f.label} className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-text-muted">
                {f.label} <span className="text-[9px] text-text-dim">({f.weight})</span>
              </span>
              <span className="font-bold text-text-primary">
                {Math.round(f.score)} / 100
              </span>
            </div>
            <div className="w-full h-1.5 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${f.color}`}
                style={{ width: `${Math.min(100, Math.max(0, f.score))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
