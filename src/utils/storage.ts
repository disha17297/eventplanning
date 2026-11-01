import { EventData, EventType } from '../types';
import { createInitialEvent } from '../data/presets';

const STORAGE_KEY_ACTIVE = 'hostmate_active_event_id';
const STORAGE_KEY_EVENTS = 'hostmate_all_events';

export function getStoredEvents(): EventData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (!raw) {
      // Seed default wedding event
      const initial = createInitialEvent('wedding');
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify([initial]));
      localStorage.setItem(STORAGE_KEY_ACTIVE, initial.id);
      return [initial];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = createInitialEvent('wedding');
    return [initial];
  } catch (e) {
    console.error('Failed to load events from storage:', e);
    return [createInitialEvent('wedding')];
  }
}

export function saveEvents(events: EventData[]) {
  try {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save events:', e);
  }
}

export function getActiveEventId(): string {
  const active = localStorage.getItem(STORAGE_KEY_ACTIVE);
  if (active) return active;
  const events = getStoredEvents();
  return events[0]?.id || '';
}

export function setActiveEventId(id: string) {
  localStorage.setItem(STORAGE_KEY_ACTIVE, id);
}

export function saveActiveEvent(updated: EventData): EventData[] {
  const all = getStoredEvents();
  const index = all.findIndex((e) => e.id === updated.id);
  let newEvents: EventData[];
  if (index >= 0) {
    newEvents = [...all];
    newEvents[index] = { ...updated, updatedAt: new Date().toISOString() };
  } else {
    newEvents = [...all, updated];
  }
  saveEvents(newEvents);
  setActiveEventId(updated.id);
  return newEvents;
}

export function formatCurrency(amount: number, currency: string = '₹'): string {
  try {
    return `${currency} ${Number(amount || 0).toLocaleString('en-IN')}`;
  } catch {
    return `${currency} ${amount}`;
  }
}
