import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from '@turnos/shared';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(@Query('companyId') companyId?: string): Promise<Event[]> {
    if (companyId) {
      return this.eventsService.findByCompany(companyId);
    }
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }
}
