import { EventSummary, EventDetail, AnalyticsSummary, SourcesStatus } from '../types/event';
import { SEED_EVENTS, DEFAULT_ANALYTICS, DEFAULT_SOURCES } from '../data/seedData';

const BASE_URL = '/api';

// In-memory local state cache for instant reactivity and offline resilience
let localEvents: EventDetail[] = [...SEED_EVENTS];

export const ApiService = {
  async getEvents(priority?: string, source?: string, status?: string): Promise<EventSummary[]> {
    try {
      const params = new URLSearchParams();
      if (priority && priority !== 'ALL') params.append('priority', priority);
      if (source && source !== 'ALL') params.append('source', source);
      if (status && status !== 'ALL') params.append('status', status);

      const resp = await fetch(`${BASE_URL}/events?${params.toString()}`);
      if (resp.ok) {
        const data = await resp.json();
        return data.events;
      }
    } catch (e) {
      console.warn('Backend offline or unreachable, using local fallback state:', e);
    }

    // Fallback filter
    return localEvents.filter(e => {
      if (priority && priority !== 'ALL' && e.priority_level !== priority) return false;
      if (source && source !== 'ALL' && !e.probable_source.toLowerCase().includes(source.toLowerCase())) return false;
      if (status && status !== 'ALL' && e.status !== status) return false;
      return true;
    });
  },

  async getEventDetail(id: string): Promise<EventDetail> {
    try {
      const resp = await fetch(`${BASE_URL}/events/${id}`);
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.warn(`Backend fetch failed for ${id}, using fallback:`, e);
    }

    const found = localEvents.find(e => e.id === id);
    if (found) return found;
    return localEvents[0];
  },

  async updateEventStatus(id: string, action: string): Promise<boolean> {
    const actionMap: Record<string, 'REVIEW' | 'MONITOR' | 'ESCALATED' | 'CONFIRMED' | 'FALSE_POSITIVE'> = {
      review: 'REVIEW',
      confirm: 'CONFIRMED',
      false_positive: 'FALSE_POSITIVE',
      escalate: 'ESCALATED',
      monitor: 'MONITOR'
    };
    const newStatus = actionMap[action.toLowerCase()] || 'REVIEW';

    // Update local cache immediately
    const idx = localEvents.findIndex(e => e.id === id);
    if (idx !== -1) {
      localEvents[idx] = { ...localEvents[idx], status: newStatus };
    }

    try {
      await fetch(`${BASE_URL}/events/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note: `Analyst marked ${action}` })
      });
      return true;
    } catch (e) {
      return true; // local state was already updated
    }
  },

  async getAnalytics(): Promise<AnalyticsSummary> {
    try {
      const resp = await fetch(`${BASE_URL}/analytics/summary`);
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      // Fallback
    }
    return DEFAULT_ANALYTICS;
  },

  async getSourcesStatus(): Promise<SourcesStatus> {
    try {
      const resp = await fetch(`${BASE_URL}/sources/status`);
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      // Fallback
    }
    return DEFAULT_SOURCES;
  }
};
