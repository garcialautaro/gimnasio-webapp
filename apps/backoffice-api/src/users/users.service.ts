import { Injectable, NotFoundException } from '@nestjs/common';
import { getFirestore } from '@turnos/firebase-config';
import { User, CreateUserDto, UpdateUserDto } from '@turnos/shared';

@Injectable()
export class UsersService {
  private readonly collection = 'users';

  async create(createUserDto: CreateUserDto & { firebaseUid: string }): Promise<User> {
    const db = getFirestore();
    const docRef = db.collection(this.collection).doc();

    const user: User = {
      id: docRef.id,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      role: createUserDto.role,
      companyId: createUserDto.companyId,
      firebaseUid: createUserDto.firebaseUid,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    await docRef.set(user);
    return user;
  }

  async findOne(id: string): Promise<User | null> {
    const db = getFirestore();
    const doc = await db.collection(this.collection).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return doc.data() as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = getFirestore();
    const snapshot = await db
      .collection(this.collection)
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data() as User;
  }

  async findByCompany(companyId: string): Promise<User[]> {
    const db = getFirestore();
    const snapshot = await db
      .collection(this.collection)
      .where('companyId', '==', companyId)
      .get();

    return snapshot.docs.map((doc) => doc.data() as User);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const db = getFirestore();
    const docRef = db.collection(this.collection).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = {
      ...doc.data(),
      ...updateUserDto,
      updatedAt: new Date(),
    };

    await docRef.update(updatedUser);
    return updatedUser as User;
  }

  async delete(id: string): Promise<void> {
    const db = getFirestore();
    await db.collection(this.collection).doc(id).delete();
  }
}
