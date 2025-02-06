import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

import { getEvents } from '@/entities/event/lib';
import { Event, EventForm } from '@/types';

export const useEventOperations = () => {
  const toast = useToast();

  const fetchEvents = async () => {
    try {
      return await getEvents();
    } catch (error) {
      showToast('이벤트 로딩 실패', 'error', error);
    }
  };

  const createEvent = async (eventFormData: EventForm) => {
    try {
      await createEvent(eventFormData);

      showToast('일정이 추가되었습니다.', 'success');
    } catch (error) {
      showToast('일정 추가 실패', 'error', error);
    }
  };

  const updateEvent = async (eventData: Event) => {
    try {
      await updateEvent(eventData);

      showToast('일정이 수정되었습니다.', 'success');
    } catch (error) {
      showToast('일정 저장 실패', 'error', error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);

      showToast('일정이 삭제되었습니다.', 'info');
    } catch (error) {
      showToast('일정 삭제 실패', 'error', error);
    }
  };

  const showToast = (title: string, status: 'info' | 'error' | 'success', error?: any) => {
    if (status === 'error') console.log(error);
    toast({
      title,
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  async function init() {
    await fetchEvents();
    toast({
      title: '일정 로딩 완료!',
      status: 'info',
      duration: 1000,
    });
  }

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { fetchEvents, createEvent, updateEvent, deleteEvent };
};
