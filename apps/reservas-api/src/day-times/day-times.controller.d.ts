import { DayTimesService } from './day-times.service';
import { GetAvailableDayTimesQuery, AvailableDayTimeSlot } from '@turnos/shared';
export declare class DayTimesController {
    private readonly dayTimesService;
    constructor(dayTimesService: DayTimesService);
    getAvailable(query: GetAvailableDayTimesQuery): Promise<AvailableDayTimeSlot[]>;
}
//# sourceMappingURL=day-times.controller.d.ts.map