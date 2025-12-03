import { Injectable } from '@nestjs/common';
import { getAuth, getFirestore } from '@turnos/firebase-config';
import { User, CreateUserDto, UserRole } from '@turnos/shared';

@Injectable()
export class AuthService {
  async registerClient(email: string, password: string, firstName: string, lastName: string, phone?: string): Promise<User> {
    const firebaseAuth = getAuth();
    const firebaseUser = await firebaseAuth.createUser({ email, password });

    const db = getFirestore();
    const docRef = db.collection('users').doc();

    const user: User = {
      id: docRef.id,
      email,
      firstName,
      lastName,
      phone,
      role: UserRole.CLIENT,
      firebaseUid: firebaseUser.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    await docRef.set(user);
    return user;
  }
}
