const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export async function fetchApi(url, options = {}, { skipAuth = false } = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (!skipAuth) {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      throw new Error(`HTTP ${res.status}`);
    }
    throw error;
  }

  return res.json();
}
