import { fetchApi } from "./fetchApi";

export async function login(email, password) {
  return fetchApi(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );
}


export async function signup(payload) {
  return fetchApi("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
}
