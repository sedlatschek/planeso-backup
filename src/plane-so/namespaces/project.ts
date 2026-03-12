import type { PlaneSoClient } from '../index.js';
import {
  V1EntitySchema,
  type V1Entity,
} from '../models/V1Entity.js';
import { type ResponseArray } from '../response.js';
import { PlaneSoWorkItemClient } from './work-item.js';

export class PlaneSoProjectClient {
  public constructor(private readonly client: PlaneSoClient, private readonly projectId: string) {}

  public get parent(): PlaneSoClient {
    return this.client;
  }

  public get id(): string {
    return this.projectId;
  }

  public workItem(workItemId: string): PlaneSoWorkItemClient {
    return new PlaneSoWorkItemClient(this, workItemId);
  }

  public async getV1States(): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${this.client.workspace.id}/projects/${this.projectId}/states/`, V1EntitySchema);
  }

  public async getV1Labels(): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${this.client.workspace.id}/projects/${this.projectId}/labels/`, V1EntitySchema);
  }

  // TODO: this is an unpaginated endpoint and does not return a ResponseArray schema
  public async getV1WorkItemTypes(): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${this.client.workspace.id}/projects/${this.projectId}/work-item-types/`, V1EntitySchema);
  }

  public async getV1WorkItemTypeProperties(workItemTypeId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${this.client.workspace.id}/projects/${this.projectId}/work-item-types/${workItemTypeId}/work-item-properties/`, V1EntitySchema);
  }

  public async getV1WorkItems(): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${this.client.workspace.id}/projects/${this.projectId}/work-items/`, V1EntitySchema);
  }

  public async getV1Cycles(): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${this.client.workspace.id}/projects/${this.projectId}/cycles/`, V1EntitySchema);
  }

  public async getV1Modules(): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${this.client.workspace.id}/projects/${this.projectId}/modules/`, V1EntitySchema);
  }

  public async getV1Epics(): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${this.client.workspace.id}/projects/${this.projectId}/epics/`, V1EntitySchema);
  }
}
