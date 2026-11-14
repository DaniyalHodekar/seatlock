import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { EventDto } from '@seatlock/shared';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  async findUpcoming(): Promise<EventDto[]> {
    const events = await this.prismaService.event.findMany({
      where: { startsAt: { gt: new Date() } },
      orderBy: { startsAt: 'asc' },
      select: { id: true, title: true, venue: true, startsAt: true },
    });

    return events.map((e) => ({ ...e, startsAt: e.startsAt.toISOString() }));
  }
}
