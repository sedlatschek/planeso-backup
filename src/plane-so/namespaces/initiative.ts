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

export class PlaneSoInitiativeClient {
  public constructor(private readonly client: PlaneSoClient) {}

  public async getV1InitiativeLabels(workspaceId: string, initiativeId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/initiatives/${initiativeId}/labels/`, V1EntitySchema);
  }

  public async getV1InitiativeProjects(workspaceId: string, initiativeId: string): Promise<ResponseArray<V1Project>> {
    return this.client.get(`v1/workspaces/${workspaceId}/initiatives/${initiativeId}/projects/`, V1ProjectSchema);
  }

  public async getV1InitiativeEpics(workspaceId: string, initiativeId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/initiatives/${initiativeId}/epics/`, V1EntitySchema);
  }
}
