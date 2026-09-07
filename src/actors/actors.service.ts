import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Actor } from './entities/actor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
  ) {}

  create(createActorDto: CreateActorDto) {
    const createdActor = this.actorRepository.create(createActorDto);
    return this.actorRepository.save(createdActor);
  }

  findAll() {
    return this.actorRepository.find();
  }

  async findOne(id: string) {
    const actor = await this.actorRepository.findOne({
      where: {
        id,
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
}
