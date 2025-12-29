import { type ZodError } from 'zod';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const handleValidationZodError = (error: ZodError): string => {
  const firstError = error.issues[0];
  return firstError.message;
};
