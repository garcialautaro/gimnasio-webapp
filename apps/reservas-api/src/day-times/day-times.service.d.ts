import { Repository } from 'typeorm';
import { DayTime, CreateDayTimeDto, UpdateDayTimeDto, GetAvailableDayTimesQuery, AvailableDayTimeSlot } from '@turnos/shared';
import { BookingsService } from '../bookings/bookings.service';
export declare class DayTimesService {
    private readonly dayTimeRepository;
    private readonly bookingsService;
    constructor(dayTimeRepository: Repository<DayTime>, bookingsService: BookingsService);
    create(createDayTimeDto: CreateDayTimeDto): Promise<DayTime>;
    findAll(): Promise<DayTime[]>;
    findByEvent(eventId: string): Promise<DayTime[]>;
    findOne(id: string): Promise<DayTime>;
    update(id: string, updateDayTimeDto: UpdateDayTimeDto): Promise<DayTime>;
    delete(id: string): Promise<void>;
    getAvailableDayTimes(query: GetAvailableDayTimesQuery): Promise<AvailableDayTimeSlot[]>;
    private getDayOfWeek;
}
//# sourceMappingURL=day-times.service.d.ts.map