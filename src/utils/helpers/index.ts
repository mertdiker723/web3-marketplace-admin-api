import { type ZodError } from 'zod';
import { BadRequestError } from '../errors/HttpError';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const handleValidationZodError = (error: ZodError): BadRequestError => {
  const firstError = error.issues[0];
  return new BadRequestError(firstError.message);
};
