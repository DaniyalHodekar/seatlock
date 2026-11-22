import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');

  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET is not set');
  }

  const logger = new Logger('Redis');
  const redisClient = createClient({
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  });
  redisClient.on('error', (err) => logger.error('Redis client error', err));

  await redisClient.connect();

  const sessionStore = new RedisStore({
    client: redisClient,
    prefix: 'seatlock:sess:',
  });

  // Behind a TLS-terminating proxy in production, also set `app.set('trust proxy', 1)`
  // so the `secure` cookie flag is honoured (added at deploy time).
  app.use(
    session({
      store: sessionStore,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
