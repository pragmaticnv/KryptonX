export interface ObservationPoint {
  time: string;
  frp: number;
  confidence?: number;
  brightness?: number;
  lat?: number;
  lon?: number;
}

export interface EvidenceItem {
  type: string;
  label: string;
  weight: 'low' | 'medium' | 'high';
}

export interface PriorityBreakdown {
  thermal_severity: number;
  anomaly_score: number;
  persistence_score: number;
  exposure_score: number;
  industrial_relevance: number;
}

export interface ProbabilityItem {
  category: string;
  probability: number;
}

export interface EventSummary {
  id: string;
  lat: number;
  lon: number;
  first_seen: string;
  last_seen: string;
  observation_count: number;
  peak_frp: number;
  mean_frp: number;
  persistence_hours: number;
  probable_source: string;
  confidence: number;
  baseline_frp: number;
  anomaly_ratio: number;
  anomaly_score: number;
  exposure_score: number;
  industrial_relevance: number;
  priority_score: number;
  priority_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  nearest_facility: string;
  facility_type: string;
  facility_distance_km: number;
  land_cover: string;
  status: 'REVIEW' | 'MONITOR' | 'ESCALATED' | 'CONFIRMED' | 'FALSE_POSITIVE';
}

export interface EventDetail extends EventSummary {
  evidence: string[];
  evidence_items?: EvidenceItem[];
  timeline: ObservationPoint[];
  probabilities: ProbabilityItem[];
  priority_breakdown?: PriorityBreakdown;
  context: {
    nearest_facility?: string;
    facility_type?: string;
    facility_distance_km?: number;
    land_cover?: string;
    transport_access?: string;
    demographic_exposure?: string;
    [key: string]: any;
  };
  caveats: string[];
}

export interface AnalyticsSummary {
  observations: number;
  events: number;
  industrial_candidates: number;
  high_critical: number;
  by_source: Record<string, number>;
  by_priority: Record<string, number>;
  avg_persistence_hours: number;
  peak_frp_max: number;
}

export interface SourceItemStatus {
  name: string;
  purpose: string;
  mode: string;
  status: string;
  last_update?: string;
  details?: string;
}

export interface SourcesStatus {
  firms: SourceItemStatus;
  osm: SourceItemStatus;
  worldcover: SourceItemStatus;
  historical: SourceItemStatus;
  copernicus: SourceItemStatus;
}
