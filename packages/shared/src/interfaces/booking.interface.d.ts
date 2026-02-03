import { BookingStatus } from '../enums';
export interface Booking {
    id: string;
    eventId: string;
    dayTimeId: string;
    userId: string;
    companyId: string;
    bookingDate: Date;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateBookingDto {
    eventId: string;
    dayTimeId: string;
    bookingDate: Date | string;
    startTime: string;
    endTime: string;
    notes?: string;
}
export interface UpdateBookingDto {
    status?: BookingStatus;
    notes?: string;
}
export interface GetBookingsQuery {
    companyId?: string;
    eventId?: string;
    userId?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    status?: BookingStatus;
}
export interface BookingWithDetails extends Booking {
    event?: {
        id: string;
        name: string;
        duration: number;
    };
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
    };
    company?: {
        id: string;
        name: string;
        slug: string;
    };
}
//# sourceMappingURL=booking.interface.d.ts.map