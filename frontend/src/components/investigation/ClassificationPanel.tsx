import React from 'react';
import { ProbabilityItem } from '../../types/event';

interface ClassificationPanelProps {
  probableSource: string;
  confidence: number;
  probabilities: ProbabilityItem[];
}

export const ClassificationPanel: React.FC<ClassificationPanelProps> = ({
  probableSource,
  confidence,
  probabilities,
}) => {
  return (
    <div className="bg-bg-panel border border-border-subtle rounded p-3.5 space-y-3">
      {/* Probable Source Header */}
      <div>
        <div className="text-[10px] font-mono tracking-wider text-text-dim uppercase">
          PROBABLE SOURCE INFERENCE
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-sm font-bold text-cyan font-mono">
            {probableSource}
          </div>
          <div className="text-xs font-mono font-bold bg-cyan/15 text-cyan px-2 py-0.5 rounded border border-cyan/40">
            {Math.round(confidence * 100)}% CONFIDENCE
          </div>
        </div>
      </div>

      {/* Probability Bars */}
      <div className="space-y-2 pt-1 border-t border-border-subtle/60">
        <div className="text-[10px] font-mono text-text-muted uppercase">
          CANDIDATE TAXONOMY DISTRIBUTION
        </div>
        {probabilities.slice(0, 5).map((p) => {
          const pct = Math.round(p.probability * 100);
          const isTop = p.category === probableSource;
          return (
            <div key={p.category} className="space-y-1 text-xs font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className={isTop ? 'text-text-primary font-semibold' : 'text-text-muted'}>
                  {p.category}
                </span>
                <span className={isTop ? 'text-cyan font-bold' : 'text-text-dim'}>
                  {pct}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isTop ? 'bg-cyan shadow-sm shadow-cyan/50' : 'bg-border-active'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Required Disclaimer */}
      <div className="text-[10px] font-mono text-text-dim italic bg-bg-secondary/60 p-2 rounded border border-border-subtle/50">
        “Classification represents evidence-weighted probable source, not ground-truth confirmation.”
      </div>
    </div>
  );
};
