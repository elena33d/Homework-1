import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';
import { ShowingsModule } from '../showings/showings.module.js';
import { HallsModule } from '../halls/halls.module.js';

@Module({
  imports: [ShowingsModule, HallsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
