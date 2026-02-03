import { AuthService } from './auth.service';
import { User } from '@turnos/shared';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }): Promise<User>;
}
//# sourceMappingURL=auth.controller.d.ts.map