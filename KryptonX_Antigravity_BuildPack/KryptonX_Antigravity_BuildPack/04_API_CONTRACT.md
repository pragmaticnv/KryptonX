# KRYPTONX API CONTRACT

## GET /api/health
Response:
{
  "status": "ok",
  "version": "0.1.0"
}

## GET /api/events
Response:
{
  "events": [
    {
      "id": "EVT-1048",
      "lat": 22.45,
      "lon": 70.12,
      "first_seen": "2026-09-06T16:20:00Z",
      "last_seen": "2026-09-06T21:35:00Z",
      "peak_frp": 48.2,
      "mean_frp": 31.4,
      "persistence_hours": 5.25,
      "probable_source": "Industrial Fire Candidate",
      "confidence": 0.91,
      "baseline_frp": 13.0,
      "anomaly_ratio": 3.71,
      "anomaly_score": 87,
      "priority_score": 91,
      "priority_level": "CRITICAL",
      "nearest_facility": "Demo Industrial Facility",
      "facility_distance_km": 0.8,
      "land_cover": "Industrial / Built-up",
      "status": "REVIEW"
    }
  ]
}

## GET /api/events/{id}
Return full investigation object:
- summary
- classification
- probabilities
- evidence
- timeline
- baseline
- context
- priority_breakdown

## GET /api/events/{id}/timeline
{
  "observations": [
    {"time":"...","frp":18.1,"confidence":0.83},
    {"time":"...","frp":25.4,"confidence":0.87},
    {"time":"...","frp":48.2,"confidence":0.91}
  ],
  "baseline_frp": 13.0
}

## GET /api/events/{id}/evidence
{
  "evidence": [
    {"type":"baseline","label":"3.7× above baseline","weight":"high"},
    {"type":"facility","label":"0.8 km from industrial facility","weight":"medium"},
    {"type":"trend","label":"FRP increased across recent observations","weight":"high"}
  ],
  "caveats": [
    "Thermal observations do not alone confirm source type."
  ]
}

## GET /api/analytics/summary
{
  "observations": 1284,
  "events": 347,
  "industrial_candidates": 42,
  "high_critical": 11,
  "by_source": {},
  "by_priority": {}
}

## GET /api/sources/status
{
  "firms": {"mode":"demo","healthy":true},
  "osm": {"mode":"demo","healthy":true},
  "historical": {"mode":"seed","healthy":true}
}

## POST /api/ingest/firms
Body:
{
  "bbox": [68.0, 8.0, 97.5, 37.0],
  "days": 1
}

## POST /api/events/{id}/feedback
Body:
{
  "action": "confirm",
  "note": "Analyst review"
}
