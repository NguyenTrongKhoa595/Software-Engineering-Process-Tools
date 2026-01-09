import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Hero() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('any');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (propertyType && propertyType !== 'any') params.append('type', propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[800px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-20">
        <img 
          src="public\home_page_cover.jpg" 
          alt="Modern Home" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>
      
      <div className="container px-4 md:px-6 mx-auto relative">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
          
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
            ✨ The #1 Platform for Modern Renting
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Find a place you'll love to <span className="text-primary">call home</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl text-balance">
            Discover thousands of verified properties with our transparent, secure, and easy-to-use rental platform.
          </p>

          {/* Search Interface */}
          <div className="w-full max-w-3xl mt-8">
            <div className="bg-background/60 backdrop-blur-xl border shadow-2xl rounded-2xl p-2 md:p-3">
              <Tabs defaultValue="rent" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4 h-12 bg-muted/50 p-1">
                  <TabsTrigger value="rent" className="rounded-lg text-base">Rent</TabsTrigger>
                  <TabsTrigger value="buy" className="rounded-lg text-base">Buy</TabsTrigger>
                  <TabsTrigger value="sold" className="rounded-lg text-base">Sold</TabsTrigger>
                </TabsList>
                
                <TabsContent value="rent" className="mt-0">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1 group">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="City, neighborhood, or address" 
                        className="pl-10 h-14 text-base bg-background border-transparent ring-1 ring-border hover:ring-primary/20 focus-visible:ring-primary transitional-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                    
                    <div className="w-full md:w-[200px]">
                      <Select value={propertyType} onValueChange={setPropertyType}>
                        <SelectTrigger className="h-14 text-base border-transparent ring-1 ring-border hover:ring-primary/20 focus:ring-primary bg-background">
                          <div className="flex items-center">
                            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Property Type" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Type</SelectItem>
                          <SelectItem value="APARTMENT">Apartment</SelectItem>
                          <SelectItem value="HOUSE">House</SelectItem>
                          <SelectItem value="STUDIO">Studio</SelectItem>
                          <SelectItem value="CONDO">Condo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button size="lg" className="h-14 px-8 text-base shadow-lg shadow-primary/20" onClick={handleSearch}>
                      <Search className="mr-2 h-5 w-5" />
                      Search
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="buy">
                  <div className="h-[56px] flex items-center justify-center text-muted-foreground bg-muted/10 rounded-lg border border-dashed text-sm">
                    Buying features coming soon!
                  </div>
                </TabsContent>
                
                <TabsContent value="sold">
                  <div className="h-[56px] flex items-center justify-center text-muted-foreground bg-muted/10 rounded-lg border border-dashed text-sm">
                    Sold history coming soon!
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <span className="hidden md:inline">Popular:</span>
              <button onClick={() => navigate('/properties?city=New York')} className="hover:text-primary transition-colors">New York</button>
              <button onClick={() => navigate('/properties?city=Los Angeles')} className="hover:text-primary transition-colors">Los Angeles</button>
              <button onClick={() => navigate('/properties?city=Chicago')} className="hover:text-primary transition-colors">Chicago</button>
              <button onClick={() => navigate('/properties?city=Houston')} className="hover:text-primary transition-colors">Houston</button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
