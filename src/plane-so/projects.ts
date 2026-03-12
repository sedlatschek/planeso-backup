import type { PlaneSoClient } from "./index.js";
import { V1LabelSchema, type V1Label } from "./models/V1Label.js";
import { V1StateSchema, type V1State } from "./models/V1State.js";
import { type ResponseArray } from "./response.js";

export class PlaneSoProjectsClient {
  public constructor(private readonly client: PlaneSoClient) {}

  public async getV1States(workspaceId: string, projectId: string): Promise<ResponseArray<V1State>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/states/`, V1StateSchema);
  }

  public async getV1Labels(workspaceId: string, projectId: string): Promise<ResponseArray<V1Label>> {
    return this.client.get(`v1/workspaces/${workspaceId}/projects/${projectId}/labels/`, V1LabelSchema);
  }
}
