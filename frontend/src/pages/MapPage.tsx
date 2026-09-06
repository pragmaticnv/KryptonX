import React, { useState, useEffect } from 'react';
import { EventMap } from '../components/dashboard/EventMap';
import { InvestigationDrawer } from '../components/investigation/InvestigationDrawer';
import { EventSummary, EventDetail } from '../types/event';
import { ApiService } from '../services/api';

interface MapPageProps {
  onSelectEventId: (id: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onSelectEventId }) => {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<EventDetail | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    ApiService.getEvents().then(setEvents);
  }, []);

  const handleSelectEvent = async (event: EventSummary) => {
    setSelectedId(event.id);
    onSelectEventId(event.id);
    const detail = await ApiService.getEventDetail(event.id);
    setSelectedDetail(detail);
    setIsDrawerOpen(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] bg-bg-main overflow-hidden">
      {/* Fullscreen Map */}
      <EventMap
        events={events}
        selectedEventId={selectedId}
        onSelectEvent={handleSelectEvent}
      />

      {/* Floating Tactical HUD Info */}
      <div className="absolute top-4 right-4 bg-bg-panel/90 backdrop-blur border border-border-subtle rounded p-3 text-xs font-mono select-none z-10 shadow-xl">
        <div className="text-[10px] text-text-dim uppercase">TACTICAL GEOSPATIAL HUD</div>
        <div className="text-text-primary font-bold mt-1">FULLSCREEN WORKSTATION</div>
        <div className="text-[10px] text-cyan mt-0.5">{events.length} ACTIVE THERMAL EVENTS</div>
      </div>

      {/* Investigation Drawer */}
      <InvestigationDrawer
        event={selectedDetail}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onStatusUpdate={async (id, action) => {
          await ApiService.updateEventStatus(id, action);
          const updated = await ApiService.getEventDetail(id);
          setSelectedDetail(updated);
        }}
      />
    </div>
  );
};
