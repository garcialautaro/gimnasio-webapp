import { EventsService } from './events.service';
import { Event } from '@turnos/shared';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(companyId?: string): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
}
//# sourceMappingURL=events.controller.d.ts.map