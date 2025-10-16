import { Category } from 'src/category/entities/category.entity';
import { z } from 'zod';

export const createTransactionSchema = z.object({
    userId: z.number().int().positive(),
    budgetId: z.number().int().positive(),
    type: z.enum(['income', 'expense']),
    amount: z.number().positive(),
    description: z.string().optional(),
    categoryId: z.number().int().optional(),
});


export const updateTransactionSchema = z.object({
    type: z.enum(['income', 'expense']).optional(),
    amount: z.number().positive().optional(),
    description: z.string().optional(),
    categoryId: z.number().int().optional(),
});


export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>;



