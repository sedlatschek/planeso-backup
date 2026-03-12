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

export class PlaneSoClient {
  private readonly config: PlaneSoClientConfig;

  private readonly workspaceClient: PlaneSoWorkspaceClient;

  private lastRequestAt = 0;
  private queue: Promise<void> = Promise.resolve();

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

  private waitRateLimit(): Promise<void> {
    // Plane.so is rate limited to 60 requests per minute, so we wait at least 1001ms between requests to be safe.
    // Uses a promise queue to prevent race conditions when multiple requests are made concurrently.
    const next = this.queue.then(async () => {
      const wait = 1001 - (Date.now() - this.lastRequestAt);
      if (wait > 0) {
        await new Promise<void>(resolve => setTimeout(resolve, wait));
      }
      this.lastRequestAt = Date.now();
    });
    this.queue = next.catch(() => {});
    return next;
  }

  private async fetchJson(endpoint: string): Promise<unknown> {
    await this.waitRateLimit();
    logger.info(`GET ${endpoint}`);

    const {
      baseUrl, accessToken,
    } = this.config;
    const url = `${baseUrl}/${endpoint}`;

    const response = await fetch(url, { headers: {
      'X-API-Key': accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    } });

    if (!response.ok) {
      throw new PlaneSoBackupError(`Request failed with status ${response.status}: ${response.statusText}`);
    }

    return response.json();
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
