const API_BASE_URL = "http://localhost:8081";

export async function apiClient(endpoint, { method = "GET", body = null, headers = {} } = {}) {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  const text = await response.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) throw new Error(data.message || data || "API error");

  return data;
}
