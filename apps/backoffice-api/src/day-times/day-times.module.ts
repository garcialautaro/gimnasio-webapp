import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayTimesController } from './day-times.controller';
import { DayTimesService } from './day-times.service';
import { BookingsModule } from '../bookings/bookings.module';
import { DayTime } from '@turnos/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([DayTime]),
    forwardRef(() => BookingsModule)
  ],
  controllers: [DayTimesController],
  providers: [DayTimesService],
  exports: [DayTimesService],
})
export class DayTimesModule {}
