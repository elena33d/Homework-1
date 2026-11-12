import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { FilmsService } from '../films/films.service.js';
import { HallsService } from '../halls/halls.service.js';

import { Showing } from './interfaces/showing.interface.js';
import { CreateShowingDto } from './dto/create-showing.dto.js';

@Injectable()
export class ShowingsService {
  private showings: Showing[] = [];

  constructor(
    private readonly filmsService: FilmsService,
    private readonly hallsService: HallsService,
  ) {}

  create(dto: CreateShowingDto): Showing {
    // Перевіряємо існування фільму
    try {
      this.filmsService.findOne(dto.filmId);
    } catch {
      throw new BadRequestException(
        `Film with ID ${dto.filmId} not found`,
      );
    }

    // Перевіряємо існування залу
    try {
      this.hallsService.findOne(dto.hallId);
    } catch {
      throw new BadRequestException(
        `Hall with ID ${dto.hallId} not found`,
      );
    }

    // Перевіряємо дату
    const startDate = new Date(dto.startsAt);

    if (Number.isNaN(startDate.getTime())) {
      throw new BadRequestException(
        'startsAt must be a valid ISO 8601 date',
      );
    }

    if (startDate.getTime() < Date.now()) {
      throw new BadRequestException(
        'Showing cannot start in the past',
      );
    }

    const showing: Showing = {
      id: randomUUID(),
      ...dto,
    };

    this.showings.push(showing);

    return showing;
  }

  findAll(filmId?: string, date?: string) {
    let result = [...this.showings];

    if (filmId) {
      result = result.filter(
        (showing) => showing.filmId === filmId,
      );
    }

    if (date) {
      result = result.filter(
        (showing) => showing.startsAt.slice(0, 10) === date,
      );
    }

    result.sort((a, b) => {
      const timeDifference =
        new Date(a.startsAt).getTime() -
        new Date(b.startsAt).getTime();

      if (timeDifference !== 0) {
        return timeDifference;
      }

      return a.id.localeCompare(b.id);
    });

    return result.map((showing) => {
      const film = this.filmsService.findOne(showing.filmId);
      const hall = this.hallsService.findOne(showing.hallId);

      return {
        ...showing,
        filmTitle: film.title,
        hallName: hall.name,
      };
    });
  }

  findOne(id: string) {
    const showing = this.showings.find(
      (item) => item.id === id,
    );

    if (!showing) {
      throw new NotFoundException('Showing not found');
    }

    const film = this.filmsService.findOne(showing.filmId);
    const hall = this.hallsService.findOne(showing.hallId);

    return {
      ...showing,
      filmTitle: film.title,
      hallName: hall.name,
    };
  }

  findByFilmId(filmId: string): Showing[] {
    return this.showings.filter(
      (showing) => showing.filmId === filmId,
    );
  }

  findByHallId(hallId: string): Showing[] {
    return this.showings.filter(
      (showing) => showing.hallId === hallId,
    );
  }
}