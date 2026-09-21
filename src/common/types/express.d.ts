import { JWTPayload } from '../interface/JwtPayload.interface';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      requestId: string;
    }
  }
}
