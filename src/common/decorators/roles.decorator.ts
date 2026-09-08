import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/role.enum';

export const USER_ROLES_KEY = 'roles';
export const USER_ROLES = (...userRoles: UserRole[]) =>
  SetMetadata(USER_ROLES_KEY, userRoles);
