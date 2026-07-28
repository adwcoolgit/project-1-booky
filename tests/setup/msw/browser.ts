import { setupWorker } from "msw/browser";

import { handlers } from "@/../tests/setup/msw/handlers";

export function createMswWorker() {
  return setupWorker(...handlers);
}

export const worker = createMswWorker();
