import { Repository } from 'typeorm';
import { Booking, CreateBookingDto, UpdateBookingDto, GetBookingsQuery } from '@turnos/shared';
export declare class BookingsService {
    private readonly bookingRepository;
    constructor(bookingRepository: Repository<Booking>);
    create(createBookingDto: CreateBookingDto, userId: string, companyId: string): Promise<Booking>;
    findAll(query: GetBookingsQuery): Promise<Booking[]>;
    findOne(id: string): Promise<Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking>;
    delete(id: string): Promise<void>;
    countBookingsForDayTime(dayTimeId: string, date: Date): Promise<number>;
}
//# sourceMappingURL=bookings.service.d.ts.map