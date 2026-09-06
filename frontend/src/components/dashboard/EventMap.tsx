import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Maximize2, RotateCcw, Layers, Factory, Flame } from 'lucide-react';
import { EventSummary } from '../../types/event';

interface EventMapProps {
  events: EventSummary[];
  selectedEventId: string | null;
  onSelectEvent: (event: EventSummary) => void;
}

export const EventMap: React.FC<EventMapProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});
  const [showFacilities, setShowFacilities] = useState(true);
  const [showThermalLayer, setShowThermalLayer] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Dark Map Style with fallback
    const styleUrl = {
      version: 8 as const,
      sources: {
        'carto-dark': {
          type: 'raster' as const,
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }
      },
      layers: [
        {
          id: 'carto-dark-layer',
          type: 'raster' as const,
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    };

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [71.5, 22.5], // Centered around Western India industrial belt
      zoom: 6.8,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update Markers
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

      let markerColor = '#19C7D8'; // Cyan
      if (isCritical) markerColor = '#FF4D4D'; // Red
      else if (isHigh) markerColor = '#FF9F1C'; // Orange
      else if (isModerate) markerColor = '#4DA3FF'; // Blue/Amber

      // Custom DOM Marker element
      const el = document.createElement('div');
      el.className = 'cursor-pointer transition-transform duration-200 transform hover:scale-125';
      el.style.width = isSelected ? '32px' : '24px';
      el.style.height = isSelected ? '32px' : '24px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      // Inner icon and radar ring
      el.innerHTML = `
        <div style="
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: ${markerColor}25;
          border: 2px solid ${markerColor};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 ${isCritical ? '16px' : '8px'} ${markerColor}80;
        ">
          <div style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${markerColor};
          "></div>
          ${isCritical ? `
            <div style="
              position: absolute;
              inset: -6px;
              border-radius: 50%;
              border: 1.5px solid ${markerColor};
              opacity: 0.7;
              animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          ` : ''}
        </div>
      `;

      // Popup
      const popup = new maplibregl.Popup({ offset: 18, closeButton: false })
        .setHTML(`
          <div style="font-family: monospace; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="color: #EAF4F7;">${event.id}</strong>
              <span style="color: ${markerColor}; font-weight: bold;">${event.priority_level}</span>
            </div>
            <div style="color: #19C7D8; margin-bottom: 3px;">${event.probable_source}</div>
            <div style="color: #8EA6B6;">Peak FRP: <strong>${event.peak_frp} MW</strong></div>
            <div style="color: #8EA6B6;">Baseline: <strong>${event.anomaly_ratio}×</strong></div>
            <div style="color: #8EA6B6;">Facility: <strong>${event.facility_distance_km} km</strong></div>
          </div>
        `);

      el.addEventListener('mouseenter', () => popup.addTo(map.current!));
      el.addEventListener('mouseleave', () => popup.remove());
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectEvent(event);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([event.lon, event.lat])
        .setPopup(popup)
        .addTo(map.current);

      markersRef.current[event.id] = marker;
    });
  }, [events, selectedEventId]);

  // Center on selected event
  useEffect(() => {
    if (!map.current || !selectedEventId) return;
    const selected = events.find((e) => e.id === selectedEventId);
    if (selected) {
      map.current.flyTo({
        center: [selected.lon, selected.lat],
        zoom: 11,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    }
  }, [selectedEventId]);

  const handleFitEvents = () => {
    if (!map.current || events.length === 0) return;
    const bounds = new maplibregl.LngLatBounds();
    events.forEach((e) => bounds.extend([e.lon, e.lat]));
    map.current.fitBounds(bounds, { padding: 80, maxZoom: 12 });
  };

  const handleResetView = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: [71.5, 22.5],
      zoom: 6.8,
      speed: 1.2,
      essential: true,
    });
  };

  return (
    <div className="relative w-full h-full bg-bg-main overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating Tactical Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 select-none">
        <div className="bg-bg-panel/90 backdrop-blur border border-border-subtle rounded p-1.5 flex flex-col gap-1 shadow-lg">
          <button
            onClick={handleFitEvents}
            title="Fit All Thermal Events"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-mono text-text-muted hover:text-cyan hover:bg-bg-hover transition-colors text-left"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fit Events</span>
          </button>
          <button
            onClick={handleResetView}
            title="Reset Map Center"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-mono text-text-muted hover:text-cyan hover:bg-bg-hover transition-colors text-left"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>
        </div>

        {/* Layer Toggles */}
        <div className="bg-bg-panel/90 backdrop-blur border border-border-subtle rounded p-1.5 flex flex-col gap-1 shadow-lg">
          <button
            onClick={() => setShowFacilities(!showFacilities)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-mono transition-colors text-left ${
              showFacilities ? 'text-cyan bg-cyan/10' : 'text-text-muted hover:bg-bg-hover'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>OSM Facilities</span>
          </button>
          <button
            onClick={() => setShowThermalLayer(!showThermalLayer)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-mono transition-colors text-left ${
              showThermalLayer ? 'text-warning bg-warning/10' : 'text-text-muted hover:bg-bg-hover'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Thermal Layer</span>
          </button>
        </div>
      </div>

      {/* Severity Legend */}
      <div className="absolute bottom-5 left-4 bg-bg-panel/90 backdrop-blur border border-border-subtle rounded px-3 py-2 z-10 select-none shadow-lg">
        <div className="text-[10px] font-mono tracking-wider text-text-muted mb-1.5 uppercase">
          SEVERITY LEVEL
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan"></span>
            <span className="text-text-primary">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-kxblue"></span>
            <span className="text-text-primary">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warning"></span>
            <span className="text-text-primary">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-critical animate-pulse"></span>
            <span className="text-critical font-bold">Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};
