import React from 'react';
import { X, ShieldAlert, Radio, ExternalLink } from 'lucide-react';
import { EventDetail } from '../../types/event';
import { ClassificationPanel } from './ClassificationPanel';
import { EvidenceChips } from './EvidenceChips';
import { FrpTimelineChart } from './FrpTimelineChart';
import { BaselineAnomalyPanel } from './BaselineAnomalyPanel';
import { PriorityBreakdownPanel } from './PriorityBreakdownPanel';
import { ContextPanel } from './ContextPanel';
import { AnalystActionBar } from './AnalystActionBar';

interface InvestigationDrawerProps {
  event: EventDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (eventId: string, action: string) => void;
}

export const InvestigationDrawer: React.FC<InvestigationDrawerProps> = ({
  event,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  if (!isOpen || !event) return null;

  const isCritical = event.priority_level === 'CRITICAL';
  const isHigh = event.priority_level === 'HIGH';

  let priorityBadge = 'bg-cyan/15 text-cyan border-cyan/40';
  if (isCritical) priorityBadge = 'bg-critical/20 text-critical border-critical/50 shadow-sm shadow-critical/30 animate-pulse';
  else if (isHigh) priorityBadge = 'bg-warning/20 text-warning border-warning/50';

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] xl:w-[620px] bg-bg-secondary/95 backdrop-blur-md border-l border-border-subtle shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-250 select-none">
      {/* Drawer Header */}
      <div className="p-4 bg-bg-panel border-b border-border-subtle flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan/10 border border-cyan/40 flex items-center justify-center text-cyan">
            <Radio className="w-4 h-4 text-cyan animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-mono font-bold text-text-primary tracking-wide">
                {event.id}
              </h2>
              <span className="px-1.5 py-0.2 text-[9px] font-mono bg-bg-secondary text-text-dim rounded border border-border-subtle">
                DEMO LEAD
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${priorityBadge}`}>
                {event.priority_level}
              </span>
            </div>
            <div className="text-[10px] font-mono text-cyan flex items-center gap-1.5 mt-0.5">
              <span>{event.probable_source}</span>
              <span className="text-text-dim">•</span>
              <span>{Math.round(event.confidence * 100)}% CONFIDENCE</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary border border-border-subtle transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Intelligence Pipeline Breadcrumb */}
      <div className="px-4 py-2 bg-bg-main/80 border-b border-border-subtle flex items-center justify-between text-[9px] font-mono text-text-dim overflow-x-auto">
        <span className="text-cyan font-semibold">DETECTION</span>
        <span>→</span>
        <span className="text-cyan font-semibold">SPATIOTEMPORAL EVENT</span>
        <span>→</span>
        <span className="text-cyan font-semibold">CONTEXT FUSION</span>
        <span>→</span>
        <span className="text-cyan font-semibold">BASELINE DEVIATION</span>
        <span>→</span>
        <span className="text-critical font-bold">PRIORITY LEAD</span>
      </div>

      {/* Scrollable Investigation Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Why Flagged - Hero Visual Evidence */}
        <EvidenceChips
          evidence={event.evidence}
          evidenceItems={event.evidence_items}
        />

        {/* FRP Trajectory Line Chart */}
        <FrpTimelineChart
          timeline={event.timeline}
          baselineFrp={event.baseline_frp}
          peakFrp={event.peak_frp}
        />

        {/* Baseline Anomaly Comparison */}
        <BaselineAnomalyPanel
          peakFrp={event.peak_frp}
          baselineFrp={event.baseline_frp}
          anomalyRatio={event.anomaly_ratio}
          anomalyScore={event.anomaly_score}
        />

        {/* Classification Probabilities */}
        <ClassificationPanel
          probableSource={event.probable_source}
          confidence={event.confidence}
          probabilities={event.probabilities}
        />

        {/* Priority Engine Breakdown */}
        <PriorityBreakdownPanel
          priorityScore={event.priority_score}
          priorityLevel={event.priority_level}
          breakdown={event.priority_breakdown}
        />

        {/* Geospatial / OSM Context */}
        <ContextPanel
          nearestFacility={event.nearest_facility}
          facilityType={event.facility_type}
          facilityDistanceKm={event.facility_distance_km}
          landCover={event.land_cover}
          context={event.context}
        />

        {/* Analyst Triage Actions */}
        <AnalystActionBar
          currentStatus={event.status}
          onAction={(action) => onStatusUpdate(event.id, action)}
        />
      </div>
    </div>
  );
};
