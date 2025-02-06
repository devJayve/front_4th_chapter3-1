import { Event } from '@/types';

export const getEvents = async () => {
  const response = await fetch('/api/events');
  return (await response.json()) as Event[];
};
