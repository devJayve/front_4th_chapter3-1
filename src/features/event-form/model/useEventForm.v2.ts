import { useToast } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

import { getTimeErrorMessage } from '../utils/timeValidation';

import { useEventOperations } from '@/entities/event/model/useEventOperations.v2.ts';
import { Event, EventForm, RepeatInfo } from '@/types';

type TimeErrorRecord = Record<'startTimeError' | 'endTimeError', string | null>;

interface UseEventFormProps {
  editingEvent?: Event;
  eventId?: string;
  mode: 'create' | 'edit';
}

const initialEventForm: EventForm = {
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  location: '',
  category: '',
  repeat: {
    type: 'none',
    interval: 1,
    endDate: '',
  },
  notificationTime: 10,
};

const initialTimeError: TimeErrorRecord = {
  startTimeError: null,
  endTimeError: null,
};

export const useEventForm = ({ eventId, editingEvent, mode }: UseEventFormProps) => {
  const [eventForm, setEventForm] = useState<EventForm>(editingEvent || initialEventForm);
  const [repeatInfo, setRepeatInfo] = useState<RepeatInfo | null>(editingEvent?.repeat || null);
  const { createEvent, updateEvent } = useEventOperations();
  const [{ startTimeError, endTimeError }, setTimeError] =
    useState<TimeErrorRecord>(initialTimeError);
  const toast = useToast();

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setEventForm((prevForm) => ({
      ...prevForm,
      startTime: newStartTime,
    }));
    setTimeError(getTimeErrorMessage(newStartTime, eventForm.endTime));
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setEventForm((prevForm) => ({
      ...prevForm,
      endTime: newEndTime,
    }));
    setTimeError(getTimeErrorMessage(eventForm.startTime, newEndTime));
  };

  const resetForm = () => {
    setEventForm(initialEventForm);
  };

  const updateRepeatInfo = (repeatInfoData: Partial<RepeatInfo>) => {
    if (repeatInfoData?.type === 'none') {
      setRepeatInfo(null);
      return;
    }
    setRepeatInfo((prev) => ({
      ...prev!,
      ...repeatInfoData,
    }));
  };

  const updateEventForm = (newEventData: Partial<EventForm>) => {
    setEventForm((prev) => ({
      ...prev,
      ...newEventData,
    }));
  };

  const validateEventForm = () => {
    if (!eventForm.title || !eventForm.date || !eventForm.startTime || !eventForm.endTime) {
      toast({
        title: '필수 정보를 모두 입력해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (startTimeError || endTimeError) {
      toast({
        title: '시간 설정을 확인해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    //TODO:: 이벤트 스토어 생성 및 중복 체크
    // const overlapping = findOverlappingEvents(eventData, events);
    // if (overlapping.length > 0) {
    //   setOverlappingEvents(overlapping);
    //   setIsOverlapDialogOpen(true);
    // } else {
    //   await saveEvent(eventData);
    //   resetForm();
    // }
    return true;
  };

  const submitEventForm = async () => {
    if (!validateEventForm()) return;

    if (mode === 'create') {
      await createEvent(eventForm);
    } else {
      const event: Event = { ...eventForm, id: eventId! };
      await updateEvent(event);
    }
    resetForm();
  };

  return {
    eventForm,
    repeatInfo,
    updateRepeatInfo,
    startTimeError,
    endTimeError,
    handleStartTimeChange,
    handleEndTimeChange,
    updateEventForm,
    submitEventForm,
  };
};
