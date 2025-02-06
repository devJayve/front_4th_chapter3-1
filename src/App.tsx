import { Box, Flex, useToast, VStack } from '@chakra-ui/react';
import { useRef, useState } from 'react';

import { useEventOperations } from './entities/event/model/useEventOperations_v2.ts';
import OverlapDialog from './features/dialog/OverlapDialog.tsx';
import EventForm from './features/event-form/EventForm.tsx';
import EventNotification from './features/notification/EventNotification.tsx';
import EventSearch from './features/search/EventSearch.tsx';
import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventForm } from './hooks/useEventForm.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useSearch } from './hooks/useSearch.ts';
import { Event, EventForm as EventFormType } from './types';
import { findOverlappingEvents } from './utils/eventOverlap';
import EventCalendar from './widgets/event-calendar/EventCalendar.tsx';
import EventCardList from './widgets/event-card-list/EventCardList.tsx';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const notificationOptions = [
  { value: 1, label: '1분 전' },
  { value: 10, label: '10분 전' },
  { value: 60, label: '1시간 전' },
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
];

function App() {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteEvent } = useEventOperations();

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch({ events, currentDate, view });

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        {/*Event Form Section*/}
        <EventForm mode={isEditing ? 'edit' : 'create'} />
        {/*Calendar Section*/}
        <EventCalendar
          view={view}
          setView={setView}
          navigate={navigate}
          currentDate={currentDate}
          weekDays={weekDays}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          holidays={holidays}
        />
        <VStack data-testid="event-list" w="500px" h="full" overflowY="auto">
          <EventSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <EventCardList
            filteredEvents={filteredEvents}
            notifiedEvents={notifiedEvents}
            notificationOptions={notificationOptions}
            editEvent={editEvent}
            deleteEvent={deleteEvent}
          />
        </VStack>
      </Flex>

      {/*<OverlapDialog*/}
      {/*  isOverlapDialogOpen={isOverlapDialogOpen}*/}
      {/*  cancelRef={cancelRef}*/}
      {/*  overlappingEvents={overlappingEvents}*/}
      {/*  setIsOverlapDialogOpen={setIsOverlapDialogOpen}*/}
      {/*  saveEvent={saveEvent}*/}
      {/*  editingEvent={editingEvent}*/}
      {/*  title={title}*/}
      {/*  date={date}*/}
      {/*  startTime={startTime}*/}
      {/*  endTime={endTime}*/}
      {/*  description={description}*/}
      {/*  location={location}*/}
      {/*  category={category}*/}
      {/*  isRepeating={isRepeating}*/}
      {/*  repeatType={repeatType}*/}
      {/*  repeatInterval={repeatInterval}*/}
      {/*  repeatEndDate={repeatEndDate}*/}
      {/*  notificationTime={notificationTime}*/}
      {/*/>*/}

      <EventNotification notifications={notifications} setNotifications={setNotifications} />
    </Box>
  );
}

export default App;
