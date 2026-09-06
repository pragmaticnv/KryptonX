import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  priority: string;
  onPriorityChange: (p: string) => void;
  source: string;
  onSourceChange: (s: string) => void;
  status: string;
  onStatusChange: (st: string) => void;
  totalEvents: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  priority,
  onPriorityChange,
  source,
  onSourceChange,
  status,
  onStatusChange,
  totalEvents,
}) => {
  const priorities = ['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'];
  const sources = [
    { label: 'All Sources', value: 'ALL' },
    { label: 'Industrial Fire', value: 'Industrial Fire' },
    { label: 'Persistent Industrial', value: 'Persistent Industrial' },
    { label: 'Gas Flare', value: 'Gas Flare' },
    { label: 'Agricultural Burning', value: 'Agricultural' },
    { label: 'Wildfire', value: 'Wildfire' },
  ];
  const statuses = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Review', value: 'REVIEW' },
    { label: 'Monitor', value: 'MONITOR' },
    { label: 'Escalated', value: 'ESCALATED' },
    { label: 'Confirmed', value: 'CONFIRMED' },
  ];

  return (
    <div className="bg-bg-panel border-b border-border-subtle px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
      {/* Priority Pill Buttons */}
      <div className="flex items-center gap-1.5">
        <span className="text-text-dim text-[11px] flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3 text-cyan" />
          PRIORITY:
        </span>
        {priorities.map((p) => {
          const isSelected = priority.toUpperCase() === p;
          let activeClass = 'bg-cyan/20 text-cyan border-cyan/50';
          if (p === 'CRITICAL') activeClass = 'bg-critical/20 text-critical border-critical/60';
          if (p === 'HIGH') activeClass = 'bg-warning/20 text-warning border-warning/60';
          if (p === 'MODERATE') activeClass = 'bg-kxblue/20 text-kxblue border-kxblue/60';
          if (p === 'LOW') activeClass = 'bg-cyan/20 text-cyan border-cyan/60';

          return (
            <button
              key={p}
              onClick={() => onPriorityChange(p)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all border ${
                isSelected
                  ? `${activeClass} shadow-sm`
                  : 'bg-bg-secondary text-text-muted hover:text-text-primary border-border-subtle'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Dropdown Selectors */}
      <div className="flex items-center gap-3">
        {/* Source Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-text-dim text-[10px]">SOURCE:</span>
          <select
            value={source}
            onChange={(e) => onSourceChange(e.target.value)}
            aria-label="Filter events by thermal source classification"
            className="bg-bg-secondary border border-border-subtle rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-cyan/40 cursor-pointer"
          >
            {sources.map((s) => (
              <option key={s.value} value={s.value} className="bg-bg-panel text-text-primary">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-text-dim text-[10px]">STATUS:</span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter events by investigation status"
            className="bg-bg-secondary border border-border-subtle rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-cyan/40 cursor-pointer"
          >
            {statuses.map((st) => (
              <option key={st.value} value={st.value} className="bg-bg-panel text-text-primary">
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Count */}
        <span className="text-[11px] text-text-muted font-mono bg-bg-secondary px-2 py-0.5 rounded border border-border-subtle">
          {totalEvents} FILTERED
        </span>
      </div>
    </div>
  );
};
