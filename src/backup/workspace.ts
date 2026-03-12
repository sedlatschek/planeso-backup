import type { PlaneSoClient } from '../plane-so/index.js';
import { stringify } from '../utility.js';
import type { Backup } from './Backup.js';
import { gatherCustomers } from './customer.js';
import { gatherInitiatives } from './initiative.js';
import { gatherProjects } from './project.js';
import { gatherTeamspaces } from './teamspace.js';

export async function backupWorkspace(client: PlaneSoClient, backup: Backup): Promise<void> {
  const projects = await gatherProjects(client);
  const teamspaces = await gatherTeamspaces(client);
  const customers = await gatherCustomers(client);
  const initiatives = await gatherInitiatives(client);

  backup.add(`${client.workspace.id}.json`, stringify({
    id: client.workspace.id,
    projects,
    teamspaces,
    customers,
    initiatives,
  }));
}
