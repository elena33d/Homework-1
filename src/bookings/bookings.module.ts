import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';
import { ShowingsModule } from '../showings/showings.module.js';

@Module({
  imports: [ShowingsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}