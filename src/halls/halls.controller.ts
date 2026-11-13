import {
  Controller,
  Get,
  Post,
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

import { HallsService } from './halls.service.js';
import { CreateHallDto } from './dto/create-hall.dto.js';

@ApiTags('Halls')
@Controller('halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a hall' })
  @ApiCreatedResponse({ description: 'Hall created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid hall data' })
  @ApiConflictResponse({ description: 'Hall name already exists' })
  create(@Body() createHallDto: CreateHallDto) {
    return this.hallsService.create(createHallDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all halls' })
  @ApiOkResponse({ description: 'List of halls' })
  findAll() {
    return this.hallsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a hall with its seats' })
  @ApiOkResponse({ description: 'Hall with seats' })
  @ApiNotFoundResponse({ description: 'Hall not found' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.hallsService.findOne(id);
  }

  @Delete(':id')
  @ApiConflictResponse({
    description: 'Hall is used in existing showings',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a hall' })
  @ApiNoContentResponse({ description: 'Hall deleted successfully' })
  @ApiNotFoundResponse({ description: 'Hall not found' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.hallsService.remove(id);
  }
}
