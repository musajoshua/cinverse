import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/pagination/pagination.dto';

export class FilterReviewDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  movieId?: string;
}
