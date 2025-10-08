import { z } from 'zod';

export const CreateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Invalid email address'),
  role: z.enum(['user', 'admin']).default('user'),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
