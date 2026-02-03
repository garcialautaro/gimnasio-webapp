import { Event } from './event.entity';
import { User } from './user.entity';
import { Booking } from './booking.entity';
export declare class Company {
    id: string;
    slug: string;
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    timezone: string;
    defaultQuotaDuration: number;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    events: Event[];
    users: User[];
    bookings: Booking[];
}
//# sourceMappingURL=company.entity.d.ts.map