// In an auth API module (e.g. auth.api.js)
import { apiClient } from "./apiClient";  // or use fetchApi similarly

export async function registerUser({ email, password }) {
  return apiClient("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function loginUser({ email, password }) {
  return apiClient("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
