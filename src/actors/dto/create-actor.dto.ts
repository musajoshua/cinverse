import { IsArray, IsDateString, IsString } from 'class-validator';

export class CreateActorDto {
  @IsString()
  name: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsArray({ each: true })
  filmography: string[];
}
