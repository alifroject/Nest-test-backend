import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBudgetSchema, UpdateBudgetSchema } from './zod/budget.schema';

@Injectable()
export class BudgetService {
    constructor(private readonly prisma: PrismaService) { }

    //create logic
    async create(data: CreateBudgetSchema, userId) {
        return this.prisma.budget.create({
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                userId
            }
        })
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
