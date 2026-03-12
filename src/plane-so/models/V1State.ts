import { z } from "zod";

export const V1StateSchema = z.object({
	id: z.string(),
}).loose();

export type V1State = z.infer<typeof V1StateSchema>;
