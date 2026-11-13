import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

export class SeatDto {
  @ApiProperty({ example: 1, minimum: 1, description: 'Row number' })
  @IsInt()
  @Min(1)
  row: number;

  @ApiProperty({
    example: 5,
    minimum: 1,
    description: 'Seat number in the row',
  })
  @IsInt()
  @Min(1)
  seat: number;
}

export class CreateBookingDto {
  @ApiProperty({
    type: [SeatDto],
    description: 'Non-empty list of unique seats',
    example: [
      { row: 1, seat: 5 },
      { row: 1, seat: 6 },
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  @ArrayUnique((s: SeatDto) => `${s.row}:${s.seat}`, {
    message: 'the same seat must not appear twice',
  })
  seats: SeatDto[];
}
