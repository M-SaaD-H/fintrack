import { z } from "zod";

export const addExpenseSchema = z.object({
  description: z.string().min(3, { message: "Description must be at least 3 characters long" }),
  category: z.enum(["Food", "Stationary", "Transportation", "Entertainment", "Shopping", "Other"]),
  paymentMethod: z.enum(["Cash", "UPI"]),
  amount: z.coerce.number().min(1, { message: "Amount must be greater than 0" }),
});