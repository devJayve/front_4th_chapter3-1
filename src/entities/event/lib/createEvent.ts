import { Event, EventForm } from '@/types';

export const createEvent = async (eventFormData: EventForm) => {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventFormData),
  });

  return (await response.json()) as Event;
};
