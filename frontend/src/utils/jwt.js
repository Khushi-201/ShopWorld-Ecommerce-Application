import { jwtDecode } from "jwt-decode";

/**
 * Reads only the `exp` claim from the token, purely so the UI can warn the
 * user before their session lapses (e.g. "you'll be logged out soon").
 *
 * IMPORTANT: never derive role/permissions from the token. Admin status and
 * seller status are only ever trusted from a live call to
 * GET /users/me/access, since that reflects the current DB state - a token
 * issued before an approval/revocation would otherwise be stale.
 */
export function getTokenExpiryMs(token) {
  if (!token) return null;
  try {
    const { exp } = jwtDecode(token);
    return exp ? exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const expiryMs = getTokenExpiryMs(token);
  if (!expiryMs) return true;
  return Date.now() >= expiryMs;
}
