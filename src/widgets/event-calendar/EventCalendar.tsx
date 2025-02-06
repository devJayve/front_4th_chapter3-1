import { Heading, VStack } from '@chakra-ui/react';

import CalendarNavigation from '../../features/calendar/CalendarNavigation.tsx';
import MonthCalendar from '../../features/calendar/MonthCalendar.tsx';
import WeekCalendar from '../../features/calendar/WeekCalendar.tsx';
import { Event } from '../../types.ts';

interface EventCalendarProps {
  view: 'week' | 'month';
  setView: (view: 'week' | 'month') => void;
  navigate: (direction: 'prev' | 'next') => void;
  currentDate: Date;
  weekDays: string[];
  filteredEvents: Event[];
  notifiedEvents: string[];
  holidays: { [key: string]: string };
}

function EventCalendar({
  view,
  navigate,
  setView,
  currentDate,
  weekDays,
  filteredEvents,
  notifiedEvents,
  holidays,
}: EventCalendarProps) {
  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>
      <CalendarNavigation view={view} onNavigate={navigate} onViewChange={setView} />
      {view === 'week' && (
        <WeekCalendar
          weekDays={weekDays}
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
      {view === 'month' && (
        <MonthCalendar
          currentDate={currentDate}
          weekDays={weekDays}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          holidays={holidays}
        />
      )}
    </VStack>
  );
}

export default EventCalendar;
