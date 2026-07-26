import { setupServer } from "msw/node";

import { handlers } from "@/../tests/setup/msw/handlers";

export const server = setupServer(...handlers);
