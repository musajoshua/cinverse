import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { ActorsModule } from '../actors/actors.module';
import { GenresModule } from '../genres/genres.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), ActorsModule, GenresModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
