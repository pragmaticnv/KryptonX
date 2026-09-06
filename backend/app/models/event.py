from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ObservationPoint(BaseModel):
    time: str
    frp: float
    confidence: Optional[float] = None
    brightness: Optional[float] = None
    lat: Optional[float] = None
    lon: Optional[float] = None

class EvidenceItem(BaseModel):
    type: str
    label: str
    weight: str = "high"  # low, medium, high

class PriorityBreakdown(BaseModel):
    thermal_severity: float = Field(..., description="Weight 30%")
    anomaly_score: float = Field(..., description="Weight 25%")
    persistence_score: float = Field(..., description="Weight 20%")
    exposure_score: float = Field(..., description="Weight 15%")
    industrial_relevance: float = Field(..., description="Weight 10%")

class ProbabilityItem(BaseModel):
    category: str
    probability: float

class EventSummary(BaseModel):
    id: str
    lat: float
    lon: float
    first_seen: str
    last_seen: str
    observation_count: int = 1
    peak_frp: float
    mean_frp: float
    persistence_hours: float
    probable_source: str
    confidence: float
    baseline_frp: float
    anomaly_ratio: float
    anomaly_score: float
    exposure_score: float = 50.0
    industrial_relevance: float = 50.0
    priority_score: float
    priority_level: str  # LOW, MODERATE, HIGH, CRITICAL
    nearest_facility: str
    facility_type: str = "Industrial Facility"
    facility_distance_km: float
    land_cover: str
    status: str = "REVIEW"  # REVIEW, MONITOR, ESCALATED, CONFIRMED, FALSE_POSITIVE

class EventDetail(EventSummary):
    evidence: List[str] = []
    evidence_items: List[EvidenceItem] = []
    timeline: List[ObservationPoint] = []
    probabilities: List[ProbabilityItem] = []
    priority_breakdown: Optional[PriorityBreakdown] = None
    context: Dict[str, Any] = {}
    caveats: List[str] = [
        "Thermal observations alone do not confirm source type.",
        "Classification represents evidence-weighted probable source, not ground-truth confirmation.",
        "Thresholds and scores are prototype engineering heuristics."
    ]

class AnalyticsSummary(BaseModel):
    observations: int
    events: int
    industrial_candidates: int
    high_critical: int
    by_source: Dict[str, int]
    by_priority: Dict[str, int]
    avg_persistence_hours: float
    peak_frp_max: float

class SourceItemStatus(BaseModel):
    name: str
    purpose: str
    mode: str  # "demo" or "live"
    status: str  # "healthy", "connected", "fallback"
    last_update: Optional[str] = None
    details: Optional[str] = None

class SourcesStatus(BaseModel):
    firms: SourceItemStatus
    osm: SourceItemStatus
    worldcover: SourceItemStatus
    historical: SourceItemStatus
    copernicus: SourceItemStatus

class FeedbackRequest(BaseModel):
    action: str  # review, confirm, false_positive, escalate
    note: Optional[str] = None

class IngestRequest(BaseModel):
    bbox: Optional[List[float]] = [68.0, 8.0, 97.5, 37.0]
    days: Optional[int] = 1
