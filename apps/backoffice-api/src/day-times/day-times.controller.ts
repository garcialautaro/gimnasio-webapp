import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DayTimesService } from './day-times.service';
import {
  DayTime,
  CreateDayTimeDto,
  UpdateDayTimeDto,
  GetAvailableDayTimesQuery,
  AvailableDayTimeSlot,
} from '@turnos/shared';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('day-times')
@UseGuards(JwtAuthGuard)
export class DayTimesController {
  constructor(private readonly dayTimesService: DayTimesService) {}

  @Post()
  async create(@Body() createDayTimeDto: CreateDayTimeDto): Promise<DayTime> {
    return this.dayTimesService.create(createDayTimeDto);
  }

  @Get()
  async findAll(@Query('eventId') eventId?: string): Promise<DayTime[]> {
    if (eventId) {
      return this.dayTimesService.findByEvent(eventId);
    }
    return this.dayTimesService.findAll();
  }

  @Get('available')
  async getAvailable(
    @Query() query: GetAvailableDayTimesQuery,
  ): Promise<AvailableDayTimeSlot[]> {
    return this.dayTimesService.getAvailableDayTimes(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DayTime> {
    return this.dayTimesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDayTimeDto: UpdateDayTimeDto,
  ): Promise<DayTime> {
    return this.dayTimesService.update(id, updateDayTimeDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.dayTimesService.delete(id);
  }
}
