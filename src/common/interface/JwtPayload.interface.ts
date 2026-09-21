import { UserRole } from '../enums/role.enum';

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
}
