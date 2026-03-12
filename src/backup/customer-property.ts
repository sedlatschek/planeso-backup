import type { PlaneSoClient } from '../plane-so/index.js';
import type { V1Entity } from '../plane-so/models/V1Entity.js';

export async function gatherCustomerProperties(client: PlaneSoClient): Promise<V1Entity[]> {
  const { results: customerProperties } = await client.workspace.getV1CustomerProperties();
  return customerProperties;
}
