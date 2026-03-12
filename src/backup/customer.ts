import type { PlaneSoClient } from '../plane-so/index.js';
import type { V1Entity } from '../plane-so/models/V1Entity.js';
import type { PlaneSoCustomerClient } from '../plane-so/namespaces/customer.js';

export async function gatherCustomers(client: PlaneSoClient, workspaceId: string): Promise<V1Entity[]> {
  const { results: customers } = await client.workspace.getV1Customers(workspaceId);
  return await Promise.all(customers.map(customer => enrichCustomer(client.customer, workspaceId, customer)));
}

async function enrichCustomer(client: PlaneSoCustomerClient, workspaceId: string, customer: V1Entity): Promise<V1Entity> {
  const { results: requests } = await client.getV1CustomerRequests(workspaceId, customer.id);

  return {
    ...customer,
    requests,
  };
}
