import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { BudgetService } from './budget.service';

//zod
import { createBudgetSchema, updateBudgetSchema } from './zod/budget.schema';
import type { Request } from 'express';
import { SessionAuthGuard } from 'src/common/guards/session-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(SessionAuthGuard, ThrottlerGuard)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) { }


  @Throttle({ short: { limit: 10, ttl: 60 } })
  @Post()
  create(@Body() body: any, @Req() req: Request) {
    const result = createBudgetSchema.safeParse(body)
    if (!result.success) {
      throw new BadRequestException(result.error.format())
    }

    return this.budgetService.create(result.data, req.session.user.id)
  }

  @Throttle({ short: { limit: 10, ttl: 60 } })
  @Get()
  findAll(@Req() req: any) {
    return this.budgetService.findAll(req.session.user.id);
  }

  @Throttle({ short: { limit: 10, ttl: 60 } })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.budgetService.findOne(+id, req.session.user.id);
  }


  @Throttle({ short: { limit: 20, ttl: 60 } })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    const result = updateBudgetSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }

    return this.budgetService.update(+id, result.data, req.session.user.id);
  }

  @Throttle({ short: { limit: 10, ttl: 60 } })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.budgetService.remove(+id);
  }
}
