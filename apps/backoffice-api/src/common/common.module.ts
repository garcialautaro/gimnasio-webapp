import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';

@Module({
  imports: [UsersModule],
  providers: [FirebaseAuthGuard],
  exports: [FirebaseAuthGuard, UsersModule],
})
export class CommonModule {}
