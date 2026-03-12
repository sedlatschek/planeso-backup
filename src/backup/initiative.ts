import { ADDED_PROPERTIES_KEY } from '../constants.js';
import type { PlaneSoClient } from '../plane-so/index.js';
import type { V1Entity } from '../plane-so/models/V1Entity.js';
import type { PlaneSoInitiativeClient } from '../plane-so/namespaces/initiative.js';

export async function gatherInitiatives(client: PlaneSoClient): Promise<V1Entity[]> {
  const { results: initiatives } = await client.workspace.getV1Initiatives();
  return await Promise.all(initiatives.map(initiative => enrichInitiative(client.initiative(initiative.id), initiative)));
}

async function enrichInitiative(client: PlaneSoInitiativeClient, initiative: V1Entity): Promise<V1Entity> {
  const [
    { results: labels },
    { results: projects },
    { results: epics },
  ] = await Promise.all([
    client.getV1Labels(),
    client.getV1Projects(),
    client.getV1Epics(),
  ]);

  return {
    ...initiative,
    [ADDED_PROPERTIES_KEY]: {
      labels,
      projects,
      epics,
    },
  };
}
