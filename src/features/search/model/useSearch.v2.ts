import { useEffect, useState } from 'react';

import useCalendarStore from '@/entities/calendar/store/useCalendarStore.ts';
import useEventStore from '@/entities/event/store/useEventStore.ts';
import { getFilteredEvents } from '@/utils/eventUtils';

export const useSearch = () => {
  const { currentDate, view } = useCalendarStore();
  const [searchTerm, setSearchTerm] = useState('');

  const { events, filteredEvents, setFilteredEvents } = useEventStore();

  useEffect(() => {
    if (events || filteredEvents) return;
    setFilteredEvents(getFilteredEvents({ events, searchTerm, currentDate, view }));
  }, [searchTerm, currentDate, view, events]);

  return {
    searchTerm,
    setSearchTerm,
    filteredEvents,
  };
};
