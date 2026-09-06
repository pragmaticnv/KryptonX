# KryptonX — Antigravity Rapid Prototype Build Pack

## Mission
Build a polished, demo-ready prototype for SIH26162:
**AI-Based Detection and Classification of Industrial Fires and Persistent Thermal Sources Using NASA FIRMS, OSM & Satellite Data**

The prototype must demonstrate the core KryptonX thesis:

> **FIRMS detects the heat. KryptonX understands the event.**

This is a 6-hour prototype, not a production system. Prioritize:
1. Excellent UI/UX
2. A convincing end-to-end investigation workflow
3. Working event logic
4. Explainable classification and anomaly scoring
5. Live FIRMS integration when a MAP_KEY is available
6. Demo fallback data when APIs are unavailable

## Build priority
P0 = must work for the video.
P1 = valuable if time remains.
P2 = do not spend deadline time on it.

### P0
- Dashboard with map
- Event markers and severity styling
- Event list/filtering
- Event detail/investigation panel
- Event formation from observations
- Classification
- Historical baseline / anomaly score
- Confidence vs priority
- Evidence/explanation panel
- Timeline/FRP trend
- OSM contextual facility lookup or mocked context
- Demo mode with deterministic seed data
- Responsive polished UI
- README + .env.example
- No fake claims presented as real measurements

### P1
- Live NASA FIRMS ingestion
- Live Overpass/OSM enrichment
- PostGIS persistence
- Alert simulation
- CSV export
- Time-window controls

### P2
- Sentinel imagery
- Weather/wind
- population exposure
- authentication
- production cloud deployment
- deep-learning imagery model

## Non-negotiable
The prototype must clearly label synthetic/demo values when they are not produced from live data.
Never claim 92% model accuracy, 91/100 priority, etc. as measured performance unless actually evaluated.
