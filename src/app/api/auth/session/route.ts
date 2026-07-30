import { NextResponse } from "next/server";

import { mapSessionStateToPresentation } from "@/entities/session";
import { readSessionLocale, readSessionState } from "@/shared/auth/session.server";

export async function processSessionReadRequest() {
  const locale = await readSessionLocale();
  const session = await readSessionState(locale, { cleanupInvalidCookie: true });

  return mapSessionStateToPresentation(session);
}

export async function GET() {
  const body = await processSessionReadRequest();

  return NextResponse.json(body);
}
