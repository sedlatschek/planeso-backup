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

export class PlaneSoTeamspaceClient {
  public constructor(private readonly client: PlaneSoClient, private readonly teamspaceId: string) {}

  public async getV1TeamspaceMembers(): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${this.client.workspace.id}/teamspaces/${this.teamspaceId}/members/`, V1EntitySchema);
  }

  public async getV1TeamspaceProjects(): Promise<ResponseArray<V1Project>> {
    return this.client.get(`v1/workspaces/${this.client.workspace.id}/teamspaces/${this.teamspaceId}/projects/`, V1ProjectSchema);
  }
}
