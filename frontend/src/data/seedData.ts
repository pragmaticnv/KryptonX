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
    nearest_facility: "Reliance Jamnagar Complex & Petrochemicals",
    facility_type: "Petrochemical Refining Complex",
    facility_distance_km: 0.8,
    land_cover: "Built-up / Industrial",
    status: "REVIEW",
    evidence: [
      "3.71× above historical baseline",
      "FRP rising steadily across 6 satellite passes",
      "0.8 km from primary petrochemical storage unit",
      "Continuous elevated thermal signature for 5.25 hours"
    ],
    evidence_items: [
      { type: "baseline", label: "3.71× above historical baseline", weight: "high" },
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
      nearest_facility: "Reliance Jamnagar Complex & Petrochemicals",
      facility_type: "Petrochemical Refining Complex",
      facility_distance_km: 0.8,
      land_cover: "Built-up / Industrial",
      transport_access: "State Highway 27 access (1.1 km)",
      demographic_exposure: "Industrial cluster periphery, medium exposure"
    },
    caveats: [
      "Thermal observations alone do not confirm source type.",
      "Classification represents evidence-weighted probable source, not ground-truth confirmation."
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
    nearest_facility: "Vatva GIDC Chemical Processing Cluster",
    facility_type: "Industrial Facility",
    facility_distance_km: 0.4,
    land_cover: "Built-up / Industrial",
    status: "MONITOR",
    evidence: [
      "FRP remains close to historical baseline",
      "Repeated thermal observations at same location",
      "0.4 km from industrial chemical intermediate plant"
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
      nearest_facility: "Vatva GIDC Chemical Processing Cluster",
      facility_type: "Industrial Facility",
      facility_distance_km: 0.4,
      land_cover: "Built-up / Industrial",
      transport_access: "Internal industrial arterial route",
      demographic_exposure: "Controlled access industrial park"
    },
    caveats: [
      "Repeated thermal activity is present, but current behaviour remains close to historical baseline."
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
    land_cover: "Agricultural Cropland",
    status: "REVIEW",
    evidence: [
      "Short persistence (<1.5 h)",
      "Agricultural land-cover context",
      "No nearby industrial facility within 8 km"
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
    id: "EVT-3190",
    lat: 24.18,
    lon: 82.68,
    first_seen: "2026-09-06T14:15:00Z",
    last_seen: "2026-09-06T21:25:00Z",
    observation_count: 11,
    peak_frp: 56.4,
    mean_frp: 38.8,
    persistence_hours: 7.2,
    probable_source: "Industrial Fire Candidate",
    confidence: 0.94,
    baseline_frp: 16.5,
    anomaly_ratio: 3.42,
    anomaly_score: 89.0,
    exposure_score: 81.0,
    industrial_relevance: 96.0,
    priority_score: 93.0,
    priority_level: "CRITICAL",
    nearest_facility: "NTPC Singrauli Super Thermal Power Station",
    facility_type: "Coal-Fired Mega Power Station",
    facility_distance_km: 0.6,
    land_cover: "Industrial Energy Infrastructure",
    status: "ESCALATED",
    evidence: [
      "3.42× spike above historical baseline",
      "Concentrated intense emission in coal yard buffer zone",
      "0.6 km from thermal generating unit",
      "Rising FRP profile detected over 7.2 hours"
    ],
    evidence_items: [
      { type: "baseline", label: "3.42× spike above historical baseline", weight: "high" },
      { type: "facility", label: "0.6 km from thermal power generating unit", weight: "high" },
      { type: "trend", label: "Rising FRP profile reaching 56.4 MW", weight: "high" }
    ],
    timeline: [
      { time: "14:15", frp: 22.1, confidence: 0.86 },
      { time: "16:00", frp: 31.4, confidence: 0.89 },
      { time: "18:10", frp: 44.0, confidence: 0.92 },
      { time: "19:50", frp: 51.2, confidence: 0.94 },
      { time: "21:25", frp: 56.4, confidence: 0.95 }
    ],
    probabilities: [
      { category: "Industrial Fire Candidate", probability: 0.94 },
      { category: "Persistent Industrial Thermal Source", probability: 0.04 },
      { category: "Other / Unclassified", probability: 0.02 }
    ],
    priority_breakdown: {
      thermal_severity: 98.0,
      anomaly_score: 89.0,
      persistence_score: 72.0,
      exposure_score: 81.0,
      industrial_relevance: 96.0
    },
    context: {
      nearest_facility: "NTPC Singrauli Super Thermal Power Station",
      facility_type: "Coal-Fired Mega Power Station",
      facility_distance_km: 0.6,
      land_cover: "Industrial Energy Infrastructure",
      transport_access: "Dedicated coal freight railway siding",
      demographic_exposure: "Industrial township periphery"
    },
    caveats: [
      "Coal stockpile self-heating requiring active emergency cooling."
    ]
  },
  {
    id: "EVT-2041",
    lat: 17.65,
    lon: 83.18,
    first_seen: "2026-09-06T15:20:00Z",
    last_seen: "2026-09-06T20:00:00Z",
    observation_count: 8,
    peak_frp: 38.6,
    mean_frp: 27.3,
    persistence_hours: 4.67,
    probable_source: "Gas Flare Candidate",
    confidence: 0.87,
    baseline_frp: 14.2,
    anomaly_ratio: 2.72,
    anomaly_score: 74.0,
    exposure_score: 78.0,
    industrial_relevance: 93.0,
    priority_score: 84.0,
    priority_level: "HIGH",
    nearest_facility: "RINL Visakhapatnam Integrated Steel Plant",
    facility_type: "Metallurgical Works & Blast Furnace",
    facility_distance_km: 0.5,
    land_cover: "Heavy Industrial / Port",
    status: "REVIEW",
    evidence: [
      "2.72× elevated blast furnace flare excursion",
      "High thermal contrast over coastal steelworks",
      "0.5 km from primary coking battery stack"
    ],
    evidence_items: [
      { type: "baseline", label: "2.72× blast furnace flare excursion", weight: "high" },
      { type: "facility", label: "0.5 km from blast furnace battery", weight: "high" }
    ],
    timeline: [
      { time: "15:20", frp: 18.5, confidence: 0.81 },
      { time: "17:15", frp: 26.2, confidence: 0.85 },
      { time: "18:40", frp: 34.0, confidence: 0.87 },
      { time: "20:00", frp: 38.6, confidence: 0.87 }
    ],
    probabilities: [
      { category: "Gas Flare Candidate", probability: 0.87 },
      { category: "Persistent Industrial Thermal Source", probability: 0.09 },
      { category: "Industrial Fire Candidate", probability: 0.04 }
    ],
    priority_breakdown: {
      thermal_severity: 77.2,
      anomaly_score: 74.0,
      persistence_score: 46.7,
      exposure_score: 78.0,
      industrial_relevance: 93.0
    },
    context: {
      nearest_facility: "RINL Visakhapatnam Integrated Steel Plant",
      facility_type: "Metallurgical Works & Blast Furnace",
      facility_distance_km: 0.5,
      land_cover: "Heavy Industrial / Port",
      transport_access: "Port arterial rail link",
      demographic_exposure: "Industrial coastal buffer zone"
    },
    caveats: [
      "Intermittent flare event above normal operating threshold."
    ]
  },
  {
    id: "EVT-1405",
    lat: 23.75,
    lon: 86.42,
    first_seen: "2026-09-06T06:30:00Z",
    last_seen: "2026-09-06T21:00:00Z",
    observation_count: 16,
    peak_frp: 35.2,
    mean_frp: 26.4,
    persistence_hours: 14.5,
    probable_source: "Industrial Fire Candidate",
    confidence: 0.89,
    baseline_frp: 15.0,
    anomaly_ratio: 2.35,
    anomaly_score: 68.0,
    exposure_score: 75.0,
    industrial_relevance: 88.0,
    priority_score: 79.0,
    priority_level: "HIGH",
    nearest_facility: "BCCL Coal Washery & Extraction Facility",
    facility_type: "Coal Processing Complex",
    facility_distance_km: 0.7,
    land_cover: "Open Cast Coal Mining Area",
    status: "MONITOR",
    evidence: [
      "Continuous 14.5-hour subsurface combustion signature",
      "2.35× baseline anomaly in Jharia coal belt",
      "0.7 km from coal handling and conveyor network"
    ],
    evidence_items: [
      { type: "persistence", label: "14.5 hours continuous combustion", weight: "high" },
      { type: "baseline", label: "2.35× elevated baseline in coalfield", weight: "high" }
    ],
    timeline: [
      { time: "06:30", frp: 22.0, confidence: 0.84 },
      { time: "11:45", frp: 27.1, confidence: 0.87 },
      { time: "16:20", frp: 31.8, confidence: 0.88 },
      { time: "21:00", frp: 35.2, confidence: 0.89 }
    ],
    probabilities: [
      { category: "Industrial Fire Candidate", probability: 0.89 },
      { category: "Persistent Industrial Thermal Source", probability: 0.08 },
      { category: "Other / Unclassified", probability: 0.03 }
    ],
    priority_breakdown: {
      thermal_severity: 70.4,
      anomaly_score: 68.0,
      persistence_score: 100.0,
      exposure_score: 75.0,
      industrial_relevance: 88.0
    },
    context: {
      nearest_facility: "BCCL Coal Washery & Extraction Facility",
      facility_type: "Coal Processing Complex",
      facility_distance_km: 0.7,
      land_cover: "Open Cast Coal Mining Area",
      transport_access: "Mining haul road",
      demographic_exposure: "Mining township settlement"
    },
    caveats: [
      "Jharia coalfield subterranean thermal plume migration."
    ]
  },
  {
    id: "EVT-2219",
    lat: 29.39,
    lon: 76.97,
    first_seen: "2026-09-06T17:50:00Z",
    last_seen: "2026-09-06T21:00:00Z",
    observation_count: 7,
    peak_frp: 28.4,
    mean_frp: 21.0,
    persistence_hours: 3.17,
    probable_source: "Gas Flare Candidate",
    confidence: 0.85,
    baseline_frp: 15.1,
    anomaly_ratio: 1.88,
    anomaly_score: 45.0,
    exposure_score: 67.0,
    industrial_relevance: 92.0,
    priority_score: 58.0,
    priority_level: "MODERATE",
    nearest_facility: "IOCL Panipat Mega Refinery & Naphtha Cracker",
    facility_type: "Refinery Flare Installation",
    facility_distance_km: 0.9,
    land_cover: "Petrochemical Infrastructure",
    status: "REVIEW",
    evidence: [
      "1.88× baseline flaring excursion",
      "Located 0.9 km from refinery process units",
      "Thermal output stabilized after 3 hours"
    ],
    evidence_items: [
      { type: "baseline", label: "1.88× flaring excursion", weight: "high" },
      { type: "facility", label: "0.9 km from refinery process units", weight: "medium" }
    ],
    timeline: [
      { time: "17:50", frp: 16.4, confidence: 0.80 },
      { time: "19:30", frp: 28.4, confidence: 0.85 },
      { time: "21:00", frp: 22.8, confidence: 0.84 }
    ],
    probabilities: [
      { category: "Gas Flare Candidate", probability: 0.85 },
      { category: "Persistent Industrial Thermal Source", probability: 0.11 },
      { category: "Industrial Fire Candidate", probability: 0.04 }
    ],
    priority_breakdown: {
      thermal_severity: 56.8,
      anomaly_score: 45.0,
      persistence_score: 31.7,
      exposure_score: 67.0,
      industrial_relevance: 92.0
    },
    context: {
      nearest_facility: "IOCL Panipat Mega Refinery & Naphtha Cracker",
      facility_type: "Refinery Flare Installation",
      facility_distance_km: 0.9,
      land_cover: "Petrochemical Infrastructure",
      transport_access: "National Highway 44 proximity",
      demographic_exposure: "Industrial safety greenbelt"
    },
    caveats: [
      "Safety flare depressurization during routine unit transfer."
    ]
  },
  {
    id: "EVT-0842",
    lat: 15.22,
    lon: 76.65,
    first_seen: "2026-09-06T12:00:00Z",
    last_seen: "2026-09-06T20:00:00Z",
    observation_count: 10,
    peak_frp: 14.8,
    mean_frp: 13.5,
    persistence_hours: 8.0,
    probable_source: "Persistent Industrial Thermal Source",
    confidence: 0.92,
    baseline_frp: 15.0,
    anomaly_ratio: 0.99,
    anomaly_score: 12.0,
    exposure_score: 38.0,
    industrial_relevance: 86.0,
    priority_score: 24.0,
    priority_level: "LOW",
    nearest_facility: "JSW Vijayanagar Integrated Steel Complex",
    facility_type: "Slag Disposal Yard",
    facility_distance_km: 0.4,
    land_cover: "Industrial Heavy Manufacturing",
    status: "MONITOR",
    evidence: [
      "FRP precisely matches historical median (0.99×)",
      "Known operational slag cooling and dumping zone",
      "Zero rapid temperature excursions observed"
    ],
    evidence_items: [
      { type: "baseline", label: "FRP matches historical baseline (0.99×)", weight: "high" },
      { type: "facility", label: "0.4 km from slag disposal yard", weight: "medium" }
    ],
    timeline: [
      { time: "12:00", frp: 13.1, confidence: 0.89 },
      { time: "15:30", frp: 14.8, confidence: 0.92 },
      { time: "20:00", frp: 13.9, confidence: 0.91 }
    ],
    probabilities: [
      { category: "Persistent Industrial Thermal Source", probability: 0.92 },
      { category: "Gas Flare Candidate", probability: 0.05 },
      { category: "Industrial Fire Candidate", probability: 0.03 }
    ],
    priority_breakdown: {
      thermal_severity: 29.6,
      anomaly_score: 12.0,
      persistence_score: 80.0,
      exposure_score: 38.0,
      industrial_relevance: 86.0
    },
    context: {
      nearest_facility: "JSW Vijayanagar Integrated Steel Complex",
      facility_type: "Slag Disposal Yard",
      facility_distance_km: 0.4,
      land_cover: "Industrial Heavy Manufacturing",
      transport_access: "Dedicated industrial rail network",
      demographic_exposure: "Enclosed heavy industrial compound"
    },
    caveats: [
      "Standard industrial thermal emission with zero anomaly escalation."
    ]
  }
];

export const DEFAULT_ANALYTICS: AnalyticsSummary = {
  observations: 48,
  events: 8,
  industrial_candidates: 7,
  high_critical: 4,
  by_source: {
    "Industrial Fire Candidate": 3,
    "Persistent Industrial Thermal Source": 2,
    "Gas Flare Candidate": 2,
    "Agricultural Burning Candidate": 1
  },
  by_priority: {
    "CRITICAL": 2,
    "HIGH": 2,
    "MODERATE": 3,
    "LOW": 1
  },
  avg_persistence_hours: 6.0,
  peak_frp_max: 56.4
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
