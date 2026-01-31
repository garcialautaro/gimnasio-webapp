import { BookingStatus } from '@turnos/shared';
import { Event } from './event.entity';
import { DayTime } from './day-time.entity';
import { User } from './user.entity';
import { Company } from './company.entity';
export declare class Booking {
    id: string;
    eventId: string;
    dayTimeId: string;
    userId: string;
    companyId: string;
    bookingDate: Date;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    event: Event;
    dayTime: DayTime;
    user: User;
    company: Company;
}
//# sourceMappingURL=booking.entity.d.ts.map