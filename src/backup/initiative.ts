import type { PlaneSoClient } from '../plane-so/index.js';
import type { V1Entity } from '../plane-so/models/V1Entity.js';
import type { PlaneSoInitiativeClient } from '../plane-so/namespaces/initiative.js';

export async function gatherInitiatives(client: PlaneSoClient): Promise<V1Entity[]> {
  const { results: initiatives } = await client.workspace.getV1Initiatives();
  return await Promise.all(initiatives.map(initiative => enrichInitiative(client.initiative(initiative.id), initiative)));
}

async function enrichInitiative(client: PlaneSoInitiativeClient, initiative: V1Entity): Promise<V1Entity> {
  const { results: labels } = await client.getV1InitiativeLabels();
  const { results: projects } = await client.getV1InitiativeProjects();
  const { results: epics } = await client.getV1InitiativeEpics();

  return {
    ...initiative,
    labels,
    projects,
    epics,
  };
}
