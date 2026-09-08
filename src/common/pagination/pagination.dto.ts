import { IsPositive, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsPositive()
  offset?: number;
}
