import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genre } from '../../genres/entities/genre.entity';
import { Actor } from '../../actors/entities/actor.entity';
import { Review } from '../../reviews/entities/review.entity';

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

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @ManyToMany(() => Genre)
  @JoinTable({ name: 'movies_genres' })
  genres: Genre[];

  @ManyToMany(() => Actor, (actor) => actor.filmography)
  @JoinTable({ name: 'movies_actors' })
  actors: Actor[];

  @OneToMany(() => Review, (review) => review.movie)
  reviews: Review[];

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
