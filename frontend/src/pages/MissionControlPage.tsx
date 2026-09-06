import React, { useState, useEffect } from 'react';
import { KpiStrip } from '../components/dashboard/KpiStrip';
import { FilterBar } from '../components/dashboard/FilterBar';
import { EventMap } from '../components/dashboard/EventMap';
import { EventQueue } from '../components/dashboard/EventQueue';
import { InvestigationDrawer } from '../components/investigation/InvestigationDrawer';
import { EventSummary, EventDetail, AnalyticsSummary } from '../types/event';
import { ApiService } from '../services/api';
import { DEFAULT_ANALYTICS } from '../data/seedData';

interface MissionControlPageProps {
  selectedEventId: string | null;
  onSelectEventId: (id: string | null) => void;
  searchQuery: string;
}

export const MissionControlPage: React.FC<MissionControlPageProps> = ({
  selectedEventId,
  onSelectEventId,
  searchQuery,
}) => {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(DEFAULT_ANALYTICS);
  const [activePriority, setActivePriority] = useState<string>('ALL');
  const [activeSource, setActiveSource] = useState<string>('ALL');
  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [selectedDetail, setSelectedDetail] = useState<EventDetail | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Load events & analytics
  const loadData = async () => {
    const evts = await ApiService.getEvents(activePriority, activeSource, activeStatus);
    const an = await ApiService.getAnalytics();
    setEvents(evts);
    setAnalytics(an);
  };

  useEffect(() => {
    loadData();
  }, [activePriority, activeSource, activeStatus]);

  // Handle event selection (from card, map marker, or prop)
  const handleSelectEvent = async (event: EventSummary) => {
    onSelectEventId(event.id);
    const detail = await ApiService.getEventDetail(event.id);
    setSelectedDetail(detail);
    setIsDrawerOpen(true);
  };

  // Sync when selectedEventId changes from external trigger
  useEffect(() => {
    if (selectedEventId) {
      ApiService.getEventDetail(selectedEventId).then((detail) => {
        setSelectedDetail(detail);
        setIsDrawerOpen(true);
      });
    }
  }, [selectedEventId]);

  // Handle triage action updates
  const handleStatusUpdate = async (eventId: string, action: string) => {
    await ApiService.updateEventStatus(eventId, action);
    // Reload local view
    loadData();
    const updated = await ApiService.getEventDetail(eventId);
    setSelectedDetail(updated);
  };

  // Apply search query filtering
  const filteredEvents = events.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.id.toLowerCase().includes(q) ||
      e.probable_source.toLowerCase().includes(q) ||
      e.nearest_facility.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-bg-main">
      {/* Top KPI Strip */}
      <KpiStrip
        analytics={analytics}
        activePriority={activePriority}
        onSelectPriority={(p) => setActivePriority(p)}
      />

      {/* Filter Toolbar */}
      <FilterBar
        priority={activePriority}
        onPriorityChange={setActivePriority}
        source={activeSource}
        onSourceChange={setActiveSource}
        status={activeStatus}
        onStatusChange={setActiveStatus}
        totalEvents={filteredEvents.length}
      />

      {/* Main Workspace: Tactical Map (Left) + Priority Event Queue (Right) */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 h-full relative">
          <EventMap
            events={filteredEvents}
            selectedEventId={selectedEventId}
            onSelectEvent={handleSelectEvent}
          />
        </div>

        {/* Right Event Queue */}
        <EventQueue
          events={filteredEvents}
          selectedEventId={selectedEventId}
          onSelectEvent={handleSelectEvent}
        />

        {/* Hero Investigation Drawer */}
        <InvestigationDrawer
          event={selectedDetail}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            onSelectEventId(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};
