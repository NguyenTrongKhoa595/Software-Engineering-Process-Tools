export const filterData = [
  {
    items: [
      { name: '10,000', value: '10000' },
      { name: '20,000', value: '20000' },
      { name: '30,000', value: '30000' },
      { name: '40,000', value: '40000' },
      { name: '50,000', value: '50000' },
      { name: '60,000', value: '60000' },
      { name: '85,000', value: '85000' },
    ],
    placeholder: 'Min Price',
    queryName: 'minPrice',
  },
  {
    items: [
      { name: '50,000', value: '50000' },
      { name: '60,000', value: '60000' },
      { name: '85,000', value: '85000' },
      { name: '110,000', value: '110000' },
      { name: '135,000', value: '135000' },
      { name: '160,000', value: '160000' },
      { name: '185,000', value: '185000' },
      { name: '200,000', value: '200000' },
      { name: '300,000', value: '300000' },
      { name: '400,000', value: '400000' },
      { name: '500,000', value: '500000' },
      { name: '600,000', value: '600000' },
      { name: '700,000', value: '700000' },
      { name: '800,000', value: '800000' },
      { name: '900,000', value: '900000' },
      { name: '1,000,000', value: '1000000' },
    ],
    placeholder: 'Max Price',
    queryName: 'maxPrice',
  },
  {
    items: [
      { name: 'Apartment', value: 'Apartment' },
      { name: 'Townhouses', value: 'Townhouses' },
      { name: 'Villas', value: 'Villas' },
      { name: 'Penthouses', value: 'Penthouses' },
      { name: 'Hotel Apartments', value: 'Hotel Apartments' },
      { name: 'Villa Compound', value: 'Villa Compound' },
      { name: 'Residential Plot', value: 'Residential Plot' },
      { name: 'Residential Floor', value: 'Residential Floor' },
      { name: 'Residential Building', value: 'Residential Building' },
    ],
    placeholder: 'Property Type',
    queryName: 'category',
  },
  {
    items: [
      { name: 'Downtown', value: 'Downtown' },
      { name: 'Marina', value: 'Marina' },
      { name: 'Palm Jumeirah', value: 'Palm Jumeirah' },
      { name: 'Business Bay', value: 'Business Bay' },
      { name: 'Jumeirah Village', value: 'Jumeirah Village' },
      { name: 'Al Barsha', value: 'Al Barsha' },
      { name: 'Dubai Silicon Oasis', value: 'Dubai Silicon Oasis' },
      { name: 'Deira', value: 'Deira' },
    ],
    placeholder: 'Location',
    queryName: 'location',
  },
  {
    items: [
      { name: 'Available Now', value: 'available' },
      { name: 'Unavailable', value: 'unavailable' },
    ],
    placeholder: 'Availability',
    queryName: 'availability',
  },
];

export const getFilterValues = (filterValues) => {
  const { minPrice, maxPrice, category, location, availability } = filterValues;

  return [
    { name: 'minPrice', value: minPrice },
    { name: 'maxPrice', value: maxPrice },
    { name: 'category', value: category },
    { name: 'location', value: location },
    { name: 'availability', value: availability },
  ];
};
