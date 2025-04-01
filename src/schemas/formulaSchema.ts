import { z } from 'zod';

export const formulaSchema = z.object({
	name: z.string().min(1),
	ingredients: z.array(
		z.object({
			name: z.string().min(1),
			quantity: z.number().min(0),
		})
	),
});

export type FormulaRequest = z.infer<typeof formulaSchema>;
