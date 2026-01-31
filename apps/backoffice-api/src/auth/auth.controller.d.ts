import { AuthService } from './auth.service';
import { AuthUserDto, CreateUserDto, AuthResponse } from '@turnos/shared';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<AuthResponse>;
    login(authUserDto: AuthUserDto): Promise<AuthResponse>;
}
//# sourceMappingURL=auth.controller.d.ts.map