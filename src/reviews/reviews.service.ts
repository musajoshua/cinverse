import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { MoviesService } from '../movies/movies.service';
import { FilterReviewDto } from './dto/filter-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly userService: UsersService,
    private readonly movieService: MoviesService,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const user = await this.userService.findOne(createReviewDto.user);
    const movie = await this.movieService.findOne(createReviewDto.movie);

    const review = await this.reviewRepository.findOne({
      where: {
        movie,
        user,
      },
    });

    if (review) {
      throw new ConflictException(
        `User ${user.id} has already reviewed movie ${movie.id}`,
      );
    }

    const createReview = this.reviewRepository.create({
      ...createReviewDto,
      user,
      movie,
    });

    return this.reviewRepository.save(createReview);
  }

  findAll(filters: FilterReviewDto) {
    const { movieId, offset = 0, limit = 20 } = filters;

    const where: FindOptionsWhere<Review> = {};

    if (movieId) {
      where.movie = { id: movieId };
    }

    return this.reviewRepository.find({
      where,
      relations: {
        user: true,
        movie: true,
      },
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
        movie: true,
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ${id} is not found`);
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const user = updateReviewDto.user
      ? await this.userService.findOne(updateReviewDto.user)
      : undefined;
    const movie = updateReviewDto.movie
      ? await this.movieService.findOne(updateReviewDto.movie)
      : undefined;

    const review = await this.reviewRepository.preload({
      id,
      ...updateReviewDto,
      user,
      movie,
    });

    if (!review) {
      throw new NotFoundException(`Review with ${id} is not found`);
    }

    return this.reviewRepository.save(review);
  }

  async remove(id: string) {
    const review = await this.reviewRepository.findOne({
      where: {
        id,
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ${id} is not found`);
    }

    return this.reviewRepository.remove(review);
  }
}
