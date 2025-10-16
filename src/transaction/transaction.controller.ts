import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from './zod/transaction.schema';
import type { Request } from 'express';
import { SessionAuthGuard } from 'src/common/guards/session-auth.guard';


@UseGuards(SessionAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post()
  create(@Body() body: any, @Req() req: Request) {
    const result = createTransactionSchema.safeParse(body)
    if (!result.success) {
      throw new BadRequestException(result.error.format())
    }
    return this.transactionService.create(result.data, req.session.user.id);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.transactionService.findAll(req.session.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.transactionService.findOne(+id, req.session.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const result = updateTransactionSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.format())
    }
    return this.transactionService.update(+id, result.data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
