'use client';

import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../api';
import { EventDto } from '@seatlock/shared';

export default function Events() {
  const { isPending, error, data } = useQuery<EventDto[]>({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  if (isPending) return 'Fetching events...';

  if (error) console.log(error.message);

  return (
    <div>
      <ul>
        {data?.map(e => (
          <li key={e.id}>
            {e.title}
            <br />
            {e.venue}
          </li>
        ))}
      </ul>
    </div>
  );
}
