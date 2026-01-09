import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Tenant',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    content: "Found my dream apartment in just 2 weeks! The filters made it super easy.",
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Landlord',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    content: "RentMate transformed how I manage properties. It's efficient and reliable.",
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Tenant',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    content: "The verification process gave me peace of mind. Highly recommended!",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Loved by Thousands</h2>
          <p className="text-xl text-muted-foreground">
            Don't just take our word for it. Here's what our community has to say.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="border-none shadow-none bg-transparent">
              <CardContent className="p-0 relative">
                <div className="absolute -top-4 -left-4 text-primary/10">
                  <Quote className="w-12 h-12 rotate-180" />
                </div>
                
                <div className="bg-background rounded-2xl p-8 shadow-sm border relative z-10 h-full flex flex-col justify-between">
                  <div className="mb-6">
                    <div className="flex gap-1 text-yellow-500 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-lg font-medium leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
