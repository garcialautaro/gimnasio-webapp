import { UsersService } from './users.service';
import { UpdateUserDto, User } from '@turnos/shared';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: User): Promise<User>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=users.controller.d.ts.map