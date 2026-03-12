import {
  V1EntitySchema,
  type V1Entity,
} from '../models/V1Entity.js';
import type { PlaneSoProjectClient } from './project.js';

export class PlaneSoWorkItemTypeClient {
  public constructor(private readonly client: PlaneSoProjectClient, private readonly workItemTypeId: string) {}

  public get parent(): PlaneSoProjectClient {
    return this.client;
  }

  public get id(): string {
    return this.workItemTypeId;
  }

  public async getV1Properties(): Promise<V1Entity[]> {
    return this.client.parent.getList(`v1/workspaces/${this.client.parent.workspace.id}/projects/${this.client.id}/work-item-types/${this.workItemTypeId}/work-item-properties/`, V1EntitySchema);
  }
}
