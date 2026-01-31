import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { DayTimesModule } from '../day-times/day-times.module';
import { Booking } from '@turnos/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    forwardRef(() => DayTimesModule)
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
