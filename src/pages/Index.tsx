import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import hero from "@/assets/hero-afrimigrate.jpg";
import { Link } from "react-router-dom";
import { UserPlus, ClipboardCheck, Plane } from "lucide-react";
import { MobileCard } from "@/components/ui/mobile-card";

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

        {/* Pricing: 3 tiers */}
        <section id="pricing" className="bg-muted/20 border-t border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl">Simple pricing</h2>
              <p className="text-muted-foreground">Start free. Upgrade when you’re ready.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Freemium */}
              <Card className="animate-enter">
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
                </CardContent>
              </Card>

              {/* Pro */}
              <Card className="animate-enter">
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
                </CardContent>
              </Card>

              {/* Premium */}
              <Card className="border-accent animate-enter">
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
