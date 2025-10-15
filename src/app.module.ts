import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiTokenCheckMiddleware } from './common/middleware/api-token-check-middleware';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { BudgetModule } from './budget/budget.module';
import { ReportModule } from './report/report.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    TransactionModule,
    CategoryModule,
    BudgetModule,
    ReportModule,
    DashboardModule,
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