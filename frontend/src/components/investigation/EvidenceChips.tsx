import React from 'react';
import { ShieldAlert, TrendingUp, Factory, Clock, CheckCircle2 } from 'lucide-react';
import { EvidenceItem } from '../../types/event';

interface EvidenceChipsProps {
  evidence: string[];
  evidenceItems?: EvidenceItem[];
  explanation?: string;
}

export const EvidenceChips: React.FC<EvidenceChipsProps> = ({
  evidence,
  evidenceItems,
  explanation,
}) => {
  const defaultExplanation =
    "Persistent thermal activity was detected near an industrial facility. Recent FRP increased above the site's historical baseline, increasing the event's abnormality and investigation priority.";

  return (
    <div className="bg-bg-panel border border-border-subtle rounded p-3.5 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-warning" />
        <span className="text-xs font-mono font-bold tracking-wider text-text-primary uppercase">
          WHY WAS THIS FLAGGED?
        </span>
      </div>

      {/* Prominent Evidence Chips Grid */}
      <div className="grid grid-cols-2 gap-2 font-mono">
        {evidence.map((item, idx) => {
          const isBaseline = item.toLowerCase().includes('baseline');
          const isTrend = item.toLowerCase().includes('rising') || item.toLowerCase().includes('trend');
          const isFacility = item.toLowerCase().includes('facility') || item.toLowerCase().includes('km');
          const isPersistence = item.toLowerCase().includes('hour') || item.toLowerCase().includes('persistence');

          let icon = CheckCircle2;
          let chipColor = 'border-cyan/40 bg-cyan/10 text-cyan';
          if (isBaseline) {
            icon = TrendingUp;
            chipColor = 'border-critical/50 bg-critical/15 text-critical font-bold';
          } else if (isTrend) {
            icon = TrendingUp;
            chipColor = 'border-warning/50 bg-warning/15 text-warning font-bold';
          } else if (isFacility) {
            icon = Factory;
            chipColor = 'border-kxblue/40 bg-kxblue/10 text-kxblue';
          } else if (isPersistence) {
            icon = Clock;
            chipColor = 'border-cyan/40 bg-cyan/10 text-cyan';
          }

          const IconComponent = icon;

          return (
            <div
              key={idx}
              className={`p-2 rounded border flex items-center gap-2 text-[11px] leading-tight ${chipColor}`}
            >
              <IconComponent className="w-3.5 h-3.5 shrink-0" />
              <span className="uppercase">{item}</span>
            </div>
          );
        })}
      </div>

      {/* Analyst Synthesis Narrative */}
      <div className="text-xs text-text-muted bg-bg-secondary p-3 rounded border border-border-subtle/80 leading-relaxed font-sans">
        <strong className="text-text-primary font-mono block text-[10px] uppercase mb-1 tracking-wider text-cyan">
          INTELLIGENCE SYNTHESIS:
        </strong>
        {explanation || defaultExplanation}
      </div>
    </div>
  );
};
