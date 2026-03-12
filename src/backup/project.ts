import { getCommandLineArguments } from '../arguments.js';
import { ADDED_PROPERTIES_KEY } from '../constants.js';
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
  const [
    { results: states },
    { results: labels },
    { results: cycles },
    { results: modules },
    { results: epics },
    workItemTypes,
    workItems,
  ] = await Promise.all([
    client.getV1States(),
    client.getV1Labels(),
    client.getV1Cycles(),
    client.getV1Modules(),
    client.getV1Epics(),
    gatherWorkItemTypes(client),
    gatherWorkItems(client),
  ]);

  return {
    ...project,
    [ADDED_PROPERTIES_KEY]: {
      states,
      labels,
      cycles,
      modules,
      epics,
      workItemTypes,
      workItems,
    },
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
  const { results } = await client.getV1WorkItems();
  const workItems = getCommandLineArguments().debugMode ? results.slice(0, 5) : results;
  return await Promise.all(workItems.map(workItem => enrichWorkItem(client.workItem(workItem.id), workItem)));
}

async function enrichWorkItem(client: PlaneSoWorkItemClient, workItem: V1Entity): Promise<V1Entity> {
  const [
    { results: links },
    { results: activities },
    { results: comments },
    attachments,
  ] = await Promise.all([
    client.getV1Links(),
    client.getV1Activities(),
    client.getV1Comments(),
    client.getV1Attachments(),
  ]);

  return {
    ...workItem,
    links,
    activities,
    comments,
    attachments,
  };
}
