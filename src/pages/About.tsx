import { Link } from 'react-router-dom';
import { Users, Building, Award, Heart, Target, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const stats = [
  { value: '2024', label: 'Founded' },
  { value: '5', label: 'Co-Founders' },
  { value: 'RMIT', label: 'University' },
  { value: 'HCM', label: 'Based In' },
];

const values = [
  { icon: Heart, title: 'Passion Driven', description: 'Built by students, for students and young professionals.' },
  { icon: Users, title: 'Student Community', description: 'Understanding the real struggles of finding accommodation near campus.' },
  { icon: Award, title: 'Academic Excellence', description: 'Applying top-tier software engineering practices to real-world problems.' },
  { icon: Target, title: 'User Focus', description: 'Designed with the specific needs of the Vietnamese rental market in mind.' },
];

const team = [
  { name: 'Minh Tran', role: 'Co-Founder & Lead Developer', avatar: 'https://tse3.mm.bing.net/th/id/OIP.p9dffYnc0B_kLWOES8V7kAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
  { name: 'Khai Nguyen', role: 'Co-Founder & UI/UX Designer', avatar: 'https://cdn2.tuoitre.vn/thumb_w/480/ttc/r/2022/05/07/ngoc-son-doctor-strange-vietnam-1651900986.jpeg' },
  { name: 'Quan Ngo', role: 'Co-Founder & Backend Engineer', avatar: 'https://wallpaperaccess.com/full/11719444.jpg' },
  { name: 'Khoa Nguyen', role: 'Co-Founder & Frontend Engineer', avatar: 'https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg' },
  { name: 'Khoi Duong', role: 'Co-Founder & Product Manager', avatar: 'https://wallpapercave.com/wp/wp11156474.jpg' },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom text-center">
            <h1 className="text-display-md font-bold text-foreground mb-6">About RentMate</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A student-led initiative from RMIT University to revolutionize the rental experience in Vietnam.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-b border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-display-sm font-bold text-foreground mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    RentMate wasn't started in a boardroom; it began in a classroom at RMIT University Vietnam. As students, we personally experienced the chaotic and often untrustworthy process of finding rental accommodation in Ho Chi Minh City.
                  </p>
                  <p>
                    From fake listings to unresponsive agents, the struggle was real. We realized that if we were facing these issues, thousands of other students and young professionals were too. That's when we decided to combine our passion for technology with our desire to solve a real community problem.
                  </p>
                  <p>
                    We are a team of 5 passionate students—Minh, Khai, Quan, Khoa, and Khoi—who came together to build a platform based on trust, transparency, and ease of use. RentMate is our answer to the question: "Why is renting still so hard?"
                  </p>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600" 
                  alt="RMIT Team collaboration"
                  className="rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Our Mission</h3>
                </div>
                <p className="text-muted-foreground">
                  To provide a safe, verified, and transparent rental marketplace for the student community and young professionals in Vietnam.
                </p>
              </Card>
              <Card className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-accent/10 text-accent">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Our Vision</h3>
                </div>
                <p className="text-muted-foreground">
                  To be the go-to housing platform for every university student in Vietnam, setting a new standard for quality and trust in the rental market.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-display-sm font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Driven by youthful energy and professional standards.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 card-hover">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                    <value.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-display-sm font-bold text-foreground mb-4">Meet The Team</h2>
              <p className="text-muted-foreground">The RMIT students behind the screen</p>
            </div>
            <div className="grid justify-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="overflow-hidden card-hover">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-foreground text-sm">{member.name}</h3>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="text-display-sm font-bold mb-4">Join Our Journey</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Whether you're looking for your next home or want to list your property, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/properties">Browse Properties <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
