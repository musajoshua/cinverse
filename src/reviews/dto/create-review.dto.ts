import { Type } from 'class-transformer';
import { IsInt, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @IsString()
  comment: string;

  @IsUUID('all')
  movie: string;
}
