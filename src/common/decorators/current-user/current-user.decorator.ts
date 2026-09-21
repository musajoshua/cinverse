import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JWTPayload } from '../../interface/JwtPayload.interface';

type UserKey = keyof JWTPayload;

export const CurrentUser = createParamDecorator(
  (data: UserKey, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
