import { Repository } from 'typeorm';
import { EventEntity, CreateEventDto, UpdateEventDto, Event } from '@turnos/shared';
export declare class EventsService {
    private readonly eventRepository;
    constructor(eventRepository: Repository<EventEntity>);
    create(createEventDto: CreateEventDto): Promise<Event>;
    findAll(): Promise<Event[]>;
    findByCompany(companyId: string): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<Event>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=events.service.d.ts.map