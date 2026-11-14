import { z } from 'zod';

export const eventDto = z.object({
  id: z.number(),
  title: z.string(),
  venue: z.string(),
  startsAt: z.string(),
});

export type EventDto = z.infer<typeof eventDto>;
