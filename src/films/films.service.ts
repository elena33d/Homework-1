import {
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

    this.films.splice(index, 1);
  }
}