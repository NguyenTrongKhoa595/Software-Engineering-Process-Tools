import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Bed, Bath, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { propertyApi, PropertySummaryDTO } from '@/lib/api/propertyApi';

export function FeaturedProperties() {
  const [properties, setProperties] = useState<PropertySummaryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [title, setTitle] = useState('Featured Properties');

  const fetchProperties = async () => {
    setIsLoading(true);
    setError(false);
    try {
      // 1. Try to get Featured properties first
      let data = await propertyApi.getFeaturedProperties();
      
      // 2. If no featured properties, fall back to "Latest" properties
      if (!data || data.length === 0) {
        setTitle('Latest Properties');
        const response = await propertyApi.searchProperties({ 
          size: 4, 
          sort: 'createdAt,desc' 
        });
        data = response.content;
      } else {
        setTitle('Featured Properties');
      }

      setProperties(data.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <section className="py-24 container px-4 md:px-6 mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
          <p className="text-xl text-muted-foreground">Hand-picked premium listings just for you.</p>
        </div>
        <Button asChild size="lg" className="hidden md:flex">
          <Link to="/properties">
            View All Properties <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : error || properties.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed hover:border-primary/50 transition-colors">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {error ? 'Unable to load properties' : 'No featured properties found'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {error ? 'There was a problem connecting to our servers.' : 'Check back later for new premium listings.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={fetchProperties} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button asChild>
              <Link to="/properties">Browse All Listings</Link>
            </Button>
          </div>
        </div>
      ) : (
        // ... grid code ...
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Link key={property.id} to={`/properties/${property.id}`} className="group">
              <Card className="h-full overflow-hidden border-border/50 bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img 
                    src={property.coverImageUrl || '/placeholder.svg'} 
                    alt={property.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {property.isNew && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-none shadow-lg">
                      New Arrival
                    </Badge>
                  )}
                  
                  <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Button size="sm" className="w-full bg-white/90 text-black hover:bg-white text-xs font-semibold backdrop-blur-sm">
                      View Details
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {property.address}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-primary">
                        ${property.rentAmount.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground font-medium">
                      <div className="flex items-center gap-1">
                        <Bed className="h-3.5 w-3.5" />
                        {property.bedrooms}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-3.5 w-3.5" />
                        {property.bathrooms}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 md:hidden text-center">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/properties">
            View All Properties <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
