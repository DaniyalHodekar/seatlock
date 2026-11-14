import Events from '@/features/events/components/events';
import { type Metadata } from 'next';

export const meta: Metadata = {
  title: 'Upcoming events',
};

export default function Page() {
  return <Events />;
}
