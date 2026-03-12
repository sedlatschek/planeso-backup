import type { PlaneSoClient } from '../plane-so/index.js';
import type { V1Project } from '../plane-so/models/V1Project.js';
import type { PlaneSoProjectClient } from '../plane-so/namespaces/project.js';

export async function gatherProjects(client: PlaneSoClient, workspaceId: string): Promise<V1Project[]> {
  const { results: projects } = await client.workspace.getV1Projects(workspaceId);
  return await Promise.all(projects.map(project => enrichProject(client.project, workspaceId, project)));
}

async function enrichProject(client: PlaneSoProjectClient, workspaceId: string, project: V1Project): Promise<V1Project> {
  // TODO: parallize
  const { results: states } = await client.getV1States(workspaceId, project.id);
  const { results: labels } = await client.getV1Labels(workspaceId, project.id);
  const { results: cycles } = await client.getV1Cycles(workspaceId, project.id);
  const { results: modules } = await client.getV1Modules(workspaceId, project.id);
  const { results: epics } = await client.getV1Epics(workspaceId, project.id);

  // TODO: workItems
  // TODO: workItemTypes

  return {
    ...project,
    states,
    labels,
    cycles,
    modules,
    epics,
  };
}
