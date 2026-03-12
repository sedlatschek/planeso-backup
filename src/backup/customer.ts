import { ADDED_PROPERTIES_KEY } from '../constants.js';
import type { PlaneSoClient } from '../plane-so/index.js';
import type { V1Entity } from '../plane-so/models/V1Entity.js';
import type { PlaneSoCustomerClient } from '../plane-so/namespaces/customer.js';

export async function gatherCustomers(client: PlaneSoClient): Promise<V1Entity[]> {
  const { results: customers } = await client.workspace.getV1Customers();
  return await Promise.all(customers.map(customer => enrichCustomer(client.customer(customer.id), customer)));
}

async function enrichCustomer(client: PlaneSoCustomerClient, customer: V1Entity): Promise<V1Entity> {
  const { results: requests } = await client.getV1CustomerRequests();

  return {
    ...customer,
    [ADDED_PROPERTIES_KEY]: { requests },
  };
}
