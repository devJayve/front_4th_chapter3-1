import { create } from 'zustand';

import { Event } from '@/types.ts';

interface EventStore {
  events: Event[];
  filteredEvents: Event[];
  notifiedEvents: string[];
  setEvents: (events: Event[]) => void;
  setFilteredEvents: (events: Event[]) => void;
  setNotifiedEvents: (events: string[]) => void;
}

const useEventStore = create<EventStore>((set) => ({
  events: [],
  filteredEvents: [],
  notifiedEvents: [],
  setEvents: (events) => set({ events }),
  setFilteredEvents: (filteredEvents) => set({ filteredEvents }),
  setNotifiedEvents: (notifiedEvents) => set({ notifiedEvents }),
}));

export default useEventStore;
