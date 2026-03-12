import { z } from 'zod';

export const V1EntitySchema = z.object({ id: z.string() }).loose();

export type V1Entity = z.infer<typeof V1EntitySchema>;
