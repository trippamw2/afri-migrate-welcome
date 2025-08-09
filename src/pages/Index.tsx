import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import hero from "@/assets/hero-afrimigrate.jpg";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Afrimigrate — Helping African Professionals Migrate</title>
        <meta name="description" content="Afrimigrate helps skilled African professionals migrate with confidence. Sign up free or upgrade to premium for tailored support." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + "/" : "/"} />
      </Helmet>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-4 py-12 md:py-20">
          <div className="space-y-6 animate-enter">
            <h1 className="font-display text-4xl md:text-5xl leading-tight">
              Empowering African Professionals to Migrate and Thrive
            </h1>
            <p className="text-lg text-muted-foreground">
              Afrimigrate provides step-by-step guidance, resources, and community support to help you land global opportunities.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg" className="hover-scale">
                <Link to="/signup">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Log In</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">No credit card required.</p>
          </div>
          <div className="relative">
            <img src={hero} alt="Afrimigrate hero showing diverse African professionals and global connections" loading="lazy" className="w-full h-auto rounded-lg border shadow-md" />
          </div>
        </section>

        {/* Plans */}
        <section id="pricing" className="bg-muted/20 border-t border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl">Choose Your Plan</h2>
              <p className="text-muted-foreground">Start on Freemium and upgrade anytime for personalized, premium support.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="animate-enter">
                <CardHeader>
                  <CardTitle>Freemium</CardTitle>
                  <CardDescription>Essential tools to begin your journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Guides on visas, jobs, and relocation basics</li>
                    <li>Community access</li>
                    <li>Checklists and templates</li>
                  </ul>
                  <div className="flex items-center gap-3 pt-2">
                    <Button asChild variant="outline"><Link to="/signup">Sign up free</Link></Button>
                    <a href="#pricing" className="story-link text-sm">See inclusions</a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent animate-enter">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">Premium <span className="text-xs rounded bg-accent text-accent-foreground px-2 py-0.5">Popular</span></CardTitle>
                  <CardDescription>Everything in Freemium, plus tailored support</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>1:1 mentorship and application reviews</li>
                    <li>Priority Q&A and office hours</li>
                    <li>Advanced job search strategies</li>
                  </ul>
                  <div className="flex items-center gap-3 pt-2">
                    <Button asChild variant="brand"><Link to="/signup">Subscribe</Link></Button>
                    <a href="#pricing" className="story-link text-sm">See inclusions</a>
                  </div>
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
