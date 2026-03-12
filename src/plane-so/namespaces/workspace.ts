import type { PlaneSoClient } from '../index.js';
import {
  V1EntitySchema,
  type V1Entity,
} from '../models/V1Entity.js';
import {
  V1ProjectSchema,
  type V1Project,
} from '../models/V1Project.js';
import { type ResponseArray } from '../response.js';

export class PlaneSoWorkspaceClient {
  public constructor(private readonly client: PlaneSoClient) {}

  public async getV1Projects(workspaceId: string): Promise<ResponseArray<V1Project>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/`, V1ProjectSchema);
  }

  public async getV1Initiatives(workspaceId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/initiatives/`, V1EntitySchema);
  }

  public async getV1Customers(workspaceId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/customers/`, V1EntitySchema);
  }

  public async getV1CustomerProperties(workspaceId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/customers-properties/`, V1EntitySchema);
  }

  public async getV1Teamspaces(workspaceId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/teamspaces/`, V1EntitySchema);
  }

  public async getV1Stickes(workspaceId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/stickies/`, V1EntitySchema);
  }
}
