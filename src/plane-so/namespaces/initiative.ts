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
  public constructor(private readonly client: PlaneSoClient, private readonly initiativeId: string) {}

  public async getV1InitiativeLabels(): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${this.client.workspace.id}/initiatives/${this.initiativeId}/labels/`, V1EntitySchema);
  }

  public async getV1InitiativeProjects(): Promise<ResponseArray<V1Project>> {
    return this.client.get(`v1/workspaces/${this.client.workspace.id}/initiatives/${this.initiativeId}/projects/`, V1ProjectSchema);
  }

  public async getV1InitiativeEpics(): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${this.client.workspace.id}/initiatives/${this.initiativeId}/epics/`, V1EntitySchema);
  }
}
