import { API_BASE_URL } from '@/constants';
import { EventDto, eventDto } from '@seatlock/shared';

export async function getEvents() {
  const url = new URL('/api/events', API_BASE_URL).toString();
  const res = await fetch(url);
  if (!res.ok) {
    console.error(await res.text());
    throw new Error('Failed to fetch events');
  }

  const result: EventDto[] = eventDto.array().parse(await res.json());
  return result;
}
