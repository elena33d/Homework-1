import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({ example: 'Interstellar' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 169 })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ example: 2014 })
  @IsInt()
  @Min(1)
  releaseYear: number;
}
