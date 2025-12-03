import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { getFirestore } from '@turnos/firebase-config';
import {
  DayTime,
  CreateDayTimeDto,
  UpdateDayTimeDto,
  GetAvailableDayTimesQuery,
  AvailableDayTimeSlot,
  DayTimeType,
  DayOfWeek,
} from '@turnos/shared';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class DayTimesService {
  private readonly collection = 'day-times';

  constructor(
    @Inject(forwardRef(() => BookingsService))
    private readonly bookingsService: BookingsService,
  ) {}

  async create(createDayTimeDto: CreateDayTimeDto): Promise<DayTime> {
    const db = getFirestore();
    const docRef = db.collection(this.collection).doc();

    const dayTime: DayTime = {
      id: docRef.id,
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
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    await docRef.set(dayTime);
    return dayTime;
  }

  async findAll(): Promise<DayTime[]> {
    const db = getFirestore();
    const snapshot = await db.collection(this.collection).get();
    return snapshot.docs.map((doc) => doc.data() as DayTime);
  }

  async findByEvent(eventId: string): Promise<DayTime[]> {
    const db = getFirestore();
    const snapshot = await db
      .collection(this.collection)
      .where('eventId', '==', eventId)
      .get();

    return snapshot.docs.map((doc) => doc.data() as DayTime);
  }

  async findOne(id: string): Promise<DayTime> {
    const db = getFirestore();
    const doc = await db.collection(this.collection).doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException(`DayTime with ID ${id} not found`);
    }

    return doc.data() as DayTime;
  }

  async update(id: string, updateDayTimeDto: UpdateDayTimeDto): Promise<DayTime> {
    const db = getFirestore();
    const docRef = db.collection(this.collection).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException(`DayTime with ID ${id} not found`);
    }

    const updatedDayTime = {
      ...doc.data(),
      ...updateDayTimeDto,
      updatedAt: new Date(),
    };

    await docRef.update(updatedDayTime);
    return updatedDayTime as DayTime;
  }

  async delete(id: string): Promise<void> {
    const db = getFirestore();
    await db.collection(this.collection).doc(id).delete();
  }

  // Obtener day-times disponibles en un rango de fechas
  async getAvailableDayTimes(
    query: GetAvailableDayTimesQuery,
  ): Promise<AvailableDayTimeSlot[]> {
    const { eventId, startDate, endDate } = query;

    // Obtener todos los day-times del evento
    const dayTimes = await this.findByEvent(eventId);

    // Separar regulares y excepcionales
    const regularDayTimes = dayTimes.filter((dt) => dt.type === DayTimeType.REGULAR);
    const exceptionalDayTimes = dayTimes.filter((dt) => dt.type === DayTimeType.EXCEPTIONAL);

    const slots: AvailableDayTimeSlot[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Iterar sobre cada día en el rango
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const currentDate = new Date(date);
      const dayOfWeek = this.getDayOfWeek(currentDate);

      // Verificar si hay excepcionales para este día
      const exceptionalForDate = exceptionalDayTimes.filter((dt) => {
        if (!dt.specificDate) return false;
        const specificDate = new Date(dt.specificDate);
        return (
          specificDate.getFullYear() === currentDate.getFullYear() &&
          specificDate.getMonth() === currentDate.getMonth() &&
          specificDate.getDate() === currentDate.getDate()
        );
      });

      if (exceptionalForDate.length > 0) {
        // Si hay excepcionales que deshabilitan regulares
        const disabling = exceptionalForDate.find((dt) => dt.disablesRegular);
        if (disabling) {
          // Solo usar los excepcionales que no deshabilitan (los habilitadores)
          for (const dt of exceptionalForDate.filter((d) => !d.disablesRegular)) {
            const bookingsCount = await this.bookingsService.countBookingsForDayTime(
              dt.id,
              currentDate,
            );

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
        } else {
          // Usar todos los excepcionales
          for (const dt of exceptionalForDate) {
            const bookingsCount = await this.bookingsService.countBookingsForDayTime(
              dt.id,
              currentDate,
            );

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
      } else {
        // No hay excepcionales, usar regulares
        const regularForDay = regularDayTimes.filter((dt) => dt.dayOfWeek === dayOfWeek);

        for (const dt of regularForDay) {
          const bookingsCount = await this.bookingsService.countBookingsForDayTime(
            dt.id,
            currentDate,
          );

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

  private getDayOfWeek(date: Date): DayOfWeek {
    const dayIndex = date.getDay();
    const days = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ];
    return days[dayIndex];
  }
}
