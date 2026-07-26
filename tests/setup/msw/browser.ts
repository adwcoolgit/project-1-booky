import { setupWorker } from "msw/browser";

import { handlers } from "@/../tests/setup/msw/handlers";

export const worker = setupWorker(...handlers);
