import React from 'react';
import { Shield, ArrowUpDown } from 'lucide-react';
import { EventSummary } from '../../types/event';
import { EventCard } from './EventCard';

interface EventQueueProps {
  events: EventSummary[];
  selectedEventId: string | null;
  onSelectEvent: (event: EventSummary) => void;
}

export const EventQueue: React.FC<EventQueueProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
}) => {
  return (
    <div className="w-80 xl:w-96 bg-bg-secondary border-l border-border-subtle flex flex-col h-full shrink-0 select-none">
      {/* Queue Header */}
      <div className="p-3.5 border-b border-border-subtle bg-bg-panel flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan" />
          <span className="text-xs font-mono font-bold tracking-wider text-text-primary uppercase">
            PRIORITY EVENT QUEUE
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan bg-cyan/10 px-2 py-0.5 rounded border border-cyan/30">
          {events.length} LEADS
        </span>
      </div>

      {/* Event Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {events.length === 0 ? (
          <div className="p-8 text-center text-text-dim text-xs font-mono">
            No events match the active filter criteria.
          </div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isSelected={event.id === selectedEventId}
              onSelect={onSelectEvent}
            />
          ))
        )}
      </div>
    </div>
  );
};
