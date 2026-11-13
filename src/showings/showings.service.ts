import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { FilmsService } from '../films/films.service.js';
import { HallsService } from '../halls/halls.service.js';
import { CreateShowingDto } from './dto/create-showing.dto.js';
import {
  Showing,
  ShowingSeat,
  ShowingWithDetails,
} from './interfaces/showing.interface.js';

type BookedSeatsProvider = (
  showingId: string,
) => Array<{ row: number; seat: number }>;

@Injectable()
export class ShowingsService {
  private showings: Showing[] = [];
  private bookedSeatsProviders: BookedSeatsProvider[] = [];

  constructor(
    private readonly filmsService: FilmsService,
    private readonly hallsService: HallsService,
  ) {
    // films and halls cannot be deleted while a showing references them
    this.filmsService.registerUsageCheck((filmId) =>
      this.showings.some((s) => s.filmId === filmId),
    );
    this.hallsService.registerUsageCheck((hallId) =>
      this.showings.some((s) => s.hallId === hallId),
    );
  }

  /** Bookings module registers a source of booked seats for a showing */
  registerBookedSeatsProvider(provider: BookedSeatsProvider): void {
    this.bookedSeatsProviders.push(provider);
  }

  create(dto: CreateShowingDto): Showing {
    if (!this.filmsService.exists(dto.filmId)) {
      throw new BadRequestException(`Film with id ${dto.filmId} not found`);
    }
    if (!this.hallsService.exists(dto.hallId)) {
      throw new BadRequestException(`Hall with id ${dto.hallId} not found`);
    }

    const startTime = new Date(dto.startsAt).getTime();
    if (Number.isNaN(startTime)) {
      throw new BadRequestException('startsAt must be a valid ISO 8601 date');
    }
    if (startTime <= Date.now()) {
      throw new BadRequestException('startsAt must not be in the past');
    }

    const showing: Showing = {
      id: randomUUID(),
      filmId: dto.filmId,
      hallId: dto.hallId,
      startsAt: dto.startsAt,
      price: dto.price,
    };
    this.showings.push(showing);
    return showing;
  }

  findAll(filmId?: string, date?: string): ShowingWithDetails[] {
    return this.showings
      .filter((s) => !filmId || s.filmId === filmId)
      .filter(
        (s) =>
          !date || new Date(s.startsAt).toISOString().slice(0, 10) === date,
      )
      .sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime() ||
          a.id.localeCompare(b.id),
      )
      .map((s) => this.withDetails(s));
  }

  findOne(id: string): ShowingWithDetails {
    return this.withDetails(this.getEntity(id));
  }

  /** Raw showing (with filmId/hallId) for use by other services */
  getEntity(id: string): Showing {
    const showing = this.showings.find((s) => s.id === id);
    if (!showing) {
      throw new NotFoundException('Showing not found');
    }
    return showing;
  }

  getSeats(id: string): ShowingSeat[] {
    const showing = this.getEntity(id);
    const hall = this.hallsService.findOne(showing.hallId);

    const booked = new Set(
      this.bookedSeatsProviders
        .flatMap((provider) => provider(id))
        .map((s) => `${s.row}:${s.seat}`),
    );

    return hall.seats.map((s) => ({
      row: s.row,
      seat: s.seat,
      isBooked: booked.has(`${s.row}:${s.seat}`),
    }));
  }

  private withDetails(showing: Showing): ShowingWithDetails {
    return {
      id: showing.id,
      filmTitle: this.filmsService.findOne(showing.filmId).title,
      hallName: this.hallsService.findOne(showing.hallId).name,
      startsAt: showing.startsAt,
      price: showing.price,
    };
  }
}
