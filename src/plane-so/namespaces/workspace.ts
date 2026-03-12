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
  public constructor(private readonly client: PlaneSoClient, private readonly workspaceId: string) {}

  public get id(): string {
    return this.workspaceId;
  }

  public async getV1Projects(): Promise<ResponseArray<V1Project>> {
    return this.client.getPaginatedList(`v1/workspaces/${this.workspaceId}/projects/`, V1ProjectSchema);
  }

  public async getV1Initiatives(): Promise<ResponseArray<V1Entity>> {
    return this.client.getPaginatedList(`v1/workspaces/${this.workspaceId}/initiatives/`, V1EntitySchema);
  }

  public async getV1Customers(): Promise<ResponseArray<V1Entity>> {
    return this.client.getPaginatedList(`v1/workspaces/${this.workspaceId}/customers/`, V1EntitySchema);
  }

  public async getV1CustomerProperties(): Promise<ResponseArray<V1Entity>> {
    return this.client.getPaginatedList(`v1/workspaces/${this.workspaceId}/customers-properties/`, V1EntitySchema);
  }

  public async getV1Teamspaces(): Promise<ResponseArray<V1Entity>> {
    return this.client.getPaginatedList(`v1/workspaces/${this.workspaceId}/teamspaces/`, V1EntitySchema);
  }

  public async getV1Stickes(): Promise<ResponseArray<V1Entity>> {
    return this.client.getPaginatedList(`v1/workspaces/${this.workspaceId}/stickies/`, V1EntitySchema);
  }
}
