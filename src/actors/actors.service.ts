import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Actor } from './entities/actor.entity';
import { In, Repository } from 'typeorm';
import { PaginationDto } from '../common/pagination/pagination.dto';

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
  ) {}

  async create(createActorDto: CreateActorDto) {
    const createdActor = this.actorRepository.create(createActorDto);

    return this.actorRepository.save(createdActor);
  }

  findAll(pagination: PaginationDto) {
    return this.actorRepository.find({
      relations: {
        filmography: true,
      },
      skip: pagination.offset,
      take: pagination.limit,
    });
  }

  async findOne(id: string) {
    const actor = await this.actorRepository.findOne({
      where: {
        id,
      },
      relations: {
        filmography: true,
      },
    });

    if (!actor) {
      throw new NotFoundException(`Actor with ${id} not found`);
    }

    return actor;
  }

  async update(id: string, updateActorDto: UpdateActorDto) {
    const actor = await this.actorRepository.preload({
      id,
      ...updateActorDto,
    });

    if (!actor) {
      throw new NotFoundException(`Actor with ${id} not found`);
    }

    return this.actorRepository.save(actor);
  }

  async remove(id: string) {
    const actor = await this.actorRepository.findOne({
      where: {
        id,
      },
    });

    if (!actor) {
      throw new NotFoundException(`Actor with ${id} not found`);
    }

    return this.actorRepository.remove(actor);
  }

  findByIds(ids: string[]) {
    return this.actorRepository.findBy({ id: In(ids) });
  }
}
