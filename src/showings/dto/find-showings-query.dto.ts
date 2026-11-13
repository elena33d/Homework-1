import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, Matches } from 'class-validator';

export class FindShowingsQueryDto {
  @ApiPropertyOptional({ description: 'Only showings of this film' })
  @IsOptional()
  @IsString()
  filmId?: string;

  @ApiPropertyOptional({
    example: '2027-12-20',
    description: 'Only showings starting on this day (YYYY-MM-DD, UTC)',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  @IsISO8601(
    { strict: true },
    { message: 'date must be a valid calendar date' },
  )
  date?: string;
}
