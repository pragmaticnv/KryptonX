import React from 'react';
import { Activity, HelpCircle } from 'lucide-react';

interface BaselineAnomalyPanelProps {
  peakFrp: number;
  baselineFrp: number;
  anomalyRatio: number;
  anomalyScore: number;
}

export const BaselineAnomalyPanel: React.FC<BaselineAnomalyPanelProps> = ({
  peakFrp,
  baselineFrp,
  anomalyRatio,
  anomalyScore,
}) => {
  let level = 'NORMAL';
  let levelColor = 'text-cyan';
  let levelBadge = 'bg-cyan/15 text-cyan border-cyan/40';

  if (anomalyRatio > 4.0) {
    level = 'CRITICAL ANOMALY';
    levelColor = 'text-critical';
    levelBadge = 'bg-critical/20 text-critical border-critical/60 animate-pulse';
  } else if (anomalyRatio >= 2.5) {
    level = 'HIGH ANOMALY';
    levelColor = 'text-warning';
    levelBadge = 'bg-warning/20 text-warning border-warning/50';
  } else if (anomalyRatio >= 1.5) {
    level = 'ELEVATED';
    levelColor = 'text-kxblue';
    levelBadge = 'bg-kxblue/20 text-kxblue border-kxblue/50';
  }

  return (
    <div className="bg-bg-panel border border-border-subtle rounded p-3.5 space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan" />
          <span className="text-xs font-bold tracking-wider text-text-primary uppercase">
            HISTORICAL BASELINE & ANOMALY ANALYSIS
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${levelBadge}`}>
          {level}
        </span>
      </div>

      {/* 4 Stat Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-bg-secondary p-2.5 rounded border border-border-subtle/70">
          <div className="text-[9px] text-text-dim uppercase">CURRENT PEAK FRP</div>
          <div className="text-base font-bold text-text-primary mt-0.5">{peakFrp} <span className="text-xs font-normal text-text-muted">MW</span></div>
        </div>
        <div className="bg-bg-secondary p-2.5 rounded border border-border-subtle/70">
          <div className="text-[9px] text-text-dim uppercase">HISTORICAL BASELINE</div>
          <div className="text-base font-bold text-text-primary mt-0.5">{baselineFrp} <span className="text-xs font-normal text-text-muted">MW</span></div>
        </div>
        <div className="bg-bg-secondary p-2.5 rounded border border-border-subtle/70">
          <div className="text-[9px] text-text-dim uppercase">ANOMALY RATIO</div>
          <div className={`text-base font-bold mt-0.5 ${anomalyRatio > 2.0 ? 'text-critical' : 'text-cyan'}`}>{anomalyRatio}×</div>
        </div>
        <div className="bg-bg-secondary p-2.5 rounded border border-border-subtle/70">
          <div className="text-[9px] text-text-dim uppercase">ANOMALY SCORE</div>
          <div className="text-base font-bold text-text-primary mt-0.5">{anomalyScore} <span className="text-xs font-normal text-text-muted">/ 100</span></div>
        </div>
      </div>

      {/* Threshold Progression Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[10px] text-text-muted">
          <span>&lt;1.5× Normal</span>
          <span>1.5–2.5× Elevated</span>
          <span>2.5–4× High</span>
          <span>&gt;4× Critical</span>
        </div>
        <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden flex gap-0.5">
          <div className="h-full bg-cyan/50" style={{ width: '25%' }} title="Normal"></div>
          <div className="h-full bg-kxblue/50" style={{ width: '25%' }} title="Elevated"></div>
          <div className="h-full bg-warning/60" style={{ width: '25%' }} title="High"></div>
          <div className="h-full bg-critical/70" style={{ width: '25%' }} title="Critical"></div>
        </div>
      </div>

      {/* Qualitative Explanation */}
      <div className="text-[11px] text-text-muted bg-bg-secondary/50 p-2 rounded border border-border-subtle/50">
        {anomalyRatio >= 2.5
          ? 'Current thermal intensity is substantially above historical site behaviour.'
          : 'Thermal activity remains commensurate with historical persistent operating levels.'}
      </div>

      <div className="text-[9px] text-text-dim italic">
        * Heuristic thresholds: engineering prototype baselines calculated from multi-overpass historical median.
      </div>
    </div>
  );
};
