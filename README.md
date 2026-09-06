# KRYPTONX — AI-Assisted Thermal Intelligence Platform
### Smart India Hackathon | Problem Statement SIH26162
> **“FIRMS detects the heat. KryptonX understands the event.”**

---

## 1. Executive Summary

NASA FIRMS provides satellite thermal anomaly detections (hotspots). However, a thermal observation in isolation does not tell an analyst whether the source is an industrial fire, an operational flare stack, a routine persistent industrial emitter, an agricultural burn, or a wildfire.

**KryptonX** introduces the intelligence layer between raw satellite detection and field investigation:

$$\text{Satellite Thermal Observations} \longrightarrow \text{Spatiotemporal Events} \longrightarrow \text{Geospatial Context} \longrightarrow \text{Probable Source} \longrightarrow \text{Historical Baseline} \longrightarrow \text{Abnormality Ratio} \longrightarrow \text{Priority Engine} \longrightarrow \text{Explainable Lead}$$

---

## 2. Architecture & Tech Stack

```
   Browser / Analyst Workstation (Desktop 1440×900)
                         │
                         ▼
        React 18 + TypeScript + Vite + Tailwind CSS
        ├── MapLibre GL JS (Tactical dark geospatial basemap)
        ├── Recharts (FRP Trajectory vs Baseline)
        └── Lucide Icons & Responsive Intelligence Console
                         │
                         ▼
             FastAPI Backend (Port 8000)
        ├── EventFormationEngine (Spatiotemporal DBSCAN / Grid)
        ├── ClassificationEngine (8-Class Evidence-Weighted Taxonomy)
        ├── BaselineEngine (Multi-overpass Median Anomaly Score)
        ├── PriorityEngine (5-Factor Weighted Urgency Score)
        ├── FIRMSAdapter (NASA FIRMS NRT Ingestion with Fallback)
        └── OSMAdapter (Overpass Industrial Facility Proximity)
                         │
                         ▼
         Seed Data & Historical Repository Store
```

---

## 3. Quickstart & Running the Application

Both servers are pre-configured and can run simultaneously:

### A. Start the Backend API (FastAPI)
```powershell
cd n:\CODING\KryptoX\backend
n:\CODING\KryptoX\.tools\python311\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Health: `http://127.0.0.1:8000/api/health`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

### B. Start the Frontend Workstation (React + Vite)
```powershell
cd n:\CODING\KryptoX\frontend
$env:PATH = "n:\CODING\KryptoX\.tools\node-v20.18.0-win-arm64;$env:PATH"
npm run dev -- --host 127.0.0.1 --port 5173
```
- Open your browser at: **`http://127.0.0.1:5173`**

---

## 4. Key Demo Scenarios (Following SIH Presentation Flow)

### 1. The Hero Event — Industrial Fire Anomaly (`EVT-1048`)
- **Probable Source**: Industrial Fire Candidate (91% confidence)
- **Anomaly**: **3.71× above historical site baseline** (Peak FRP: 48.2 MW vs Baseline: 13.0 MW)
- **Context**: Located **0.8 km** from an active industrial complex
- **Evidence Chips**:
  - `3.7× ABOVE HISTORICAL BASELINE`
  - `FRP RISING ACROSS RECENT OBSERVATIONS`
  - `0.8 KM INDUSTRIAL FACILITY`
  - `5.25 H PERSISTENCE`
- **Priority**: **91 / 100 (CRITICAL)**
- **Triage Action**: Click **ESCALATE** to transition status to `ESCALATED`.

### 2. The Baseline Contrast — Persistent vs. Abnormal (`EVT-0921`)
- **Probable Source**: Persistent Industrial Thermal Source (88% confidence)
- **Baseline**: Current FRP 19.8 MW vs Baseline 18.2 MW (**1.09× anomaly**)
- **Priority**: 42 / 100 (MODERATE)
- **Insight**: Demonstrates that **persistence alone does not equal a fire**. Normal industrial processes generate continuous heat; KryptonX uses baseline deviation to prevent false alarms.

### 3. Contextual Differentiation — Rural Agricultural Burn (`EVT-1182`)
- **Probable Source**: Agricultural Burning Candidate (79% confidence)
- **Context**: 8.6 km from nearest industrial installation; ESA WorldCover agricultural cropland.
- **Priority**: 27 / 100 (LOW/MODERATE)

---

## 5. Responsible AI & Methodology Notes

1. **Decoupled Priority vs. Classification**: Classification confidence is distinct from operational urgency. Priority is scored via:
   $$\text{Priority} = 0.30 \times \text{Thermal} + 0.25 \times \text{Anomaly} + 0.20 \times \text{Persistence} + 0.15 \times \text{Exposure} + 0.10 \times \text{Industrial}$$
2. **Probable Sources Only**: The platform never claims ground-truth certainty from satellite thermal pixels alone. It produces **evidence-weighted probable source leads**.
3. **Demo Data Transparency**: The platform displays the `● DEMO DATA` telemetry badge whenever running on synthetic reference records.

---

## 6. Verification Checklist Status

- [x] Backend FastAPI server running on `http://127.0.0.1:8000`
- [x] Frontend React/Vite workstation running on `http://127.0.0.1:5173`
- [x] `npm run build` succeeds cleanly (`dist/` generated with zero errors)
- [x] MapLibre dark tactical basemap with severity-coded glowing markers
- [x] Recharts FRP trajectory line chart with historical baseline reference
- [x] Evidence chips and qualitative intelligence synthesis
- [x] Multi-factor filtering (Priority, Source taxonomy, Status)
- [x] Decoupled 5-factor priority engine breakdown
- [x] Full offline demo fallback resilience (zero external key dependencies)
