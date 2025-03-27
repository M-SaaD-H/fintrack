import { z } from "zod";

export const addBalanceSchema = z.object({
  upi: z.coerce.number().min(0, { message: "UPI must be a positive number" }).optional(),
  cash: z.coerce.number().min(0, { message: "Cash must be a positive number" }).optional(),
}).refine((data) => {
  return (data.upi ?? 0) > 0 || (data.cash ?? 0) > 0
},
  {
    message: "At least one field must be provided to update the balance",
    path: ["cash"],
  }
);