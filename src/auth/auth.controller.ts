import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { ConfirmPasswordPipePipe } from '../confirm-password-pipe/confirm-password-pipe.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signIn(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Post('/signup')
  signUp(@Body(ConfirmPasswordPipePipe) registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
  }
}
