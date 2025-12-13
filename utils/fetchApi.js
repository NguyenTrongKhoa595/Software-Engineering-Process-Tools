// utils/fetchApi.js

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export async function fetchApi(endpoint, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Attach Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Try to parse JSON safely
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  // Handle HTTP errors
  if (!response.ok) {
    const error = new Error(
      data?.message || "Something went wrong"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
