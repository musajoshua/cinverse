import { IsArray, IsDateString, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  releaseDate: string;

  @IsArray({ each: true })
  genres: string[];

  @IsArray({ each: true })
  actors: string[];

  @IsString()
  posterImage: string;

  @IsString()
  trailerLink: string;
}
