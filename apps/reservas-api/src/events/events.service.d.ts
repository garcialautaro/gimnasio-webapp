import { Repository } from 'typeorm';
import { Event, CreateEventDto, UpdateEventDto } from '@turnos/shared';
export declare class EventsService {
    private readonly eventRepository;
    constructor(eventRepository: Repository<Event>);
    create(createEventDto: CreateEventDto): Promise<Event>;
    findAll(): Promise<Event[]>;
    findByCompany(companyId: string): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<Event>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=events.service.d.ts.map