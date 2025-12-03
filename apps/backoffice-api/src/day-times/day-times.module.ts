import { Module } from '@nestjs/common';
import { DayTimesController } from './day-times.controller';
import { DayTimesService } from './day-times.service';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [BookingsModule],
  controllers: [DayTimesController],
  providers: [DayTimesService],
  exports: [DayTimesService],
})
export class DayTimesModule {}
