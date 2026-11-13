import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { Hall, HallWithSeats, Seat } from './interfaces/hall.interface.js';
import { CreateHallDto } from './dto/create-hall.dto.js';

@Injectable()
export class HallsService {
  private halls: Hall[] = [];
  private usageChecks: Array<(hallId: string) => boolean> = [];

  /**
   * Other modules (showings) register a check telling whether a hall is still
   * referenced. This keeps halls -> showings dependency out of the module graph.
   */
  registerUsageCheck(check: (hallId: string) => boolean): void {
    this.usageChecks.push(check);
  }

  create(createHallDto: CreateHallDto): Hall {
    const existingHall = this.halls.find(
      (hall) => hall.name === createHallDto.name,
    );

    if (existingHall) {
      throw new ConflictException('Hall with this name already exists');
    }
    const hall: Hall = {
      id: randomUUID(),
      ...createHallDto,
    };
    this.halls.push(hall);
    return hall;
  }

  findAll(): Hall[] {
    return this.halls;
  }

  exists(id: string): boolean {
    return this.halls.some((hall) => hall.id === id);
  }

  findOne(id: string): HallWithSeats {
    const hall = this.halls.find((hall) => hall.id === id);

    if (!hall) {
      throw new NotFoundException('Hall not found');
    }
    const seats: Seat[] = [];
    for (let row = 1; row <= hall.rows; row++) {
      for (let seat = 1; seat <= hall.seatsPerRow; seat++) {
        seats.push({ row, seat });
      }
    }
    return {
      ...hall,
      seats,
    };
  }

  remove(id: string): void {
    const index = this.halls.findIndex((hall) => hall.id === id);

    if (index === -1) {
      throw new NotFoundException('Hall not found');
    }

    const hall = this.halls[index];
    if (this.usageChecks.some((check) => check(hall.id))) {
      throw new ConflictException('Hall is used in existing showings');
    }

    this.halls.splice(index, 1);
  }
}
