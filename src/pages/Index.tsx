import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import hero from "@/assets/hero-afrimigrate.jpg";
import imgCanada from "@/assets/destinations/canada.jpg";
import imgUK from "@/assets/destinations/uk.jpg";
import imgGermany from "@/assets/destinations/germany.jpg";
import imgAustralia from "@/assets/destinations/australia.jpg";
import imgUAE from "@/assets/destinations/uae.jpg";
import imgNetherlands from "@/assets/destinations/netherlands.jpg";
import { Link } from "react-router-dom";
import { UserPlus, ClipboardCheck, Plane, Shield, Zap, Users, Star, MapPin } from "lucide-react";
import { MobileCard } from "@/components/ui/mobile-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Afrimigrate — Migrate with Confidence</title>
        <meta name="description" content="Clear steps, expert guidance, and community for African professionals to migrate and thrive." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + "/" : "/"} />
      </Helmet>
      <Navbar />
      <main>
        {/* Hero: clear promise + primary CTA */}
        <section className="hero-bg border-b">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-4 py-12 md:py-20">
            <div className="space-y-6 animate-enter">
              <h1 className="font-display text-4xl md:text-5xl leading-tight">
                Migrate with confidence.
              </h1>
              <p className="text-lg text-muted-foreground">
                A simple plan, expert support, and tools built for African professionals.
              </p>
              <MobileCard className="flex flex-wrap gap-3">
                <Button asChild variant="hero" size="lg" className="hover-scale" aria-label="Get started for free">
                  <Link to="/signup">Get Started Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" aria-label="Log in">
                  <Link to="/login">Log In</Link>
                </Button>
              </MobileCard>
            </div>
            <div className="relative">
              <img src={hero} alt="Professionals with global connections" loading="lazy" className="w-full h-auto rounded-lg border shadow-md" />
            </div>
          </div>
        </section>

        {/* 3‑Step Plan */}
        <section aria-labelledby="plan-heading">
          <div className="container mx-auto px-4 py-12">
            <h2 id="plan-heading" className="font-display text-3xl text-center mb-2">Your 3‑step plan</h2>
            <p className="text-center text-muted-foreground mb-8">Clarity. Action. Results.</p>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="card-elevated animate-enter">
                <CardHeader>
                  <div className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-accent" /><CardTitle>Join</CardTitle></div>
                  <CardDescription>Tell us your goals.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Country & role focus</li>
                    <li>Instant checklist</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="card-elevated animate-enter">
                <CardHeader>
                  <div className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-accent" /><CardTitle>Build</CardTitle></div>
                  <CardDescription>Complete your evidence.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Templates that work</li>
                    <li>Reviews on Premium</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="card-elevated animate-enter">
                <CardHeader>
                  <div className="flex items-center gap-2"><Plane className="h-5 w-5 text-accent" /><CardTitle>Apply</CardTitle></div>
                  <CardDescription>Submit and prepare.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Visa & job guidance</li>
                    <li>Interview prep</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="brand" size="lg"><Link to="/signup">Start Free</Link></Button>
            </div>
          </div>
        </section>

        {/* Why choose Afrimigrate */}
        <section aria-labelledby="why-afrimigrate" className="border-t">
          <div className="container mx-auto px-4 py-12">
            <h2 id="why-afrimigrate" className="font-display text-3xl text-center mb-2">Why choose Afrimigrate</h2>
            <p className="text-center text-muted-foreground mb-8">Three reasons thousands trust us.</p>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="animate-enter">
                <CardHeader>
                  <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-accent" /><CardTitle>Trusted network</CardTitle></div>
                  <CardDescription>Verified partners and up‑to‑date guidance.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="animate-enter">
                <CardHeader>
                  <div className="flex items-center gap-2"><Users className="h-5 w-5 text-accent" /><CardTitle>Expert support</CardTitle></div>
                  <CardDescription>Advice that shortens your path.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="animate-enter">
                <CardHeader>
                  <div className="flex items-center gap-2"><Zap className="h-5 w-5 text-accent" /><CardTitle>Faster progress</CardTitle></div>
                  <CardDescription>Smart checklists and templates that work.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section aria-labelledby="testimonials" className="border-t">
          <div className="container mx-auto px-4 py-12">
            <h2 id="testimonials" className="font-display text-3xl text-center mb-2">What members say</h2>
            <p className="text-center text-muted-foreground mb-8">Real stories from African professionals.</p>
            <div className="relative">
              <Carousel className="mx-auto max-w-5xl">
                <CarouselContent>
                  {[
                    { name: "Aisha", role: "Nurse • Ghana → UK", rating: 5, text: "Afrimigrate’s checklist kept me on track and the community gave me courage." },
                    { name: "Samuel", role: "Software • Nigeria → Canada", rating: 5, text: "The visa wizard clarified my docs. Offer in 6 weeks, permit in 5!" },
                    { name: "Lerato", role: "Engineer • SA → Australia", rating: 4, text: "Templates + guidance saved me weeks. Clear next steps throughout." },
                    { name: "Yusuf", role: "Finance • Kenya → UAE", rating: 4, text: "Loved the support and real examples from members who’ve done it." },
                    { name: "Fatou", role: "Research • Senegal → Germany", rating: 5, text: "Great tips for language tests and academic visas." },
                  ].map((t) => (
                    <CarouselItem key={t.name} className="md:basis-1/2 lg:basis-1/3">
                      <Card className="h-full">
                        <CardHeader className="flex flex-row items-center gap-3">
                          <img src="/placeholder.svg" alt={`Photo of ${t.name}`} className="h-10 w-10 rounded-full border" loading="lazy" />
                          <div>
                            <CardTitle className="text-base">{t.name}</CardTitle>
                            <CardDescription>{t.role}</CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'text-accent' : 'text-muted-foreground/40'}`} />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">“{t.text}”</p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-background/90 backdrop-blur z-10" />
                <CarouselNext className="bg-background/90 backdrop-blur z-10" />
              </Carousel>
            </div>
          </div>
        </section>

        {/* Popular destinations */}
        <section aria-labelledby="destinations" className="border-t">
          <div className="container mx-auto px-4 py-12">
            <h2 id="destinations" className="font-display text-3xl text-center mb-2">Popular work destinations</h2>
            <p className="text-center text-muted-foreground mb-8">High-demand markets and visa pathways.</p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { flag: "🇨🇦", name: "Canada", visa: "Express Entry, Work Permits", jobs: "Tech, Healthcare, Skilled Trades", img: imgCanada },
                { flag: "🇬🇧", name: "United Kingdom", visa: "Skilled Worker, Global Talent", jobs: "NHS, Tech, Finance", img: imgUK },
                { flag: "🇩🇪", name: "Germany", visa: "EU Blue Card", jobs: "Engineering, Tech, Research", img: imgGermany },
                { flag: "🇦🇺", name: "Australia", visa: "Skilled Independent/State Nomination", jobs: "Healthcare, Engineering", img: imgAustralia },
                { flag: "🇦🇪", name: "UAE", visa: "Work Visa, Golden Visa", jobs: "Finance, Hospitality, Tech", img: imgUAE },
                { flag: "🇳🇱", name: "Netherlands", visa: "Highly Skilled Migrant", jobs: "Tech, Design, Research", img: imgNetherlands },
              ].map((d) => (
                <Card key={d.name} className="animate-enter overflow-hidden">
                  <img src={d.img} alt={`${d.name} skyline and landmarks`} loading="lazy" className="w-full h-36 md:h-40 object-cover" />
                  <CardHeader className="pt-4">
                    <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-accent" /><CardTitle>{d.flag} {d.name}</CardTitle></div>
                    <CardDescription>
                      <span className="block">Visas: {d.visa}</span>
                      <span className="block">Jobs: {d.jobs}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" size="sm"><Link className="story-link" to="/visa" aria-label={`Explore ${d.name} visa options`}>Explore visas</Link></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing: 3 tiers */}
        <section id="pricing" className="bg-muted/20 border-t border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl">Simple pricing</h2>
              <p className="text-muted-foreground">Start free. Upgrade when you’re ready.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Freemium */}
              <Card id="pricing-freemium" className="animate-enter">
                <CardHeader>
                  <CardTitle>Freemium</CardTitle>
                  <CardDescription>Core tools to begin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-display text-2xl">Free</p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Guides & checklists</li>
                    <li>Community</li>
                    <li>Templates</li>
                  </ul>
                  <Button asChild variant="outline" aria-label="Sign up free"><Link to="/signup">Sign up</Link></Button>
                  <Button asChild variant="ghost" aria-label="Learn more about Freemium"><Link to="/pricing/freemium">Learn more</Link></Button>
                </CardContent>
              </Card>

              {/* Pro */}
              <Card id="pricing-pro" className="animate-enter">
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>More support</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-display text-2xl">$9<span className="text-sm text-muted-foreground">/mo</span></p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Everything in Free</li>
                    <li>Advanced strategies</li>
                    <li>Group Q&A</li>
                  </ul>
                  <Button asChild variant="brand" aria-label="Subscribe to Pro"><Link to="/signup">Subscribe</Link></Button>
                  <Button asChild variant="ghost" aria-label="Learn more about Pro"><Link to="/pricing/pro">Learn more</Link></Button>
                </CardContent>
              </Card>

              {/* Premium */}
              <Card id="pricing-premium" className="border-accent animate-enter">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">Premium <span className="text-xs rounded bg-accent text-accent-foreground px-2 py-0.5">Popular</span></CardTitle>
                  <CardDescription>1:1 mentorship</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-display text-2xl">$29<span className="text-sm text-muted-foreground">/mo</span></p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Everything in Pro</li>
                    <li>Application reviews</li>
                    <li>Priority support</li>
                  </ul>
                  <Button asChild variant="brand" aria-label="Subscribe to Premium"><Link to="/signup">Subscribe</Link></Button>
                  <Button asChild variant="ghost" aria-label="Learn more about Premium"><Link to="/pricing/premium">Learn more</Link></Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
