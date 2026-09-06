# KRYPTONX — RAPID PROTOTYPE PRD
## SIH26162 | Industrial Thermal Intelligence

### 1. Product definition

KryptonX is an AI-assisted geospatial intelligence platform that converts satellite thermal observations into **spatiotemporal thermal events**, enriches them with geographic/industrial context, compares them with historical behavior, classifies the probable source, and prioritizes events for investigation.

### 2. Core problem

NASA FIRMS provides thermal anomaly observations, but a thermal observation alone does not establish whether the source is an industrial fire, gas flare, wildfire, agricultural burn, mining activity, or another persistent thermal source.

KryptonX adds the intelligence layer between detection and investigation.

### 3. Core user

Primary:
- GIS / remote-sensing analyst
- disaster-management analyst
- infrastructure-monitoring analyst
- government/defence intelligence analyst

Secondary:
- emergency response / safety teams
- industrial risk teams
- researchers

### 4. Core product loop

OBSERVE
→ FORM EVENT
→ ENRICH CONTEXT
→ CLASSIFY
→ COMPARE WITH BASELINE
→ SCORE PRIORITY
→ EXPLAIN
→ INVESTIGATE

### 5. Event model

A FIRMS observation is a point-in-time thermal detection.

An Event is a group of spatially and temporally related observations.

Minimum event fields:
- event_id
- latitude
- longitude
- first_seen
- last_seen
- observation_count
- peak_frp
- mean_frp
- persistence_hours
- recurrence_count
- probable_source
- classification_confidence
- baseline_frp
- anomaly_ratio
- anomaly_score
- exposure_score
- priority_score
- priority_level
- nearby_facility
- facility_distance_km
- land_cover
- evidence[]
- status

### 6. Classification taxonomy

Use:
- Industrial Fire Candidate
- Gas Flare Candidate
- Persistent Industrial Thermal Source
- Wildfire / Natural Fire Candidate
- Agricultural Burning Candidate
- Mining / Extraction Candidate
- Other / Unclassified
- Insufficient Evidence

Important:
The classifier predicts a **probable source category**. It must not imply certainty.

### 7. Feature groups

#### Thermal
- peak_frp
- mean_frp
- frp_trend
- observation_count
- confidence
- brightness-related fields when available

#### Temporal
- duration
- persistence
- recurrence
- observation frequency
- growth rate

#### Spatial/context
- nearest industrial facility distance
- facility type
- residential distance
- road/rail proximity
- water proximity
- land-cover class

#### Baseline
- historical median FRP
- historical p90 FRP
- current/baseline ratio
- deviation from expected behavior

### 8. Baseline engine

For a site/event family:
baseline_frp = historical median or robust rolling median.

anomaly_ratio = current_peak_frp / max(baseline_frp, epsilon)

Example interpretation:
- < 1.5x = Normal
- 1.5–2.5x = Elevated
- 2.5–4x = High anomaly
- > 4x = Critical anomaly

These thresholds are prototype heuristics, not validated scientific thresholds.

### 9. Priority engine

Priority must remain separate from classification confidence.

Example prototype score:
priority =
0.30 * thermal_severity +
0.25 * anomaly_score +
0.20 * persistence_score +
0.15 * exposure_score +
0.10 * industrial_relevance

Normalize to 0–100.

Priority:
- 0–24 Low
- 25–49 Moderate
- 50–74 High
- 75–100 Critical

These are prototype scoring weights and must be clearly described as such.

### 10. Explainability

Every event detail must show:
- probable source
- confidence
- why the system thinks this
- baseline comparison
- nearby facility
- event timeline
- FRP trend
- contextual evidence
- limitations / uncertainty

Example:
“Persistent thermal activity near an industrial facility; current peak FRP is 3.8× the historical baseline; event intensity is increasing across recent observations.”

### 11. Main screens

#### A. Mission Control Dashboard
- dark professional intelligence-console aesthetic
- left navigation
- KPI strip
- interactive map
- event list
- severity legend
- filters
- live/demo status indicator

KPI cards:
- Thermal Observations
- Thermal Events
- Industrial Candidates
- High/Critical Events

#### B. Event Investigation
Top:
- Event ID
- priority
- probable source
- confidence
- status

Main:
- map with event and nearby facility
- event timeline
- FRP chart
- baseline comparison
- evidence cards
- contextual data
- recommended analyst action

#### C. Analytics
- event distribution by source
- priority distribution
- persistence histogram
- anomaly distribution
- regional activity

#### D. Data Sources
Show:
- NASA FIRMS
- OpenStreetMap
- Land Cover
- Historical Event Store
- optional Copernicus/Sentinel

### 12. Interaction flow

