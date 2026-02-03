import { Company } from './company.entity';
import { DayTime } from './day-time.entity';
import { Booking } from './booking.entity';
export declare class Event {
    id: string;
    companyId: string;
    name: string;
    description: string;
    duration: number;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    company: Company;
    dayTimes: DayTime[];
    bookings: Booking[];
}
//# sourceMappingURL=event.entity.d.ts.map