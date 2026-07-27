import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { isSupportedLocale } from "@/shared/i18n/config";
import { routing } from "@/shared/i18n/routing";

const intlMiddleware = createMiddleware(routing);
const localeLikeSegmentPattern = /^[A-Za-z]{2}(?:-[A-Za-z]{2})?$/;

export default function proxy(request: NextRequest) {
  const [, localeSegment] = request.nextUrl.pathname.split("/");

  if (
    localeSegment &&
    localeLikeSegmentPattern.test(localeSegment) &&
    !isSupportedLocale(localeSegment)
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};