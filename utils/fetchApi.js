import fetchApi;
import axios from "axios";

const BACKEND_URL = "http://localhost:8081";
const USE_MOCK_DATA = false;

const mockResponse = {
  hits: [
    {
      id: 1,
      title: "Modern Apartment",
      price: 120000,
      rentFrequency: "monthly",
      rooms: 3,
      baths: 2,
      area: 1200,
      agency: { logo: { url: "/demo-logo.png" } },
      coverPhoto: { url: "https://via.placeholder.com/400x300" },
    },
  ],
};

export const fetchApi = async (endpoint, options = {}) => {
  if (USE_MOCK_DATA) {
    return mockResponse;
  }

  try {
    const response = await axios({
      method: options.method || "GET",
      url: `${BACKEND_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      data: options.body ? JSON.parse(options.body) : undefined,
    });

    return response.data;
  } catch (error) {
    console.error("API ERROR:", error.response?.data || error.message);
    throw error;
  }
};
