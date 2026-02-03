import { Repository } from 'typeorm';
import { UserEntity, CreateUserDto, UpdateUserDto, User } from '@turnos/shared';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    create(createUserDto: CreateUserDto & {
        firebaseUid?: string;
    }): Promise<User>;
    findOne(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByCompany(companyId: string): Promise<User[]>;
    findByFirebaseUid(firebaseUid: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    delete(id: string): Promise<void>;
    findByEmailWithPassword(email: string): Promise<UserEntity | null>;
    sanitizeUser(user: UserEntity): User;
}
//# sourceMappingURL=users.service.d.ts.map