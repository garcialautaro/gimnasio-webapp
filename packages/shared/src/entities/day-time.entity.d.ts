import { DayTimeType, DayOfWeek } from '@turnos/shared';
import { Event } from './event.entity';
import { Booking } from './booking.entity';
export declare class DayTime {
    id: string;
    eventId: string;
    type: DayTimeType;
    dayOfWeek: DayOfWeek;
    specificDate: Date;
    startTime: string;
    endTime: string;
    quota: number;
    disablesRegular: boolean;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    event: Event;
    bookings: Booking[];
}
//# sourceMappingURL=day-time.entity.d.ts.map