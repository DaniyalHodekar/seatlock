import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUpcoming() {
    const events = await this.prismaService.event.findMany({
      where: { startsAt: { gt: new Date() } },
      orderBy: { startsAt: 'asc' },
      select: { id: true, title: true, venue: true, startsAt: true },
    });
    return events;
  }
}
