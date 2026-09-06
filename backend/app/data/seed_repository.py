import os
import json
from typing import List, Optional, Dict, Any
from ..models.event import (
    EventSummary, EventDetail, EvidenceItem, ObservationPoint,
    PriorityBreakdown, ProbabilityItem, AnalyticsSummary, SourcesStatus, SourceItemStatus
)
from ..engines.priority import PriorityEngine
from ..engines.classification import ClassificationEngine, TAXONOMY
from ..engines.baseline import BaselineEngine

SEED_DATA_PATH = os.path.join(os.path.dirname(__file__), "seed_data.json")

class SeedRepository:
    def __init__(self):
        self.events: Dict[str, Dict[str, Any]] = {}
        self.mode = "DEMO_DATA"
        self.load_seed()

    def load_seed(self):
        if os.path.exists(SEED_DATA_PATH):
            with open(SEED_DATA_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.mode = data.get("mode", "DEMO_DATA")
                for evt in data.get("events", []):
                    self.events[evt["id"]] = evt
        
        # Ensure the 3 core demo events are richly configured per spec
        self._ensure_demo_events()

    def _ensure_demo_events(self):
        for e in self.events.values():
            e.setdefault("observation_count", len(e.get("timeline", [])) or 6)
            e.setdefault("confidence", 0.85)
            e.setdefault("status", "REVIEW")

    def get_events(
        self,
        priority: Optional[str] = None,
        source: Optional[str] = None,
        status: Optional[str] = None,
        bbox: Optional[str] = None,
        limit: int = 100
    ) -> List[EventSummary]:
        res = []
        for e in self.events.values():
            if priority and priority.upper() != "ALL":
                if e.get("priority_level", "").upper() != priority.upper():
                    continue
            if source and source.upper() != "ALL":
                if source.lower() not in e.get("probable_source", "").lower():
                    continue
            if status and status.upper() != "ALL":
                if e.get("status", "").upper() != status.upper():
                    continue

            summary = EventSummary(
                id=e["id"],
                lat=e["lat"],
                lon=e["lon"],
                first_seen=e["first_seen"],
                last_seen=e["last_seen"],
                observation_count=e.get("observation_count", len(e.get("timeline", []))),
                peak_frp=e["peak_frp"],
                mean_frp=e["mean_frp"],
                persistence_hours=e["persistence_hours"],
                probable_source=e["probable_source"],
                confidence=e.get("confidence", 0.85),
                baseline_frp=e.get("baseline_frp", 15.0),
                anomaly_ratio=e.get("anomaly_ratio", 1.0),
                anomaly_score=e.get("anomaly_score", 30.0),
                exposure_score=e.get("exposure_score", 50.0),
                industrial_relevance=e.get("industrial_relevance", 50.0),
                priority_score=e.get("priority_score", 50.0),
                priority_level=e.get("priority_level", "MODERATE"),
                nearest_facility=e.get("nearest_facility", "Industrial Facility"),
                facility_type=e.get("facility_type", "Industrial Complex"),
                facility_distance_km=e.get("facility_distance_km", 1.0),
                land_cover=e.get("land_cover", "Industrial / Built-up"),
                status=e.get("status", "REVIEW")
            )
            res.append(summary)

        # Sort by priority score descending
        res.sort(key=lambda x: x.priority_score, reverse=True)
        return res[:limit]

    def get_event_detail(self, event_id: str) -> Optional[EventDetail]:
        e = self.events.get(event_id)
        if not e:
            return None

        # Build probabilities
        top_cat, top_conf, prob_items, _, _ = ClassificationEngine.classify(
            observation_count=e.get("observation_count", len(e.get("timeline", []))),
            peak_frp=e["peak_frp"],
            mean_frp=e["mean_frp"],
            persistence_hours=e["persistence_hours"],
            anomaly_ratio=e.get("anomaly_ratio", 1.0),
            facility_distance_km=e.get("facility_distance_km", 1.0),
            land_cover=e.get("land_cover", "Built-up"),
            frp_trend="rising" if e["id"] == "EVT-1048" else "stable"
        )

        # Build priority breakdown
        _, _, breakdown = PriorityEngine.calculate_priority(
            peak_frp=e["peak_frp"],
            anomaly_score=e.get("anomaly_score", 50.0),
            persistence_hours=e["persistence_hours"],
            exposure_score=e.get("exposure_score", 50.0),
            industrial_relevance=e.get("industrial_relevance", 50.0)
        )

        timeline = [
            ObservationPoint(
                time=item.get("time", ""),
                frp=item.get("frp", 0.0),
                confidence=item.get("confidence", 0.85)
            ) for item in e.get("timeline", [])
        ]

        evidence_list = e.get("evidence", [])
        evidence_items = []
        for ev in evidence_list:
            weight = "high" if ("baseline" in ev.lower() or "rising" in ev.lower()) else "medium"
            ev_type = "baseline" if "baseline" in ev.lower() else ("trend" if "rising" in ev.lower() else "facility")
            evidence_items.append(EvidenceItem(type=ev_type, label=ev, weight=weight))

        context = {
            "nearest_facility": e.get("nearest_facility"),
            "facility_type": e.get("facility_type"),
            "facility_distance_km": e.get("facility_distance_km"),
            "land_cover": e.get("land_cover"),
            "transport_access": "Highway accessible (<1.5 km)",
            "demographic_exposure": "Low immediate residential exposure (<500 pop in 3 km radius)" if e["id"] != "EVT-1048" else "Medium exposure — industrial cluster edge"
        }

        return EventDetail(
            id=e["id"],
            lat=e["lat"],
            lon=e["lon"],
            first_seen=e["first_seen"],
            last_seen=e["last_seen"],
            observation_count=e.get("observation_count", len(timeline)),
            peak_frp=e["peak_frp"],
            mean_frp=e["mean_frp"],
            persistence_hours=e["persistence_hours"],
            probable_source=e["probable_source"],
            confidence=e.get("confidence", top_conf),
            baseline_frp=e.get("baseline_frp", 15.0),
            anomaly_ratio=e.get("anomaly_ratio", 1.0),
            anomaly_score=e.get("anomaly_score", 30.0),
            exposure_score=e.get("exposure_score", 50.0),
            industrial_relevance=e.get("industrial_relevance", 50.0),
            priority_score=e.get("priority_score", 50.0),
            priority_level=e.get("priority_level", "MODERATE"),
            nearest_facility=e.get("nearest_facility", "Industrial Facility"),
            facility_type=e.get("facility_type", "Industrial Complex"),
            facility_distance_km=e.get("facility_distance_km", 1.0),
            land_cover=e.get("land_cover", "Industrial / Built-up"),
            status=e.get("status", "REVIEW"),
            evidence=evidence_list,
            evidence_items=evidence_items,
            timeline=timeline,
            probabilities=prob_items,
            priority_breakdown=breakdown,
            context=context
        )

    def update_status(self, event_id: str, action: str, note: Optional[str] = None) -> bool:
        if event_id not in self.events:
            return False
        action_map = {
            "review": "REVIEW",
            "confirm": "CONFIRMED",
            "false_positive": "FALSE_POSITIVE",
            "escalate": "ESCALATED",
            "monitor": "MONITOR"
        }
        new_status = action_map.get(action.lower(), "REVIEW")
        self.events[event_id]["status"] = new_status
        return True

    def get_analytics(self) -> AnalyticsSummary:
        by_source: Dict[str, int] = {}
        by_priority: Dict[str, int] = {"LOW": 0, "MODERATE": 0, "HIGH": 0, "CRITICAL": 0}
        total_obs = 0
        industrial_candidates = 0
        high_critical = 0
        peak_max = 0.0
        persistence_sum = 0.0

        for e in self.events.values():
            src = e.get("probable_source", "Other")
            by_source[src] = by_source.get(src, 0) + 1

            p_lvl = e.get("priority_level", "MODERATE")
            by_priority[p_lvl] = by_priority.get(p_lvl, 0) + 1

            total_obs += e.get("observation_count", len(e.get("timeline", [])))
            persistence_sum += e.get("persistence_hours", 1.0)
            
            p_frp = e.get("peak_frp", 0.0)
            if p_frp > peak_max:
                peak_max = p_frp

            if "industrial" in src.lower() or "flare" in src.lower():
                industrial_candidates += 1

            if p_lvl in ["HIGH", "CRITICAL"]:
                high_critical += 1

        total_events = len(self.events)
        avg_persist = round(persistence_sum / total_events, 1) if total_events > 0 else 0.0

        return AnalyticsSummary(
            observations=total_obs or 1284,
            events=total_events or 347,
            industrial_candidates=industrial_candidates or 42,
            high_critical=high_critical or 11,
            by_source=by_source,
            by_priority=by_priority,
            avg_persistence_hours=avg_persist,
            peak_frp_max=peak_max
        )

    def get_sources_status(self, firms_mode: str = "demo") -> SourcesStatus:
        return SourcesStatus(
            firms=SourceItemStatus(
                name="NASA FIRMS",
                purpose="Satellite Thermal Anomaly Hotspots (MODIS / VIIRS)",
                mode=firms_mode,
                status="connected" if firms_mode == "live" else "demo",
                last_update="2026-09-06T21:35:00Z",
                details="VIIRS 375m active thermal sensor feed"
            ),
            osm=SourceItemStatus(
                name="OpenStreetMap / Overpass",
                purpose="Industrial Facility Infrastructure & Context Fusion",
                mode="live",
                status="connected",
                last_update="2026-09-06T22:00:00Z",
                details="Overpass Turbo API endpoint with cached fallback"
            ),
            worldcover=SourceItemStatus(
                name="ESA WorldCover",
                purpose="10m Global Land-Cover Classification (Built-up / Agri / Forest)",
                mode="demo",
                status="connected",
                last_update="2026-09-01T00:00:00Z",
                details="V100 global land classification layer"
            ),
            historical=SourceItemStatus(
                name="KryptonX Baseline Store",
                purpose="Multi-month Spatiotemporal Median FRP & Anomaly Baselines",
                mode="seed",
                status="healthy",
                last_update="2026-09-06T20:00:00Z",
                details="Historical persistent thermal site catalog"
            ),
            copernicus=SourceItemStatus(
                name="Copernicus Sentinel-2",
                purpose="SWIR Multi-Spectral Satellite Imagery (Phase 2 Integration)",
                mode="standby",
                status="standby",
                last_update=None,
                details="Optical validation pipeline scheduled for Phase 2"
            )
        )

# Global repository instance
repository = SeedRepository()
