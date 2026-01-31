import { DayTimeType, DayOfWeek } from '../enums';
export interface DayTime {
    id: string;
    eventId: string;
    type: DayTimeType;
    dayOfWeek?: DayOfWeek;
    specificDate?: Date;
    startTime: string;
    endTime: string;
    quota: number;
    disablesRegular: boolean;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}
export interface CreateDayTimeDto {
    eventId: string;
    type: DayTimeType;
    dayOfWeek?: DayOfWeek;
    specificDate?: Date | string;
    startTime: string;
    endTime: string;
    quota: number;
    disablesRegular?: boolean;
}
export interface UpdateDayTimeDto {
    startTime?: string;
    endTime?: string;
    quota?: number;
    disablesRegular?: boolean;
    isActive?: boolean;
}
export interface GetAvailableDayTimesQuery {
    eventId: string;
    startDate: Date | string;
    endDate: Date | string;
}
export interface AvailableDayTimeSlot {
    date: Date | string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    quota: number;
    availableQuota: number;
    isExceptional: boolean;
    dayTimeId: string;
}
//# sourceMappingURL=day-time.interface.d.ts.map