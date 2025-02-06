import React from 'react';

import { useEventOperations } from '@/entities/event/model/useEventOperations.v2.ts';
import { Event } from '@/types.ts';

interface UseEventCardListProps {
  setEditingEvent: React.Dispatch<React.SetStateAction<Event | null>>;
}

export const useEventCardList = ({ setEditingEvent }: UseEventCardListProps) => {
  const { deleteEvent } = useEventOperations();
  const handleEventEdit = (event: Event) => {
    setEditingEvent(event);
  };

  const handleEventDelete = async (id: string) => {
    await deleteEvent(id);
  };

  return {
    handleEventEdit,
    handleEventDelete,
  };
};
