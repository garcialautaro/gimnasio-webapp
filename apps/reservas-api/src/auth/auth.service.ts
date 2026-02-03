import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '@turnos/shared';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(email: string, password: string, firstName: string, lastName: string, phone?: string): Promise<User> {
    const user = this.userRepository.create({
      email,
      password, // Se hasheará automáticamente en la entity
      firstName,
      lastName,
      phone,
      role: UserRole.CLIENT,
    });

    return this.userRepository.save(user);
  }
}
