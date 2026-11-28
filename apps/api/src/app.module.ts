import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module.js';
import { AuthModule } from './auth/auth.module.js';
import { HoldsModule } from './holds/holds.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    AuthModule,
    EventsModule,
    HoldsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
