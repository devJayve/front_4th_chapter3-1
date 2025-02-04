import { Event } from '../types.ts';

export interface GetFilteredEventsParams {
  events: Event[];
  searchTerm?: string;
  currentDate: Date;
  view: 'week' | 'month';
}
