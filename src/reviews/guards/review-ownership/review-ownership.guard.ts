import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ReviewsService } from '../../reviews.service';
import { UserRole } from '../../../common/enums/role.enum';
import { Request } from 'express';

@Injectable()
export class ReviewOwnershipGuard implements CanActivate {
  constructor(private readonly reviewService: ReviewsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const reviewId = request.params.id as string;

    if (!user) throw new UnauthorizedException('You are not authorized');

    const review = await this.reviewService.findOne(reviewId);

    const isAdmin = user.role === UserRole.ADMIN;
    const isOwner = review.user.id === user.id;

    if (!isOwner && !isAdmin)
      throw new ForbiddenException(
        'You do not have the permission to perform this action',
      );

    return true;
  }
}
