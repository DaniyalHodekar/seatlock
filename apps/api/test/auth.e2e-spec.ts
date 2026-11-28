import { Test } from '@nestjs/testing';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/configure-app.js';
import { PrismaService } from '../src/prisma.service.js';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: Awaited<ReturnType<typeof configureApp>>;

  const email = `user-${randomUUID()}@test.local`;
  const password = 'TestPassword@123';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    redis = await configureApp(app);
    prisma = app.get(PrismaService, { strict: false });
    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await redis.quit();
    await app.close();
  });

  it('register → login → /me → logout → /me 401', async () => {
    // request.agent keeps the session cookie across calls (like a browser).
    const agent = request.agent(app.getHttpServer());

    // register
    await agent
      .post('/api/auth/register')
      .send({ email, password })
      .expect(201);

    // login
    await agent.post('/api/auth/login').send({ email, password }).expect(200);

    // me
    await agent
      .get('/api/auth/me')
      .expect(200)
      .expect((response) => {
        expect(typeof response.body.id).toBe('number');
      });

    await agent.post('/api/auth/logout').expect(204);
    await agent.get('/api/auth/me').expect(401); // session gone
  });
});
