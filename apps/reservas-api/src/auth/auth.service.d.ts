import { Repository } from 'typeorm';
import { User } from '@turnos/shared';
export declare class AuthService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    registerClient(email: string, password: string, firstName: string, lastName: string, phone?: string): Promise<User>;
}
//# sourceMappingURL=auth.service.d.ts.map