import { z } from 'zod';
import { validateEmail } from '../../utils/helpers';

export const loginUserSchema = z.object({
  email: z.preprocess(
    (val) => (val === null || val === undefined ? '' : val),
    z.string().trim().min(1, 'Email is required').refine(validateEmail, 'Please enter a valid email address')
  ),
  password: z.preprocess((val) => (val === null || val === undefined ? '' : val), z.string().trim().min(6, 'Password must be at least 6 characters')),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
