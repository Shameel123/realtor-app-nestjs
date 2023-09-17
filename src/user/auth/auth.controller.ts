import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SigninDto, SignupDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signUp(@Body() body: SignupDto, @Param('userType') userType: string) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  async signIn(@Body() body: SigninDto) {
    return this.authService.signIn(body);
  }

  @Post('/key')
  generateProductKey(@Body() { email, userType }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }
}
