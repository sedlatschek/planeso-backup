#!/usr/bin/env node

import { getConfig } from './config.js';
import { logger } from './logger.js';
import { PlaneSoClient } from './plane-so/index.js';
import { backupWorkspace } from './backup/workspace.js';
import { Backup } from './backup/Backup.js';
import { join } from 'path';
import { isoTimestamp } from './utility.js';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const outputDir = args[0];
  if (!outputDir) {
    logger.error('Usage: planeso-backup <output-directory>');
    process.exit(1);
  }

  const config = getConfig();

  const backup = new Backup();

  const workspaceIds = config.PLANE_WORKSPACES.split(',').map(s => s.trim());
  for (const workspaceId of workspaceIds) {
    logger.info(`Backing up workspace: ${workspaceId}`);

    const client = new PlaneSoClient({
      workspaceId,
      baseUrl: config.PLANE_API_BASE_URL,
      accessToken: config.PLANE_API_TOKEN,
    });
    await backupWorkspace(client, backup);
  }

  await backup.finalize(join(outputDir, `planeso_backup_${isoTimestamp()}.zip`));
}

try {
  await main();
}
catch (error) {
  logger.error(error);
  process.exit(1);
}
