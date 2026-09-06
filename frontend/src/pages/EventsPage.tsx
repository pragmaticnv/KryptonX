import React, { useState, useEffect } from 'react';
import { Flame, Shield, ArrowUpRight, Filter, Search } from 'lucide-react';
import { EventSummary, EventDetail } from '../types/event';
import { ApiService } from '../services/api';
import { InvestigationDrawer } from '../components/investigation/InvestigationDrawer';

interface EventsPageProps {
  onSelectEventId: (id: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onSelectEventId }) => {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<EventDetail | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterText, setFilterText] = useState('');

  const loadEvents = async () => {
    const data = await ApiService.getEvents();
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleRowClick = async (id: string) => {
    onSelectEventId(id);
    const detail = await ApiService.getEventDetail(id);
    setSelectedDetail(detail);
    setIsDrawerOpen(true);
  };

  const filtered = events.filter(
    (e) =>
      e.id.toLowerCase().includes(filterText.toLowerCase()) ||
      e.probable_source.toLowerCase().includes(filterText.toLowerCase()) ||
      e.nearest_facility.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-bg-main p-5 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-text-primary uppercase flex items-center gap-2">
            <Flame className="w-5 h-5 text-cyan" />
            Active Spatiotemporal Thermal Events Catalog
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            DBSCAN spatiotemporal grouped clusters with contextual OSM fusion and anomaly baseline metrics.
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-dim" />
          <input
            type="text"
            placeholder="Filter catalog..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-64 bg-bg-secondary border border-border-subtle rounded pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-dim focus:outline-none focus:border-cyan/50"
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="flex-1 bg-bg-panel border border-border-subtle rounded overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-bg-secondary/90 sticky top-0 border-b border-border-subtle text-[10px] text-text-dim uppercase tracking-wider">
              <tr>
                <th className="p-3">Event ID</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Probable Source</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Peak FRP</th>
                <th className="p-3">Baseline</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Facility Context</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-text-primary">
              {filtered.map((e) => {
                const isCritical = e.priority_level === 'CRITICAL';
                return (
                  <tr
                    key={e.id}
                    onClick={() => handleRowClick(e.id)}
                    className="hover:bg-bg-hover cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-bold text-text-primary flex items-center gap-1.5">
                      <span>{e.id}</span>
                      <span className="text-[9px] bg-bg-secondary px-1 rounded text-text-dim border border-border-subtle">DEMO</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          isCritical
                            ? 'bg-critical/20 text-critical border-critical/50 animate-pulse'
                            : e.priority_level === 'HIGH'
                            ? 'bg-warning/20 text-warning border-warning/50'
                            : 'bg-cyan/15 text-cyan border-cyan/40'
                        }`}
                      >
                        {e.priority_level}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-text-primary">
                      {e.probable_source}
                    </td>
                    <td className="p-3 text-cyan">
                      {Math.round(e.confidence * 100)}%
                    </td>
                    <td className="p-3 font-bold text-warning">
                      {e.peak_frp} MW
                    </td>
                    <td className={`p-3 font-bold ${e.anomaly_ratio > 2.0 ? 'text-critical' : 'text-text-primary'}`}>
                      {e.anomaly_ratio}×
                    </td>
                    <td className="p-3 text-text-muted">
                      {e.persistence_hours} h
                    </td>
                    <td className="p-3 text-text-muted truncate max-w-[180px]">
                      {e.nearest_facility} ({e.facility_distance_km} km)
                    </td>
                    <td className="p-3">
                      <span className={`uppercase text-[10px] font-bold ${e.status === 'ESCALATED' ? 'text-critical' : 'text-warning'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(evt) => {
                          evt.stopPropagation();
                          handleRowClick(e.id);
                        }}
                        className="p-1 rounded bg-cyan/10 text-cyan hover:bg-cyan/20 border border-cyan/30"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <InvestigationDrawer
        event={selectedDetail}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onStatusUpdate={async (id, action) => {
          await ApiService.updateEventStatus(id, action);
          loadEvents();
          const up = await ApiService.getEventDetail(id);
          setSelectedDetail(up);
        }}
      />
    </div>
  );
};
