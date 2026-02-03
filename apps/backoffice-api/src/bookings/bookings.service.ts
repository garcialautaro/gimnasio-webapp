import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import {
  Booking,
  CreateBookingDto,
  UpdateBookingDto,
  GetBookingsQuery,
  BookingStatus,
} from '@turnos/shared';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string, companyId: string): Promise<Booking> {
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      userId,
      companyId,
      bookingDate: new Date(createBookingDto.bookingDate),
      status: BookingStatus.CONFIRMED,
    });

    return this.bookingRepository.save(booking);
  }

  async findAll(query: GetBookingsQuery): Promise<Booking[]> {
    const where: any = {};

    if (query.companyId) {
      where.companyId = query.companyId;
    }

    if (query.eventId) {
      where.eventId = query.eventId;
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.startDate && query.endDate) {
      where.bookingDate = Between(new Date(query.startDate), new Date(query.endDate));
    } else if (query.startDate) {
      const startDate = new Date(query.startDate);
      where.bookingDate = Between(startDate, new Date('2099-12-31'));
    } else if (query.endDate) {
      const endDate = new Date(query.endDate);
      where.bookingDate = Between(new Date('1970-01-01'), endDate);
    }

    return this.bookingRepository.find({ where });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    Object.assign(booking, updateBookingDto);
    return this.bookingRepository.save(booking);
  }

  async delete(id: string): Promise<void> {
    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }

  // Contar reservas para un day-time específico en una fecha
  async countBookingsForDayTime(dayTimeId: string, date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.bookingRepository.count({
      where: {
        dayTimeId,
        bookingDate: Between(startOfDay, endOfDay),
        status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
      },
    });
  }
}
