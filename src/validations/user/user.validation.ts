import { z } from 'zod';
import { validateEmail } from '../../utils/helpers';

// Helper function to handle null/undefined values
const preprocessString = (val: unknown) => (val === null || val === undefined ? '' : val);

// Reusable field schemas
const emailSchema = z.string().trim().min(1, 'Email is required').refine(validateEmail, 'Please enter a valid email address');
const passwordSchema = z.string().trim().min(1, 'Password is required').min(6, 'Password must be at least 6 characters');
const textSchema = (fieldName: string) => z.string().trim().min(1, `${fieldName} is required`);
const guidSchema = z.guid({ message: 'Invalid ID format' });

// Login Schema
export const loginUserSchema = z.object({
  email: z.preprocess(preprocessString, emailSchema),
  password: z.preprocess(preprocessString, passwordSchema),
});

// Register Schema
export const registerUserSchema = z
  .object({
    firstName: z.preprocess(preprocessString, textSchema('First name')),
    lastName: z.preprocess(preprocessString, textSchema('Last name')),
    email: z.preprocess(preprocessString, emailSchema),
    password: z.preprocess(preprocessString, passwordSchema),
    confirmPassword: z.preprocess(
      preprocessString,
      passwordSchema.refine(() => true, 'Confirm password is required')
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const getUserSchema = z.object({
  id: z.preprocess(preprocessString, guidSchema),
});

// Types
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
