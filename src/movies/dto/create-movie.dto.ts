import { IsArray, IsDateString, IsString, IsUUID } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  releaseDate: string;

  @IsArray()
  @IsUUID('all', { each: true })
  genres: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  actors: string[];

  @IsString()
  posterImage: string;

  @IsString()
  trailerLink: string;
}
