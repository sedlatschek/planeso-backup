import type { PlaneSoClient } from '../plane-so/index.js';
import { stringify } from '../utility.js';
import type { Backup } from './Backup.js';
import { gatherCustomerProperties } from './customer-property.js';
import { gatherCustomers } from './customer.js';
import { gatherInitiatives } from './initiative.js';
import { gatherProjects } from './project.js';
import { gatherStickies } from './sticky.js';
import { gatherTeamspaces } from './teamspace.js';

export async function backupWorkspace(client: PlaneSoClient, backup: Backup): Promise<void> {
  const [
    projects,
    teamspaces,
    customers,
    customerProperties,
    initiatives,
    stickies,
    members,
  ] = await Promise.all([
    gatherProjects(client),
    gatherTeamspaces(client),
    gatherCustomers(client),
    gatherCustomerProperties(client),
    gatherInitiatives(client),
    gatherStickies(client),
    client.workspace.getV1Members(),
  ]);

  backup.add(`${client.workspace.id}.json`, stringify({
    id: client.workspace.id,
    projects,
    teamspaces,
    customers,
    customerProperties,
    initiatives,
    stickies,
    members,
  }));
}
