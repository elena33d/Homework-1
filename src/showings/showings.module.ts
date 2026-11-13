import { Module } from '@nestjs/common';
import { ShowingsController } from './showings.controller.js';
import { ShowingsService } from './showings.service.js';
import { FilmsModule } from '../films/films.module.js';
import { HallsModule } from '../halls/halls.module.js';

@Module({
  imports: [FilmsModule, HallsModule],
  controllers: [ShowingsController],
  providers: [ShowingsService],
  exports: [ShowingsService],
})
export class ShowingsModule {}
