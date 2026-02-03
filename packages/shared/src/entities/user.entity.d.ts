import { UserRole } from '@turnos/shared';
import { Company } from './company.entity';
import { Booking } from './booking.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    company: Company;
    bookings: Booking[];
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
//# sourceMappingURL=user.entity.d.ts.map