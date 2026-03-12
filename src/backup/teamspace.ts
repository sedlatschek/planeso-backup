import type { PlaneSoClient } from '../plane-so/index.js';
import type { V1Entity } from '../plane-so/models/V1Entity.js';
import type { PlaneSoTeamspaceClient } from '../plane-so/namespaces/teamspace.js';

export async function gatherTeamspaces(client: PlaneSoClient): Promise<V1Entity[]> {
  const { results: teamspaces } = await client.workspace.getV1Teamspaces();
  return await Promise.all(teamspaces.map(teamspace => enrichTeamspace(client.teamspace(teamspace.id), teamspace)));
}

async function enrichTeamspace(client: PlaneSoTeamspaceClient, teamspace: V1Entity): Promise<V1Entity> {
  const { results: members } = await client.getV1TeamspaceMembers();
  const { results: projects } = await client.getV1TeamspaceProjects();

  return {
    ...teamspace,
    members,
    projects,
  };
}