1. User opens Dashboard.
2. Map displays thermal events.
3. User filters `High/Critical`.
4. User clicks an event.
5. Right-side investigation drawer opens.
6. Event timeline and FRP trend animate/update.
7. Baseline comparison shows normal vs current behavior.
8. Context section shows nearest industrial facility and distances.
9. Classifier gives probable source + confidence.
10. Priority engine explains urgency.
11. Analyst can mark:
   - Review
   - Confirm
   - False Positive
   - Escalate

### 13. Demo scenario

Create three visually distinct demo events:

A. NORMAL PERSISTENT INDUSTRIAL SOURCE
- repeated observations
- stable FRP
- close to industrial facility
- low anomaly
- classification: Persistent Industrial Thermal Source
- priority: Moderate

B. ABNORMAL INDUSTRIAL EVENT
- rising FRP
- short duration but strong intensity
- close to industrial facility
- current/baseline ratio > 3x
- classification: Industrial Fire Candidate
- priority: Critical

C. NATURAL / AGRICULTURAL EVENT
- farther from industrial facilities
- different land-cover context
- less persistent
- classification: Wildfire / Agricultural Burning Candidate
- priority: Moderate or Low

The dashboard should make the contrast obvious.

### 14. Live data behavior

NASA FIRMS must be an adapter, not a hard dependency.

If `NASA_FIRMS_MAP_KEY` exists:
- backend requests FIRMS data
- normalizes observations
- forms events
- enriches events
- returns results

If the key is absent or API fails:
- automatically use demo seed data
- display `DEMO DATA` badge
- never make the UI look broken

Never expose the FIRMS key in browser code.

### 15. OSM behavior

Use Overpass as a read-only contextual data source.
Query nearby industrial features around selected event coordinates.
Cache responses.

If Overpass fails:
- use stored contextual facility data
- display source as `OSM context` or `demo context` accordingly

### 16. Architecture

Frontend:
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui or equivalent
- MapLibre GL JS
- Recharts

Backend:
- Python
- FastAPI
- Pydantic
- pandas/numpy
- scikit-learn for prototype model if used

Storage:
- PostgreSQL + PostGIS preferred
- SQLite fallback for fastest local demo if PostGIS setup becomes a blocker

### 17. Prototype ML

Do not spend the six-hour window training a deep model.

Implement a transparent hybrid classifier:
- deterministic feature rules + optional lightweight sklearn model
- return class probabilities/confidence
- retain feature evidence

For the demo, deterministic inference is acceptable if clearly described as a prototype inference layer.

### 18. API endpoints

GET /api/health
GET /api/events
GET /api/events/{event_id}
GET /api/events/{event_id}/timeline
GET /api/events/{event_id}/evidence
GET /api/analytics/summary
GET /api/sources/status
POST /api/ingest/firms
POST /api/events/{event_id}/feedback

Query parameters for /api/events:
- bbox
- start
- end
- priority
- source
- status
- limit

### 19. Acceptance criteria

P0 is complete when:
- dashboard loads without errors
- demo data appears immediately
- map contains events
- filters work
- event click opens investigation view
- event timeline renders
- baseline comparison renders
- classification and confidence render
- priority and reason render
- nearby facility context renders
- dashboard is visually polished
- refresh does not destroy the demo
- live FIRMS can be enabled via env without frontend changes

### 20. Responsible claims

The UI must use:
- “probable source”
- “candidate”
- “confidence”
- “evidence”
- “investigation lead”

Avoid:
- “confirmed”
- “guaranteed”
- “100% accurate”
- “continuous satellite surveillance”
- “exact facility identification from FIRMS alone”

### 21. Demo-mode banner

Use a subtle top-right status:
`● DEMO DATA`
or
`● LIVE FIRMS`

When live:
show `LIVE FIRMS • Updated <time>`.
When demo:
show `DEMO • Synthetic event records`.

### 22. Visual direction

Design language:
**Satellite Intelligence × Geospatial AI × Mission Control**

Palette:
- background: #071521 / #0B1F33
- panels: #0E2438
- primary: #19C7D8
- secondary: #4DA3FF
- warning: #FF9F1C
- critical: #FF4D4D
- success: #35D07F
- text: #EAF4F7
- muted: #8EA6B6

Use restrained glow, thin borders, dense but readable information hierarchy.

Avoid:
- generic SaaS landing-page styling
- excessive gradients
- giant cards
- stock fire photos
- fake 3D dashboards
- excessive animations

### 23. Performance target

For demo:
- first meaningful UI < 2.5s on local environment
- event interaction < 300ms after data is loaded
- map should remain usable with hundreds of markers
- use clustering on map for dense events
