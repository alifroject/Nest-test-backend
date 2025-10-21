import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBudgetSchema, UpdateBudgetSchema } from './zod/budget.schema';

@Injectable()
export class BudgetService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateBudgetSchema, userId: number) {
        const budgetData: Prisma.BudgetCreateInput = {
            name: data.name,
            user: { connect: { id: userId } },
            startDate: data.startDate ? new Date(data.startDate) : new Date(),
            endDate: data.endDate ? new Date(data.endDate) : new Date(),
            category: data.category,
            isRecurring: data.isRecurring,
            status: data.status,
            limitAmount:
                data.limitAmount !== undefined
                    ? typeof data.limitAmount === 'number'
                        ? data.limitAmount
                        : new Prisma.Decimal(data.limitAmount)
                    : new Prisma.Decimal(0),
        };

        return this.prisma.budget.create({ data: budgetData });
    }


    //
    async findAll(userId: number) {
        return this.prisma.budget.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        })
    }

    //
    async findOne(id: number, userId) {
        return this.prisma.budget.findFirst({
            where: { id, userId }
        });
    }


    //
    async update(id: number, data: UpdateBudgetSchema, userId: number) {
        const budget = await this.prisma.budget.findUnique({ where: { id } });
        if (!budget) throw new NotFoundException(`Budget ${id} not found`);
        if (budget.userId !== userId) throw new ForbiddenException(`Not your budget`);

        return this.prisma.budget.update({
            where: { id },
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                isRecurring: data.isRecurring,
                status: data.status,
            },
        });
    }



    //
    async remove(id: number) {
        return this.prisma.budget.delete({
            where: { id }
        })
    }
}
