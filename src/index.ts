#!/usr/bin/env node

import { getConfig } from "./config.js";
import { PlaneSoClient } from "./plane-so/index.js";

async function main(): Promise<void> {
  const config = getConfig();

  const api = new PlaneSoClient({
    baseUrl: "https://api.plane.so/api",
    accessToken: config.PLANE_API_TOKEN
  });

  const projectsResponse = await api.workspace.getV1Projects(config.PLANE_WORKSPACE);
  console.log(projectsResponse);

  const statesResponse = await api.projects.getV1States(config.PLANE_WORKSPACE, "5801e923-7dd6-45b2-adc6-f79d8531c208");
  console.log(statesResponse);

  const labelsResponse = await api.projects.getV1Labels(config.PLANE_WORKSPACE, "5801e923-7dd6-45b2-adc6-f79d8531c208");
  console.log(labelsResponse);

}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}

