import { readFile } from 'fs/promises';
import { z } from 'zod';
import jsYaml from 'js-yaml';

const configSchema = z.object({
  api: z.object({
    baseUrl: z.url(),
    accessToken: z.string(),
  }),
  backup: z.object({
    workspaces: z.array(z.string()),
    outputDir: z.string(),
  }),
});

export type Config = z.infer<typeof configSchema>;

export async function getConfig(configFile: string): Promise<Config> {
  const content = await readFile(configFile, 'utf8');
  const yaml = jsYaml.load(content);
  return configSchema.parse(yaml);
}
