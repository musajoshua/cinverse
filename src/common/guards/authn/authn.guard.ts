import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../../auth/constants';
import { JWTPayload } from '../../interface/JwtPayload.interface';
import { AuthenticatedRequest } from '../../interface/AuthenticatedRequest.interface';

@Injectable()
export class AuthNGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractTokenFromHeader(request);

    if (!token)
      throw new UnauthorizedException('Missing Authentication Payload');

    try {
      const payload = await this.jwtService.verifyAsync<JWTPayload>(token, {
        secret: jwtConstants.secret,
      });

      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: AuthenticatedRequest) {
    const [type, token] = request.header('Authorization')?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
