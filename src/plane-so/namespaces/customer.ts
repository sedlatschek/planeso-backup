import type { PlaneSoClient } from '../index.js';
import {
  V1EntitySchema,
  type V1Entity,
} from '../models/V1Entity.js';
import { type ResponseArray } from '../response.js';

export class PlaneSoCustomerClient {
  public constructor(private readonly client: PlaneSoClient) {}

  public async getV1CustomerRequests(workspaceId: string, customerId: string): Promise<ResponseArray<V1Entity>> {
    return this.client.get(`v1/workspaces/${workspaceId}/customers/${customerId}/requests/`, V1EntitySchema);
  }
}
