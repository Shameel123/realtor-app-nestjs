import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  async signIn(@Body() body: SigninDto) {
    return this.authService.signIn(body);
  }
}
