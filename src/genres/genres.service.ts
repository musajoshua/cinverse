import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  create(createGenreDto: CreateGenreDto) {
    const createdGenre = this.genreRepository.create(createGenreDto);
    return this.genreRepository.save(createdGenre);
  }

  findAll() {
    return this.genreRepository.find();
  }

  async findOne(id: string) {
    const genre = await this.genreRepository.findOne({
      where: {
        id,
      },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ${id} is not found`);
    }

    return genre;
  }

  async update(id: string, updateGenreDto: UpdateGenreDto) {
    const genre = await this.genreRepository.preload({
      id,
      ...updateGenreDto,
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ${id} is not found`);
    }

    return this.genreRepository.save(genre);
  }

  async remove(id: string) {
    const genre = await this.genreRepository.findOne({
      where: {
        id,
      },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ${id} is not found`);
    }

    return this.genreRepository.remove(genre);
  }

  findByIds(ids: string[]) {
    return this.genreRepository.findBy({ id: In(ids) });
  }
}
