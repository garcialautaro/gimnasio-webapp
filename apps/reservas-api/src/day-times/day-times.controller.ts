import { Controller, Get, Query } from '@nestjs/common';
import { DayTimesService } from './day-times.service';
import { GetAvailableDayTimesQuery, AvailableDayTimeSlot } from '@turnos/shared';

@Controller('day-times')
export class DayTimesController {
  constructor(private readonly dayTimesService: DayTimesService) {}

  @Get('available')
  async getAvailable(
    @Query() query: GetAvailableDayTimesQuery,
  ): Promise<AvailableDayTimeSlot[]> {
    return this.dayTimesService.getAvailableDayTimes(query);
  }
}
