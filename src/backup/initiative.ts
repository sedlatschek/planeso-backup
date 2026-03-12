import type { PlaneSoClient } from '../plane-so/index.js';
import type { V1Entity } from '../plane-so/models/V1Entity.js';
import type { PlaneSoInitiativeClient } from '../plane-so/namespaces/initiative.js';

export async function gatherInitiatives(client: PlaneSoClient, workspaceId: string): Promise<V1Entity[]> {
  const { results: initiatives } = await client.workspace.getV1Initiatives(workspaceId);
  return await Promise.all(initiatives.map(initiative => enrichInitiative(client.initiative, workspaceId, initiative)));
}

async function enrichInitiative(client: PlaneSoInitiativeClient, workspaceId: string, initiative: V1Entity): Promise<V1Entity> {
  const { results: labels } = await client.getV1InitiativeLabels(workspaceId, initiative.id);
  const { results: projects } = await client.getV1InitiativeProjects(workspaceId, initiative.id);
  const { results: epics } = await client.getV1InitiativeEpics(workspaceId, initiative.id);

  return {
    ...initiative,
    labels,
    projects,
    epics,
  };
}
