import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompaniesModule } from './companies/companies.module';
import { EventsModule } from './events/events.module';
import { DayTimesModule } from './day-times/day-times.module';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    CompaniesModule,
    EventsModule,
    DayTimesModule,
    BookingsModule,
  ],
})
export class AppModule {}
