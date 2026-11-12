import { ApiProperty } from '@nestjs/swagger';

import {
  IsInt,
  IsISO8601,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateShowingDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Film ID',
  })
  @IsUUID()
  filmId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Hall ID',
  })
  @IsUUID()
  hallId: string;

  @ApiProperty({
    example: '2027-12-20T18:00:00.000Z',
    description: 'Showing start date and time',
  })
  @IsString()
  @IsISO8601()
  startsAt: string;

  @ApiProperty({
    example: 12500,
    description: 'Ticket price in kopecks',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  price: number;
}