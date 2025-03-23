import { z } from "zod";

export const usernameValidation = z
.string()
.min(3, 'Username must be at least 3 characters long')
.regex(/^[a-zA-Z0-9_]+$/, 'Username must contain only letters, numbers and underscores');

export const signupSchema = z.object({
  firstName: z.string().min(3, 'First name must be at least 3 characters long'),
  lastName: z.string().min(3, 'Last name must be at least 3 characters long'),
  username: usernameValidation,
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});
