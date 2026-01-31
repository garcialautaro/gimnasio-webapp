import { BookingsService } from './bookings.service';
import { Booking, CreateBookingDto } from '@turnos/shared';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto & {
        userId: string;
        companyId: string;
    }): Promise<Booking>;
}
//# sourceMappingURL=bookings.controller.d.ts.map