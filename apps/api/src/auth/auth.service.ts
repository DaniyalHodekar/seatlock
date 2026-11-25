import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import type { Request } from 'express';
import { PrismaService } from '../prisma.service.js';
import { LoginDto, RegisterDto } from './dto/register.dto.js';
import { normalizeEmail } from '../utils/email.js';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const CONFLICT_ERR = 'Email already registered';

    const email = normalizeEmail(registerDto?.email);

    const existing = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (existing) {
      throw new ConflictException(CONFLICT_ERR);
    }

    try {
      const passwordHash = await hash(registerDto?.password);
      const createdUser = await this.prismaService.user.create({
        data: {
          email: email,
          passwordHash,
          role: 'buyer',
        },
        select: { id: true, email: true, role: true },
      });

      return {
        id: createdUser?.id,
        email: createdUser?.email,
      };
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'P2002') {
        throw new ConflictException(CONFLICT_ERR);
      }
      throw new InternalServerErrorException(
        'User not created, please try again',
      );
    }
  }
  async login(loginDto: LoginDto): Promise<{ id: number; email: string }> {
    const genericError = new UnauthorizedException('Error logging in');
    const email = normalizeEmail(loginDto.email);

    const existing = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: { id: true, email: true, role: true, passwordHash: true },
    });

    if (!existing) {
      // prevent timing attack
      const fakeHash =
        '$argon2id$v=19$m=65536,t=3,p=4$dz+ClGe6Hiq6Mj3fSXH2+g$wDzOMDVmWhN7jifEXgUdaOYMn+mjAwuxYkM8ac8BJXQ';
      await verify(fakeHash, loginDto.password);
      throw genericError;
    }

    const password = loginDto.password;
    const hash = existing.passwordHash;

    const correctPassword = await verify(hash, password);

    if (!correctPassword) {
      throw genericError;
    }

    return {
      id: existing.id,
      email: existing.email,
    };
  }

  async establishSession(req: Request, userId: number) {
    await new Promise<void>((resolve, reject) =>
      req.session.regenerate((err) => (err ? reject(err) : resolve())),
    );
    req.session.userId = userId;
  }

  async destroySession(req: Request) {
    await new Promise<void>((resolve, reject) =>
      req.session.destroy((err) => (err ? reject(err) : resolve())),
    );
  }
}
