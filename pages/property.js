import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchApi } from '../utils/fetchApi';

export default function PropertyDetail({ property }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    function replaceFeather() {
      try {
        if (typeof window !== 'undefined' && window.feather && typeof window.feather.replace === 'function') {
          window.feather.replace();
        }
      } catch (e) {
        // ignore
      }
    }

    replaceFeather();
    const t = setTimeout(replaceFeather, 300);
    return () => clearTimeout(t);
  }, [activeIndex]);

  if (!property) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Property not found</h2>
      </div>
    );
  }

  // Build thumbnails array from available photos or fallback to coverPhoto
  const thumbnails = (property.photos && property.photos.length > 0)
    ? property.photos.map(p => p.url)
    : [property.coverPhoto?.url || '', property.coverPhoto?.url || '', property.coverPhoto?.url || ''];

  // Helper to return a sized image URL. If the source contains a widthxheight segment
  function getSizedImage(url, targetSize = '1200x630') {
    if (!url) return `https://via.placeholder.com/${targetSize}?text=No+Image`;
    try {
      // replace common size patterns like 640x360 or 400x300
      const replaced = url.replace(/\d+x\d+/g, targetSize);
      return replaced;
    } catch (e) {
      return url;
    }
  }

  const mainImageSrc = getSizedImage(thumbnails[activeIndex] || thumbnails[0], '1200x630');

  return (
    <>
      <Head>
        <title>{property.title || 'Property - Details'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
        <script src="https://unpkg.com/feather-icons"></script>
      </Head>

      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{property.title}</h1>
              <div className="flex items-center mt-2">
                <i data-feather="map-pin" className="w-4 h-4 text-gray-500 mr-1"></i>
                <p className="text-gray-600">{property.location || 'Location not provided'}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-3xl font-bold text-primary-500">${property.price} {property.rentFrequency ? ` / ${property.rentFrequency}` : ''}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                <img id="main-image" src={mainImageSrc} alt="Property main view" className="w-full h-96 object-cover" />
              </div>

              <div className="flex space-x-2 overflow-x-auto pb-2">
                {thumbnails.map((src, i) => (
                  <img
                    key={i}
                    src={getSizedImage(src, '640x360')}
                    alt={`Property view ${i + 1}`}
                    className={`thumbnail w-32 h-20 object-cover rounded-lg cursor-pointer border-2 transform transition-all duration-200 ${i === activeIndex ? 'border-blue-500 scale-105' : 'border-transparent'}`}
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <i data-feather="home" className="w-5 h-5 text-primary-500 mr-2"></i>
                      <span className="text-gray-600">Rooms</span>
                    </div>
                    <p className="text-xl font-bold mt-1">{property.rooms || '-'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <i data-feather="droplet" className="w-5 h-5 text-primary-500 mr-2"></i>
                      <span className="text-gray-600">Bathrooms</span>
                    </div>
                    <p className="text-xl font-bold mt-1">{property.baths || '-'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <i data-feather="maximize" className="w-5 h-5 text-primary-500 mr-2"></i>
                      <span className="text-gray-600">Area</span>
                    </div>
                    <p className="text-xl font-bold mt-1">{property.area ? `${property.area} sqft` : '-'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <i data-feather="calendar" className="w-5 h-5 text-primary-500 mr-2"></i>
                      <span className="text-gray-600">Year Built</span>
                    </div>
                    <p className="text-xl font-bold mt-1">{property.yearBuilt || '-'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <i data-feather="truck" className="w-5 h-5 text-primary-500 mr-2"></i>
                      <span className="text-gray-600">Garage</span>
                    </div>
                    <p className="text-xl font-bold mt-1">{property.garage || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-700 leading-relaxed">{property.description || 'No description available.'}</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact the Landlord</h2>
                <div className="flex items-center mb-4">
                  <img src={property.landlordPhoto || 'https://via.placeholder.com/80'} alt="Landlord" className="w-16 h-16 rounded-full object-cover mr-4" />
                  <div>
                    <p className="font-medium text-gray-800">{property.landlordName || 'Owner'}</p>
                    <p className="text-sm text-gray-500">{property.landlordTitle || 'Property Owner'}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <i data-feather="mail" className="w-4 h-4 mr-2 text-primary-500"></i>
                    <span>{property.landlordEmail || 'n/a'}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <i data-feather="phone" className="w-4 h-4 mr-2 text-primary-500"></i>
                    <span>{property.landlordPhone || 'n/a'}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sessionStorage.setItem('paymentData', JSON.stringify({
                      price: property.price,
                      id: property.id,
                      title: property.title
                    }));
                    router.push('/payment');
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center"
                >
                  <i data-feather="corner-down-right" className="w-4 h-4 mr-2"></i>
                  Rent This Property
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">Response time: usually within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  // fetch data (mocked by fetchApi)
  const data = await fetchApi('/properties');
  const hits = data && data.hits ? data.hits : [];

  // find property by id (support numeric or string ids)
  const property = hits.find((h) => String(h.id) === String(id)) || hits[0] || null;

  // Map fields to the shape used in the page
  const mapped = property
    ? {
      id: property.id,
      title: property.title,
      coverPhoto: property.coverPhoto || { url: '' },
      photos: property.photos || null,
      price: property.price,
      rentFrequency: property.rentFrequency,
      rooms: property.rooms || property.room || '-',
      baths: property.baths || property.bath || '-',
      area: property.area,
      description: property.description || property.summary || '',
      location: property.location || property.city || '',
      landlordName: property.landlordName || null,
      landlordEmail: property.landlordEmail || null,
      landlordPhone: property.landlordPhone || null,
      landlordPhoto: property.landlordPhoto || null,
      yearBuilt: property.yearBuilt || null,
      garage: property.garage || null,
    }
    : null;

  return {
    props: {
      property: mapped,
    },
  };
}
