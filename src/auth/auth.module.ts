import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from '../auth/strategies/google.strategy';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy], // Remove JwtStrategy
  exports: [AuthService]
})
export class AuthModule {}