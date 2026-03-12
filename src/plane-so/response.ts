import { z } from "zod";

export const responseArraySchema = z.object({
  total_count: z.number(),
  next_page_results: z.boolean(),
  prev_page_results: z.boolean(),
  count: z.number(),
  total_pages: z.number(),
  total_results: z.number(),
  results: z.array(z.any()),
});

export type ResponseArray<T> = z.infer<typeof responseArraySchema> & {
  results: T[];
}
