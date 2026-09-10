import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaginationDto } from '../../common/pagination/pagination.dto';
import { Type } from 'class-transformer';

export class FilterMovieDto extends PaginationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  actor?: string;

  @IsOptional()
  @Min(1)
  @Max(5)
  @IsNumber({})
  @Type(() => Number)
  averageRating?: number;
}
