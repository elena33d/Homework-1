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

// Создание зала
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
this.halls.splice(index, 1);

}
}