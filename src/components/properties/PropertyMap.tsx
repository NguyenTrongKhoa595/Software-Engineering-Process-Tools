import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { PropertySummaryDTO } from '@/lib/api/propertyApi';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';

// Fix Leaflet Textures

// Custom Price Marker
const createPriceIcon = (price: number) => {
    return L.divIcon({
        className: 'custom-marker-container',
        html: `
            <div class="relative group cursor-pointer -translate-x-1/2 -translate-y-full hover:z-50 pb-2">
                <div class="bg-white text-slate-900 font-extrabold px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.3)] border border-slate-200 text-sm w-max hover:scale-110 hover:bg-slate-900 hover:text-white transition-all duration-200 whitespace-nowrap">
                    $${price.toLocaleString()}
                </div>
                <div class="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 group-hover:bg-slate-900 group-hover:border-slate-900 transition-colors"></div>
            </div>
        `,
        iconSize: [0, 0], 
        iconAnchor: [0, 0],
    });
};

interface PropertyMapProps {
    properties: PropertySummaryDTO[];
    center?: [number, number]; // [lat, lng]
    zoom?: number;
}

// Default Center (Ho Chi Minh City)
const DEFAULT_CENTER: [number, number] = [10.762622, 106.660172];

// Component to update map view when properties change
function ChangeView({ center, properties }: { center?: [number, number], properties: PropertySummaryDTO[] }) {
    const map = useMap();
    
    useEffect(() => {
        if (properties.length > 0) {
            // Calculate bounds
            const bounds = L.latLngBounds(properties.map(p => [p.latitude || DEFAULT_CENTER[0], p.longitude || DEFAULT_CENTER[1]]));
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        } else if (center) {
            map.flyTo(center, 12);
        }
    }, [center, properties, map]);
    
    return null;
}

// Deterministic pseudo-random number generator based on property ID
const getPseudoRandomOffset = (id: number) => {
    const seed = id * 9301 + 49297;
    const rnd = ((seed % 233280) / 233280) - 0.5; // -0.5 to 0.5
    return rnd * 0.08; // Spread within ~8-10km
};

export function PropertyMap({ properties, center = DEFAULT_CENTER, zoom = 13 }: PropertyMapProps) {
    // Filter properties that actually have location data (mock or real)
    const validProperties = properties.map(p => {
        // Use real coordinates if available, otherwise deterministic mock
        const hasRealCoords = p.latitude && p.longitude;
        return {
            ...p,
            latitude: hasRealCoords ? p.latitude! : DEFAULT_CENTER[0] + getPseudoRandomOffset(p.id),
            longitude: hasRealCoords ? p.longitude! : DEFAULT_CENTER[1] + getPseudoRandomOffset(p.id * 7919),
            isMock: !hasRealCoords
        };
    });

    return (
        <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-border shadow-sm z-0">
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <ChangeView center={center} properties={validProperties} />
                
                {validProperties.map(property => (
                    <Marker 
                        key={property.id} 
                        position={[property.latitude, property.longitude]}
                        icon={createPriceIcon(property.rentAmount)}
                    >
                        <Popup className="min-w-[280px] p-0 overflow-hidden rounded-lg shadow-xl border-none">
                            <div className="space-y-0">
                                <div className="relative h-40 w-full bg-muted group">
                                     <img 
                                        src={property.coverImageUrl || '/placeholder.svg'} 
                                        alt={property.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {property.featured && (
                                        <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                            Featured
                                        </span>
                                    )}
                                    {/* Directions Badge on Image */}
                                    <a 
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="absolute bottom-2 right-2 bg-background/90 hover:bg-background text-foreground text-xs font-semibold px-2 py-1.5 rounded-md shadow-sm flex items-center gap-1 transition-colors"
                                    >
                                        <Navigation className="h-3 w-3 text-primary" /> Directions
                                    </a>
                                </div>
                                <div className="p-4 bg-card">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold text-base line-clamp-1 hover:text-primary transition-colors cursor-pointer">
                                                <Link to={`/properties/${property.id}`}>{property.title}</Link>
                                            </h4>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <MapPin className="h-3 w-3" /> {property.address}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                        <span className="flex items-center gap-1"><span className="font-medium text-foreground">{property.bedrooms}</span> Beds</span>
                                        <span className="flex items-center gap-1"><span className="font-medium text-foreground">{property.bathrooms}</span> Baths</span>
                                        <span className="flex items-center gap-1"><span className="font-medium text-foreground">{property.size}</span> sqft</span>
                                    </div>

                                    <div className="flex gap-2 mt-3">
                                        <Button size="sm" className="w-full font-semibold shadow-sm !text-white" asChild>
                                            <Link to={`/properties/${property.id}`} className="!text-white hover:!text-white">View Details</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            
            {/* Quick Filter Bubbles (Overlay) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-border z-[1000] flex gap-2">
               <span className="text-xs font-semibold px-2 py-1 flex items-center gap-1">
                 <MapPin className="h-3 w-3 text-primary" /> Interactive Map
               </span>
            </div>
        </div>
    );
}
