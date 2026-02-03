import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { getAuth } from '@turnos/firebase-config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const firebaseAuth = getAuth();
      const decoded = await firebaseAuth.verifyIdToken(token);
      const user = await this.usersService.findByFirebaseUid(decoded.uid);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;
      request.firebase = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
