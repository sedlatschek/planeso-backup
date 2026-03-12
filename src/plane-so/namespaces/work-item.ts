import {
  V1EntitySchema,
  type V1Entity,
} from '../models/V1Entity.js';
import { type ResponseArray } from '../response.js';
import type { PlaneSoProjectClient } from './project.js';

export class PlaneSoWorkItemClient {
  public constructor(private readonly client: PlaneSoProjectClient, private readonly workItemId: string) {}

  public async getV1Links(): Promise<ResponseArray<V1Entity>> {
    return this.client.parent.getPaginatedList(`v1/workspaces/${this.client.parent.workspace.id}/projects/${this.client.id}/work-items/${this.workItemId}/links/`, V1EntitySchema);
  }

  public async getV1Activities(): Promise<ResponseArray<V1Entity>> {
    return this.client.parent.getPaginatedList(`v1/workspaces/${this.client.parent.workspace.id}/projects/${this.client.id}/work-items/${this.workItemId}/activities/`, V1EntitySchema);
  }

  public async getV1Comments(): Promise<ResponseArray<V1Entity>> {
    return this.client.parent.getPaginatedList(`v1/workspaces/${this.client.parent.workspace.id}/projects/${this.client.id}/work-items/${this.workItemId}/comments/`, V1EntitySchema);
  }

  public async getV1Attachments(): Promise<V1Entity[]> {
    return this.client.parent.getList(`v1/workspaces/${this.client.parent.workspace.id}/projects/${this.client.id}/work-items/${this.workItemId}/attachments/`, V1EntitySchema);
  }
}
