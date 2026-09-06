# KRYPTONX TECHNICAL ARCHITECTURE

## Runtime

Browser
  ↓
React/Vite/TypeScript
  ↓
FastAPI
  ├── FIRMS Adapter
  ├── OSM/Overpass Adapter
  ├── Event Engine
  ├── Context Engine
  ├── Classification Engine
  ├── Baseline Engine
  ├── Priority Engine
  └── Evidence Generator
  ↓
PostgreSQL/PostGIS

## FIRMS adapter

Environment:
NASA_FIRMS_MAP_KEY

Keep provider access server-side.

Normalize provider records into:
{
  latitude,
  longitude,
  observed_at,
  satellite,
  instrument,
  confidence,
  frp,
  brightness,
  source
}

Do not assume all FIRMS products expose exactly the same fields.

## Event formation

For prototype:
- spatial radius: 1–3 km depending on sensor scale
- temporal window: 6–12 hours
- group using DBSCAN when sklearn is available
- otherwise deterministic grid/time bucketing

Important:
these are engineering prototype parameters, not validated scientific thresholds.

## Context engine

For selected event:
1. query nearby OSM/Overpass features
2. identify industrial/facility candidates
3. compute haversine distance
4. attach nearest relevant feature
5. assign contextual evidence

## Classification engine

Hybrid:
- rules generate feature evidence
- optional sklearn model generates probabilities
- final output:
  class, confidence, evidence[]

Example rule evidence:
if facility_distance < 1 km:
  industrial_relevance += 0.35

if persistence > threshold:
  persistent_source += 0.25

if anomaly_ratio > 3:
  industrial_fire += 0.30

if forest land cover and no industrial context:
  natural_fire += 0.35

## Baseline

Historical event store grouped by spatial/site identity.

Prototype fallback:
use event-specific `baseline_frp` from seed data.

## Priority

priority_score =
thermal + anomaly + persistence + exposure + industrial_relevance

Return both:
- score
- component breakdown

This allows the UI to explain the score.

## Data source status

Expose:
GET /api/sources/status

Example:
{
  "firms": {"status": "live", "last_update": "..."},
  "osm": {"status": "live"},
  "historical": {"status": "demo"}
}

## Logging

Log:
- provider failures
- ingestion count
- event formation count
- inference time
- API latency

Do not log secrets.
