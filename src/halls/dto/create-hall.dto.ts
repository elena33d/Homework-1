import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateHallDto {
  @ApiProperty({
    example: 'Зал №1',
    description: 'Hall name (unique)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 5,
    description: 'Number of rows',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  rows: number;

  @ApiProperty({
    example: 10,
    description: 'Number of seats in each row',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  seatsPerRow: number;
}
