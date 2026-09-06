import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { Maximize2, RotateCcw, Layers, Factory, Flame, Radio, Compass, Eye, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import { EventSummary } from '../../types/event';
import { getThermalObservationsGeoJson, DEMO_THERMAL_OBSERVATIONS } from '../../data/thermalObservations';
import { getFacilitiesGeoJson, DEMO_FACILITIES, getContextualLinkGeoJson } from '../../data/facilitiesData';
import { INDIA_TACTICAL_BOUNDARIES } from '../../data/indiaBoundaries';

interface EventMapProps {
  events: EventSummary[];
  selectedEventId: string | null;
  onSelectEvent: (event: EventSummary) => void;
}

// India geographic bounding box (SW to NE)
const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [68.0, 7.5],   // Southwest coordinates
  [97.5, 35.8],  // Northeast coordinates
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
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Active facility HUD popup
  const [facilityPopup, setFacilityPopup] = useState<{
    name: string;
    type: string;
    category: string;
    status: string;
    proximity: string;
    x: number;
    y: number;
  } | null>(null);

  // ─── Initialize MapLibre with India Focus ───
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

    mapInstance.addControl(
      new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }),
      'top-right'
    );

    mapInstance.on('load', () => {
      setMapLoaded(true);

      // Fit initially to India view
      mapInstance.fitBounds(INDIA_BOUNDS, {
        padding: { top: 30, bottom: 30, left: 30, right: 30 },
        duration: 0,
      });

      // ─── 1. Tactical India Boundaries Source & Layers ───
      mapInstance.addSource('india-tactical-boundaries', {
        type: 'geojson',
        data: INDIA_TACTICAL_BOUNDARIES,
      });

      // Ambient boundary cyan glow
      mapInstance.addLayer({
        id: 'india-border-glow',
        type: 'line',
        source: 'india-tactical-boundaries',
        paint: {
          'line-color': '#19C7D8',
          'line-width': 3,
          'line-opacity': 0.2,
          'line-blur': 2,
        },
      });

      // Sharp tactical dashed border line
      mapInstance.addLayer({
        id: 'india-border-line',
        type: 'line',
        source: 'india-tactical-boundaries',
        paint: {
          'line-color': '#19C7D8',
          'line-width': 1.2,
          'line-opacity': 0.45,
          'line-dasharray': [3, 2],
        },
      });

      // ─── 2. Thermal Observations Source & Heatmap Layer ───
      const observationsGeoJson = getThermalObservationsGeoJson();

      mapInstance.addSource('thermal-observations-source', {
        type: 'geojson',
        data: observationsGeoJson,
      });

      // Satellite Thermal Heatmap Layer
      mapInstance.addLayer({
        id: 'thermal-heatmap-layer',
        type: 'heatmap',
        source: 'thermal-observations-source',
        maxzoom: 14,
        paint: {
          // Weight calculation based on Fire Radiative Power (MW)
          'heatmap-weight': ['get', 'weight'],
          // Increase intensity progressively with zoom
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, 0.7,
            5, 1.4,
            8, 2.2,
            11, 3.2
          ],
          // Intelligence-grade thermal color ramp: Cyan -> Cobalt -> Amber -> Orange -> Crimson Red
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',
            0.12, 'rgba(25, 199, 216, 0.35)',   // Cyan (Low thermal baseline)
            0.32, 'rgba(0, 150, 255, 0.65)',   // Electric Blue
            0.55, 'rgba(255, 204, 0, 0.82)',   // Warm Amber (Moderate activity)
            0.75, 'rgba(255, 120, 0, 0.92)',   // Orange (High thermal activity)
            1.0, 'rgba(255, 45, 45, 0.98)'     // Crimson Red (Critical intensity)
          ],
          // Smooth radius expansion per zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, 16,
            5, 28,
            8, 52,
            11, 85
          ],
          'heatmap-opacity': 0.82,
        },
      });

      // Observation Points Outer Glow
      mapInstance.addLayer({
        id: 'thermal-points-glow',
        type: 'circle',
        source: 'thermal-observations-source',
        minzoom: 4.5,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4, 4,
            8, 9,
            12, 16
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
          'circle-opacity': 0.25,
          'circle-blur': 1.0,
        },
      });

      // Individual Sensor Detection Dots
      mapInstance.addLayer({
        id: 'thermal-points-layer',
        type: 'circle',
        source: 'thermal-observations-source',
        minzoom: 4.5,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4, 2.5,
            7, 4.5,
            11, 7.5
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
          'circle-stroke-color': '#EAF4F7',
          'circle-stroke-width': 1,
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4, 0.45,
            6, 0.85,
            10, 1.0
          ],
        },
      });

      // ─── 3. OSM Industrial Facilities Source & Layers ───
      const facilitiesGeoJson = getFacilitiesGeoJson();

      mapInstance.addSource('osm-facilities-source', {
        type: 'geojson',
        data: facilitiesGeoJson,
      });

      // Facility marker outer ambient ring
      mapInstance.addLayer({
        id: 'facilities-halo-layer',
        type: 'circle',
        source: 'osm-facilities-source',
        paint: {
          'circle-radius': 9,
          'circle-color': 'rgba(25, 199, 216, 0.15)',
          'circle-stroke-color': '#19C7D8',
          'circle-stroke-width': 1,
          'circle-stroke-opacity': 0.4,
        },
      });

      // Facility core symbol marker
      mapInstance.addLayer({
        id: 'facilities-point-layer',
        type: 'circle',
        source: 'osm-facilities-source',
        paint: {
          'circle-radius': 4.5,
          'circle-color': '#0F2B48',
          'circle-stroke-color': '#19C7D8',
          'circle-stroke-width': 2,
        },
      });

      // ─── 4. Contextual Fusion Link Layer (Connecting Line) ───
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
          'line-width': 6,
          'line-opacity': 0.25,
          'line-blur': 3,
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
          'line-opacity': 0.9,
        },
      });

      // ─── Hover Events for Sensor Observation Points ───
      mapInstance.on('mouseenter', 'thermal-points-layer', (e) => {
        if (!e.features || !e.features[0]) return;
        mapInstance.getCanvas().style.cursor = 'pointer';
        const props = e.features[0].properties as any;
        const coords = (e.features[0].geometry as any).coordinates.slice();

        if (activePopupRef.current) activePopupRef.current.remove();

        activePopupRef.current = new maplibregl.Popup({ offset: 12, closeButton: false })
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

        new maplibregl.Popup({ offset: 14 })
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
    setVisibility('thermal-points-glow', showObservations);
    setVisibility('thermal-points-layer', showObservations);
    setVisibility('facilities-halo-layer', showFacilities);
    setVisibility('facilities-point-layer', showFacilities);
    setVisibility('india-border-glow', showBoundaries);
    setVisibility('india-border-line', showBoundaries);
  }, [showHeatmap, showObservations, showFacilities, showBoundaries, mapLoaded]);

  // ─── Render Interactive Primary Demo Event Markers ───
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
      const opacity = selectedEventId && !isSelected ? '0.45' : '1.0';

      const el = document.createElement('div');
      el.className = 'cursor-pointer transition-all duration-300 transform select-none';
      el.style.opacity = opacity;
      el.style.zIndex = isSelected ? '50' : isCritical ? '40' : '30';

      // Advanced Tactical Marker Design
      el.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <!-- Top Event ID Label Pill -->
          <div style="
            background: rgba(14, 36, 56, 0.95);
            border: 1px solid ${markerColor};
            border-radius: 4px;
            padding: 2px 6px;
            margin-bottom: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
          ">
            <span style="width: 5px; height: 5px; border-radius: 50%; background: ${markerColor}; ${isCritical ? 'animation: ping 1.2s cubic-bezier(0,0,0.2,1) infinite;' : ''}"></span>
            <span style="font-family: monospace; font-size: 10px; font-weight: bold; color: #EAF4F7;">${event.id}</span>
            <span style="font-family: monospace; font-size: 9px; font-weight: bold; color: ${markerColor};">${event.priority_level}</span>
          </div>

          <!-- Central Glowing Beacon -->
          <div style="
            position: relative;
            width: ${isSelected ? '36px' : isCritical ? '32px' : '26px'};
            height: ${isSelected ? '36px' : isCritical ? '32px' : '26px'};
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <!-- Radar ping rings for critical and selected -->
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
              box-shadow: 0 0 ${isCritical ? '24px' : '14px'} ${markerColor}99;
              transition: transform 0.2s ease;
            ">
              <div style="
                width: ${isSelected ? '10px' : '8px'};
                height: ${isSelected ? '10px' : '8px'};
                border-radius: 50%;
                background: #FFFFFF;
                box-shadow: 0 0 6px #FFFFFF;
              "></div>
            </div>
          </div>
        </div>
      `;

      // Hover and Click Callout Popup
      const popup = new maplibregl.Popup({
        offset: [0, -18],
        closeButton: true,
        closeOnClick: false,
        className: 'tactical-event-popup',
      }).setHTML(`
        <div style="font-family: monospace; font-size: 11px; min-width: 230px; line-height: 1.4;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1A374F; padding-bottom: 4px; margin-bottom: 6px;">
            <strong style="color: #EAF4F7; font-size: 12px; letter-spacing: 0.5px;">${event.id}</strong>
            <span style="
              background: ${markerColor}20;
              color: ${markerColor};
              border: 1px solid ${markerColor}60;
              padding: 1px 6px;
              border-radius: 3px;
              font-weight: bold;
              font-size: 10px;
            ">
              ${event.priority_level} • ${Math.round(event.confidence * 100)}%
            </span>
          </div>

          <!-- Classification -->
          <div style="color: #19C7D8; font-weight: bold; font-size: 11px; margin-bottom: 6px;">
            ${event.probable_source}
          </div>

          <!-- Telemetry Grid -->
          <div style="background: rgba(10, 25, 41, 0.6); border: 1px solid rgba(26, 55, 79, 0.6); border-radius: 4px; padding: 6px; margin-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #8EA6B6;">Peak FRP:</span>
              <strong style="color: #FFCC00;">${event.peak_frp} MW</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #8EA6B6;">Baseline Anomaly:</span>
              <strong style="color: ${event.anomaly_ratio >= 2.5 ? '#FF4D4D' : '#4DA3FF'};">${event.anomaly_ratio}× Historical</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #8EA6B6;">Contextual Distance:</span>
              <strong style="color: #19C7D8;">${event.facility_distance_km} km to Facility</strong>
            </div>
          </div>

          <!-- Action hint -->
          <div style="color: #2ED573; font-size: 10px; text-align: center; background: rgba(46, 213, 115, 0.1); border: 1px dashed rgba(46, 213, 115, 0.4); padding: 3px 6px; border-radius: 3px;">
            ⚡ CLICK MARKER TO LAUNCH INVESTIGATION
          </div>
        </div>
      `);

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.15)';
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

      // If this event is selected, open its popup automatically
      if (isSelected) {
        popup.addTo(map.current);
      }

      markersRef.current[event.id] = marker;
    });
  }, [events, selectedEventId]);

  // ─── Contextual Fusion Link & Smooth Camera Zoom ───
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const m = map.current;

    const linkSource = m.getSource('context-link-source') as maplibregl.GeoJSONSource;

    if (!selectedEventId) {
      // Clear line
      if (linkSource) {
        linkSource.setData({ type: 'FeatureCollection', features: [] });
      }
      return;
    }

    const selected = events.find((e) => e.id === selectedEventId);
    if (!selected) return;

    // Determine nearby facility for contextual link
    if (selectedEventId === 'EVT-1048') {
      // EVT-1048 to Reliance Jamnagar Petrochemical Complex (0.8 km)
      const eventCoord: [number, number] = [70.070, 22.470];
      const facCoord: [number, number] = [70.076, 22.474];

      if (linkSource) {
        linkSource.setData(getContextualLinkGeoJson(eventCoord, facCoord, {
          name: 'Proximity Fusion Link',
          distance: '0.8 km',
        }));
      }

      // Smooth cinematic zoom into the event and facility
      m.flyTo({
        center: [70.073, 22.472],
        zoom: 13.2,
        pitch: 35,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    } else if (selectedEventId === 'EVT-0921') {
      // EVT-0921 to Vatva Chemical Processing Zone (0.4 km)
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
        zoom: 13.5,
        pitch: 30,
        speed: 1.2,
        essential: true,
      });
    } else if (selectedEventId === 'EVT-1182') {
      // Clear line (rural agricultural burn)
      if (linkSource) {
        linkSource.setData({ type: 'FeatureCollection', features: [] });
      }

      m.flyTo({
        center: [selected.lon, selected.lat],
        zoom: 11.5,
        pitch: 20,
        speed: 1.2,
        essential: true,
      });
    } else {
      m.flyTo({
        center: [selected.lon, selected.lat],
        zoom: 12.0,
        speed: 1.2,
        essential: true,
      });
    }
  }, [selectedEventId, mapLoaded, events]);

  // ─── Fit All Events ───
  const handleFitEvents = useCallback(() => {
    if (!map.current || events.length === 0) return;
    const bounds = new maplibregl.LngLatBounds();
    events.forEach((e) => bounds.extend([e.lon, e.lat]));
    map.current.fitBounds(bounds, { padding: 90, maxZoom: 12, duration: 1200 });
  }, [events]);

  // ─── Reset View to India Theater ───
  const handleResetView = useCallback(() => {
    if (!map.current) return;
    map.current.fitBounds(INDIA_BOUNDS, {
      padding: { top: 35, bottom: 35, left: 35, right: 35 },
      pitch: 0,
      duration: 1400,
    });
  }, []);

  return (
    <div className="relative w-full h-full bg-bg-main overflow-hidden font-mono">
      {/* MapLibre Canvas Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Top Banner: Operations Theater Indicator */}
      <div className="absolute top-4 right-14 bg-bg-panel/90 backdrop-blur border border-border-subtle rounded px-3 py-1.5 z-10 flex items-center gap-2.5 shadow-lg select-none">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
        <span className="text-[11px] font-bold text-text-primary tracking-wider uppercase">
          INDIA THEATER • THERMAL INTELLIGENCE GRID
        </span>
        <span className="text-[10px] text-cyan font-bold bg-cyan/15 px-2 py-0.5 rounded border border-cyan/30">
          DEMO DATA
        </span>
      </div>

      {/* Floating Tactical HUD Controls (Top-Left) */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 select-none">
        {/* Navigation Actions */}
        <div className="bg-bg-panel/95 backdrop-blur border border-border-subtle rounded p-1.5 flex flex-col gap-1 shadow-2xl">
          <div className="px-2 py-1 text-[9px] font-bold text-text-dim uppercase tracking-wider border-b border-border-subtle/50 mb-0.5 flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-cyan" />
            <span>THEATER VIEWS</span>
          </div>
          <button
            onClick={handleResetView}
            title="Reset Map to Full India View"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded text-xs text-text-muted hover:text-cyan hover:bg-bg-hover transition-colors text-left group"
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
            <span>Reset (India)</span>
          </button>
          <button
            onClick={handleFitEvents}
            title="Fit All Monitored Events"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded text-xs text-text-muted hover:text-cyan hover:bg-bg-hover transition-colors text-left"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fit Events</span>
          </button>
        </div>

        {/* Intelligence Layer Toggles */}
        <div className="bg-bg-panel/95 backdrop-blur border border-border-subtle rounded p-1.5 flex flex-col gap-1 shadow-2xl">
          <div className="px-2 py-1 text-[9px] font-bold text-text-dim uppercase tracking-wider border-b border-border-subtle/50 mb-0.5 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-warning" />
            <span>INTELLIGENCE LAYERS</span>
          </div>

          {/* Thermal Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center justify-between gap-3 px-2.5 py-1.5 rounded text-xs transition-colors text-left ${
              showHeatmap ? 'text-warning bg-warning/15 border border-warning/30 font-bold' : 'text-text-muted hover:bg-bg-hover border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Thermal Heatmap</span>
            </div>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${showHeatmap ? 'bg-warning text-bg-main' : 'text-text-dim'}`}>
              {showHeatmap ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Sensor Observation Points Toggle */}
          <button
            onClick={() => setShowObservations(!showObservations)}
            className={`flex items-center justify-between gap-3 px-2.5 py-1.5 rounded text-xs transition-colors text-left ${
              showObservations ? 'text-cyan bg-cyan/15 border border-cyan/30 font-bold' : 'text-text-muted hover:bg-bg-hover border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5" />
              <span>Sensor Points</span>
            </div>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${showObservations ? 'bg-cyan text-bg-main' : 'text-text-dim'}`}>
              {showObservations ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* OSM Facilities Toggle */}
          <button
            onClick={() => setShowFacilities(!showFacilities)}
            className={`flex items-center justify-between gap-3 px-2.5 py-1.5 rounded text-xs transition-colors text-left ${
              showFacilities ? 'text-kxblue bg-kxblue/15 border border-kxblue/30 font-bold' : 'text-text-muted hover:bg-bg-hover border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <Factory className="w-3.5 h-3.5" />
              <span>OSM Facilities</span>
            </div>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${showFacilities ? 'bg-kxblue text-bg-main' : 'text-text-dim'}`}>
              {showFacilities ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* State Boundaries Toggle */}
          <button
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`flex items-center justify-between gap-3 px-2.5 py-1.5 rounded text-xs transition-colors text-left ${
              showBoundaries ? 'text-text-primary bg-bg-hover border border-border-subtle font-bold' : 'text-text-muted hover:bg-bg-hover border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5" />
              <span>State Grid</span>
            </div>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${showBoundaries ? 'bg-text-muted text-bg-main' : 'text-text-dim'}`}>
              {showBoundaries ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* Proximity Risk HUD Pill (Visible when EVT-1048 is selected) */}
      {selectedEventId === 'EVT-1048' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-critical/15 backdrop-blur border border-critical/60 rounded px-4 py-2 z-10 shadow-2xl flex items-center gap-3 animate-fade-in">
          <ShieldAlert className="w-4 h-4 text-critical animate-pulse" />
          <div>
            <div className="text-[11px] font-bold text-critical flex items-center gap-2">
              <span>CONTEXTUAL FUSION MATCH DETECTED</span>
              <span className="text-[9px] bg-critical text-white px-1.5 py-0.5 rounded font-bold">0.8 KM</span>
            </div>
            <div className="text-[10px] text-text-muted">
              EVT-1048 Anomaly (3.71×) ╌╌ Reliance Jamnagar Petrochemical Complex
            </div>
          </div>
        </div>
      )}

      {/* Bottom-Left Segregated Tactical Map Legend */}
      <div className="absolute bottom-5 left-4 bg-bg-panel/95 backdrop-blur border border-border-subtle rounded-md p-3 z-10 select-none shadow-2xl max-w-[340px] space-y-2.5">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-border-subtle/70 pb-1.5">
          <span className="text-[10px] font-bold text-text-primary tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan" />
            <span>Tactical Map Telemetry</span>
          </span>
          <span className="text-[9px] text-cyan font-bold bg-cyan/15 px-1.5 py-0.5 rounded">
            48 OBS SENSORS
          </span>
        </div>

        {/* 1. Thermal Intensity Heatmap Gradient */}
        <div>
          <div className="flex items-center justify-between text-[10px] text-text-muted mb-1">
            <span>SATELLITE THERMAL INTENSITY</span>
            <span className="text-text-dim text-[9px]">(MW FRP)</span>
          </div>
          <div className="h-2 w-full rounded-sm bg-gradient-to-r from-cyan/40 via-kxblue to-warning via-orange-500 to-critical mb-1 shadow-inner" />
          <div className="flex items-center justify-between text-[9px] text-text-dim">
            <span>Low (&lt;15)</span>
            <span>Med (25)</span>
            <span>High (35)</span>
            <span className="text-critical font-bold">Extreme (&gt;45)</span>
          </div>
        </div>

        {/* 2. Primary Event Priority Targets */}
        <div>
          <div className="text-[10px] text-text-muted mb-1">EVENT PRIORITY TARGETS</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-critical animate-pulse shadow-[0_0_8px_rgba(255,77,77,0.8)]"></span>
              <span className="text-critical font-bold">Critical</span>
              <span className="text-[9px] text-text-dim">(EVT-1048)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-warning"></span>
              <span className="text-warning">High Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-kxblue"></span>
              <span className="text-kxblue font-bold">Moderate</span>
              <span className="text-[9px] text-text-dim">(EVT-0921)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan"></span>
              <span className="text-cyan">Low Priority</span>
            </div>
          </div>
        </div>

        {/* 3. Tactical Geospatial Context Entities */}
        <div className="border-t border-border-subtle/50 pt-1.5 flex items-center justify-between text-[10px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-cyan bg-[#0F2B48] flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-cyan"></span>
            </span>
            <span>OSM Industrial Facility</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-critical">
            <span className="tracking-tighter">╌╌╌</span>
            <span>0.8km Context Link</span>
          </div>
        </div>
      </div>
    </div>
  );
};
