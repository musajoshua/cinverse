import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO) {
    const user = await this.userService.findUserByEmail(loginDTO.email);

    if (!user) {
      throw new BadRequestException(
        `User with email ${loginDTO.email} does not exist`,
      );
    }

    const isPasswordCorrect = await this.comparePasswordWithHash(
      loginDTO.password,
      user.passwordHash,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid password');
    }

    const token = await this.generateJWTToken(user);

    return {
      id: user.id,
      email: user.email,
      token,
    };
  }

  async register(registerDTO: RegisterDTO) {
    const user = await this.userService.findUserByEmail(registerDTO.email);

    if (user) {
      throw new BadRequestException(
        `User with email ${registerDTO.email} is already registered`,
      );
    }

    const passwordHash = await this.createPasswordHash(registerDTO.password);

    const createdUser = await this.userService.create({
      email: registerDTO.email,
      passwordHash,
    });

    const token = await this.generateJWTToken(createdUser);

    return {
      id: createdUser.id,
      email: createdUser.email,
      token,
    };
  }

  private async createPasswordHash(password: string) {
    const salt = await genSalt();
    return hash(password, salt);
  }

  private comparePasswordWithHash(password: string, hash: string) {
    return compare(password, hash);
  }

  private generateJWTToken(user: User) {
    const payload = { id: user.id, email: user.email };
    return this.jwtService.signAsync(payload);
  }
}
