import { logger } from './logger.js';

export type CommandLineArguments = {
  outputDir: string
  debugMode: boolean
};

let cachedArgs: CommandLineArguments | undefined = undefined;

function parseCommandLineArguments(): CommandLineArguments {
  const args = process.argv.slice(2);

  const outputDir = args[0];
  if (!outputDir) {
    logger.error('Usage: planeso-backup <output-directory>');
    process.exit(1);
  }

  const debugMode = args.includes('--debug');

  return {
    outputDir,
    debugMode,
  };
}

export function getCommandLineArguments(): CommandLineArguments {
  if (!cachedArgs) {
    cachedArgs = parseCommandLineArguments();
  }

  return cachedArgs;
}
