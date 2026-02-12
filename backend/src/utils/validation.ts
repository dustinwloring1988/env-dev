import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});

export const createAppSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const updateAppSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().nullable(),
});

export const createSecretSchema = z.object({
  key: z.string().min(1, 'Key is required').max(100, 'Key must be less than 100 characters'),
  value: z.string().min(1, 'Value is required'),
});

export const updateSecretSchema = z.object({
  key: z.string().min(1, 'Key is required').max(100, 'Key must be less than 100 characters').optional(),
  value: z.string().min(1, 'Value is required').optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAppInput = z.infer<typeof createAppSchema>;
export type UpdateAppInput = z.infer<typeof updateAppSchema>;
export type CreateSecretInput = z.infer<typeof createSecretSchema>;
export type UpdateSecretInput = z.infer<typeof updateSecretSchema>;
