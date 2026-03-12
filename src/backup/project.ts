import type { PlaneSoClient } from '../plane-so/index.js';
import type { V1Project } from '../plane-so/models/V1Project.js';
import type { PlaneSoProjectClient } from '../plane-so/namespaces/project.js';

export async function gatherProjects(client: PlaneSoClient): Promise<V1Project[]> {
  const { results: projects } = await client.workspace.getV1Projects();
  return await Promise.all(projects.map(project => enrichProject(client.project(project.id), project)));
}

async function enrichProject(client: PlaneSoProjectClient, project: V1Project): Promise<V1Project> {
  // TODO: parallize
  const { results: states } = await client.getV1States();
  const { results: labels } = await client.getV1Labels();
  const { results: cycles } = await client.getV1Cycles();
  const { results: modules } = await client.getV1Modules();
  const { results: epics } = await client.getV1Epics();

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
