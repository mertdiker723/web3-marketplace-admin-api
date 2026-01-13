import { z } from 'zod';

export const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255, 'Brand name is too long'),
});
