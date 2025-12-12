// utils/apiClient.js
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

const buildHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Make a GET request to the API
 * @param {string} endpoint - API endpoint (e.g., '/users/123')
 * @returns {Promise<any>} - Parsed JSON response
 */
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

/**
 * Make a PUT request to the API
 * @param {string} endpoint - API endpoint (e.g., '/users/123')
 * @param {any} body - Request body (will be JSON stringified)
 * @returns {Promise<any>} - Parsed JSON response
 */
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

/**
 * Make a POST request to the API
 * @param {string} endpoint - API endpoint (e.g., '/users')
 * @param {any} body - Request body (will be JSON stringified)
 * @returns {Promise<any>} - Parsed JSON response
 */
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

/**
 * Make a DELETE request to the API
 * @param {string} endpoint - API endpoint (e.g., '/users/123')
 * @returns {Promise<any>} - Parsed JSON response
 */
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
