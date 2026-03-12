import type { PlaneSoClient } from '../plane-so/index.js';
import type { V1Entity } from '../plane-so/models/V1Entity.js';

export async function gatherStickies(client: PlaneSoClient): Promise<V1Entity[]> {
  const { results: stickies } = await client.workspace.getV1Stickies();
  return stickies;
}
