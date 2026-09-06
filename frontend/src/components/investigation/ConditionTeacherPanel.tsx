import React, { useState } from 'react';
import { 
  AlertTriangle, Flame, ShieldAlert, CheckCircle2, 
  HelpCircle, ChevronDown, ChevronUp, BookOpen, Sparkles
} from 'lucide-react';
import { EventDetail } from '../../types/event';

interface ConditionTeacherPanelProps {
  event: EventDetail;
}

interface ConditionKnowledge {
  title: string;
  tagline: string;
  colorName: string;
  themeColor: string;
  bgTint: string;
  borderColor: string;
  icon: React.ReactNode;
  teachingSummary: string;
  keyHeuristics: { label: string; value: string }[];
  protocol: string;
}

export const ConditionTeacherPanel: React.FC<ConditionTeacherPanelProps> = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Derive knowledge and teaching narrative based on event priority and classification
  const getConditionKnowledge = (): ConditionKnowledge => {
    if (event.priority_level === 'CRITICAL') {
      return {
        title: 'CRITICAL INDUSTRIAL FIRE CANDIDATE',
        tagline: 'Severe Thermal Anomaly (> 2.5× Site Baseline) with Rising Trend',
        colorName: 'Crimson Red Dot',
        themeColor: '#FF4D4D',
        bgTint: 'rgba(255, 77, 77, 0.12)',
        borderColor: 'rgba(255, 77, 77, 0.5)',
        icon: <ShieldAlert className="w-5 h-5 text-critical animate-pulse" />,
        teachingSummary: 
          'Standard NASA FIRMS satellite data only detects raw thermal hotspots. It cannot distinguish between a routine furnace and a factory fire. KryptonX baseline intelligence detected that this site is emitting ' + 
          `${event.anomaly_ratio}× more thermal power than its multi-month median baseline (${event.baseline_frp} MW), and Fire Radiative Power is escalating across consecutive satellite passes within ${event.facility_distance_km} km of ${event.nearest_facility}. This triggers immediate Tier-1 emergency escalation.`,
        keyHeuristics: [
          { label: 'Baseline Deviation', value: `${event.anomaly_ratio}× above median (${event.peak_frp} vs ${event.baseline_frp} MW)` },
          { label: 'Thermal Trajectory', value: 'Rising FRP across satellite passes (Active Combustion)' },
          { label: 'Spatial Proximity', value: `${event.facility_distance_km} km to ${event.facility_type}` },
          { label: 'Land-Cover Class', value: event.land_cover }
        ],
        protocol: 'IMMEDIATE ACTION: Dispatch automated alert to district emergency response and industrial safety officer for field/optical verification.'
      };
    }

    if (event.priority_level === 'HIGH') {
      return {
        title: 'HIGH RISK THERMAL EXCURSION',
        tagline: 'Elevated Industrial Combustion (2.0× – 2.8× Baseline) or Subsurface Seam Fire',
        colorName: 'Vivid Orange Dot',
        themeColor: '#FF9F1C',
        bgTint: 'rgba(255, 159, 28, 0.12)',
        borderColor: 'rgba(255, 159, 28, 0.5)',
        icon: <Flame className="w-5 h-5 text-warning" />,
        teachingSummary: 
          'This condition indicates an abnormal high-heat operational event such as an unannounced flare stack depressurization, blast furnace surge, or deep coal seam combustion. While not yet an uncontained structure fire, the thermal output is ' + 
          `${event.anomaly_ratio}× above baseline, sustained over ${event.persistence_hours} hours.`,
        keyHeuristics: [
          { label: 'Baseline Deviation', value: `${event.anomaly_ratio}× above site baseline` },
          { label: 'Sustained Duration', value: `${event.persistence_hours} hours continuous thermal emission` },
          { label: 'Facility Context', value: `${event.facility_distance_km} km from ${event.nearest_facility}` },
          { label: 'Source Inference', value: event.probable_source }
        ],
        protocol: 'ALERT: Notify plant operations engineering to confirm flare control valve status or check open-cast coal yard.'
      };
    }

    if (event.priority_level === 'MODERATE') {
      const isAgri = event.probable_source.toLowerCase().includes('agricultural');
      if (isAgri) {
        return {
          title: 'AGRICULTURAL RESIDUE BURNING',
          tagline: 'Open Cropland Biomass Burn (Isolated from Industrial Infrastructure)',
          colorName: 'Electric Blue Dot',
          themeColor: '#4DA3FF',
          bgTint: 'rgba(77, 163, 255, 0.12)',
          borderColor: 'rgba(77, 163, 255, 0.5)',
          icon: <AlertTriangle className="w-5 h-5 text-kxblue" />,
          teachingSummary: 
            'Conventional alerting systems often mistakenly flag crop stubble burning as industrial fires. KryptonX fused ESA WorldCover 10m land-cover data (classified as open agricultural cropland) and calculated distance to nearest industrial facility (' + 
            `${event.facility_distance_km} km). Because this short-lived burn (${event.persistence_hours}h) is in farmland with no industrial assets, it is safely deprioritized from emergency channels.`,
          keyHeuristics: [
            { label: 'Land-Cover Context', value: 'Agricultural / Crop Residue (ESA WorldCover)' },
            { label: 'Infrastructure Distance', value: `${event.facility_distance_km} km isolated from industrial grid` },
            { label: 'Temporal Signature', value: `Short burning duration (${event.persistence_hours} h)` },
            { label: 'Classification', value: 'Crop Biomass Burning (Non-Industrial)' }
          ],
          protocol: 'ROUTINE LOG: Record in regional air-quality and biomass emission ledger. No industrial emergency required.'
        };
      }

      return {
        title: 'PERSISTENT INDUSTRIAL THERMAL SOURCE',
        tagline: 'Normal Operational Heat Signature (Close to Historical Baseline ~1.0×)',
        colorName: 'Cobalt Blue Dot',
        themeColor: '#4DA3FF',
        bgTint: 'rgba(77, 163, 255, 0.12)',
        borderColor: 'rgba(77, 163, 255, 0.5)',
        icon: <CheckCircle2 className="w-5 h-5 text-kxblue" />,
        teachingSummary: 
          'Refineries, chemical plants, and glass factories emit constant thermal radiation. Without baseline intelligence, these trigger thousands of false fire alarms every week. KryptonX baseline engine recognized that this site\'s current FRP (' + 
          `${event.peak_frp} MW) closely matches its multi-month operating baseline (${event.baseline_frp} MW, ratio ${event.anomaly_ratio}×). It is categorized as normal continuous operation.`,
        keyHeuristics: [
          { label: 'Historical Ratio', value: `${event.anomaly_ratio}× (Normal operational envelope)` },
          { label: 'Persistence', value: `${event.persistence_hours} hours continuous operation` },
          { label: 'Facility Link', value: `${event.facility_distance_km} km from ${event.nearest_facility}` },
          { label: 'False Alarm Filter', value: 'Suppressed from emergency dispatch' }
        ],
        protocol: 'MONITORING ONLY: Background continuous logging. Status set to MONITOR to avoid alert fatigue.'
      };
    }

    // Default: LOW
    return {
      title: 'ROUTINE INDUSTRIAL BASELINE',
      tagline: 'Normal Heat Dissipation / Slag Cooling / Low-Intensity Operations',
      colorName: 'Electric Cyan Dot',
      themeColor: '#19C7D8',
      bgTint: 'rgba(25, 199, 216, 0.12)',
      borderColor: 'rgba(25, 199, 216, 0.5)',
      icon: <CheckCircle2 className="w-5 h-5 text-cyan" />,
      teachingSummary: 
        'This site exhibits low-intensity thermal radiation consistent with standard cooling yards or routine heat dissipation. Current FRP is ' + 
        `${event.anomaly_ratio}× of baseline (no temperature surge). Zero intervention required.`,
      keyHeuristics: [
        { label: 'Baseline Ratio', value: `${event.anomaly_ratio}× (Sub-baseline or normal)` },
        { label: 'Thermal Intensity', value: `${event.peak_frp} MW (Low)` },
        { label: 'Hazard Classification', value: 'Low Priority / Routine Facility' }
      ],
      protocol: 'AUTO-ARCHIVED: Stored in baseline telemetry registry.'
    };
  };

  const knowledge = getConditionKnowledge();

  return (
    <div 
      className="rounded-md border p-3.5 space-y-2.5 transition-all shadow-xl font-mono select-none"
      style={{ 
        backgroundColor: knowledge.bgTint, 
        borderColor: knowledge.borderColor 
      }}
    >
      {/* Header with Color Identity and Teaching Trigger */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-start justify-between cursor-pointer gap-2"
      >
        <div className="flex items-center gap-2.5">
          <div 
            className="w-8 h-8 rounded-md flex items-center justify-center border shadow-inner"
            style={{ 
              backgroundColor: 'rgba(10, 25, 41, 0.85)', 
              borderColor: knowledge.themeColor 
            }}
          >
            {knowledge.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border"
                style={{ 
                  backgroundColor: `${knowledge.themeColor}25`, 
                  color: knowledge.themeColor,
                  borderColor: knowledge.themeColor 
                }}
              >
                ● {knowledge.colorName}
              </span>
              <span className="text-[10px] text-text-dim flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan" />
                <span>CONDITION TEACHER</span>
              </span>
            </div>
            <h3 className="text-xs font-bold text-text-primary mt-0.5 tracking-wide">
              {knowledge.title}
            </h3>
          </div>
        </div>

        <button 
          className="p-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors mt-1"
          title={isExpanded ? "Collapse Guide" : "Expand Guide"}
        >
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="text-[10.5px] text-text-muted font-sans font-medium leading-relaxed">
        {knowledge.tagline}
      </div>

      {isExpanded && (
        <div className="pt-2 border-t border-border-subtle/60 space-y-2.5 animate-fade-in">
          {/* Why KryptonX Classified This Condition */}
          <div className="bg-bg-panel/90 rounded border border-border-subtle p-2.5 space-y-1.5">
            <div className="text-[10px] font-bold text-cyan flex items-center gap-1.5 uppercase">
              <BookOpen className="w-3 h-3" />
              <span>How AI Differentiates This Condition:</span>
            </div>
            <p className="text-[11px] font-sans text-text-primary/95 leading-relaxed">
              {knowledge.teachingSummary}
            </p>
          </div>

          {/* Core Decision Heuristics Grid */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {knowledge.keyHeuristics.map((h, i) => (
              <div key={i} className="bg-bg-panel/80 rounded p-1.5 border border-border-subtle/70">
                <div className="text-text-dim uppercase text-[9px] truncate">{h.label}:</div>
                <div className="text-text-primary font-bold truncate mt-0.5" title={h.value}>
                  {h.value}
                </div>
              </div>
            ))}
          </div>

          {/* Action Protocol */}
          <div 
            className="p-2 rounded text-[10px] font-bold border flex items-start gap-2"
            style={{ 
              backgroundColor: 'rgba(10, 25, 41, 0.9)', 
              borderColor: `${knowledge.themeColor}60`,
              color: knowledge.themeColor 
            }}
          >
            <span className="shrink-0 mt-0.5">⚡</span>
            <span className="leading-snug">{knowledge.protocol}</span>
          </div>
        </div>
      )}
    </div>
  );
};
