import { z } from 'zod';

export const V1ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
}).loose();

export type V1Project = z.infer<typeof V1ProjectSchema>;
