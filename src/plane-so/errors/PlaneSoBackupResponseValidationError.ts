import { z } from 'zod';
import { PlaneSoBackupError } from './PlaneSoBackupError.js';
import { stringify } from '../../utility.js';

export type PlaneSoBackupResponseValidationErrorOptions = {
  endpoint: string
  payload: unknown
  cause: z.ZodError
};

export class PlaneSoBackupResponseValidationError extends PlaneSoBackupError {
  public constructor({
    endpoint,
    payload,
    cause,
  }: PlaneSoBackupResponseValidationErrorOptions) {
    super(`Invalid response for GET ${endpoint}:\nPayload:\n${stringify(payload)}\nValidation errors:\n${cause}`, { cause });
    this.name = 'PlaneSoBackupResponseValidationError';
  }
}
