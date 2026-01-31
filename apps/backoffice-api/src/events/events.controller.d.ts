import { EventsService } from './events.service';
import { Event, CreateEventDto, UpdateEventDto } from '@turnos/shared';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(createEventDto: CreateEventDto): Promise<Event>;
    findAll(companyId?: string): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<Event>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=events.controller.d.ts.map