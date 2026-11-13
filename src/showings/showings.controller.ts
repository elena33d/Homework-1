import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateShowingDto } from './dto/create-showing.dto.js';
import { FindShowingsQueryDto } from './dto/find-showings-query.dto.js';
import { ShowingsService } from './showings.service.js';

@ApiTags('Showings')
@Controller('showings')
export class ShowingsController {
  constructor(private readonly showingsService: ShowingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a showing' })
  @ApiCreatedResponse({ description: 'Showing created' })
  @ApiBadRequestResponse({
    description:
      'Film/hall not found, invalid or past startsAt, or invalid price',
  })
  create(@Body() dto: CreateShowingDto) {
    return this.showingsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List showings (optionally by film and/or day)' })
  @ApiOkResponse({ description: 'Showings sorted by start time, then id' })
  @ApiBadRequestResponse({ description: 'date is not in YYYY-MM-DD format' })
  findAll(@Query() query: FindShowingsQueryDto) {
    return this.showingsService.findAll(query.filmId, query.date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a showing' })
  @ApiOkResponse({ description: 'Showing with film title and hall name' })
  @ApiNotFoundResponse({ description: 'Showing not found' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.showingsService.findOne(id);
  }

  @Get(':id/seats')
  @ApiOperation({ summary: 'Seat map of the showing with booked flags' })
  @ApiOkResponse({ description: 'Array of { row, seat, isBooked }' })
  @ApiNotFoundResponse({ description: 'Showing not found' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  getSeats(@Param('id', ParseUUIDPipe) id: string) {
    return this.showingsService.getSeats(id);
  }
}
