import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AnalyticsSummary, EventSummary } from '../types/event';
import { ApiService } from '../services/api';
import { DEFAULT_ANALYTICS } from '../data/seedData';

interface AnalyticsPageProps {
  onSelectEventId: (id: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onSelectEventId }) => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(DEFAULT_ANALYTICS);
  const [events, setEvents] = useState<EventSummary[]>([]);

  useEffect(() => {
    ApiService.getAnalytics().then(setAnalytics);
    ApiService.getEvents().then(setEvents);
  }, []);

  // Format source bar data
  const sourceData = Object.entries(analytics.by_source).map(([category, count]) => ({
    name: category.replace(' Candidate', '').replace(' Thermal Source', ''),
    count,
  }));

  // Format priority pie data
  const priorityColors: Record<string, string> = {
    CRITICAL: '#FF4D4D',
    HIGH: '#FF9F1C',
    MODERATE: '#4DA3FF',
    LOW: '#19C7D8',
  };

  const priorityData = Object.entries(analytics.by_priority).map(([priority, count]) => ({
    name: priority,
    value: count,
    color: priorityColors[priority] || '#8EA6B6',
  }));

  // Format scatter data: anomaly ratio vs FRP
  const scatterData = events.map((e) => ({
    id: e.id,
    frp: e.peak_frp,
    anomaly: e.anomaly_ratio,
    source: e.probable_source,
    priority: e.priority_level
  }));

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto bg-bg-main p-5 font-mono space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-text-primary uppercase flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan" />
          Thermal Intelligence & Anomaly Analytics
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Spatiotemporal thermal distribution, anomaly clustering, and risk classification metrics.
        </p>
      </div>

      {/* Top 3 Core Charts Above Fold */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Probable Source Breakdown */}
        <div className="bg-bg-panel border border-border-subtle rounded p-4 flex flex-col">
          <div className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
            1. EVENTS BY PROBABLE SOURCE
          </div>
          <div className="text-[10px] text-text-muted mb-3">
            Inferred taxonomy based on contextual feature rules
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid stroke="#1A374F" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="#5A7588" fontSize={10} fontFamily="JetBrains Mono" />
                <YAxis dataKey="name" type="category" stroke="#8EA6B6" fontSize={10} width={90} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0E2438',
                    borderColor: '#1A374F',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                    color: '#EAF4F7'
                  }}
                />
                <Bar dataKey="count" fill="#19C7D8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Priority Distribution */}
        <div className="bg-bg-panel border border-border-subtle rounded p-4 flex flex-col">
          <div className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
            2. PRIORITY LEVEL DISTRIBUTION
          </div>
          <div className="text-[10px] text-text-muted mb-3">
            5-factor operational triage weighting (Thermal + Anomaly + Persistence)
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0E2438',
                    borderColor: '#1A374F',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                    color: '#EAF4F7'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 text-[10px] text-text-muted mt-2">
            {priorityData.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span>{p.name}: {p.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Anomaly Ratio vs Peak FRP */}
        <div className="bg-bg-panel border border-border-subtle rounded p-4 flex flex-col">
          <div className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
            3. ANOMALY RATIO VS PEAK FRP
          </div>
          <div className="text-[10px] text-text-muted mb-3">
            Identifies outliers exhibiting extreme deviation from baseline
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: -15, bottom: 5 }}>
                <CartesianGrid stroke="#1A374F" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="frp"
                  name="Peak FRP"
                  unit=" MW"
                  stroke="#5A7588"
                  fontSize={10}
                  fontFamily="JetBrains Mono"
                />
                <YAxis
                  type="number"
                  dataKey="anomaly"
                  name="Anomaly Ratio"
                  unit="×"
                  stroke="#5A7588"
                  fontSize={10}
                  fontFamily="JetBrains Mono"
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: '#0E2438',
                    borderColor: '#1A374F',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                    color: '#EAF4F7'
                  }}
                />
                <Scatter name="Events" data={scatterData} fill="#FF9F1C" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Anomalous Events Table */}
      <div className="bg-bg-panel border border-border-subtle rounded p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-text-primary uppercase tracking-wider">
            TOP ANOMALOUS INVESTIGATION LEADS
          </div>
          <span className="text-[10px] text-cyan">RANKED BY ANOMALY RATIO</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-text-dim uppercase border-b border-border-subtle">
              <tr>
                <th className="py-2 px-3">Event</th>
                <th className="py-2 px-3">Anomaly Ratio</th>
                <th className="py-2 px-3">Peak / Baseline</th>
                <th className="py-2 px-3">Probable Source</th>
                <th className="py-2 px-3">Priority</th>
                <th className="py-2 px-3">Facility Distance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40">
              {events
                .sort((a, b) => b.anomaly_ratio - a.anomaly_ratio)
                .slice(0, 5)
                .map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => onSelectEventId(e.id)}
                    className="hover:bg-bg-hover cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-bold text-text-primary">{e.id}</td>
                    <td className="py-2.5 px-3 font-bold text-critical">{e.anomaly_ratio}×</td>
                    <td className="py-2.5 px-3 text-text-muted">{e.peak_frp} MW / {e.baseline_frp} MW</td>
                    <td className="py-2.5 px-3 text-cyan">{e.probable_source}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${e.priority_level === 'CRITICAL' ? 'bg-critical/20 text-critical border border-critical/50' : 'bg-warning/20 text-warning border border-warning/50'}`}>
                        {e.priority_level}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-text-muted">{e.facility_distance_km} km ({e.nearest_facility})</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
