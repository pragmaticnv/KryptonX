import React from 'react';
import { Eye, Flame, Factory, AlertTriangle } from 'lucide-react';
import { AnalyticsSummary } from '../../types/event';

interface KpiStripProps {
  analytics: AnalyticsSummary;
  activePriority: string;
  onSelectPriority: (p: string) => void;
}

export const KpiStrip: React.FC<KpiStripProps> = ({
  analytics,
  activePriority,
  onSelectPriority,
}) => {
  const kpis = [
    {
      id: 'observations',
      label: 'THERMAL OBSERVATIONS',
      value: analytics.observations.toLocaleString(),
      subtext: 'Raw VIIRS / MODIS detections',
      icon: Eye,
      color: 'text-text-muted',
      borderColor: 'border-border-subtle',
      bgGlow: '',
      onClick: () => onSelectPriority('ALL')
    },
    {
      id: 'events',
      label: 'SPATIOTEMPORAL EVENTS',
      value: analytics.events.toString(),
      subtext: 'Clustered spatiotemporal units',
      icon: Flame,
      color: 'text-cyan',
      borderColor: 'border-cyan/30',
      bgGlow: 'hover:border-cyan/60',
      onClick: () => onSelectPriority('ALL')
    },
    {
      id: 'industrial',
      label: 'INDUSTRIAL CANDIDATES',
      value: analytics.industrial_candidates.toString(),
      subtext: 'Proximity to OSM facility ≤1.2km',
      icon: Factory,
      color: 'text-kxblue',
      borderColor: 'border-kxblue/30',
      bgGlow: 'hover:border-kxblue/60',
      onClick: () => onSelectPriority('ALL')
    },
    {
      id: 'critical',
      label: 'HIGH / CRITICAL ANOMALIES',
      value: analytics.high_critical.toString(),
      subtext: 'Anomaly > 2.5× site baseline',
      icon: AlertTriangle,
      color: 'text-critical',
      borderColor: activePriority === 'CRITICAL' ? 'border-critical shadow-sm shadow-critical/30' : 'border-critical/30',
      bgGlow: 'hover:border-critical/80',
      onClick: () => onSelectPriority(activePriority === 'CRITICAL' ? 'ALL' : 'CRITICAL')
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-bg-main/60 border-b border-border-subtle">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <button
            key={kpi.id}
            onClick={kpi.onClick}
            className={`p-3 bg-bg-panel/90 border rounded text-left transition-all relative overflow-hidden group ${kpi.borderColor} ${kpi.bgGlow}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-semibold tracking-wider text-text-muted uppercase">
                {kpi.label}
              </span>
              <Icon className={`w-4 h-4 ${kpi.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-text-primary">
                {kpi.value}
              </span>
            </div>
            <div className="text-[10px] font-mono text-text-dim mt-0.5 truncate">
              {kpi.subtext}
            </div>
          </button>
        );
      })}
    </div>
  );
};
