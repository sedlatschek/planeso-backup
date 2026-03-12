import { z } from 'zod';
import { PlaneSoWorkspacesClient } from './workspaces.js';
import {
  responseArraySchema, type ResponseArray,
} from './response.js';
import { PlaneSoProjectsClient } from './projects.js';

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

  private readonly workspaceClient: PlaneSoWorkspacesClient;
  private readonly projectsClient: PlaneSoProjectsClient;

  public constructor(options: PlaneSoClientOptions) {
    this.config = {
      baseUrl: 'https://api.plane.so/api',
      ...options,
    };

    this.workspaceClient = new PlaneSoWorkspacesClient(this);
    this.projectsClient = new PlaneSoProjectsClient(this);
  }

  public get workspace(): PlaneSoWorkspacesClient {
    return this.workspaceClient;
  }

  public get projects(): PlaneSoProjectsClient {
    return this.projectsClient;
  }

  public async get<T>(endpoint: string, schema: z.ZodType<T>): Promise<ResponseArray<T>> {
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

    return responseArraySchema.extend({ results: schema.array() }).parseAsync(json);
  }
}
