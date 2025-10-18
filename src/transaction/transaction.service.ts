import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionSchema, UpdateTransactionSchema } from './zod/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateTransactionSchema, userId: number) {
    return this.prisma.transaction.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    return this.prisma.transaction.findFirst({
      where: { id, userId },
    });
  }

  async update(id: number, data: UpdateTransactionSchema, userId: number) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });
    if (!transaction) throw new NotFoundException(`Budget ${id} not found`);
    if (transaction.userId !== userId) throw new ForbiddenException(`Not your budget`);

    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
