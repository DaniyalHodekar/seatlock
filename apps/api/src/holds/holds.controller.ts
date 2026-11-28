import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { type Request } from 'express';
import { HoldsService } from './holds.service.js';
import { CreateHoldDto } from './dto/create-hold.dto.js';

@Controller('holds')
export class HoldsController {
  constructor(private readonly holdsService: HoldsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createHold(@Body() createHoldDto: CreateHoldDto, @Req() request: Request) {
    return this.holdsService.createHold(
      createHoldDto.seatId,
      request.session.userId!,
    );
  }
}
