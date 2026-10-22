import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
