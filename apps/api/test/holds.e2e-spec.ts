import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { AppModule } from '../src/app.module.js';
import { HoldsService } from '../src/holds/holds.service.js';
import { PrismaService } from '../src/prisma.service.js';
import { ConflictException } from '@nestjs/common';

describe('HoldsService — concurrency (e2e)', () => {
  let moduleRef: TestingModule;
  let holds: HoldsService;
  let prisma: PrismaService;

  let organiser: { id: number };
  let event: { id: number };
  let seat: { id: number };
  let userA: { id: number };
  let userB: { id: number };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    holds = moduleRef.get(HoldsService, { strict: false });
    prisma = moduleRef.get(PrismaService, { strict: false });
  });

  beforeEach(async () => {
    organiser = await prisma.user.create({
      data: {
        email: `organiser-${randomUUID()}@test.local`,
        passwordHash: 'test-hash',
        role: 'organiser',
      },
    });

    event = await prisma.event.create({
      data: {
        title: 'Concurrency Test Show',
        venue: 'Test Hall',
        startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        organiserId: organiser.id,
      },
    });

    seat = await prisma.seat.create({
      data: { row: 'A', number: 1, pricePaise: 50_000, eventId: event.id },
    });

    [userA, userB] = await Promise.all([
      prisma.user.create({
        data: {
          email: `a-${randomUUID()}@test.local`,
          passwordHash: 'test-hash',
          role: 'buyer',
        },
      }),
      prisma.user.create({
        data: {
          email: `b-${randomUUID()}@test.local`,
          passwordHash: 'test-hash',
          role: 'buyer',
        },
      }),
    ]);
  });

  afterEach(async () => {
    // Deleting the event cascades to its seats, which cascades to holds.
    await prisma.event.deleteMany({ where: { id: event.id } });
    await prisma.user.deleteMany({
      where: { id: { in: [organiser.id, userA.id, userB.id] } },
    });
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('allows exactly one of two concurrent holds on the same seat', async () => {
    const results = await Promise.allSettled([
      holds.createHold(seat.id, userA.id),
      holds.createHold(seat.id, userB.id),
    ]);
    const ok = results.filter((r) => r.status === 'fulfilled');
    const failed = results.filter((r) => r.status === 'rejected');

    expect(ok).toHaveLength(1); // exactly one winner
    expect(failed).toHaveLength(1); // exactly one loser
    expect((failed[0] as PromiseRejectedResult).reason).toBeInstanceOf(
      ConflictException,
    ); // lost for the right reason (409)
    expect(await prisma.hold.count({ where: { seatId: seat.id } })).toBe(1);
  });
});
