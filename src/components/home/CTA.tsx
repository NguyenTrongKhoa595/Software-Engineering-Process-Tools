import { Link } from 'react-router-dom';
import { Search, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-20 md:px-20 text-center text-primary-foreground shadow-2xl">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Ready to find your next home?
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of happy renters. Whether you're looking to rent, buy, or list your property, we've got you covered.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-base shadow-lg hover:shadow-xl transition-all" asChild>
                <Link to="/properties">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Properties
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/auth?mode=signup&role=landlord">
                  <Building className="mr-2 h-5 w-5" />
                  List Your Property
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
