import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class HoldsService {
  constructor(private readonly prisma: PrismaService) {}
  async createHold(seatId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Lock the seat row — concurrent holders on this seat serialize here
      const rows =
        await tx.$queryRaw`SELECT id FROM seats WHERE id = ${seatId} FOR UPDATE`;
      // 2. (if rows is empty → seat doesn't exist → NotFoundException)
      if (!Array.isArray(rows) || rows.length === 0)
        throw new NotFoundException('Seat not found');

      // 3. Reject if an unexpired hold exists   (tx.hold.findFirst, expiresAt > now → ConflictException)

      const unexpiredHold = await tx.hold.findFirst({
        where: {
          expiresAt: {
            gt: new Date(),
          },
          seatId,
        },
      });
      if (unexpiredHold !== null)
        throw new ConflictException('Seat already held');

      // 4. Reject if the seat is already sold    (a ticket exists for this seatId → ConflictException)
      const existingTicket = await tx.ticket.findUnique({
        where: {
          seatId,
        },
      });

      if (existingTicket !== null)
        throw new ConflictException('Seat already sold');

      // 5. Create the hold with expiresAt = now + 10 min, return it

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);
      const hold = await tx.hold.create({
        data: {
          seatId,
          userId,
          expiresAt,
        },
      });

      return hold;
    });
  }
}
