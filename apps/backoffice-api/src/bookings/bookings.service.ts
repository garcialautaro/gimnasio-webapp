import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { getFirestore } from '@turnos/firebase-config';
import {
  Booking,
  CreateBookingDto,
  UpdateBookingDto,
  GetBookingsQuery,
  BookingStatus,
} from '@turnos/shared';

@Injectable()
export class BookingsService {
  private readonly collection = 'bookings';

  async create(createBookingDto: CreateBookingDto, userId: string, companyId: string): Promise<Booking> {
    const db = getFirestore();

    // Verificar disponibilidad de quota
    const bookingsCount = await this.countBookingsForDayTime(
      createBookingDto.dayTimeId,
      new Date(createBookingDto.bookingDate),
    );

    // Aquí se debería verificar contra la quota del day-time
    // Por ahora lo omitimos para simplificar

    const docRef = db.collection(this.collection).doc();

    const booking: Booking = {
      id: docRef.id,
      eventId: createBookingDto.eventId,
      dayTimeId: createBookingDto.dayTimeId,
      userId,
      companyId,
      bookingDate: new Date(createBookingDto.bookingDate),
      startTime: createBookingDto.startTime,
      endTime: createBookingDto.endTime,
      status: BookingStatus.CONFIRMED,
      notes: createBookingDto.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await docRef.set(booking);
    return booking;
  }

  async findAll(query: GetBookingsQuery): Promise<Booking[]> {
    const db = getFirestore();
    let firestoreQuery = db.collection(this.collection);

    if (query.companyId) {
      firestoreQuery = firestoreQuery.where('companyId', '==', query.companyId) as any;
    }

    if (query.eventId) {
      firestoreQuery = firestoreQuery.where('eventId', '==', query.eventId) as any;
    }

    if (query.userId) {
      firestoreQuery = firestoreQuery.where('userId', '==', query.userId) as any;
    }

    if (query.status) {
      firestoreQuery = firestoreQuery.where('status', '==', query.status) as any;
    }

    const snapshot = await firestoreQuery.get();
    const bookings = snapshot.docs.map((doc) => doc.data() as Booking);

    // Filtrar por fechas en memoria (Firestore tiene limitaciones con rangos)
    let filteredBookings = bookings;

    if (query.startDate) {
      const startDate = new Date(query.startDate);
      filteredBookings = filteredBookings.filter(
        (b) => new Date(b.bookingDate) >= startDate,
      );
    }

    if (query.endDate) {
      const endDate = new Date(query.endDate);
      filteredBookings = filteredBookings.filter(
        (b) => new Date(b.bookingDate) <= endDate,
      );
    }

    return filteredBookings;
  }

  async findOne(id: string): Promise<Booking> {
    const db = getFirestore();
    const doc = await db.collection(this.collection).doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return doc.data() as Booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const db = getFirestore();
    const docRef = db.collection(this.collection).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    const updatedBooking = {
      ...doc.data(),
      ...updateBookingDto,
      updatedAt: new Date(),
    };

    await docRef.update(updatedBooking);
    return updatedBooking as Booking;
  }

  async delete(id: string): Promise<void> {
    const db = getFirestore();
    await db.collection(this.collection).doc(id).delete();
  }

  // Contar reservas para un day-time específico en una fecha
  async countBookingsForDayTime(dayTimeId: string, date: Date): Promise<number> {
    const db = getFirestore();

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const snapshot = await db
      .collection(this.collection)
      .where('dayTimeId', '==', dayTimeId)
      .where('status', 'in', [BookingStatus.CONFIRMED, BookingStatus.PENDING])
      .get();

    // Filtrar por fecha en memoria
    const bookings = snapshot.docs.filter((doc) => {
      const bookingDate = doc.data().bookingDate.toDate();
      return bookingDate >= startOfDay && bookingDate <= endOfDay;
    });

    return bookings.length;
  }
}
