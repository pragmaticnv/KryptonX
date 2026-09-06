from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any

from ..models.event import (
    EventSummary, EventDetail, AnalyticsSummary, SourcesStatus,
    FeedbackRequest, IngestRequest
)
from ..data.seed_repository import repository
from ..adapters.firms_adapter import FIRMSAdapter
from ..adapters.osm_adapter import OSMAdapter

router = APIRouter(prefix="/api")
firms_adapter = FIRMSAdapter()
osm_adapter = OSMAdapter()

@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "version": "0.1.0",
        "service": "KryptonX Thermal Intelligence Engine",
        "sih_problem_statement": "SIH26162"
    }

@router.get("/events", response_model=Dict[str, List[EventSummary]])
def get_events(
    priority: Optional[str] = Query("ALL", description="All, Low, Moderate, High, Critical"),
    source: Optional[str] = Query("ALL", description="Source classification filter"),
    status: Optional[str] = Query("ALL", description="All, Review, Monitor, Escalated, Resolved"),
    bbox: Optional[str] = None,
    limit: int = Query(100, ge=1, le=500)
):
    events = repository.get_events(
        priority=priority,
        source=source,
        status=status,
        bbox=bbox,
        limit=limit
    )
    return {"events": events}

@router.get("/events/{event_id}", response_model=EventDetail)
def get_event_detail(event_id: str):
    detail = repository.get_event_detail(event_id)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Event {event_id} not found")
    return detail

@router.get("/events/{event_id}/timeline")
def get_event_timeline(event_id: str):
    detail = repository.get_event_detail(event_id)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Event {event_id} not found")
    return {
        "event_id": event_id,
        "observations": detail.timeline,
        "baseline_frp": detail.baseline_frp,
        "peak_frp": detail.peak_frp,
        "persistence_hours": detail.persistence_hours
    }

@router.get("/events/{event_id}/evidence")
def get_event_evidence(event_id: str):
    detail = repository.get_event_detail(event_id)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Event {event_id} not found")
    return {
        "event_id": event_id,
        "evidence": detail.evidence_items,
        "evidence_summary": detail.evidence,
        "caveats": detail.caveats
    }

@router.get("/analytics/summary", response_model=AnalyticsSummary)
def get_analytics_summary():
    return repository.get_analytics()

@router.get("/sources/status", response_model=SourcesStatus)
def get_sources_status():
    return repository.get_sources_status(firms_mode=firms_adapter.mode)

@router.post("/ingest/firms")
async def ingest_firms(request: IngestRequest):
    observations = await firms_adapter.fetch_observations(days=request.days or 1)
    return {
        "status": "success",
        "mode": firms_adapter.mode,
        "observations_ingested": len(observations),
        "message": "FIRMS observations processed. Fallback to seed records if key is inactive."
    }

@router.post("/events/{event_id}/feedback")
def submit_feedback(event_id: str, request: FeedbackRequest):
    success = repository.update_status(event_id, request.action, request.note)
    if not success:
        raise HTTPException(status_code=404, detail=f"Event {event_id} not found")
    return {
        "status": "success",
        "event_id": event_id,
        "action": request.action,
        "message": f"Event {event_id} status updated to {request.action.upper()}"
    }
