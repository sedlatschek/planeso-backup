import type { PlaneSoClient } from './index.js';
import {
  V1ProjectSchema, type V1Project,
} from './models/V1Project.js';
import { type ResponseArray } from './response.js';

export class PlaneSoWorkspacesClient {
  public constructor(private readonly client: PlaneSoClient) {}

  public async getV1Projects(workspaceId: string): Promise<ResponseArray<V1Project>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/`, V1ProjectSchema);
  }
}
