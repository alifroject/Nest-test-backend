import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';

//corn scheduler
import { ScheduleModule } from '@nestjs/schedule';
import { BudgetCron } from './budget.cron';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetCron],
})
export class BudgetModule { }
