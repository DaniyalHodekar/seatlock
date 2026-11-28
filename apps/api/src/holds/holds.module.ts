import { Module } from '@nestjs/common';
import { HoldsController } from './holds.controller.js';
import { HoldsService } from './holds.service.js';
import { PrismaModule } from '../prisma.module.js';

@Module({
  controllers: [HoldsController],
  providers: [HoldsService],
  imports: [PrismaModule],
})
export class HoldsModule {}
