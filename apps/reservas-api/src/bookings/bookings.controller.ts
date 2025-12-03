import { Controller, Post, Body } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking, CreateBookingDto } from '@turnos/shared';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto & { userId: string; companyId: string },
  ): Promise<Booking> {
    return this.bookingsService.create(
      createBookingDto,
      createBookingDto.userId,
      createBookingDto.companyId,
    );
  }
}
