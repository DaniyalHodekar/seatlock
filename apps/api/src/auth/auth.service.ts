import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto?.email?.trim();

    const existing = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (existing) {
    }

    return {};
  }
  async login() {
    return {};
  }
}
