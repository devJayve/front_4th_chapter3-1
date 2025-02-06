import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Tooltip,
  VStack,
} from '@chakra-ui/react';

import { useEventForm } from '@/hooks/useEventForm.ts';
import { Event, RepeatType } from '@/types.ts';
import { getTimeErrorMessage } from '@/utils/timeValidation.ts';

interface EventFormProps {
  mode: 'create' | 'edit';
  editingEvent?: Event;
}

const categories = ['업무', '개인', '가족', '기타'];

const notificationOptions = [
  { value: 1, label: '1분 전' },
  { value: 10, label: '10분 전' },
  { value: 60, label: '1시간 전' },
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
];

function EventForm({ mode, editingEvent }: EventFormProps) {
  const {
    eventForm,
    repeatInfo,
    updateRepeatInfo,
    startTimeError,
    endTimeError,
    handleStartTimeChange,
    handleEndTimeChange,
    updateEventForm,
    submitEventForm,
  } = useEventForm({ mode, editingEvent, eventId: editingEvent?.id });

  return (
    <VStack data-testid="event-form" w="400px" spacing={5} align="stretch">
      <Heading>{mode === 'edit' ? '일정 수정' : '일정 추가'}</Heading>

      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={eventForm.title}
          onChange={(e) => updateEventForm({ title: e.target.value })}
        />
      </FormControl>

      <FormControl>
        <FormLabel>날짜</FormLabel>
        <Input
          type="date"
          value={eventForm.date}
          onChange={(e) => updateEventForm({ date: e.target.value })}
        />
      </FormControl>

      <HStack width="100%">
        <FormControl>
          <FormLabel>시작 시간</FormLabel>
          <Tooltip label={startTimeError} isOpen={!!startTimeError} placement="top">
            <Input
              type="time"
              value={eventForm.startTime}
              onChange={handleStartTimeChange}
              onBlur={() => getTimeErrorMessage(eventForm.startTime, eventForm.endTime)}
              isInvalid={!!startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <FormLabel>종료 시간</FormLabel>
          <Tooltip label={endTimeError} isOpen={!!endTimeError} placement="top">
            <Input
              type="time"
              value={eventForm.endTime}
              onChange={handleEndTimeChange}
              onBlur={() => getTimeErrorMessage(eventForm.startTime, eventForm.endTime)}
              isInvalid={!!endTimeError}
            />
          </Tooltip>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input
          value={eventForm.description}
          onChange={(e) => updateEventForm({ description: e.target.value })}
        />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input
          value={eventForm.location}
          onChange={(e) => updateEventForm({ location: e.target.value })}
        />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select
          value={eventForm.category}
          onChange={(e) => updateEventForm({ category: e.target.value })}
        >
          <option value="">카테고리 선택</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>반복 설정</FormLabel>
        <Checkbox isChecked={!!repeatInfo} onChange={(e) => console.log(e.target.value)}>
          반복 일정
        </Checkbox>
      </FormControl>

      <FormControl>
        <FormLabel>알림 설정</FormLabel>
        <Select
          value={eventForm.notificationTime}
          onChange={(e) => updateEventForm({ notificationTime: Number(e.target.value) })}
        >
          {notificationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>

      {!!repeatInfo && (
        <VStack width="100%">
          <FormControl>
            <FormLabel>반복 유형</FormLabel>
            <Select
              value={eventForm.repeat?.type}
              onChange={(e) => updateRepeatInfo({ type: e.target.value as RepeatType })}
            >
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
              <option value="yearly">매년</option>
            </Select>
          </FormControl>
          <HStack width="100%">
            <FormControl>
              <FormLabel>반복 간격</FormLabel>
              <Input
                type="number"
                value={eventForm.repeat?.interval}
                onChange={(e) => updateRepeatInfo({ interval: Number(e.target.value) })}
                min={1}
              />
            </FormControl>
            <FormControl>
              <FormLabel>반복 종료일</FormLabel>
              <Input
                type="date"
                value={eventForm.repeat?.endDate}
                onChange={(e) => updateRepeatInfo({ endDate: e.target.value })}
              />
            </FormControl>
          </HStack>
        </VStack>
      )}

      <Button data-testid="event-submit-button" onClick={submitEventForm} colorScheme="blue">
        {editingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </VStack>
  );
}

export default EventForm;
