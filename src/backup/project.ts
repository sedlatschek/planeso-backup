import type { PlaneSoClient } from '../plane-so/index.js';
import type { V1Entity } from '../plane-so/models/V1Entity.js';
import type { V1Project } from '../plane-so/models/V1Project.js';
import type { PlaneSoProjectClient } from '../plane-so/namespaces/project.js';
import type { PlaneSoWorkItemTypeClient } from '../plane-so/namespaces/work-item-type.js';
import type { PlaneSoWorkItemClient } from '../plane-so/namespaces/work-item.js';

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
  const workItemTypes = await gatherWorkItemTypes(client);
  const workItems = await gatherWorkItems(client);

  return {
    ...project,
    states,
    labels,
    cycles,
    modules,
    epics,
    workItemTypes,
    workItems,
  };
}

async function gatherWorkItemTypes(client: PlaneSoProjectClient): Promise<V1Entity[]> {
  const workItemTypes = await client.getV1WorkItemTypes();
  return await Promise.all(workItemTypes.map(workItemType => enrichWorkItemType(client.workItemType(workItemType.id), workItemType)));
}

async function enrichWorkItemType(client: PlaneSoWorkItemTypeClient, workItemType: V1Entity): Promise<V1Entity> {
  const properties = await client.getV1Properties();

  return {
    ...workItemType,
    properties,
  };
}

async function gatherWorkItems(client: PlaneSoProjectClient): Promise<V1Entity[]> {
  const workItems = (await client.getV1WorkItems()).results.slice(0, 2); // TODO: remove limit and parallize
  return await Promise.all(workItems.map(workItem => enrichWorkItem(client.workItem(workItem.id), workItem)));
}

async function enrichWorkItem(client: PlaneSoWorkItemClient, workItem: V1Entity): Promise<V1Entity> {
  const { results: links } = await client.getV1Links();
  const { results: activities } = await client.getV1Activities();
  const { results: comments } = await client.getV1Comments();
  const attachments = await client.getV1Attachments();

  return {
    ...workItem,
    links,
    activities,
    comments,
    attachments,
  };
}
