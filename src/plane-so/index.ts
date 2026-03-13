import { z } from 'zod';
import { PlaneSoWorkspaceClient } from './namespaces/workspace.js';
import {
  responseArraySchema,
  type ResponseArray,
} from './response.js';
import { PlaneSoProjectClient } from './namespaces/project.js';
import { logger } from '../logger.js';
import { PlaneSoTeamspaceClient } from './namespaces/teamspace.js';
import { PlaneSoInitiativeClient } from './namespaces/initiative.js';
import { PlaneSoCustomerClient } from './namespaces/customer.js';
import { PlaneSoBackupResponseValidationError } from './errors/PlaneSoBackupResponseValidationError.js';
import { PlaneSoBackupError } from './errors/PlaneSoBackupError.js';
import PQueue from 'p-queue';

export type PlaneSoClientOptions = {
  baseUrl?: string
  accessToken: string
  workspaceId: string
};

export type PlaneSoClientConfig = {
  baseUrl: string
  accessToken: string
  workspaceId: string
};

type RateLimit = {
  remaining: number
  reset: Date
};

export class PlaneSoClient {
  private readonly config: PlaneSoClientConfig;

  private readonly workspaceClient: PlaneSoWorkspaceClient;

  private readonly rateLimit: RateLimit = {
    remaining: 60,
    reset: new Date(),
  };

  private readonly queue = new PQueue({
    concurrency: 1,
    interval: 60000,
    intervalCap: 60,
  });

  public constructor(options: PlaneSoClientOptions) {
    this.config = {
      baseUrl: 'https://api.plane.so/api',
      ...options,
    };

    this.workspaceClient = new PlaneSoWorkspaceClient(this, this.config.workspaceId);
  }

  public get workspace(): PlaneSoWorkspaceClient {
    return this.workspaceClient;
  }

  public project(projectId: string): PlaneSoProjectClient {
    return new PlaneSoProjectClient(this, projectId);
  }

  public teamspace(teamspaceId: string): PlaneSoTeamspaceClient {
    return new PlaneSoTeamspaceClient(this, teamspaceId);
  }

  public initiative(initiativeId: string): PlaneSoInitiativeClient {
    return new PlaneSoInitiativeClient(this, initiativeId);
  }

  public customer(customerId: string): PlaneSoCustomerClient {
    return new PlaneSoCustomerClient(this, customerId);
  }

  private async waitForRateLimitReset(): Promise<void> {
    const now = new Date();
    if (this.rateLimit.remaining > 1 || this.rateLimit.reset <= now) {
      return;
    }

    const waitTime = this.rateLimit.reset.getTime() - now.getTime();
    logger.warn(`Waiting for rate limit reset in ${waitTime / 1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  private async fetchJson(endpoint: string): Promise<unknown> {
    return this.queue.add(async () => {
      await this.waitForRateLimitReset();

      logger.info(`GET ${endpoint} (${this.rateLimit.remaining}/60, resets at ${this.rateLimit.reset.toISOString()})`);

      const {
        baseUrl, accessToken,
      } = this.config;
      const url = `${baseUrl}/${endpoint}`;

      const response = await fetch(url, { headers: {
        'X-API-Key': accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      } });

      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      if (rateLimitRemaining !== null) {
        this.rateLimit.remaining = Number(rateLimitRemaining) || this.rateLimit.remaining;
      }
      const rateLimitReset = response.headers.get('X-RateLimit-Reset');
      if (rateLimitReset !== null) {
        this.rateLimit.reset = new Date(Number(rateLimitReset) * 1000);
      }

      if (!response.ok) {
        throw new PlaneSoBackupError(`Request failed with status ${response.status}: ${response.statusText}`);
      }

      return response.json();
    });
  }

  public async getOne<T>(endpoint: string, schema: z.ZodType<T>): Promise<T> {
    const payload = await this.fetchJson(endpoint);
    const result = await schema.safeParseAsync(payload);

    if (!result.success) {
      throw new PlaneSoBackupResponseValidationError({
        endpoint,
        payload,
        cause: result.error,
      });
    }

    return result.data;
  }

  public async getList<T>(endpoint: string, schema: z.ZodType<T>): Promise<T[]> {
    const payload = await this.fetchJson(endpoint);
    const result = await schema.array().safeParseAsync(payload);

    if (!result.success) {
      throw new PlaneSoBackupResponseValidationError({
        endpoint,
        payload,
        cause: result.error,
      });
    }

    return result.data;
  }

  public async getPaginatedList<T>(endpoint: string, schema: z.ZodType<T>): Promise<ResponseArray<T>> {
    const payload = await this.fetchJson(endpoint);
    const result = await responseArraySchema.extend({ results: schema.array() }).safeParseAsync(payload);

    if (!result.success) {
      throw new PlaneSoBackupResponseValidationError({
        endpoint,
        payload,
        cause: result.error,
      });
    }

    if (result.data.total_pages > 1) {
      throw new PlaneSoBackupError('Pagination is not supported yet. Please implement pagination handling to retrieve all results.');
    }

    return result.data;
  }
}
