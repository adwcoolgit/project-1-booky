import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://library-backend-production-b9cf.up.railway.app/api/__foundation__/health", () => {
    return HttpResponse.json({ ok: true, status: "foundation-only" });
  }),
];
