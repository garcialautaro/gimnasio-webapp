export * from './enums';
export * from './types';
export * from './utils';

// Export entities explicitly
export { Company } from './entities/company.entity';
export { User } from './entities/user.entity';
export { Event } from './entities/event.entity';
export { DayTime } from './entities/day-time.entity';
export { Booking } from './entities/booking.entity';

// Export DTOs and query types from interfaces
export type { CreateCompanyDto, UpdateCompanyDto } from './interfaces/company.interface';
export type { CreateUserDto, UpdateUserDto, AuthUserDto, AuthResponse } from './interfaces/user.interface';
export type { CreateEventDto, UpdateEventDto } from './interfaces/event.interface';
export type { CreateDayTimeDto, UpdateDayTimeDto, GetAvailableDayTimesQuery, AvailableDayTimeSlot } from './interfaces/day-time.interface';
export type { CreateBookingDto, UpdateBookingDto, GetBookingsQuery } from './interfaces/booking.interface';

// Export interfaces with I prefix to avoid conflicts with entities
export type { Company as ICompany } from './interfaces/company.interface';
export type { User as IUser } from './interfaces/user.interface';
export type { Event as IEvent } from './interfaces/event.interface';
export type { DayTime as IDayTime } from './interfaces/day-time.interface';
export type { Booking as IBooking } from './interfaces/booking.interface';
