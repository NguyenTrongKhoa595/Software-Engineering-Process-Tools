import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

export default function LandlordCreate() {
  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState([]); 
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.feather && typeof window.feather.replace === 'function') {
        window.feather.replace();
      }
    } catch (e) {}
    const t = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.feather && typeof window.feather.replace === 'function') {
          window.feather.replace();
        }
      } catch (e) {}
    }, 200);
    return () => clearTimeout(t);
  }, [previews]);

  function showMessage(type, text) {
    setMessage({ type, text });
    if (type === 'success') setTimeout(() => setMessage(null), 3000);
  }

  function processFiles(filesArray) {
    if (!filesArray || !filesArray.length) return;
    const files = Array.from(filesArray);

    const maxFiles = 10;
    if (previews.length + files.length > maxFiles) {
      showMessage('error', `You can upload a maximum of ${maxFiles} images`);
      return;
    }

    const newPreviews = [];
    for (let i = 0; i < files.length && newPreviews.length + previews.length < maxFiles; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) continue;
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showMessage('error', `File ${file.name} exceeds 5MB and was skipped.`);
        continue;
      }
      const url = URL.createObjectURL(file);
      newPreviews.push({ id: `${Date.now()}-${i}-${file.name}`, url, file });
    }

    if (newPreviews.length) {
      setPreviews(prev => [...prev, ...newPreviews]);
      // clear photos error if any
      setErrors(prev => ({ ...prev, photos: undefined }));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleFilesSelected(e) {
    processFiles(e.target.files);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  }

  function removePreview(id) {
    setPreviews(prev => {
      const next = prev.filter(p => p.id !== id);
      // revoke URL of removed
      prev.forEach(p => { if (p.id === id) URL.revokeObjectURL(p.url); });
      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // validate fields before submission
    if (!validateForm()) return;

    showMessage('success', 'Property listing submitted successfully!');
    // optionally clear form and previews
    setTimeout(() => {
      setPreviews(prev => {
        prev.forEach(p => URL.revokeObjectURL(p.url));
        return [];
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 800);
  }

  function validateForm() {
    const propertyName = (document.getElementById('propertyName') || {}).value || '';
    const propertyDescription = (document.getElementById('propertyDescription') || {}).value || '';
    const priceVal = (document.getElementById('price') || {}).value || '';
    const bedroomsVal = (document.getElementById('bedrooms') || {}).value || '';
    const bathroomsVal = (document.getElementById('bathrooms') || {}).value || '';
    const areaVal = (document.getElementById('area') || {}).value || '';
    const garageVal = (document.getElementById('garage') || {}).value || '';
    const yearBuiltVal = (document.getElementById('yearBuilt') || {}).value || '';
    const addressVal = (document.getElementById('address') || {}).value || '';

    const newErrors = {};
    if (!propertyName.trim()) newErrors.propertyName = 'Please enter the property name';
    if (!propertyDescription.trim()) newErrors.propertyDescription = 'Please provide a short description';

    const price = Number(priceVal);
    if (!priceVal || Number.isNaN(price) || price <= 0) newErrors.price = 'Please enter a valid price greater than 0';

    const bedrooms = Number(bedroomsVal);
    if (!bedroomsVal || Number.isNaN(bedrooms) || bedrooms < 1) newErrors.bedrooms = 'Please enter the number of bedrooms (minimum 1)';

    const bathrooms = Number(bathroomsVal);
    if (!bathroomsVal || Number.isNaN(bathrooms) || bathrooms < 1) newErrors.bathrooms = 'Please enter a valid number of bathrooms (minimum 1)';

    const area = Number(areaVal);
    if (!areaVal || Number.isNaN(area) || area <= 0) newErrors.area = 'Please enter a valid area greater than 0';

    const garage = Number(garageVal);
    if (!garageVal || Number.isNaN(garage) || garage < 0) newErrors.garage = 'Please enter a valid number of garage spaces';

    const yearBuilt = Number(yearBuiltVal);
    const currentYear = new Date().getFullYear();
    if (!yearBuiltVal || Number.isNaN(yearBuilt) || yearBuilt < 1800 || yearBuilt > currentYear) newErrors.yearBuilt = `Please enter a valid construction year between 1800 and ${currentYear}`;

    if (!addressVal.trim()) newErrors.address = 'Please enter the full address';

    if (previews.length === 0) newErrors.photos = 'Please upload at least one photo of the property';

    setErrors(newErrors);

    const firstKey = Object.keys(newErrors)[0];
    if (firstKey) {
      const el = document.getElementById(firstKey);
      if (el) el.focus();
      showMessage('error', newErrors[firstKey]);
      return false;
    }

    return true;
  }

  return (
    <>
      <Head>
        <title>Create New Property</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/feather-icons"></script>
        <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-8">Create New Property Listing</h1>

          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Property Details</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="propertyName" className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                  <input type="text" id="propertyName" name="propertyName" onChange={() => setErrors(prev => ({ ...prev, propertyName: undefined }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  {errors.propertyName && <p className="mt-1 text-xs text-red-600">{errors.propertyName}</p>}
                </div>

                <div>
                  <label htmlFor="propertyDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea id="propertyDescription" name="propertyDescription" rows="4" onChange={() => setErrors(prev => ({ ...prev, propertyDescription: undefined }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                  {errors.propertyDescription && <p className="mt-1 text-xs text-red-600">{errors.propertyDescription}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos (Max 10)</label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center ${isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-white'}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                    onDrop={handleDrop}
                  >
                    <div className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
                      <i data-feather="upload"></i>
                      <span>Drag &amp; drop photos here or click to browse</span>
                    </div>
                    <input ref={fileInputRef} type="file" id="propertyPhotos" className="hidden" multiple accept="image/*" onChange={handleFilesSelected} />
                    <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Select Files
                    </button>
                    <p className="text-xs text-gray-500 mt-2">JPEG or PNG, maximum 5MB each</p>
                    {errors.photos && <p className="mt-2 text-xs text-red-600">{errors.photos}</p>}

                    <div id="previewContainer" className={`mt-4 grid grid-cols-3 gap-2 ${previews.length ? '' : 'hidden'}`}>
                      {previews.map(p => (
                        <div key={p.id} className="relative group">
                          <img src={p.url} alt="Preview" className="w-full h-24 object-cover rounded" />
                          <button type="button" onClick={() => removePreview(p.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <i data-feather="x" className="w-3 h-3"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Property Specifications</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <input type="number" id="bedrooms" name="bedrooms" min="1" onChange={() => setErrors(prev => ({ ...prev, bedrooms: undefined }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Number of bedrooms" />
                    {errors.bedrooms && <p className="mt-1 text-xs text-red-600">{errors.bedrooms}</p>}
                  </div>
                  <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                    <input type="number" id="bathrooms" name="bathrooms" min="1" step="0.5" onChange={() => setErrors(prev => ({ ...prev, bathrooms: undefined }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Number of bathrooms" />
                    {errors.bathrooms && <p className="mt-1 text-xs text-red-600">{errors.bathrooms}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
                  <input type="number" id="area" name="area" onChange={() => setErrors(prev => ({ ...prev, area: undefined }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area}</p>}
                </div>

                <div>
                  <label htmlFor="garage" className="block text-sm font-medium text-gray-700 mb-1">Garage</label>
                  <input type="number" id="garage" name="garage" min="0" onChange={() => setErrors(prev => ({ ...prev, garage: undefined }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Number of garage spaces" />
                  {errors.garage && <p className="mt-1 text-xs text-red-600">{errors.garage}</p>}
                </div>

                <div>
                  <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                  <input type="number" id="yearBuilt" name="yearBuilt" min="1800" max={new Date().getFullYear()} onChange={() => setErrors(prev => ({ ...prev, yearBuilt: undefined }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Construction year" />
                  {errors.yearBuilt && <p className="mt-1 text-xs text-red-600">{errors.yearBuilt}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                  <textarea id="address" name="address" rows="2" onChange={() => setErrors(prev => ({ ...prev, address: undefined }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                  {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price per Month ($)</label>
                  <input type="number" id="price" name="price" onChange={() => setErrors(prev => ({ ...prev, price: undefined }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                </div>

                <div className="pt-4">
                  <button id="submitBtn" type="submit" className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                    <i data-feather="check-circle" className="mr-2"></i>
                    Submit for Leasing
                  </button>
                </div>

                {message && (
                  <div className={`mt-4 text-sm p-3 rounded ${message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-green-50 border border-green-200 text-green-800'}`} role="status">
                    {message.text}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
