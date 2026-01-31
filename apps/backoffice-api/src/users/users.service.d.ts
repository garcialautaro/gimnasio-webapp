import { Repository } from 'typeorm';
import { User, CreateUserDto, UpdateUserDto } from '@turnos/shared';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findOne(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByCompany(companyId: string): Promise<User[]>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=users.service.d.ts.map