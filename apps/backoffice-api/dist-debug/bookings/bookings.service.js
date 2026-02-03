"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shared_1 = require("@turnos/shared");
let BookingsService = class BookingsService {
    bookingRepository;
    dayTimeRepository;
    constructor(bookingRepository, dayTimeRepository) {
        this.bookingRepository = bookingRepository;
        this.dayTimeRepository = dayTimeRepository;
    }
    async create(createBookingDto, userId, companyId) {
        const dayTime = await this.dayTimeRepository.findOne({
            where: { id: createBookingDto.dayTimeId },
        });
        if (!dayTime) {
            throw new common_1.BadRequestException('El day-time seleccionado no existe');
        }
        if (dayTime.eventId !== createBookingDto.eventId) {
            throw new common_1.BadRequestException('El day-time no pertenece al evento indicado');
        }
        if (dayTime.isActive === false) {
            throw new common_1.BadRequestException('El day-time no está activo');
        }
        if (dayTime.quota <= 0) {
            throw new common_1.BadRequestException('No hay cupo disponible para este horario');
        }
        const bookingsCount = await this.countBookingsForDayTime(createBookingDto.dayTimeId, new Date(createBookingDto.bookingDate));
        if (bookingsCount >= dayTime.quota) {
            throw new common_1.BadRequestException('No hay cupo disponible para este horario');
        }
        const booking = this.bookingRepository.create({
            eventId: createBookingDto.eventId,
            dayTimeId: createBookingDto.dayTimeId,
            userId,
            companyId,
            bookingDate: new Date(createBookingDto.bookingDate),
            startTime: createBookingDto.startTime,
            endTime: createBookingDto.endTime,
            status: shared_1.BookingStatus.CONFIRMED,
            notes: createBookingDto.notes,
        });
        return this.bookingRepository.save(booking);
    }
    async findAll(query) {
        const qb = this.bookingRepository.createQueryBuilder('booking');
        if (query.companyId) {
            qb.andWhere('booking.companyId = :companyId', { companyId: query.companyId });
        }
        if (query.eventId) {
            qb.andWhere('booking.eventId = :eventId', { eventId: query.eventId });
        }
        if (query.userId) {
            qb.andWhere('booking.userId = :userId', { userId: query.userId });
        }
        if (query.status) {
            qb.andWhere('booking.status = :status', { status: query.status });
        }
        if (query.startDate) {
            qb.andWhere('booking.bookingDate >= :startDate', {
                startDate: new Date(query.startDate),
            });
        }
        if (query.endDate) {
            qb.andWhere('booking.bookingDate <= :endDate', {
                endDate: new Date(query.endDate),
            });
        }
        return qb.getMany();
    }
    async findOne(id) {
        const booking = await this.bookingRepository.findOne({ where: { id } });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }
    async update(id, updateBookingDto) {
        const booking = await this.findOne(id);
        Object.assign(booking, updateBookingDto);
        return this.bookingRepository.save(booking);
    }
    async delete(id) {
        const result = await this.bookingRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
    }
    async countBookingsForDayTime(dayTimeId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const qb = this.bookingRepository.createQueryBuilder('booking');
        qb.where('booking.dayTimeId = :dayTimeId', { dayTimeId });
        qb.andWhere('booking.status IN (:...statuses)', {
            statuses: [shared_1.BookingStatus.CONFIRMED, shared_1.BookingStatus.PENDING],
        });
        qb.andWhere('booking.bookingDate >= :startOfDay', { startOfDay });
        qb.andWhere('booking.bookingDate <= :endOfDay', { endOfDay });
        return qb.getCount();
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shared_1.BookingEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(shared_1.DayTimeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map