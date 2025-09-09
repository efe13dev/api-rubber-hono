import { z } from "zod";

export const stockSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().min(0).optional(),
});

export type StockRequest = z.infer<typeof stockSchema>;
