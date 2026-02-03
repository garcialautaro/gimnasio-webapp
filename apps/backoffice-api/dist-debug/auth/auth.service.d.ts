import { UsersService } from '../users/users.service';
import { AuthFirebaseDto, AuthResponse, CreateUserDto } from '@turnos/shared';
export declare class AuthService {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<AuthResponse>;
    login(authFirebaseDto: AuthFirebaseDto): Promise<AuthResponse>;
    validateUser(userId: string): Promise<import("@turnos/shared").User>;
}
//# sourceMappingURL=auth.service.d.ts.map