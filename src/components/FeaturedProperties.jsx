// components/FeaturedProperties.jsx
import React from 'react';
import Property from './Property';
import { mockProperties } from '../utils/mockProperties';

const FeaturedProperties = () => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Featured Properties</h2>

      <div className="flex flex-wrap gap-6">
        {mockProperties.map((property) => (
          <Property key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProperties;
