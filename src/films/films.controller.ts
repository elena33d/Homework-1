import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

import { FilmsService } from './films.service.js';
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';

@ApiTags('Films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a film' })
  @ApiCreatedResponse({ description: 'Film created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid film data' })
  create(@Body() createFilmDto: CreateFilmDto) {
    return this.filmsService.create(createFilmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all films' })
  @ApiOkResponse({ description: 'List of films' })
  findAll() {
    return this.filmsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a film by ID' })
  @ApiOkResponse({ description: 'Film found' })
  @ApiNotFoundResponse({ description: 'Film not found' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.filmsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a film' })
  @ApiOkResponse({ description: 'Film updated successfully' })
  @ApiNotFoundResponse({ description: 'Film not found' })
  @ApiBadRequestResponse({ description: 'Invalid data or UUID' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateFilmDto: UpdateFilmDto,
  ) {
    return this.filmsService.update(id, updateFilmDto);
  }

  @Delete(':id')
  @ApiConflictResponse({
    description: 'Film is used in existing showings',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a film' })
  @ApiNoContentResponse({ description: 'Film deleted successfully' })
  @ApiNotFoundResponse({ description: 'Film not found' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.filmsService.remove(id);
  }
}
