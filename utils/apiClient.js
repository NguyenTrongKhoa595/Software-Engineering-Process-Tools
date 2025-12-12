// utils/apiClient.js
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api";

const buildHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export async function apiGet(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    method: "GET",
    headers: buildHeaders(),
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function apiPut(endpoint, body) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function apiPost(endpoint, body) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function apiDelete(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: buildHeaders(),
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
