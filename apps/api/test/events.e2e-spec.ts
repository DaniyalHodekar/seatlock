import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';

describe('EventsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/events (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/events')
      .expect(200)
      .expect((res) => expect(Array.isArray(res.body)).toBe(true));
  });

  afterAll(async () => {
    await app.close();
  });
});
