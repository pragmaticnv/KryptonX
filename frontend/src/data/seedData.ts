import { EventDetail, AnalyticsSummary, SourcesStatus } from '../types/event';

export const SEED_EVENTS: EventDetail[] = [
  {
    id: "EVT-1048",
    lat: 22.47,
    lon: 70.07,
    first_seen: "2026-09-06T16:20:00Z",
    last_seen: "2026-09-06T21:35:00Z",
    observation_count: 9,
    peak_frp: 48.2,
    mean_frp: 31.4,
    persistence_hours: 5.25,
    probable_source: "Industrial Fire Candidate",
    confidence: 0.91,
    baseline_frp: 13.0,
    anomaly_ratio: 3.71,
    anomaly_score: 87.0,
    exposure_score: 76.0,
    industrial_relevance: 94.0,
    priority_score: 91.0,
    priority_level: "CRITICAL",
    nearest_facility: "Demo Industrial Facility",
    facility_type: "Industrial Complex",
    facility_distance_km: 0.8,
    land_cover: "Built-up / Industrial",
    status: "REVIEW",
    evidence: [
      "3.7× above historical baseline",
      "FRP rising across recent observations",
      "0.8 km from industrial facility",
      "Persistent activity over 5.25 hours"
    ],
    evidence_items: [
      { type: "baseline", label: "3.7× above historical baseline", weight: "high" },
      { type: "trend", label: "FRP rising across recent observations", weight: "high" },
      { type: "facility", label: "0.8 km from industrial facility", weight: "medium" },
      { type: "persistence", label: "Persistent activity over 5.25 hours", weight: "medium" }
    ],
    timeline: [
      { time: "16:20", frp: 18.1, confidence: 0.83 },
      { time: "17:05", frp: 21.6, confidence: 0.85 },
      { time: "18:00", frp: 25.4, confidence: 0.87 },
      { time: "19:10", frp: 31.0, confidence: 0.89 },
      { time: "20:20", frp: 39.7, confidence: 0.90 },
      { time: "21:35", frp: 48.2, confidence: 0.91 }
    ],
    probabilities: [
      { category: "Industrial Fire Candidate", probability: 0.91 },
      { category: "Gas Flare Candidate", probability: 0.04 },
      { category: "Persistent Industrial Thermal Source", probability: 0.02 },
      { category: "Wildfire / Natural Fire Candidate", probability: 0.01 },
      { category: "Agricultural Burning Candidate", probability: 0.01 },
      { category: "Other / Unclassified", probability: 0.01 }
    ],
    priority_breakdown: {
      thermal_severity: 96.4,
      anomaly_score: 87.0,
      persistence_score: 52.5,
      exposure_score: 76.0,
      industrial_relevance: 94.0
    },
    context: {
      nearest_facility: "Demo Industrial Facility",
      facility_type: "Industrial Complex",
      facility_distance_km: 0.8,
      land_cover: "Built-up / Industrial",
      transport_access: "State Highway 27 access (1.1 km)",
      demographic_exposure: "Industrial cluster periphery, medium exposure"
    },
    caveats: [
      "Thermal observations alone do not confirm source type.",
      "Classification represents evidence-weighted probable source, not ground-truth confirmation.",
      "Prototype heuristics based on spatiotemporal cluster analysis."
    ]
  },
  {
    id: "EVT-0921",
    lat: 23.02,
    lon: 72.54,
    first_seen: "2026-09-06T10:15:00Z",
    last_seen: "2026-09-06T20:15:00Z",
    observation_count: 14,
    peak_frp: 19.8,
    mean_frp: 16.9,
    persistence_hours: 10.0,
    probable_source: "Persistent Industrial Thermal Source",
    confidence: 0.88,
    baseline_frp: 18.2,
    anomaly_ratio: 1.09,
    anomaly_score: 18.0,
    exposure_score: 58.0,
    industrial_relevance: 91.0,
    priority_score: 42.0,
    priority_level: "MODERATE",
    nearest_facility: "Demo Processing Facility",
    facility_type: "Industrial Facility",
    facility_distance_km: 0.4,
    land_cover: "Built-up / Industrial",
    status: "MONITOR",
    evidence: [
      "FRP remains close to historical baseline",
      "Repeated thermal observations at same location",
      "0.4 km from industrial facility"
    ],
    evidence_items: [
      { type: "baseline", label: "FRP matches historical baseline (1.09×)", weight: "high" },
      { type: "persistence", label: "Repeated thermal observations at same site", weight: "high" },
      { type: "facility", label: "0.4 km from industrial processing facility", weight: "medium" }
    ],
    timeline: [
      { time: "10:15", frp: 17.8, confidence: 0.85 },
      { time: "13:00", frp: 18.4, confidence: 0.88 },
      { time: "16:30", frp: 17.2, confidence: 0.86 },
      { time: "20:15", frp: 19.8, confidence: 0.88 }
    ],
    probabilities: [
      { category: "Persistent Industrial Thermal Source", probability: 0.88 },
      { category: "Gas Flare Candidate", probability: 0.08 },
      { category: "Industrial Fire Candidate", probability: 0.02 },
      { category: "Other / Unclassified", probability: 0.02 }
    ],
    priority_breakdown: {
      thermal_severity: 39.6,
      anomaly_score: 18.0,
      persistence_score: 100.0,
      exposure_score: 58.0,
      industrial_relevance: 91.0
    },
    context: {
      nearest_facility: "Demo Processing Facility",
      facility_type: "Industrial Facility",
      facility_distance_km: 0.4,
      land_cover: "Built-up / Industrial",
      transport_access: "Internal industrial arterial route",
      demographic_exposure: "Controlled access industrial park"
    },
    caveats: [
      "Repeated thermal activity is present, but current behaviour remains close to historical baseline.",
      "Persistence alone does not indicate an industrial fire event."
    ]
  },
  {
    id: "EVT-1182",
    lat: 21.14,
    lon: 79.08,
    first_seen: "2026-09-06T13:40:00Z",
    last_seen: "2026-09-06T15:05:00Z",
    observation_count: 5,
    peak_frp: 22.6,
    mean_frp: 15.2,
    persistence_hours: 1.42,
    probable_source: "Agricultural Burning Candidate",
    confidence: 0.79,
    baseline_frp: 14.7,
    anomaly_ratio: 1.54,
    anomaly_score: 39.0,
    exposure_score: 29.0,
    industrial_relevance: 12.0,
    priority_score: 27.0,
    priority_level: "MODERATE",
    nearest_facility: "No relevant industrial facility",
    facility_type: "None",
    facility_distance_km: 8.6,
    land_cover: "Agricultural",
    status: "REVIEW",
    evidence: [
      "Short persistence",
      "Agricultural land-cover context",
      "No nearby industrial facility"
    ],
    evidence_items: [
      { type: "persistence", label: "Short persistence (<1.5 h)", weight: "medium" },
      { type: "landcover", label: "Agricultural land-cover context", weight: "high" },
      { type: "facility", label: "8.6 km from nearest industrial facility", weight: "high" }
    ],
    timeline: [
      { time: "13:40", frp: 10.5, confidence: 0.75 },
      { time: "14:10", frp: 17.2, confidence: 0.78 },
      { time: "15:05", frp: 22.6, confidence: 0.79 }
    ],
    probabilities: [
      { category: "Agricultural Burning Candidate", probability: 0.79 },
      { category: "Wildfire / Natural Fire Candidate", probability: 0.15 },
      { category: "Other / Unclassified", probability: 0.04 },
      { category: "Industrial Fire Candidate", probability: 0.02 }
    ],
    priority_breakdown: {
      thermal_severity: 45.2,
      anomaly_score: 39.0,
      persistence_score: 14.2,
      exposure_score: 29.0,
      industrial_relevance: 12.0
    },
    context: {
      nearest_facility: "None (< 8 km)",
      facility_type: "Rural Farmland",
      facility_distance_km: 8.6,
      land_cover: "Agricultural Cropland",
      transport_access: "Rural link road",
      demographic_exposure: "Dispersed rural settlement"
    },
    caveats: [
      "Agricultural burning candidate based on open cropland land-cover and absence of industrial infrastructure."
    ]
  },
  {
    id: "EVT-1065",
    lat: 22.18,
    lon: 70.32,
    first_seen: "2026-09-06T18:10:00Z",
    last_seen: "2026-09-06T21:00:00Z",
    observation_count: 6,
    peak_frp: 34.5,
    mean_frp: 28.1,
    persistence_hours: 2.83,
    probable_source: "Gas Flare Candidate",
    confidence: 0.84,
    baseline_frp: 29.0,
    anomaly_ratio: 1.19,
    anomaly_score: 22.0,
    exposure_score: 62.0,
    industrial_relevance: 88.0,
    priority_score: 48.0,
    priority_level: "MODERATE",
    nearest_facility: "Demo Refinery Complex",
    facility_type: "Refinery Flare Stack",
    facility_distance_km: 0.2,
    land_cover: "Petrochemical Infrastructure",
    status: "MONITOR",
    evidence: [
      "High temperature with regular flaring cycle",
      "0.2 km from designated flare installation",
      "Thermal output consistent with baseline (1.19×)"
    ],
    evidence_items: [
      { type: "facility", label: "0.2 km from refinery stack", weight: "high" },
      { type: "baseline", label: "FRP closely matches operational flaring baseline", weight: "high" }
    ],
    timeline: [
      { time: "18:10", frp: 27.5, confidence: 0.82 },
      { time: "19:30", frp: 34.5, confidence: 0.85 },
      { time: "21:00", frp: 29.2, confidence: 0.84 }
    ],
    probabilities: [
      { category: "Gas Flare Candidate", probability: 0.84 },
      { category: "Persistent Industrial Thermal Source", probability: 0.11 },
      { category: "Industrial Fire Candidate", probability: 0.05 }
    ],
    priority_breakdown: {
      thermal_severity: 69.0,
      anomaly_score: 22.0,
      persistence_score: 28.3,
      exposure_score: 62.0,
      industrial_relevance: 88.0
    },
    context: {
      nearest_facility: "Demo Refinery Complex",
      facility_type: "Refinery Flare Stack",
      facility_distance_km: 0.2,
      land_cover: "Petrochemical Infrastructure",
      transport_access: "Private terminal pipeline",
      demographic_exposure: "Industrial safety buffer zone"
    },
    caveats: [
      "Thermal signature matches typical gas flare emission profile."
    ]
  },
  {
    id: "EVT-1089",
    lat: 23.45,
    lon: 71.12,
    first_seen: "2026-09-06T15:30:00Z",
    last_seen: "2026-09-06T21:15:00Z",
    observation_count: 8,
    peak_frp: 41.0,
    mean_frp: 33.2,
    persistence_hours: 5.75,
    probable_source: "Industrial Fire Candidate",
    confidence: 0.86,
    baseline_frp: 14.5,
    anomaly_ratio: 2.83,
    anomaly_score: 68.0,
    exposure_score: 72.0,
    industrial_relevance: 90.0,
    priority_score: 78.0,
    priority_level: "CRITICAL",
    nearest_facility: "Gujarat Chemical Manufacturing",
    facility_type: "Chemical Processing",
    facility_distance_km: 0.6,
    land_cover: "Industrial / Built-up",
    status: "ESCALATED",
    evidence: [
      "2.83× above historical baseline",
      "Elevated thermal growth rate",
      "0.6 km from chemical production unit"
    ],
    evidence_items: [
      { type: "baseline", label: "2.83× above site median baseline", weight: "high" },
      { type: "facility", label: "0.6 km from chemical plant", weight: "high" },
      { type: "trend", label: "High anomaly in dense manufacturing district", weight: "medium" }
    ],
    timeline: [
      { time: "15:30", frp: 21.0, confidence: 0.80 },
      { time: "17:45", frp: 32.4, confidence: 0.85 },
      { time: "19:20", frp: 38.2, confidence: 0.86 },
      { time: "21:15", frp: 41.0, confidence: 0.87 }
    ],
    probabilities: [
      { category: "Industrial Fire Candidate", probability: 0.86 },
      { category: "Persistent Industrial Thermal Source", probability: 0.08 },
      { category: "Gas Flare Candidate", probability: 0.04 },
      { category: "Other / Unclassified", probability: 0.02 }
    ],
    priority_breakdown: {
      thermal_severity: 82.0,
      anomaly_score: 68.0,
      persistence_score: 57.5,
      exposure_score: 72.0,
      industrial_relevance: 90.0
    },
    context: {
      nearest_facility: "Gujarat Chemical Manufacturing",
      facility_type: "Chemical Processing",
      facility_distance_km: 0.6,
      land_cover: "Industrial / Built-up",
      transport_access: "Industrial freight corridor",
      demographic_exposure: "Industrial workforce concentration"
    },
    caveats: [
      "Thermal surge requires prompt optical or field corroboration."
    ]
  }
];

