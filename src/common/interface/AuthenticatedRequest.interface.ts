import { Request } from 'express';
import { JWTPayload } from './JwtPayload.interface';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
