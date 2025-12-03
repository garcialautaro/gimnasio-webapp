import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getAuth } from '@turnos/firebase-config';
import { UsersService } from '../users/users.service';
import { AuthUserDto, AuthResponse, CreateUserDto } from '@turnos/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    // Crear usuario en Firebase Auth
    const firebaseAuth = getAuth();
    const firebaseUser = await firebaseAuth.createUser({
      email: createUserDto.email,
      password: createUserDto.password,
    });

    // Crear usuario en Firestore
    const user = await this.usersService.create({
      ...createUserDto,
      firebaseUid: firebaseUser.uid,
    });

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
    try {
      // Aquí normalmente usarías el Firebase Client SDK para autenticar
      // Por ahora, buscaremos al usuario por email y generaremos un token
      const user = await this.usersService.findByEmail(authUserDto.email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generar token JWT
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      });

      return { user, token };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async validateUser(userId: string) {
    return this.usersService.findOne(userId);
  }
}