export const DEFAULT_ANALYTICS: AnalyticsSummary = {
  observations: 1284,
  events: 347,
  industrial_candidates: 42,
  high_critical: 11,
  by_source: {
    "Industrial Fire Candidate": 18,
    "Persistent Industrial Thermal Source": 45,
    "Gas Flare Candidate": 22,
    "Agricultural Burning Candidate": 142,
    "Wildfire / Natural Fire Candidate": 86,
    "Mining / Extraction Candidate": 14,
    "Other / Unclassified": 20
  },
  by_priority: {
    "CRITICAL": 5,
    "HIGH": 16,
    "MODERATE": 184,
    "LOW": 142
  },
  avg_persistence_hours: 4.8,
  peak_frp_max: 48.2
};

export const DEFAULT_SOURCES: SourcesStatus = {
  firms: {
    name: "NASA FIRMS",
    purpose: "Satellite Thermal Anomaly Hotspots (MODIS / VIIRS)",
    mode: "demo",
    status: "demo",
    last_update: "2026-09-06T21:35:00Z",
    details: "VIIRS 375m active thermal sensor feed (Demo mode active)"
  },
  osm: {
    name: "OpenStreetMap / Overpass",
    purpose: "Industrial Facility Infrastructure & Context Fusion",
    mode: "live",
    status: "connected",
    last_update: "2026-09-06T22:00:00Z",
    details: "Overpass API endpoint connected with local caching"
  },
  worldcover: {
    name: "ESA WorldCover",
    purpose: "10m Global Land-Cover Classification (Built-up / Agri / Forest)",
    mode: "demo",
    status: "connected",
    last_update: "2026-09-01T00:00:00Z",
    details: "10m resolution land-cover categorizer"
  },
  historical: {
    name: "KryptonX Baseline Store",
    purpose: "Multi-month Spatiotemporal Median FRP & Anomaly Baselines",
    mode: "seed",
    status: "healthy",
    last_update: "2026-09-06T20:00:00Z",
    details: "Historical persistent thermal site catalog (3.7x detection model)"
  },
  copernicus: {
    name: "Copernicus Sentinel-2",
    purpose: "SWIR Multi-Spectral Satellite Imagery (Phase 2 Integration)",
    mode: "standby",
    status: "standby",
    last_update: undefined,
    details: "High-resolution optical validation scheduled for Phase 2"
  }
};
