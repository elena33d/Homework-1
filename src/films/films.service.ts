import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { Film } from './interfaces/film.interface.js';
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';

@Injectable()
export class FilmsService {
  private films: Film[] = [];
  private usageChecks: Array<(filmId: string) => boolean> = [];

  /**
   * Other modules (showings) register a check telling whether a film is still
   * referenced. This keeps films -> showings dependency out of the module graph.
   */
  registerUsageCheck(check: (filmId: string) => boolean): void {
    this.usageChecks.push(check);
  }

  create(createFilmDto: CreateFilmDto): Film {
    const film: Film = {
      id: randomUUID(),
      ...createFilmDto,
    };

    this.films.push(film);

    return film;
  }

  findAll(): Film[] {
    return this.films;
  }

  exists(id: string): boolean {
    return this.films.some((film) => film.id === id);
  }

  findOne(id: string): Film {
    const film = this.films.find((film) => film.id === id);

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    return film;
  }

  update(id: string, updateFilmDto: UpdateFilmDto): Film {
    const film = this.findOne(id);

    Object.assign(film, updateFilmDto);

    return film;
  }

  remove(id: string): void {
    const index = this.films.findIndex((film) => film.id === id);

    if (index === -1) {
      throw new NotFoundException('Film not found');
    }

    const film = this.films[index];
    if (this.usageChecks.some((check) => check(film.id))) {
      throw new ConflictException('Film is used in existing showings');
    }

    this.films.splice(index, 1);
  }
}
