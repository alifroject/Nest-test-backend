import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BudgetService } from './budget.service';

@Injectable()
export class BudgetCron {
    private readonly logger = new Logger(BudgetCron.name);

    constructor(private readonly budgetService: BudgetService) { }


    @Cron('*/1 * * * *')
    async handleBudgetStatusUpdate() {
        this.logger.log('Running daily budget status check...');

        const updatedCount = await this.budgetService.updateExpiredBudgets();
        this.logger.log(`Budgets updated: ${updatedCount}`);
    }
}
