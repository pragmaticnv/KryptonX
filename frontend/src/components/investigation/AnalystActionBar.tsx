import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface AnalystActionBarProps {
  currentStatus: string;
  onAction: (action: string) => void;
}

export const AnalystActionBar: React.FC<AnalystActionBarProps> = ({
  currentStatus,
  onAction,
}) => {
  return (
    <div className="bg-bg-panel border border-border-subtle rounded p-3.5 space-y-2 select-none font-mono">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
          ANALYST TRIAGE ACTION
        </span>
        <span className="text-[10px] text-text-muted">
          STATUS: <strong className="text-cyan font-bold">{currentStatus}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <button
          onClick={() => onAction('review')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded text-xs font-semibold border transition-all ${
            currentStatus === 'REVIEW'
              ? 'bg-warning/20 border-warning text-warning shadow-sm shadow-warning/20'
              : 'bg-bg-secondary hover:bg-bg-hover text-text-muted border-border-subtle'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>REVIEW</span>
        </button>

        <button
          onClick={() => onAction('confirm')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded text-xs font-semibold border transition-all ${
            currentStatus === 'CONFIRMED'
              ? 'bg-success/20 border-success text-success shadow-sm shadow-success/20'
              : 'bg-bg-secondary hover:bg-bg-hover text-text-muted border-border-subtle'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>CONFIRM</span>
        </button>

        <button
          onClick={() => onAction('false_positive')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded text-xs font-semibold border transition-all ${
            currentStatus === 'FALSE_POSITIVE'
              ? 'bg-cyan/20 border-cyan text-cyan shadow-sm shadow-cyan/20'
              : 'bg-bg-secondary hover:bg-bg-hover text-text-muted border-border-subtle'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>FALSE POS</span>
        </button>

        <button
          onClick={() => onAction('escalate')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded text-xs font-semibold border transition-all ${
            currentStatus === 'ESCALATED'
              ? 'bg-critical/20 border-critical text-critical shadow-sm shadow-critical/30'
              : 'bg-bg-secondary hover:bg-bg-hover text-critical/80 border-border-subtle hover:border-critical/50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>ESCALATE</span>
        </button>
      </div>
    </div>
  );
};
