import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthUserDto, AuthResponse, CreateUserDto, User } from '@turnos/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    // Crear usuario (password se hashea automáticamente en la entity)
    const user = await this.usersService.create(createUserDto);

    // Generar token JWT
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    return { user, token };
  }

  async login(authUserDto: AuthUserDto): Promise<AuthResponse> {
    // Buscar usuario por email (incluye password)
    const user = await this.usersService.findByEmail(authUserDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validar password con bcrypt
    const userEntity = user as unknown as User & { validatePassword: (password: string) => Promise<boolean> };
    const isPasswordValid = await userEntity.validatePassword(authUserDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generar token JWT
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    // Remover password del objeto user antes de retornar
    const { password, ...userWithoutPassword } = user as any;

    return { user: userWithoutPassword as User, token };
  }

  async validateUser(userId: string) {
    return this.usersService.findOne(userId);
  }
}
