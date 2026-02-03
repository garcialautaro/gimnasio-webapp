import { BookingsService } from './bookings.service';
import { Booking, CreateBookingDto, UpdateBookingDto, GetBookingsQuery, User } from '@turnos/shared';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto, user: User): Promise<Booking>;
    findAll(query: GetBookingsQuery): Promise<Booking[]>;
    findOne(id: string): Promise<Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=bookings.controller.d.ts.map