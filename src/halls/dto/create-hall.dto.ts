import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateHallDto {
  @ApiProperty({
    example: 'Зал №1',
    description: 'Название зала',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 5,
    description: 'Количество рядов',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  rows: number;

  @ApiProperty({
    example: 10,
    description: 'Количество мест в каждом ряду',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  seatsPerRow: number;
}