# COPY THIS ENTIRE PROMPT INTO ANTIGRAVITY

You are the lead full-stack engineer, product designer and geospatial/ML engineer responsible for building the KryptonX prototype described in the attached/project files.

IMPORTANT: We have approximately 6 hours before a competition submission. Build a working, visually exceptional prototype first. Do not over-engineer.

PROJECT:
KryptonX — Thermal Intelligence Layer for SIH26162.

CORE THESIS:
“FIRMS detects the heat. KryptonX understands the event.”

The product converts thermal observations into spatiotemporal events, adds OSM/geospatial context, compares behavior with a historical baseline, classifies the probable source, assigns confidence, prioritizes the event, and explains why it was flagged.

SOURCE OF TRUTH:
Use the supplied PRD, UI spec, architecture, API contract and seed data. Do not invent unrelated features.

TECH STACK:
Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui or a similarly polished component system
- MapLibre GL JS
- Recharts

Backend:
- Python
- FastAPI
- Pydantic
- pandas/numpy
- scikit-learn where useful

Storage:
- Prefer PostgreSQL/PostGIS.
- If database setup threatens the demo deadline, implement a clean repository abstraction with seed JSON/in-memory fallback and keep the PostGIS adapter ready.

MUST BUILD:

1. Mission Control Dashboard
- dark geospatial intelligence aesthetic
- left navigation
- KPI strip
- interactive map
- event queue
- filters
- data source status

2. Event Investigation Drawer/Page
- event ID
- probable source
- confidence
- priority
- evidence
- timeline
- FRP chart
- baseline
- anomaly ratio
- facility context
- land cover
- analyst action buttons

3. Analytics page
- source distribution
- priority distribution
- anomaly/persistence trends

4. Data Sources page
- FIRMS
- OSM
- Land Cover
- Historical Data
- live/demo status

5. Functional logic
- spatial/temporal event formation
- classification
- baseline deviation
- priority score
- explainability

6. Demo data
Load `05_seed_data.json` immediately so the application works even without API keys.

7. Live FIRMS adapter
If NASA_FIRMS_MAP_KEY exists, provide backend ingestion.
If it doesn't exist or the request fails, automatically fall back to demo data.
Never expose the API key to the browser.

8. OSM enrichment
Use Overpass server-side for nearby industrial context.
Cache responses.
Fallback to demo context if unavailable.

VISUAL DESIGN:

Think:
“Satellite Intelligence × Geospatial AI × Mission Control.”

Use:
#071521
#0B1F33
#0E2438
#19C7D8
#4DA3FF
#FF9F1C
#FF4D4D
#35D07F
#EAF4F7
#8EA6B6

The UI must look like a serious geospatial intelligence console, not a generic admin dashboard.

Use:
- thin borders
- subtle cyan/blue glow
- compact information density
- crisp typography
- strong hierarchy
- dark map
- severity colors
- professional charts

Avoid:
- stock photos
- excessive gradients
- giant rounded cards
- excessive animations
- generic SaaS purple
- fake AI brain graphics
- clutter

MAP:
- MapLibre
- dark basemap
- clustered markers
- critical event glow
- industrial facility markers
- click marker → investigation drawer
- fit-to-events control

EVENT SEVERITY:
Low = cyan
Moderate = amber
High = orange
Critical = red

CLASSIFICATION:
- Industrial Fire Candidate
- Gas Flare Candidate
- Persistent Industrial Thermal Source
- Wildfire / Natural Fire Candidate
- Agricultural Burning Candidate
- Mining / Extraction Candidate
- Other / Unclassified
- Insufficient Evidence

IMPORTANT LANGUAGE:
Always use “probable source” or “candidate”.
Do not claim certainty.

BASELINE:
Use seed baseline values for demo events.
Show actual FRP vs baseline on chart.
Compute anomaly ratio.
Use prototype heuristic thresholds:
<1.5x Normal
1.5–2.5x Elevated
2.5–4x High
>4x Critical
Label these as prototype heuristics in a small methodology note.

PRIORITY:
Compute 0–100 score from:
thermal severity 30%
anomaly 25%
persistence 20%
exposure 15%
industrial relevance 10%

Show component breakdown in investigation view.

DEMO EVENTS:
EVT-1048 should be the hero event:
Industrial Fire Candidate
91% confidence
3.71x baseline
Critical priority
rising FRP
near industrial facility

EVT-0921 should demonstrate normal persistent industrial heat:
Persistent Industrial Thermal Source
close to baseline
Moderate priority

EVT-1182 should demonstrate non-industrial context:
Agricultural Burning Candidate
short persistence
far from industrial facility

These are synthetic demonstration values. Put a `DEMO DATA` badge in the UI.

CRITICAL UX DETAIL:
When clicking EVT-1048, the investigation drawer should feel like the main “wow moment” of the demo.

It should visually communicate:

THERMAL OBSERVATIONS
        ↓
SPATIOTEMPORAL EVENT
        ↓
CONTEXT FUSION
        ↓
PROBABLE SOURCE
        ↓
BASELINE DEVIATION
        ↓
PRIORITY
        ↓
EXPLAINABLE INVESTIGATION LEAD

Create a polished event evidence panel with chips:
- 3.7× above baseline
- FRP rising
- 0.8 km industrial facility
- 5.25h persistence

Add a clear caveat:
“Thermal observations alone do not confirm source type.”

ENGINEERING:
- TypeScript strict mode
- clean components
- no giant monolithic component
- loading states
- error states
- empty states
- responsive desktop layout
- no console errors
- no broken routes
- no hardcoded API secrets

ROUTES:
/
 /events
 /analytics
 /map
 /sources
 /settings

If time is limited, make `/` and `/events/:id` excellent and make the remaining pages lightweight but functional.

DELIVERY:
At the end:
1. Ensure `npm run build` succeeds.
2. Ensure backend starts.
3. Add README with exact startup commands.
4. Add `.env.example`.
5. Add demo mode instructions.
6. Add live FIRMS instructions.
7. Make sure fresh startup works without external credentials.
8. Do not leave TODO placeholders in the primary demo flow.

DO NOT spend time implementing:
- authentication
- complex deep learning
- Sentinel imagery processing
- real-time notifications
- production deployment
- advanced population models

Those are Phase 2.

FIRST IMPLEMENT:
1. shell + map
2. seed data
3. event cards
4. investigation drawer
5. charts
6. baseline/anomaly
7. priority/evidence
8. live adapters
9. analytics
10. polish

Before finishing, perform a visual QA pass on the dashboard and investigation view.
