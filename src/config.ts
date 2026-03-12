import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const configSchema = z.object({
  PLANE_WORKSPACE: z.string(),
  PLANE_API_TOKEN: z.string(),
});

export type Config = z.infer<typeof configSchema>;

export function getConfig(): Config {
  return configSchema.parse(process.env);
}
