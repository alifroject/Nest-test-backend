import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from './zod/transaction.schema';
import type { Request } from 'express';
import { SessionAuthGuard } from 'src/common/guards/session-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(SessionAuthGuard, ThrottlerGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Throttle({ short: { limit: 10, ttl: 60 } })
  @Post()
  create(@Body() body: any, @Req() req: Request) {
    const result = createTransactionSchema.safeParse(body)
    if (!result.success) {
      throw new BadRequestException(result.error.format())
    }
    return this.transactionService.create(result.data, req.session.user.id);
  }

  @Throttle({ short: { limit: 10, ttl: 60 } })
  @Get()
  findAll(@Req() req: any) {
    return this.transactionService.findAll(req.session.user.id);
  }


  @Throttle({ short: { limit: 10, ttl: 60 } })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.transactionService.findOne(+id, req.session.user.id);
  }

  @Throttle({ short: { limit: 20, ttl: 60 } })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    const result = updateTransactionSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.format())
    }
    return this.transactionService.update(+id, result.data, req.session.user.id);
  }

  @Throttle({ short: { limit: 10, ttl: 60 } })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
