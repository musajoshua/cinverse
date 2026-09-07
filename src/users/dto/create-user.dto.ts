import { Users } from '../entities/user.entity';

export type CreateUserDto = Pick<Users, 'email' | 'passwordHash'>;
