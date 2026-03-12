import { z } from 'zod';
import { PlaneSoWorkspaceClient } from './namespaces/workspace.js';
import {
  responseArraySchema,
  type ResponseArray,
} from './response.js';
import { PlaneSoProjectClient } from './namespaces/project.js';
import { logger } from '../logger.js';
import { stringify } from '../utility.js';
import { PlaneSoTeamspaceClient } from './namespaces/teamspace.js';
import { PlaneSoInitiativeClient } from './namespaces/initiative.js';
import { PlaneSoCustomerClient } from './namespaces/customer.js';

export type PlaneSoClientOptions = {
  baseUrl?: string
  accessToken: string
};

export type PlaneSoClientConfig = {
  baseUrl: string
  accessToken: string
};

export class PlaneSoClient {
  private readonly config: PlaneSoClientConfig;

  private readonly workspaceClient: PlaneSoWorkspaceClient;
  private readonly projectsClient: PlaneSoProjectClient;
  private readonly teamspaceClient: PlaneSoTeamspaceClient;
  private readonly initiativeClient: PlaneSoInitiativeClient;
  private readonly customerClient: PlaneSoCustomerClient;

  private lastRequestAt = 0;
  private queue: Promise<void> = Promise.resolve();

  public constructor(options: PlaneSoClientOptions) {
    this.config = {
      baseUrl: 'https://api.plane.so/api',
      ...options,
    };

    this.workspaceClient = new PlaneSoWorkspaceClient(this);
    this.projectsClient = new PlaneSoProjectClient(this);
    this.teamspaceClient = new PlaneSoTeamspaceClient(this);
    this.initiativeClient = new PlaneSoInitiativeClient(this);
    this.customerClient = new PlaneSoCustomerClient(this);
  }

  public get workspace(): PlaneSoWorkspaceClient {
    return this.workspaceClient;
  }

  public get project(): PlaneSoProjectClient {
    return this.projectsClient;
  }

  public get teamspace(): PlaneSoTeamspaceClient {
    return this.teamspaceClient;
  }

  public get initiative(): PlaneSoInitiativeClient {
    return this.initiativeClient;
  }

  public get customer(): PlaneSoCustomerClient {
    return this.customerClient;
  }

  private waitRateLimit(): Promise<void> {
    // Plane.so is rate limited to 60 requests per minute, so we wait at least 1100ms between requests to be safe.
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

  public async get<T>(endpoint: string, schema: z.ZodType<T>): Promise<ResponseArray<T>> {
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
      throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    const result = await responseArraySchema.extend({ results: schema.array() }).safeParseAsync(json);

    if (!result.success) {
      logger.error(`Failed to parse response from ${endpoint}: ${result.error}`);
      throw new Error(`Failed to parse response from ${endpoint}:\nPayload:\n${stringify(json)}\nValidation errors:\n${result.error}`, { cause: result.error });
    }

    if (result.data.total_pages > 1) {
      throw new Error('Pagination is not supported yet. Please implement pagination handling to retrieve all results.');
    }

    return result.data;
  }
}
