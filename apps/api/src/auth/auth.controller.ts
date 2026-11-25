import type { Request, Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto, LoginDto } from './dto/register.dto.js';
import { type SessionData } from 'express-session';
import { AuthGuard } from './auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    const user = await this.authService.register(registerDto);
    await this.authService.establishSession(req, user.id);
    return user;
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const user = await this.authService.login(loginDto);
    await this.authService.establishSession(req, user.id);
    return user;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Session() sessionData: SessionData) {
    return { id: sessionData?.userId };
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.destroySession(req);
    res.clearCookie('connect.sid');
  }
}
