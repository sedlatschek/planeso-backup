import type { PlaneSoClient } from '../index.js';
import {
  V1EntitySchema,
  type V1Entity,
} from '../models/V1Entity.js';
import { type ResponseArray } from '../response.js';

export class PlaneSoProjectClient {
  public constructor(private readonly client: PlaneSoClient) {}

  public async getV1States(workspaceId: string, projectId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/states/`, V1EntitySchema);
  }

  public async getV1Labels(workspaceId: string, projectId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/labels/`, V1EntitySchema);
  }

  // TODO: this is an unpaginated endpoint and does not return a ResponseArray schema
  public async getV1WorkItemTypes(workspaceId: string, projectId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/work-item-types/`, V1EntitySchema);
  }

  public async getV1WorkItemTypeProperties(workspaceId: string, projectId: string, workItemTypeId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/work-item-types/${workItemTypeId}/work-item-properties/`, V1EntitySchema);
  }

  public async getV1WorkItems(workspaceId: string, projectId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/work-items/`, V1EntitySchema);
  }

  public async getV1WorkItemLinks(workspaceId: string, projectId: string, workItemId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/work-items/${workItemId}/links/`, V1EntitySchema);
  }

  public async getV1WorkItemActivities(workspaceId: string, projectId: string, workItemId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/work-items/${workItemId}/activities/`, V1EntitySchema);
  }

  public async getV1WorkItemComments(workspaceId: string, projectId: string, workItemId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/work-items/${workItemId}/comments/`, V1EntitySchema);
  }

  public async getV1WorkItemAttachments(workspaceId: string, projectId: string, workItemId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/work-items/${workItemId}/attachments/`, V1EntitySchema);
  }

  public async getV1Cycles(workspaceId: string, projectId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/cycles/`, V1EntitySchema);
  }

  public async getV1Modules(workspaceId: string, projectId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/modules/`, V1EntitySchema);
  }

  public async getV1Epics(workspaceId: string, projectId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/epics/`, V1EntitySchema);
  }
}
