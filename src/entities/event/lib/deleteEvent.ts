import { Event } from '@/types.ts';

export const deleteEvent = async (id: string) => {
  const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });
  return (await response.json()) as Event;
};
