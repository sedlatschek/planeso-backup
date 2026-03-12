#!/usr/bin/env node

import { Backup } from './backup.js';
import { getConfig } from './config.js';
import { logger } from './logger.js';
import { PlaneSoClient } from './plane-so/index.js';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const outputFile = args[0];
  if (!outputFile) {
    logger.error('Usage: planeso-backup <output-file>');
    process.exit(1);
  }

  const config = getConfig();

  const api = new PlaneSoClient({
    baseUrl: 'https://api.plane.so/api',
    accessToken: config.PLANE_API_TOKEN,
  });

  const backup = new Backup();

  const projectsResponse = await api.workspace.getV1Projects(config.PLANE_WORKSPACE);
  backup.add('projects.json', JSON.stringify(projectsResponse.results, null, 2));
  logger.info(projectsResponse);

  const statesResponse = await api.projects.getV1States(config.PLANE_WORKSPACE, '5801e923-7dd6-45b2-adc6-f79d8531c208');
  backup.add('states.json', JSON.stringify(statesResponse.results, null, 2));
  logger.info(statesResponse);

  const labelsResponse = await api.projects.getV1Labels(config.PLANE_WORKSPACE, '5801e923-7dd6-45b2-adc6-f79d8531c208');
  backup.add('labels.json', JSON.stringify(labelsResponse.results, null, 2));
  logger.info(labelsResponse);

  await backup.finalize(outputFile);
}

try {
  await main();
}
catch (error) {
  logger.error(error);
  process.exit(1);
}
