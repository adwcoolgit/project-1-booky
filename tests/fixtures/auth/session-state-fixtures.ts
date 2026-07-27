export const unreadableSessionCookieFixture = "not-a-valid-session-cookie";

export const guestSessionSnapshotFixture = {
  status: "guest",
} as const;

export const authenticatedUserSessionSnapshotFixture = {
  status: "authenticated",
  user: {
    id: 2,
    name: "Booky Reader",
    email: "reader@booky.test",
    role: "USER",
  },
  locale: "en",
} as const;

export const authenticatedAdminSessionSnapshotFixture = {
  status: "authenticated",
  user: {
    id: 1,
    name: "Booky Admin",
    email: "admin@booky.test",
    role: "ADMIN",
  },
  locale: "id",
} as const;
