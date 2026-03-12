import { logger } from './logger.js';

export type CommandLineArguments = {
  configPath: string
  debugMode: boolean
};

let cachedArgs: CommandLineArguments | undefined = undefined;

function parseCommandLineArguments(): CommandLineArguments {
  const args = process.argv.slice(2);

  const configPath = args[0];
  if (!configPath) {
    logger.error('Usage: planeso-backup <config-file-path>');
    process.exit(1);
  }

  const debugMode = args.includes('--debug');

  return {
    configPath,
    debugMode,
  };
}

export function getCommandLineArguments(): CommandLineArguments {
  if (!cachedArgs) {
    cachedArgs = parseCommandLineArguments();
  }

  return cachedArgs;
}
