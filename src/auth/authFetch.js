import { API_URL } from "./constants";
import { getStoredAccessToken, saveAccessToken } from "./tokenStorage";

export async function authFetch(endpoint, options = {}) {
  const accessToken = getStoredAccessToken();

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
    ...(accessToken && { Authorization: `Bearer ${accessToken}` })
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (res.status === 401) {
    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      throw new Error("Sesión expirada");
    }

    const retryHeaders = {
      ...(options.headers || {}),
      Authorization: `Bearer ${newAccessToken}`
    };

    if (!isFormData) {
      retryHeaders["Content-Type"] = "application/json";
    }

    const retryRes = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: retryHeaders
    });

    return handleResponse(retryRes);
  }

  return handleResponse(res);
}

async function handleResponse(res) {
  if (!res.ok) {
    // intento parsear body y devolver status para debug
    const payload = await res.json().catch(() => null);
    const serverMsg = payload?.error || payload?.message || JSON.stringify(payload) || "Error de servidor";
    throw new Error(`${res.status} ${serverMsg}`);
  }

  // si no hay body, devolver null
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

async function refreshAccessToken() {
  const res = await fetch(`${API_URL}/refreshtoken`, {
    method: "POST",
    credentials: "include"
  });

  if (!res.ok) return null;

  const data = await res.json();
  saveAccessToken(data.accessToken);
  return data.accessToken;
}