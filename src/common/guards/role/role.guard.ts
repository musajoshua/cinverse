import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { USER_ROLES_KEY } from '../../decorators/roles.decorator';
import { UserRole } from '../../enums/role.enum';
import { Request } from 'express';
import { AuthenticatedRequest } from '../../interface/AuthenticatedRequest.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      USER_ROLES_KEY,
      [context.getHandler()],
    );

    if (!requiredRoles || requiredRoles.length == 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = request.user;

    if (!user) throw new UnauthorizedException('Invalid user');

    const role = user.role;

    if (!requiredRoles.includes(role))
      throw new ForbiddenException(
        'You do not have permission to perfrom this action',
      );

    return true;
  }
}
