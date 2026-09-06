# KRYPTONX UI/UX SPEC

## Overall shell

Desktop-first 1440×900 dashboard.

Left sidebar:
- KRYPTONX logo/wordmark
- Mission Control
- Events
- Analytics
- Map
- Data Sources
- Settings

Top bar:
- page title
- current region
- time window
- LIVE/DEMO status
- search

## Dashboard layout

┌ Sidebar ┐ ┌ KPI strip ───────────────────────────────┐
│          │ │ Observations | Events | Industrial | High│
│          │ ├──────────────────────┬───────────────────┤
│          │ │                      │ PRIORITY QUEUE    │
│          │ │       MAP            │                  │
│          │ │                      │ Critical Event   │
│          │ │                      │ High Event       │
│          │ ├──────────────────────┴───────────────────┤
│          │ │ RECENT EVENT ACTIVITY / FRP TREND        │
└──────────┘ └──────────────────────────────────────────┘

## Map

Use MapLibre with a dark map style.
Event markers:
- Low: cyan
- Moderate: amber
- High: orange
- Critical: red
Use a glow ring for Critical.

Cluster markers at low zoom.

Map controls:
- zoom
- reset view
- fit events
- toggle facilities
- toggle heat layer

## Event card

Each card:
Event ID
probable source
priority badge
confidence
peak FRP
duration
nearest facility
anomaly ratio

Example:
`EVT-1048`
`Industrial Fire Candidate`
`CRITICAL`
`Confidence 91%`
`Peak FRP 48.2 MW`
`3.7× baseline`
`0.8 km to industrial facility`

If values are synthetic, show `DEMO`.

## Investigation drawer

Width: 480–560px.

Header:
- Event ID
- status
- priority

Section 1: Classification
- source
- confidence
- compact probability bars

Section 2: Why flagged
Evidence chips:
- `3.7× baseline`
- `FRP rising`
- `0.8 km industrial facility`
- `persistent 5.2h`

Section 3: Timeline
Horizontal or vertical observation timeline.

Section 4: FRP vs baseline
Line chart:
- actual FRP
- baseline
- anomaly region

Section 5: Context
- nearest facility
- facility type
- distance
- land cover
- nearby road/settlement

Section 6: Analyst action
buttons:
`Review`
`Confirm`
`False Positive`
`Escalate`

## Analytics

Three charts maximum above fold:
1. events by probable source
2. priority distribution
3. FRP/anomaly trend

Below:
regional table and top anomalous events.

## Empty/error states

Never show raw stack traces.

Use:
“Live source unavailable — showing last known/demo context.”

## Microinteractions

- map marker click → drawer
- filter changes update KPI counts
- timeline points highlight on hover
- priority badge subtly pulses only for Critical
- no distracting animation
