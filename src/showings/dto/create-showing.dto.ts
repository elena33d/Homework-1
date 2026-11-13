import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsISO8601, IsString, IsUUID, Min } from 'class-validator';

export class CreateShowingDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  filmId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  hallId: string;

  @ApiProperty({
    example: '2027-12-20T18:00:00.000Z',
    description: 'Start date and time, ISO 8601, must be in the future',
  })
  @IsString()
  @IsISO8601({ strict: true })
  startsAt: string;

  @ApiProperty({
    example: 12500,
    description: 'Ticket price in kopecks (positive integer)',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  price: number;
}
