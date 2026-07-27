export const protectedProfileFixture = {
  id: 2,
  name: "Booky Reader",
  email: "reader@booky.test",
  activeLoanCount: 3,
};

export const protectedAdminProfileFixture = {
  id: 1,
  name: "Booky Admin",
  email: "admin@booky.test",
  activeLoanCount: 0,
};

export const protectedUnauthorizedToken = "opaque-session-token-expired";
export const protectedForbiddenToken = "opaque-session-token-forbidden";
export const protectedUnauthorizedMessage = "Deterministic unauthorized session.";
export const protectedForbiddenMessage = "Deterministic forbidden session.";
