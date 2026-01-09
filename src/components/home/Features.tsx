import { Shield, Clock, Users, Key, Sparkles, Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Shield,
    title: 'Verified Listings',
    description: 'Every property is manually verified for authenticity.',
    className: "md:col-span-2 md:row-span-2",
  },
  {
    icon: Clock,
    title: 'Instant Response',
    description: 'Connect with landlords in real-time.',
    className: "md:col-span-1",
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join 50k+ happy renters.',
    className: "md:col-span-1",
  },
  {
    icon: Key,
    title: 'Secure Payments',
    description: 'Bank-level encryption for all transactions.',
    className: "md:col-span-2",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Why Choose RentMate?</h2>
          <p className="text-xl text-muted-foreground">
            We're redefining the rental experience with safety, speed, and transparency at the core.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-[200px]">
          {features.map((feature, i) => (
            <Card 
              key={i} 
              className={cn(
                "group relative overflow-hidden p-6 hover:shadow-xl transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-sm",
                feature.className
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
