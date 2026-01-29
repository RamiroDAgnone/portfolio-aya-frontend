let accessToken = null;

export function saveAccessToken(token) {
  accessToken = token;
}

export function getStoredAccessToken() {
  return accessToken;
}

export function clearTokens() {
  accessToken = null;
}
