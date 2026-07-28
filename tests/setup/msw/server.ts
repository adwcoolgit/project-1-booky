import { setupServer } from "msw/node";

import { handlers } from "@/../tests/setup/msw/handlers";

export function createMswServer() {
  return setupServer(...handlers);
}

export const server = createMswServer();
