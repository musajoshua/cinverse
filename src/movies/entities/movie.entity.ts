import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genre } from '../../genres/entities/genre.entity';
import { Actor } from '../../actors/entities/actor.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('date')
  releaseDate: string;

  @ManyToMany(() => Genre)
  @JoinTable({ name: 'movies_genres' })
  genres: Genre[];

  @ManyToMany(() => Actor, (actor) => actor.filmography)
  @JoinTable({ name: 'movies_actors' })
  actors: Actor[];

  @Column()
  posterImage: string;

  @Column()
  trailerLink: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
