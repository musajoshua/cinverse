import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { In, Repository } from 'typeorm';
import { ActorsService } from '../actors/actors.service';
import { GenresService } from '../genres/genres.service';
import { PaginationDto } from '../common/pagination/pagination.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly actorService: ActorsService,
    private readonly genreService: GenresService,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const genres = await this.preloadGenres(createMovieDto.genres);
    const actors = await this.preloadActors(createMovieDto.actors);

    const createdMovie = this.movieRepository.create({
      ...createMovieDto,
      actors,
      genres,
    });

    return this.movieRepository.save(createdMovie);
  }

  findAll(pagination: PaginationDto) {
    return this.movieRepository.find({
      skip: pagination.offset,
      take: pagination.limit,
    });
  }

  async findOne(id: string) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ${id} is not found`);
    }

    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const genres = await this.preloadGenres(updateMovieDto?.genres);
    const actors = await this.preloadActors(updateMovieDto?.actors);

    const movie = await this.movieRepository.preload({
      id,
      ...updateMovieDto,
      genres,
      actors,
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ${id} is not found`);
    }

    return this.movieRepository.save(movie);
  }

  async remove(id: string) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ${id} is not found`);
    }

    return this.movieRepository.remove(movie);
  }

  findByIds(ids: string[]) {
    return this.movieRepository.findBy({ id: In(ids) });
  }

  private async preloadGenres(ids: string[] | undefined) {
    if (!ids) return undefined;

    const genres = await this.genreService.findByIds(ids);

    if (genres.length !== ids.length) {
      throw new BadRequestException('One or more genre IDs do not exist');
    }

    return genres;
  }

  private async preloadActors(ids: string[] | undefined) {
    if (!ids) return undefined;

    const actors = await this.actorService.findByIds(ids);

    if (actors.length !== ids.length) {
      throw new BadRequestException('One or more actor IDs do not exist');
    }

    return actors;
  }
}
