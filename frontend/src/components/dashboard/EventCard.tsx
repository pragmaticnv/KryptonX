import React from 'react';
import { Flame, Factory, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { EventSummary } from '../../types/event';

interface EventCardProps {
  event: EventSummary;
  isSelected: boolean;
  onSelect: (event: EventSummary) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isSelected, onSelect }) => {
  const isCritical = event.priority_level === 'CRITICAL';
  const isHigh = event.priority_level === 'HIGH';
  const isModerate = event.priority_level === 'MODERATE';

  let priorityBadgeColor = 'bg-cyan/15 text-cyan border-cyan/40';
  if (isCritical) priorityBadgeColor = 'bg-critical/20 text-critical border-critical/50';
  else if (isHigh) priorityBadgeColor = 'bg-warning/20 text-warning border-warning/50';
  else if (isModerate) priorityBadgeColor = 'bg-kxblue/20 text-kxblue border-kxblue/50';

  return (
    <div
      onClick={() => onSelect(event)}
      className={`p-3.5 rounded border transition-all cursor-pointer select-none relative group ${
        isSelected
          ? 'bg-bg-panel border-cyan shadow-md shadow-cyan/10'
          : 'bg-bg-panel/70 hover:bg-bg-panel border-border-subtle hover:border-border-active'
      } ${isCritical && !isSelected ? 'border-critical/30' : ''}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs text-text-primary">
            {event.id}
          </span>
          <span className="px-1.5 py-0.2 text-[9px] font-mono bg-bg-secondary text-text-dim rounded border border-border-subtle">
            DEMO
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${priorityBadgeColor} ${isCritical ? 'animate-pulse' : ''}`}>
            {event.priority_level}
          </span>
        </div>
      </div>

      {/* Probable Source */}
      <div className="text-xs font-semibold text-text-primary mb-2 flex items-center justify-between">
        <span className="truncate">{event.probable_source}</span>
        <span className="text-[11px] font-mono text-cyan ml-2 shrink-0">
          {Math.round(event.confidence * 100)}% conf
        </span>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-text-muted bg-bg-secondary/60 p-2 rounded border border-border-subtle/50 mb-2">
        <div className="flex items-center gap-1.5 truncate">
          <Flame className="w-3 h-3 text-warning shrink-0" />
          <span>FRP: <strong className="text-text-primary">{event.peak_frp} MW</strong></span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <TrendingUp className={`w-3 h-3 ${event.anomaly_ratio > 2.0 ? 'text-critical' : 'text-cyan'} shrink-0`} />
          <span>Base: <strong className={event.anomaly_ratio > 2.0 ? 'text-critical' : 'text-text-primary'}>{event.anomaly_ratio}×</strong></span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Clock className="w-3 h-3 text-kxblue shrink-0" />
          <span>Dur: <strong className="text-text-primary">{event.persistence_hours}h</strong></span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Factory className="w-3 h-3 text-text-muted shrink-0" />
          <span>Fac: <strong className="text-text-primary">{event.facility_distance_km} km</strong></span>
        </div>
      </div>

      {/* Footer Location & Status */}
      <div className="flex items-center justify-between text-[10px] font-mono text-text-dim">
        <span className="truncate max-w-[170px]" title={event.nearest_facility}>
          {event.nearest_facility}
        </span>
        <span className={`uppercase font-semibold ${event.status === 'ESCALATED' ? 'text-critical' : event.status === 'MONITOR' ? 'text-cyan' : 'text-warning'}`}>
          {event.status}
        </span>
      </div>
    </div>
  );
};
