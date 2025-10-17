import { z } from 'zod';

// Create Budget
export const createBudgetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().optional(),
  limitAmount: z.string(), // Prisma Decimal
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional(),
});

// Update Budget
export const updateBudgetSchema = z.object({
  title: z.string().min(1).optional(),
  category: z.string().optional(),
  limitAmount: z.string().refine((val) => !isNaN(Number(val)), { message: "limitAmount must be a number" }).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional(),
});

export type CreateBudgetSchema = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetSchema = z.infer<typeof updateBudgetSchema>;
