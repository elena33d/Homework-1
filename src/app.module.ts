import { Module } from '@nestjs/common';
import { FilmsModule } from './films/films.module.js';
import { HallsModule } from './halls/halls.module.js';
import { ShowingsModule } from './showings/showings.module.js';
import { BookingsModule } from './bookings/bookings.module.js';

@Module({
  imports: [FilmsModule, HallsModule, ShowingsModule, BookingsModule],
})
export class AppModule {}
