import { z } from "zod"

export const editExpenseSchema = z.object({
  description: z.string().optional(),
  category: z.enum(["Food", "Stationary", "Transportation", "Entertainment", "Other"]).optional(),
  paymentMethod: z.enum(["Cash", "UPI"]).optional(),
  amount: z.coerce.number().optional(),
}).refine(data => {
  return [data.description, data.category, data.paymentMethod, data.amount].some(field => field !== undefined)
}, {
  message: "At least one field must be provided",
  path: ['_errors']
})