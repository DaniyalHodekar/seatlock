import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { PrismaModule } from '../prisma.module.js';
import { AuthService } from './auth.service.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [PrismaModule],
})
export class AuthModule {}
