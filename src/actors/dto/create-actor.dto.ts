import { IsArray, IsDateString, IsString } from 'class-validator';

export class CreateActorDto {
  @IsString()
  name: string;

  @IsDateString()
  dateOfBirth: string;

  @IsArray({ each: true })
  filmography: string[];
}
