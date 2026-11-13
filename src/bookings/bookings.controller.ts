import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@ApiTags('Bookings')
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('bookings')
  @ApiOperation({ summary: 'List all bookings' })
  @ApiOkResponse({ description: 'Array of bookings (empty if none)' })
  findAll() {
    return this.bookingsService.findAll();
  }

  @Post('showings/:id/bookings')
  @ApiOperation({ summary: 'Book seats for a showing' })
  @ApiCreatedResponse({ description: 'Booking created with totalPrice' })
  @ApiBadRequestResponse({
    description:
      'Empty/invalid seats, duplicate seat, seat outside the hall, or invalid UUID',
  })
  @ApiNotFoundResponse({ description: 'Showing not found' })
  @ApiConflictResponse({
    description: 'At least one seat is already booked; nothing is booked',
  })
  create(
    @Param('id', ParseUUIDPipe) showingId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(showingId, dto);
  }

  @Get('showings/:id/bookings')
  @ApiOperation({ summary: 'List bookings of a showing' })
  @ApiOkResponse({ description: 'Array of bookings' })
  @ApiNotFoundResponse({ description: 'Showing not found' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  findByShowing(@Param('id', ParseUUIDPipe) showingId: string) {
    return this.bookingsService.findByShowing(showingId);
  }

  @Delete('bookings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel a booking (seats become free)' })
  @ApiNoContentResponse({ description: 'Booking cancelled' })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.remove(id);
  }
}
