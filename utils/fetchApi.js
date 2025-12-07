import axios from "axios";

export const baseUrl = 'https://bayut.p.rapidapi.com';

// MOCK DATA FOR UI PREVIEW
export const fetchApi = async (url) => {
  // Enriched mock data including location, photos, description and landlord info
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
        coverPhoto: { url: "https://via.placeholder.com/1200x630?text=Property+1+Main" },
        photos: [
          { url: "http://static.photos/estate/640x360/47" },
          { url: "http://static.photos/indoor/640x360/101" },
          { url: "http://static.photos/indoor/640x360/102" },
          { url: "http://static.photos/indoor/640x360/103" },
          { url: "http://static.photos/indoor/640x360/105" },
          { url: "http://static.photos/indoor/640x360/106" },
          { url: "http://static.photos/indoor/640x360/107" }
        ],
        location: "123 Serene Lane, Lakeview, USA",
        description: "A modern, thoughtfully designed apartment located just steps from the lake. This three-bedroom, two-bath home features an open-plan living and dining area with floor-to-ceiling windows, premium finishes, a gourmet kitchen with stainless steel appliances, and smart-home controls. The unit includes a sunny balcony with water views, in-unit laundry, ample storage, and access to on-site amenities such as a fitness center and secure parking. Conveniently located near top-rated schools, transit links, and neighborhood shops, this property blends comfort with contemporary style.",
        landlordName: "Michael Johnson",
        landlordEmail: "michael.johnson@example.com",
        landlordPhone: "(555) 123-4567",
        landlordPhoto: "http://static.photos/people/200x200/5",
        yearBuilt: 2018,
        garage: 2,
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
        coverPhoto: { url: "http://static.photos/estate/1200x630/48" },
        photos: [
          { url: "http://static.photos/estate/640x360/48" },
          { url: "http://static.photos/indoor/640x360/49" }
        ],
        location: "456 Ocean Drive, Seaside, USA",
        description: "An exquisite luxury villa offering expansive indoor and outdoor living spaces, perfect for entertaining and family living. The property boasts a private heated pool, professionally landscaped gardens, a fully equipped chef's kitchen with high-end appliances, a home theater, and a dedicated gym. High ceilings, bespoke cabinetry, and premium materials run throughout. The grounds include guest parking and a three-car garage, enhanced security systems, and smart-home automation. Located in an exclusive seaside neighborhood with private access to coastal walks and premium dining, this villa is a rare find for discerning buyers.",
        landlordName: "Samantha Lee",
        landlordEmail: "samantha.lee@example.com",
        landlordPhone: "(555) 987-6543",
        landlordPhoto: "http://static.photos/people/200x200/6",
        yearBuilt: 2015,
        garage: 3,
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
        coverPhoto: { url: "http://static.photos/estate/1200x630/49" },
        photos: [
          { url: "http://static.photos/estate/640x360/50" },
          { url: "http://static.photos/indoor/640x360/51" },
          { url: "http://static.photos/indoor/640x360/52" },
          { url: "http://static.photos/indoor/640x360/53" },
          { url: "http://static.photos/indoor/640x360/54" },
          { url: "http://static.photos/indoor/640x360/55" }
        ],
        location: "789 Country Road, Hillside, USA",
        description: "A charming and well-maintained cozy house ideal for small families or first-time buyers. The home features two comfortable bedrooms, a recently updated kitchen with modern appliances, a warm living room with a fireplace, and a sunny backyard perfect for kids and pets. Additional benefits include extra storage space, a dedicated laundry area, and a detached garage. Situated in a friendly neighborhood close to parks, schools, and local amenities, this property offers a relaxed lifestyle with convenient access to nearby commuter routes.",
        landlordName: "Alex Martinez",
        landlordEmail: "alex.martinez@example.com",
        landlordPhone: "(555) 555-1212",
        landlordPhoto: "http://static.photos/people/200x200/7",
        yearBuilt: 2005,
        garage: 1,
      },
    ],
  };
};