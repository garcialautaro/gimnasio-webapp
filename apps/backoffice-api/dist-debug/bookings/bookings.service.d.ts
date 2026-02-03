import { Repository } from 'typeorm';
import { Booking, BookingEntity, DayTimeEntity, CreateBookingDto, UpdateBookingDto, GetBookingsQuery } from '@turnos/shared';
export declare class BookingsService {
    private readonly bookingRepository;
    private readonly dayTimeRepository;
    constructor(bookingRepository: Repository<BookingEntity>, dayTimeRepository: Repository<DayTimeEntity>);
    create(createBookingDto: CreateBookingDto, userId: string, companyId: string): Promise<Booking>;
    findAll(query: GetBookingsQuery): Promise<Booking[]>;
    findOne(id: string): Promise<Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking>;
    delete(id: string): Promise<void>;
    countBookingsForDayTime(dayTimeId: string, date: Date): Promise<number>;
}
//# sourceMappingURL=bookings.service.d.ts.map