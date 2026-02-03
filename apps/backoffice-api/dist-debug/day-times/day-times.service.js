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
exports.DayTimesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shared_1 = require("@turnos/shared");
const bookings_service_1 = require("../bookings/bookings.service");
let DayTimesService = class DayTimesService {
    dayTimeRepository;
    bookingsService;
    constructor(dayTimeRepository, bookingsService) {
        this.dayTimeRepository = dayTimeRepository;
        this.bookingsService = bookingsService;
    }
    async create(createDayTimeDto) {
        const dayTime = this.dayTimeRepository.create({
            eventId: createDayTimeDto.eventId,
            type: createDayTimeDto.type,
            dayOfWeek: createDayTimeDto.dayOfWeek,
            specificDate: createDayTimeDto.specificDate
                ? new Date(createDayTimeDto.specificDate)
                : undefined,
            startTime: createDayTimeDto.startTime,
            endTime: createDayTimeDto.endTime,
            quota: createDayTimeDto.quota,
            disablesRegular: createDayTimeDto.disablesRegular || false,
            isActive: true,
        });
        return this.dayTimeRepository.save(dayTime);
    }
    async findAll() {
        return this.dayTimeRepository.find();
    }
    async findByEvent(eventId) {
        return this.dayTimeRepository.find({ where: { eventId } });
    }
    async findOne(id) {
        const dayTime = await this.dayTimeRepository.findOne({ where: { id } });
        if (!dayTime) {
            throw new common_1.NotFoundException(`DayTime with ID ${id} not found`);
        }
        return dayTime;
    }
    async update(id, updateDayTimeDto) {
        const dayTime = await this.findOne(id);
        Object.assign(dayTime, updateDayTimeDto);
        return this.dayTimeRepository.save(dayTime);
    }
    async delete(id) {
        const result = await this.dayTimeRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`DayTime with ID ${id} not found`);
        }
    }
    async getAvailableDayTimes(query) {
        const { eventId, startDate, endDate } = query;
        const dayTimes = await this.findByEvent(eventId);
        const regularDayTimes = dayTimes.filter((dt) => dt.type === shared_1.DayTimeType.REGULAR);
        const exceptionalDayTimes = dayTimes.filter((dt) => dt.type === shared_1.DayTimeType.EXCEPTIONAL);
        const slots = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const currentDate = new Date(date);
            const dayOfWeek = this.getDayOfWeek(currentDate);
            const exceptionalForDate = exceptionalDayTimes.filter((dt) => {
                if (!dt.specificDate)
                    return false;
                const specificDate = new Date(dt.specificDate);
                return (specificDate.getFullYear() === currentDate.getFullYear() &&
                    specificDate.getMonth() === currentDate.getMonth() &&
                    specificDate.getDate() === currentDate.getDate());
            });
            if (exceptionalForDate.length > 0) {
                const disabling = exceptionalForDate.find((dt) => dt.disablesRegular);
                if (disabling) {
                    for (const dt of exceptionalForDate.filter((d) => !d.disablesRegular)) {
                        const bookingsCount = await this.bookingsService.countBookingsForDayTime(dt.id, currentDate);
                        slots.push({
                            date: currentDate.toISOString(),
                            dayOfWeek,
                            startTime: dt.startTime,
                            endTime: dt.endTime,
                            quota: dt.quota,
                            availableQuota: dt.quota - bookingsCount,
                            isExceptional: true,
                            dayTimeId: dt.id,
                        });
                    }
                }
                else {
                    for (const dt of exceptionalForDate) {
                        const bookingsCount = await this.bookingsService.countBookingsForDayTime(dt.id, currentDate);
                        slots.push({
                            date: currentDate.toISOString(),
                            dayOfWeek,
                            startTime: dt.startTime,
                            endTime: dt.endTime,
                            quota: dt.quota,
                            availableQuota: dt.quota - bookingsCount,
                            isExceptional: true,
                            dayTimeId: dt.id,
                        });
                    }
                }
            }
            else {
                const regularForDay = regularDayTimes.filter((dt) => dt.dayOfWeek === dayOfWeek);
                for (const dt of regularForDay) {
                    const bookingsCount = await this.bookingsService.countBookingsForDayTime(dt.id, currentDate);
                    slots.push({
                        date: currentDate.toISOString(),
                        dayOfWeek,
                        startTime: dt.startTime,
                        endTime: dt.endTime,
                        quota: dt.quota,
                        availableQuota: dt.quota - bookingsCount,
                        isExceptional: false,
                        dayTimeId: dt.id,
                    });
                }
            }
        }
        return slots;
    }
    getDayOfWeek(date) {
        const dayIndex = date.getDay();
        const days = [
            shared_1.DayOfWeek.SUNDAY,
            shared_1.DayOfWeek.MONDAY,
            shared_1.DayOfWeek.TUESDAY,
            shared_1.DayOfWeek.WEDNESDAY,
            shared_1.DayOfWeek.THURSDAY,
            shared_1.DayOfWeek.FRIDAY,
            shared_1.DayOfWeek.SATURDAY,
        ];
        return days[dayIndex];
    }
};
exports.DayTimesService = DayTimesService;
exports.DayTimesService = DayTimesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shared_1.DayTimeEntity)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => bookings_service_1.BookingsService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        bookings_service_1.BookingsService])
], DayTimesService);
//# sourceMappingURL=day-times.service.js.map