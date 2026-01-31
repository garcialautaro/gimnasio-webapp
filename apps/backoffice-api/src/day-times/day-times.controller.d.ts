import { DayTimesService } from './day-times.service';
import { DayTime, CreateDayTimeDto, UpdateDayTimeDto, GetAvailableDayTimesQuery, AvailableDayTimeSlot } from '@turnos/shared';
export declare class DayTimesController {
    private readonly dayTimesService;
    constructor(dayTimesService: DayTimesService);
    create(createDayTimeDto: CreateDayTimeDto): Promise<DayTime>;
    findAll(eventId?: string): Promise<DayTime[]>;
    getAvailable(query: GetAvailableDayTimesQuery): Promise<AvailableDayTimeSlot[]>;
    findOne(id: string): Promise<DayTime>;
    update(id: string, updateDayTimeDto: UpdateDayTimeDto): Promise<DayTime>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=day-times.controller.d.ts.map