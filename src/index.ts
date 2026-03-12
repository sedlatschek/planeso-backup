#!/usr/bin/env node

import { getConfig } from './config.js';
import { logger } from './logger.js';
import { PlaneSoClient } from './plane-so/index.js';
import { backupWorkspace } from './backup/workspace.js';
import { Backup } from './backup/Backup.js';
import { join } from 'path';
import { isoTimestamp } from './utility.js';
import { getCommandLineArguments } from './arguments.js';

async function main(): Promise<void> {
  const {
    configPath,
    debugMode,
  } = getCommandLineArguments();
  if (debugMode) {
    logger.level = 'debug';
  }

  const {
    api: {
      baseUrl, accessToken,
    }, backup: {
      workspaces, outputDir,
    },
  } = await getConfig(configPath);

  const backup = new Backup();

  for (const workspaceId of workspaces) {
    logger.info(`Backing up workspace: ${workspaceId}`);

    const client = new PlaneSoClient({
      workspaceId,
      baseUrl,
      accessToken,
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
