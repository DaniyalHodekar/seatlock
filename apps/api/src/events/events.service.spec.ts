import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service.js';
import { PrismaService } from '../prisma.service.js';


describe('EventsService', () => {
  let service: EventsService;

  const findMany = vi.fn();
  const mockPrisma = { event: { findMany } };

  beforeEach(async () => {
    findMany.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: mockPrisma }, //  fake prisma
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('returns the upcoming events Prisma gives back', async () => {
    const fakeEvents = [
      { id: 1, title: 'EventName', venue: 'HallName', startsAt: new Date() },
    ];
    findMany.mockResolvedValue(fakeEvents);

    const result = await service.findUpcoming();

    expect(result).toBe(fakeEvents);
  });

  it('queries only future events, ordered by startsAt', async () => {
    findMany.mockResolvedValue([]);

    await service.findUpcoming();

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { startsAt: { gt: expect.any(Date) } },
        orderBy: { startsAt: 'asc' },
      }),
    );
  });
});
