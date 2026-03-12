import pino from 'pino';

export const logger = pino({
  name: 'plane.so-backup',
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: { target: 'pino-pretty' },
});
