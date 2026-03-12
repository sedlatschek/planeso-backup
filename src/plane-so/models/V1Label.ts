import { z } from "zod";

export const V1LabelSchema = z.object({
  id: z.string(),
}).loose();

export type V1Label = z.infer<typeof V1LabelSchema>;
