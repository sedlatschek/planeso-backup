import type { PlaneSoClient } from '../plane-so/index.js';
import { stringify } from '../utility.js';
import type { Backup } from './Backup.js';
import { gatherCustomers } from './customer.js';
import { gatherInitiatives } from './initiative.js';
import { gatherProjects } from './project.js';
import { gatherTeamspaces } from './teamspace.js';

export async function backupWorkspace(client: PlaneSoClient, workspaceId: string, backup: Backup): Promise<void> {
  const projects = await gatherProjects(client, workspaceId);
  const teamspaces = await gatherTeamspaces(client, workspaceId);
  const customers = await gatherCustomers(client, workspaceId);
  const initiatives = await gatherInitiatives(client, workspaceId);

  backup.add(`${workspaceId}.json`, stringify({
    id: workspaceId,
    projects,
    teamspaces,
    customers,
    initiatives,
  }));
}
