import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@turnos/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; firstName: string; lastName: string; phone?: string },
  ): Promise<User> {
    return this.authService.registerClient(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
      body.phone,
    );
  }
}
