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
import { BookingsService } from './bookings.service';
import {
  Booking,
  CreateBookingDto,
  UpdateBookingDto,
  GetBookingsQuery,
  User,
} from '@turnos/shared';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User,
  ): Promise<Booking> {
    return this.bookingsService.create(
      createBookingDto,
      user.id,
      user.companyId!,
    );
  }

  @Get()
  async findAll(@Query() query: GetBookingsQuery): Promise<Booking[]> {
    return this.bookingsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.bookingsService.delete(id);
  }
}
