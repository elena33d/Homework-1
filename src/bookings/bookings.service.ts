import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { HallsService } from '../halls/halls.service.js';
import { ShowingsService } from '../showings/showings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { Booking } from './interfaces/booking.interface.js';

@Injectable()
export class BookingsService {
  private bookings: Booking[] = [];

  constructor(
    private readonly showingsService: ShowingsService,
    private readonly hallsService: HallsService,
  ) {
    this.showingsService.registerBookedSeatsProvider((showingId) =>
      this.bookings
        .filter((b) => b.showingId === showingId)
        .flatMap((b) => b.seats),
    );
  }

  findAll(): Booking[] {
    return this.bookings;
  }

  findByShowing(showingId: string): Booking[] {
    this.showingsService.getEntity(showingId); // 404 if missing
    return this.bookings.filter((b) => b.showingId === showingId);
  }

  create(showingId: string, dto: CreateBookingDto): Booking {
    const showing = this.showingsService.getEntity(showingId);
    const hall = this.hallsService.findOne(showing.hallId);

    for (const { row, seat } of dto.seats) {
      if (row > hall.rows || seat > hall.seatsPerRow) {
        throw new BadRequestException(
          `Seat row ${row}, seat ${seat} does not exist in the hall`,
        );
      }
    }

    const taken = new Set(
      this.bookings
        .filter((b) => b.showingId === showingId)
        .flatMap((b) => b.seats)
        .map((s) => `${s.row}:${s.seat}`),
    );
    const conflicts = dto.seats.filter((s) => taken.has(`${s.row}:${s.seat}`));
    if (conflicts.length > 0) {
      throw new ConflictException(
        `Seats already booked: ${conflicts
          .map((s) => `row ${s.row} seat ${s.seat}`)
          .join(', ')}`,
      );
    }

    const booking: Booking = {
      id: randomUUID(),
      showingId,
      seats: dto.seats.map(({ row, seat }) => ({ row, seat })),
      totalPrice: showing.price * dto.seats.length,
    };
    this.bookings.push(booking);
    return booking;
  }

  remove(id: string): void {
    const index = this.bookings.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new NotFoundException('Booking not found');
    }
    this.bookings.splice(index, 1);
  }
}
