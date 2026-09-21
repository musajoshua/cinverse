import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { ConfirmPasswordPipe } from '../common/pipes/confirm-password/confirm-password.pipe';
import { IS_PUBLIC } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  @IS_PUBLIC()
  signIn(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Post('/signup')
  @IS_PUBLIC()
  signUp(@Body(ConfirmPasswordPipe) registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
  }
}
