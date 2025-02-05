import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, act, waitFor, fireEvent } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { ReactElement } from 'react';

import App from '../App';
import { server } from '../setupTests';
import { Event, EventForm } from '../types';
import { formatMinuteTime } from '../utils/dateUtils.ts';


const REPEAT_TYPE_MAP = {
  none: '없음',
  daily: '매일',
  weekly: '매주',
  monthly: '매월',
  yearly: '매년',
}

// ! HINT. "검색 결과가 없습니다"는 초기에 노출되는데요. 그럼 검증하고자 하는 액션이 실행되기 전에 검증해버리지 않을까요? 이 테스트를 신뢰성있게 만드려면 어떻게 할까요?
describe('일정 CRUD 및 기본 기능', () => {

  const createEvent = async (event: Partial<Event>) => {
    const user = userEvent.setup();

    const eventForm = within(screen.getByTestId('event-form'));

    event.title && await user.type(eventForm.getByLabelText(/제목/i), event.title);
    event.date && await user.type(eventForm.getByLabelText(/날짜/i), event.date);
    event.startTime && await user.type(eventForm.getByLabelText(/시작 시간/i), event.startTime);
    event.endTime && await user.type(eventForm.getByLabelText(/종료 시간/i), event.endTime);
    event.description && await user.type(eventForm.getByLabelText(/설명/i), event.description);
    event.location && await user.type(eventForm.getByLabelText(/위치/i), event.location);
    event.category && await user.selectOptions(eventForm.getByLabelText(/카테고리/i), event.category);
    event.notificationTime && await user.selectOptions(eventForm.getByLabelText(/알림 설정/i), `${formatMinuteTime(event.notificationTime)} 전`);

    if (event.repeat && event.repeat.type !== 'none') {
      fireEvent.change(eventForm.getByLabelText(/반복 설정/i), { target: { checked: true } });
      await user.selectOptions(eventForm.getByLabelText(/반복 유형/i), REPEAT_TYPE_MAP[event.repeat.type]);
      event.repeat.interval && await user.type(eventForm.getByLabelText(/반복 간격/i), String(event.repeat.interval));
      event.repeat.endDate && await user.type(eventForm.getByLabelText(/반복 종료일/i), event.repeat.endDate);
    }

    await user.click(screen.getByTestId('event-submit-button'));
  }

  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const mockEvent: EventForm = {
      title: '테스트 이벤트',
      date: '2025-02-05',
      startTime: '14:00',
      endTime: '15:00',
      description: '테스트 설명',
      location: '회의실 B',
      category: '개인',
    };

    await createEvent(mockEvent);



    const eventItem = screen.getByTestId(`event-item-${}`);

    await waitFor(() => {
      const eventListWithin = within(eventList);
      expect(eventListWithin.getByText(mockEvent.title)).toBeInTheDocument();
      expect(eventListWithin.getByText(mockEvent.date)).toBeInTheDocument();
      expect(
        eventListWithin.getByText(`${mockEvent.startTime} - ${mockEvent.endTime}`)
      ).toBeInTheDocument();
      expect(eventListWithin.getByText(mockEvent.description)).toBeInTheDocument();
      expect(eventListWithin.getByText(mockEvent.location)).toBeInTheDocument();
      expect(eventListWithin.getByText(`카테고리: ${mockEvent.category}`)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/제목/i)).toHaveValue('');
    expect(screen.getByLabelText(/설명/i)).toHaveValue('');
    expect(screen.getByLabelText(/위치/i)).toHaveValue('');
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {});

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {});
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {});

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {});

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {});

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {});

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {});
});

describe('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {});

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {});

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {});
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {});

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {});
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {});
