import type { PlaneSoClient } from '../plane-so/index.js';
import type { V1Entity } from '../plane-so/models/V1Entity.js';
import type { PlaneSoTeamspaceClient } from '../plane-so/namespaces/teamspace.js';

export async function gatherTeamspaces(client: PlaneSoClient, workspaceId: string): Promise<V1Entity[]> {
  const { results: teamspaces } = await client.workspace.getV1Teamspaces(workspaceId);
  return await Promise.all(teamspaces.map(teamspace => enrichTeamspace(client.teamspace, workspaceId, teamspace)));
}

async function enrichTeamspace(client: PlaneSoTeamspaceClient, workspaceId: string, teamspace: V1Entity): Promise<V1Entity> {
  const { results: members } = await client.getV1TeamspaceMembers(workspaceId, teamspace.id);
  const { results: projects } = await client.getV1TeamspaceProjects(workspaceId, teamspace.id);

  return {
    ...teamspace,
    members,
    projects,
  };
}
