import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiTokenCheckMiddleware } from './common/middleware/api-token-check-middleware';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiTokenCheckMiddleware)
      .exclude(
        'auth/google',
        'auth/google/callback',
        'auth/login', 
        'auth/register',
        'auth/(.*)' 
      )
      .forRoutes('*');
  }
}