import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthUserDto, AuthResponse, CreateUserDto, User } from '@turnos/shared';
export declare class AuthService {
    private readonly jwtService;
    private readonly usersService;
    constructor(jwtService: JwtService, usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<AuthResponse>;
    login(authUserDto: AuthUserDto): Promise<AuthResponse>;
    validateUser(userId: string): Promise<User>;
}
//# sourceMappingURL=auth.service.d.ts.map