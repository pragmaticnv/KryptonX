import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { Maximize2, RotateCcw, Factory, Flame, Radio, ShieldAlert } from 'lucide-react';
import { EventSummary } from '../../types/event';
import { getThermalObservationsGeoJson } from '../../data/thermalObservations';
import { getFacilitiesGeoJson, getContextualLinkGeoJson } from '../../data/facilitiesData';

interface EventMapProps {
  events: EventSummary[];
  selectedEventId: string | null;
  onSelectEvent: (event: EventSummary) => void;
}

// Bounding box tightly framing India (SW to NE)
const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [68.0, 7.5],   // Southwest: Arabian Sea / Kanyakumari
  [97.5, 35.5],  // Northeast: Arunachal / Kashmir
];

const INDIA_CENTER: [number, number] = [79.2, 21.8];

export const EventMap: React.FC<EventMapProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});
  const activePopupRef = useRef<maplibregl.Popup | null>(null);

  // Tactical Layer Controls
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showObservations, setShowObservations] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  // ─── Initialize MapLibre Centered on India ───
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const CARTO_API_KEY = import.meta.env.VITE_CARTO_API_KEY || 'cb1_2zcv_1_f02cb61d600f0fe96e48e9de';
    const keyParam = CARTO_API_KEY ? `?key=${CARTO_API_KEY}` : '';

    const styleUrl: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: [
            `https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png${keyParam}`,
            `https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png${keyParam}`,
            `https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png${keyParam}`,
            `https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png${keyParam}`,
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }
      },
      layers: [
        {
          id: 'carto-dark-layer',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    };

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: INDIA_CENTER,
      zoom: 4.6,
      attributionControl: false,
    });

    map.current = mapInstance;

    // Navigation control placed cleanly at bottom-right out of visual focus
    mapInstance.addControl(
      new maplibregl.NavigationControl({ showCompass: true, visualizePitch: false }),
      'bottom-right'
    );

    mapInstance.on('load', () => {
      setMapLoaded(true);

      // Fit initially to India view
      mapInstance.fitBounds(INDIA_BOUNDS, {
        padding: { top: 40, bottom: 40, left: 40, right: 40 },
        duration: 0,
      });

      // ─── 1. Thermal Observations Source & Heatmap Layer ───
      const observationsGeoJson = getThermalObservationsGeoJson();

      mapInstance.addSource('thermal-observations-source', {
        type: 'geojson',
        data: observationsGeoJson,
      });

      // Satellite Thermal Heatmap Layer - Smooth density gradients across clusters
      mapInstance.addLayer({
        id: 'thermal-heatmap-layer',
        type: 'heatmap',
        source: 'thermal-observations-source',
        maxzoom: 13,
        paint: {
          // Weight calculation based on Fire Radiative Power (MW)
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'frp'],
            10, 0.25,
            25, 0.55,
            40, 0.85,
            50, 1.0
          ],
          // Smooth progressive intensity with zoom
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, 0.6,
            5, 0.95,
            7, 1.4,
            10, 2.2
          ],
          // Satellite thermal intensity color spectrum
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',
            0.15, 'rgba(25, 199, 216, 0.3)',   // Electric Cyan (ambient/low activity)
            0.35, 'rgba(0, 140, 255, 0.6)',    // Cobalt Blue
            0.55, 'rgba(255, 204, 0, 0.78)',   // Thermal Amber (moderate activity)
            0.75, 'rgba(255, 120, 0, 0.9)',    // Orange (high heat density)
            0.95, 'rgba(255, 45, 45, 0.96)'    // Crimson Red (critical anomaly)
          ],
          // Realistic organic radius
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, 12,
            5, 20,
            7, 32,
            10, 52
          ],
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, 0.82,
            7, 0.72,
            11, 0.4
          ],
        },
      });

      // Sharp Pinpoint Sensor Observation Dots
      mapInstance.addLayer({
        id: 'thermal-points-layer',
        type: 'circle',
        source: 'thermal-observations-source',
        minzoom: 4.2,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4, 1.8,
            6, 3.2,
            10, 5.5
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'frp'],
            15, '#19C7D8',
            25, '#FFCC00',
            35, '#FF9F1C',
            45, '#FF4D4D'
          ],
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 0.8,
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4, 0.5,
            6, 0.85,
            10, 1.0
          ],
        },
      });

      // ─── 2. OSM Industrial Facilities Source & Layers ───
      const facilitiesGeoJson = getFacilitiesGeoJson();

      mapInstance.addSource('osm-facilities-source', {
        type: 'geojson',
        data: facilitiesGeoJson,
      });

      mapInstance.addLayer({
        id: 'facilities-halo-layer',
        type: 'circle',
        source: 'osm-facilities-source',
        paint: {
          'circle-radius': 7,
          'circle-color': 'rgba(25, 199, 216, 0.12)',
          'circle-stroke-color': '#19C7D8',
          'circle-stroke-width': 0.8,
          'circle-stroke-opacity': 0.5,
        },
      });

      mapInstance.addLayer({
        id: 'facilities-point-layer',
        type: 'circle',
        source: 'osm-facilities-source',
        paint: {
          'circle-radius': 3.5,
          'circle-color': '#0F2B48',
          'circle-stroke-color': '#19C7D8',
          'circle-stroke-width': 1.5,
        },
      });

      // ─── 3. Contextual Fusion Link Layer (Connecting Line) ───
      mapInstance.addSource('context-link-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      mapInstance.addLayer({
        id: 'context-link-glow',
        type: 'line',
        source: 'context-link-source',
        paint: {
          'line-color': '#FF4D4D',
          'line-width': 5,
          'line-opacity': 0.3,
          'line-blur': 2,
        },
      });

      mapInstance.addLayer({
        id: 'context-link-line',
        type: 'line',
        source: 'context-link-source',
        paint: {
          'line-color': '#FF4D4D',
          'line-width': 2,
          'line-dasharray': [3, 2],
          'line-opacity': 0.95,
        },
      });

      // ─── Hover Events for Sensor Observation Points ───
      mapInstance.on('mouseenter', 'thermal-points-layer', (e) => {
        if (!e.features || !e.features[0]) return;
        mapInstance.getCanvas().style.cursor = 'pointer';
        const props = e.features[0].properties as any;
        const coords = (e.features[0].geometry as any).coordinates.slice();

        if (activePopupRef.current) activePopupRef.current.remove();

        activePopupRef.current = new maplibregl.Popup({ offset: 10, closeButton: false })
          .setLngLat(coords)
          .setHTML(`
            <div style="font-family: monospace; font-size: 11px; min-width: 170px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1A374F; padding-bottom: 3px; margin-bottom: 4px;">
                <span style="color: #19C7D8; font-weight: bold;">${props.sensor || 'VIIRS'}</span>
                <span style="color: #FFCC00; font-weight: bold;">${props.frp} MW</span>
              </div>
              <div style="color: #EAF4F7; font-weight: bold; margin-bottom: 2px;">${props.cluster}</div>
              <div style="color: #8EA6B6; font-size: 10px;">Brightness: ${props.brightness} K • Conf: ${Math.round(props.confidence * 100)}%</div>
              <div style="color: #4DA3FF; font-size: 9px; margin-top: 3px;">● SATELLITE THERMAL DETECTION</div>
            </div>
          `)
          .addTo(mapInstance);
      });

      mapInstance.on('mouseleave', 'thermal-points-layer', () => {
        mapInstance.getCanvas().style.cursor = '';
        if (activePopupRef.current) {
          activePopupRef.current.remove();
          activePopupRef.current = null;
        }
      });

      // ─── Click Events on OSM Facilities ───
      mapInstance.on('click', 'facilities-point-layer', (e) => {
        if (!e.features || !e.features[0]) return;
        const props = e.features[0].properties as any;
        const coords = (e.features[0].geometry as any).coordinates.slice();

        new maplibregl.Popup({ offset: 12 })
          .setLngLat(coords)
          .setHTML(`
            <div style="font-family: monospace; font-size: 11px; min-width: 210px;">
              <div style="display: flex; align-items: center; gap: 6px; color: #19C7D8; font-weight: bold; margin-bottom: 4px;">
                <span>🏭</span>
                <span>OSM INDUSTRIAL FACILITY</span>
              </div>
              <div style="color: #EAF4F7; font-weight: bold; font-size: 12px; margin-bottom: 3px;">${props.name}</div>
              <div style="color: #8EA6B6; margin-bottom: 2px;">Type: <strong style="color: #EAF4F7;">${props.type}</strong></div>
              <div style="color: #8EA6B6; margin-bottom: 4px;">Category: <span style="color: #4DA3FF;">${props.category}</span></div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; border-top: 1px solid #1A374F; padding-top: 4px;">
                <span style="color: #2ED573;">● ${props.status}</span>
                <span style="color: #8EA6B6;">${props.osm_id}</span>
              </div>
            </div>
          `)
          .addTo(mapInstance);
      });

      mapInstance.on('mouseenter', 'facilities-point-layer', () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });
      mapInstance.on('mouseleave', 'facilities-point-layer', () => {
        mapInstance.getCanvas().style.cursor = '';
      });
    });

    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, []);

  // ─── Update Layer Visibility Toggles ───
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const m = map.current;

    const setVisibility = (layerId: string, visible: boolean) => {
      if (m.getLayer(layerId)) {
        m.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
      }
    };

    setVisibility('thermal-heatmap-layer', showHeatmap);
    setVisibility('thermal-points-layer', showObservations);
    setVisibility('facilities-halo-layer', showFacilities);
    setVisibility('facilities-point-layer', showFacilities);
  }, [showHeatmap, showObservations, showFacilities, mapLoaded]);

  // ─── Render Clean, Non-Colliding Event Markers ───
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    events.forEach((event) => {
      const isSelected = event.id === selectedEventId;
      const isCritical = event.priority_level === 'CRITICAL';
      const isHigh = event.priority_level === 'HIGH';
      const isModerate = event.priority_level === 'MODERATE';

      let markerColor = '#19C7D8'; // Low (Cyan)
      if (isCritical) markerColor = '#FF4D4D'; // Critical (Crimson Red)
      else if (isHigh) markerColor = '#FF9F1C'; // High (Vivid Orange)
      else if (isModerate) markerColor = '#4DA3FF'; // Moderate (Electric Blue/Amber)

      // Dim non-selected events slightly if an event is currently selected
      const opacity = selectedEventId && !isSelected ? '0.4' : '1.0';

      const el = document.createElement('div');
      el.className = 'cursor-pointer transition-all duration-300 transform select-none';
      el.style.opacity = opacity;
      el.style.zIndex = isSelected ? '50' : isCritical ? '40' : '30';

      // Smart label positioning: offset EVT-1048 left, EVT-0921 right so they NEVER overlap in Gujarat
      let labelAlignment = 'items-center';
      let labelOffset = '';
      if (event.id === 'EVT-1048') {
        labelOffset = 'transform: translateX(-40px);';
      } else if (event.id === 'EVT-0921') {
        labelOffset = 'transform: translateX(40px);';
      }

      el.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; ${labelAlignment};">
          <!-- Compact Event ID Label -->
          <div style="
            background: rgba(14, 36, 56, 0.95);
            border: 1px solid ${markerColor};
            border-radius: 3px;
            padding: 1px 5px;
            margin-bottom: 3px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            gap: 3px;
            white-space: nowrap;
            ${labelOffset}
          ">
            <span style="width: 5px; height: 5px; border-radius: 50%; background: ${markerColor}; ${isCritical ? 'animation: ping 1.2s cubic-bezier(0,0,0.2,1) infinite;' : ''}"></span>
            <span style="font-family: monospace; font-size: 10px; font-weight: bold; color: #EAF4F7;">${event.id}</span>
            <span style="font-family: monospace; font-size: 8.5px; font-weight: bold; color: ${markerColor};">${event.priority_level}</span>
          </div>

          <!-- Central Beacon Target Reticle -->
          <div style="
            position: relative;
            width: ${isSelected ? '32px' : isCritical ? '28px' : '22px'};
            height: ${isSelected ? '32px' : isCritical ? '28px' : '22px'};
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <!-- Pulsing radar ring for critical & selected -->
            ${(isCritical || isSelected) ? `
              <div class="radar-ring" style="
                position: absolute;
                inset: -6px;
                border-radius: 50%;
                border: 2px solid ${markerColor};
                pointer-events: none;
              "></div>
            ` : ''}

            <!-- Core circle -->
            <div style="
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background: radial-gradient(circle, ${markerColor} 30%, ${markerColor}33 100%);
              border: 2px solid ${isSelected ? '#FFFFFF' : markerColor};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 ${isCritical ? '20px' : '10px'} ${markerColor}99;
              transition: transform 0.2s ease;
            ">
              <div style="
                width: ${isSelected ? '8px' : '6px'};
                height: ${isSelected ? '8px' : '6px'};
                border-radius: 50%;
                background: #FFFFFF;
                box-shadow: 0 0 5px #FFFFFF;
              "></div>
            </div>
          </div>
        </div>
      `;

      // Detailed tactical popup on hover/click
      const popup = new maplibregl.Popup({
        offset: [0, -16],
        closeButton: true,
        closeOnClick: false,
        className: 'tactical-event-popup',
      }).setHTML(`
        <div style="font-family: monospace; font-size: 11px; min-width: 220px; line-height: 1.4;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1A374F; padding-bottom: 4px; margin-bottom: 5px;">
            <strong style="color: #EAF4F7; font-size: 12px;">${event.id}</strong>
            <span style="background: ${markerColor}20; color: ${markerColor}; border: 1px solid ${markerColor}60; padding: 1px 5px; border-radius: 3px; font-weight: bold; font-size: 9px;">
              ${event.priority_level} • ${Math.round(event.confidence * 100)}%
            </span>
          </div>
          <div style="color: #19C7D8; font-weight: bold; font-size: 11px; margin-bottom: 5px;">
            ${event.probable_source}
          </div>
          <div style="background: rgba(10, 25, 41, 0.7); border: 1px solid rgba(26, 55, 79, 0.6); border-radius: 4px; padding: 5px; margin-bottom: 5px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #8EA6B6;">Peak FRP:</span>
              <strong style="color: #FFCC00;">${event.peak_frp} MW</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #8EA6B6;">Baseline Anomaly:</span>
              <strong style="color: ${event.anomaly_ratio >= 2.5 ? '#FF4D4D' : '#4DA3FF'};">${event.anomaly_ratio}× Historical</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #8EA6B6;">Facility Proximity:</span>
              <strong style="color: #19C7D8;">${event.facility_distance_km} km</strong>
            </div>
          </div>
          <div style="color: #2ED573; font-size: 9.5px; text-align: center; background: rgba(46, 213, 115, 0.1); border: 1px dashed rgba(46, 213, 115, 0.3); padding: 2px 4px; border-radius: 3px;">
            ⚡ CLICK TO LAUNCH INVESTIGATION
          </div>
        </div>
      `);

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.12)';
        popup.addTo(map.current!);
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1.0)';
        if (!isSelected) popup.remove();
      });

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectEvent(event);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([event.lon, event.lat])
        .setPopup(popup)
        .addTo(map.current);

      if (isSelected) {
        popup.addTo(map.current);
      }

      markersRef.current[event.id] = marker;
    });
  }, [events, selectedEventId]);

  // ─── Contextual Fusion Link & Smooth Camera FlyTo ───
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const m = map.current;

    const linkSource = m.getSource('context-link-source') as maplibregl.GeoJSONSource;

    if (!selectedEventId) {
      if (linkSource) {
        linkSource.setData({ type: 'FeatureCollection', features: [] });
      }
      return;
    }

    const selected = events.find((e) => e.id === selectedEventId);
    if (!selected) return;

    if (selectedEventId === 'EVT-1048') {
      // Connect EVT-1048 to Reliance Jamnagar Petrochem (0.8 km)
      const eventCoord: [number, number] = [70.070, 22.470];
      const facCoord: [number, number] = [70.076, 22.474];

      if (linkSource) {
        linkSource.setData(getContextualLinkGeoJson(eventCoord, facCoord, {
          name: 'Proximity Fusion Link',
          distance: '0.8 km',
        }));
      }

      m.flyTo({
        center: [70.073, 22.472],
        zoom: 13.0,
        pitch: 35,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    } else if (selectedEventId === 'EVT-0921') {
      const eventCoord: [number, number] = [72.540, 23.020];
      const facCoord: [number, number] = [72.543, 23.023];

      if (linkSource) {
        linkSource.setData(getContextualLinkGeoJson(eventCoord, facCoord, {
          name: 'Proximity Fusion Link',
          distance: '0.4 km',
        }));
      }

      m.flyTo({
        center: [72.542, 23.021],
        zoom: 13.2,
        pitch: 25,
        speed: 1.2,
        essential: true,
      });
    } else {
      if (linkSource) {
        linkSource.setData({ type: 'FeatureCollection', features: [] });
      }
      m.flyTo({
        center: [selected.lon, selected.lat],
        zoom: 11.5,
        speed: 1.2,
        essential: true,
      });
    }
  }, [selectedEventId, mapLoaded, events]);

  // ─── Fit Monitored Events ───
  const handleFitEvents = useCallback(() => {
    if (!map.current || events.length === 0) return;
    const bounds = new maplibregl.LngLatBounds();
    events.forEach((e) => bounds.extend([e.lon, e.lat]));
    map.current.fitBounds(bounds, { padding: 90, maxZoom: 11, duration: 1200 });
  }, [events]);

  // ─── Reset View to India Theater ───
  const handleResetView = useCallback(() => {
    if (!map.current) return;
    map.current.fitBounds(INDIA_BOUNDS, {
      padding: { top: 40, bottom: 40, left: 40, right: 40 },
      pitch: 0,
      duration: 1300,
    });
  }, []);

  return (
    <div className="relative w-full h-full bg-bg-main overflow-hidden font-mono">
      {/* MapLibre Canvas Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* ─── Top-Left: Sleek Unified Operations & Theater Bar ─── */}
      <div className="absolute top-3.5 left-4 flex items-center gap-2 z-10 select-none">
        <div className="bg-bg-panel/95 backdrop-blur border border-border-subtle rounded-md px-3 py-1.5 flex items-center gap-2.5 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] font-bold text-text-primary tracking-wider uppercase">
            INDIA THEATER
          </span>
          <span className="text-[9px] text-cyan font-bold bg-cyan/15 px-1.5 py-0.2 rounded border border-cyan/30">
            DEMO GRID
          </span>

          <div className="h-3 w-[1px] bg-border-subtle mx-1" />

          {/* Quick Theater View Controls */}
          <button
            onClick={handleResetView}
            title="Reset Map to Full India View"
            className="px-2 py-1 rounded text-[11px] text-text-muted hover:text-cyan hover:bg-bg-hover transition-colors flex items-center gap-1 font-bold group"
          >
            <RotateCcw className="w-3 h-3 group-hover:rotate-[-45deg] transition-transform" />
            <span>Reset (India)</span>
          </button>
          <button
            onClick={handleFitEvents}
            title="Fit All Monitored Events"
            className="px-2 py-1 rounded text-[11px] text-text-muted hover:text-cyan hover:bg-bg-hover transition-colors flex items-center gap-1 font-bold"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Fit Events</span>
          </button>
        </div>
      </div>

      {/* ─── Top-Right: Horizontal Intelligence Layer Toggles ─── */}
      <div className="absolute top-3.5 right-4 flex items-center gap-1.5 z-10 select-none">
        <div className="bg-bg-panel/95 backdrop-blur border border-border-subtle rounded-md p-1 flex items-center gap-1 shadow-2xl">
          {/* Thermal Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            title="Toggle Satellite Thermal Heatmap"
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
              showHeatmap
                ? 'bg-warning/20 text-warning border border-warning/40'
                : 'text-text-muted hover:bg-bg-hover border border-transparent'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Heatmap</span>
          </button>

          {/* Observation Points Toggle */}
          <button
            onClick={() => setShowObservations(!showObservations)}
            title="Toggle Sensor Observation Points"
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
              showObservations
                ? 'bg-cyan/20 text-cyan border border-cyan/40'
                : 'text-text-muted hover:bg-bg-hover border border-transparent'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Sensors</span>
          </button>

          {/* OSM Facilities Toggle */}
          <button
            onClick={() => setShowFacilities(!showFacilities)}
            title="Toggle Industrial Facilities"
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
              showFacilities
                ? 'bg-kxblue/20 text-kxblue border border-kxblue/40'
                : 'text-text-muted hover:bg-bg-hover border border-transparent'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Facilities</span>
          </button>
        </div>
      </div>

      {/* ─── Center-Top: Contextual Fusion Risk Alert (When EVT-1048 Selected) ─── */}
      {selectedEventId === 'EVT-1048' && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-bg-panel/95 backdrop-blur border border-critical/70 rounded-md px-3.5 py-1.5 z-10 shadow-2xl flex items-center gap-2.5 animate-fade-in select-none">
          <ShieldAlert className="w-4 h-4 text-critical animate-pulse" />
          <div className="text-[11px] font-bold text-text-primary flex items-center gap-2">
            <span className="text-critical uppercase">CONTEXTUAL FUSION MATCH:</span>
            <span>EVT-1048 ╌╌ 0.8 km ╌╌ Reliance Jamnagar Petrochemical Complex</span>
            <span className="text-[9px] bg-critical text-white px-1.5 py-0.5 rounded font-bold uppercase">HIGH RISK</span>
          </div>
        </div>
      )}

      {/* ─── Bottom-Left: Slim, Non-Obstructive Intelligence Legend ─── */}
      <div className="absolute bottom-4 left-4 bg-bg-panel/95 backdrop-blur border border-border-subtle rounded-md px-3 py-2 z-10 select-none shadow-2xl flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[10px]">
        {/* Thermal Density Gradient Bar */}
        <div className="flex items-center gap-2">
          <span className="text-text-muted uppercase font-bold text-[9px] tracking-wider">THERMAL (MW):</span>
          <div className="w-20 h-2 rounded-sm bg-gradient-to-r from-cyan/50 via-warning to-critical" />
          <span className="text-[9px] text-text-dim">&lt;15 → &gt;45</span>
        </div>

        <div className="h-3 w-[1px] bg-border-subtle" />

        {/* Priority Target Classes */}
        <div className="flex items-center gap-2.5">
          <span className="text-text-muted uppercase font-bold text-[9px] tracking-wider">TARGETS:</span>
          <div className="flex items-center gap-1 text-critical font-bold">
            <span className="w-2 h-2 rounded-full bg-critical animate-pulse shadow-[0_0_6px_#FF4D4D]" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1 text-warning font-bold">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1 text-kxblue font-bold">
            <span className="w-2 h-2 rounded-full bg-kxblue" />
            <span>Moderate</span>
          </div>
        </div>

        <div className="h-3 w-[1px] bg-border-subtle" />

        {/* Tactical Geospatial Context Entities */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 text-text-muted">
            <span className="w-2 h-2 rounded-full border border-cyan bg-[#0F2B48]" />
            <span>OSM Facility</span>
          </div>
          <div className="flex items-center gap-1 text-critical text-[9px]">
            <span>╌╌</span>
            <span>0.8km Proximity Link</span>
          </div>
        </div>
      </div>
    </div>
  );
};
