import axios from "axios";

export const baseUrl = 'https://bayut.p.rapidapi.com';

// MOCK DATA FOR UI PREVIEW
export const fetchApi = async (url) => {
  // You can edit this data to match whatever you want
  return {
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
        coverPhoto: {
          url: "https://via.placeholder.com/400x300?text=Property+1",
        },
      },
      {
        id: 2,
        title: "Luxury Villa",
        price: 850000,
        rentFrequency: "yearly",
        rooms: 5,
        baths: 4,
        area: 3500,
        agency: { logo: { url: "/demo-logo2.png" } },
        coverPhoto: {
          url: "https://via.placeholder.com/400x300?text=Property+2",
        },
      },
      {
        id: 3,
        title: "Cozy House",
        price: 220000,
        rentFrequency: "monthly",
        rooms: 2,
        baths: 1,
        area: 900,
        agency: { logo: { url: "/demo-logo3.png" } },
        coverPhoto: {
          url: "https://via.placeholder.com/400x300?text=Property+3",
        },
      },
    ],
  };
};