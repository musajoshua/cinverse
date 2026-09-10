import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Movie } from '../../movies/entities/movie.entity';

@Entity('reviews')
@Unique(['user', 'movie'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  rating: number;

  @Column('text')
  comment: string;

  @ManyToOne(() => Movie, (movie) => movie.reviews)
  movie: Movie;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
}
