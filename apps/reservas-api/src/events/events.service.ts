import { Injectable, NotFoundException } from '@nestjs/common';
import { getFirestore } from '@turnos/firebase-config';
import { Event, CreateEventDto, UpdateEventDto } from '@turnos/shared';

@Injectable()
export class EventsService {
  private readonly collection = 'events';

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const db = getFirestore();
    const docRef = db.collection(this.collection).doc();

    const event: Event = {
      id: docRef.id,
      companyId: createEventDto.companyId,
      name: createEventDto.name,
      description: createEventDto.description,
      duration: createEventDto.duration,
      color: createEventDto.color,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    await docRef.set(event);
    return event;
  }

  async findAll(): Promise<Event[]> {
    const db = getFirestore();
    const snapshot = await db.collection(this.collection).get();
    return snapshot.docs.map((doc) => doc.data() as Event);
  }

  async findByCompany(companyId: string): Promise<Event[]> {
    const db = getFirestore();
    const snapshot = await db
      .collection(this.collection)
      .where('companyId', '==', companyId)
      .get();

    return snapshot.docs.map((doc) => doc.data() as Event);
  }

  async findOne(id: string): Promise<Event> {
    const db = getFirestore();
    const doc = await db.collection(this.collection).doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return doc.data() as Event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const db = getFirestore();
    const docRef = db.collection(this.collection).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const updatedEvent = {
      ...doc.data(),
      ...updateEventDto,
      updatedAt: new Date(),
    };

    await docRef.update(updatedEvent);
    return updatedEvent as Event;
  }

  async delete(id: string): Promise<void> {
    const db = getFirestore();
    await db.collection(this.collection).doc(id).delete();
  }
}
