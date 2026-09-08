import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { ILike, In, Repository } from 'typeorm';
import { ActorsService } from '../actors/actors.service';
import { GenresService } from '../genres/genres.service';
import { FilterMovieDto } from './dto/filter-movie.dto';

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

  findAll(filters: FilterMovieDto) {
    const { title, genre, actor, offset = 0, limit = 20 } = filters;

    return this.movieRepository.find({
      where: {
        title: title ? ILike(`%${title}%`) : undefined,
        genres: genre ? { name: ILike(`%${genre}%`) } : undefined,
        actors: actor ? { name: ILike(`%${actor}%`) } : undefined,
      },
      relations: {
        genres: true,
        actors: true,
      },
      skip: offset,
      take: limit,
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
