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
const shared_1 = require("../../../../packages/shared/src");
let BookingsService = class BookingsService {
    bookingRepository;
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async create(createBookingDto, userId, companyId) {
        const booking = this.bookingRepository.create({
            ...createBookingDto,
            userId,
            companyId,
            bookingDate: new Date(createBookingDto.bookingDate),
            status: shared_1.BookingStatus.CONFIRMED,
        });
        return this.bookingRepository.save(booking);
    }
    async findAll(query) {
        const where = {};
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
            where.bookingDate = (0, typeorm_2.Between)(new Date(query.startDate), new Date(query.endDate));
        }
        else if (query.startDate) {
            const startDate = new Date(query.startDate);
            where.bookingDate = (0, typeorm_2.Between)(startDate, new Date('2099-12-31'));
        }
        else if (query.endDate) {
            const endDate = new Date(query.endDate);
            where.bookingDate = (0, typeorm_2.Between)(new Date('1970-01-01'), endDate);
        }
        return this.bookingRepository.find({ where });
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
        return this.bookingRepository.count({
            where: {
                dayTimeId,
                bookingDate: (0, typeorm_2.Between)(startOfDay, endOfDay),
                status: (0, typeorm_2.In)([shared_1.BookingStatus.PENDING, shared_1.BookingStatus.CONFIRMED]),
            },
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shared_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map