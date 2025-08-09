import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import hero from "@/assets/hero-afrimigrate.jpg";
import { Link } from "react-router-dom";
import { UserPlus, ClipboardCheck, Plane, CheckCircle, Target, ShieldCheck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Afrimigrate — Helping African Professionals Migrate</title>
        <meta name="description" content="Afrimigrate guides skilled African professionals to migrate with confidence using a clear 3‑step plan, expert guidance, and community support." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + "/" : "/"} />
      </Helmet>
      <Navbar />
      <main>
        {/* StoryBrand: Hero (Character + Problem + Clear CTA) */}
        <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-4 py-12 md:py-20">
          <div className="space-y-6 animate-enter">
            <h1 className="font-display text-4xl md:text-5xl leading-tight">
              Land Global Opportunities with a Clear Plan and a Trusted Guide
            </h1>
            <p className="text-lg text-muted-foreground">
              You’re a skilled African professional ready for the next step. The process is confusing and high‑stakes. Afrimigrate gives you clarity, support, and momentum so you don’t go it alone.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg" className="hover-scale" aria-label="Get started for free">
                <Link to="/signup">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" aria-label="Log in">
                <Link to="/login">Log In</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">No credit card required. Upgrade anytime.</p>
          </div>
          <div className="relative">
            <img src={hero} alt="Afrimigrate hero showing diverse African professionals and global connections" loading="lazy" className="w-full h-auto rounded-lg border shadow-md" />
          </div>
        </section>

        {/* StoryBrand: The Problem (external/internal/philosophical) */}
        <section id="about" className="border-t">
          <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="font-display text-3xl">The Challenge</h2>
              <p className="text-muted-foreground">Migration requires strategy, evidence, and timing. Many talented professionals stall because they lack a proven plan and expert feedback.</p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><Target className="h-5 w-5 text-accent mt-0.5" /><span>Unclear visa and job requirements across countries.</span></li>
                <li className="flex items-start gap-3"><ShieldCheck className="h-5 w-5 text-accent mt-0.5" /><span>Risk of avoidable rejections due to weak documentation.</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-accent mt-0.5" /><span>No trusted guide to review, refine, and accelerate.</span></li>
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 text-center hover-scale">
                <p className="font-display text-2xl">10k+</p>
                <p className="text-xs text-muted-foreground">Community Members</p>
              </div>
              <div className="rounded-lg border p-4 text-center hover-scale">
                <p className="font-display text-2xl">500+</p>
                <p className="text-xs text-muted-foreground">Job Offers Secured</p>
              </div>
              <div className="rounded-lg border p-4 text-center hover-scale">
                <p className="font-display text-2xl">4.9/5</p>
                <p className="text-xs text-muted-foreground">Member Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* StoryBrand: The Plan (3 steps) */}
        <section aria-labelledby="plan-heading" className="">
          <div className="container mx-auto px-4 py-12">
            <h2 id="plan-heading" className="font-display text-3xl text-center mb-2">Your 3‑Step Plan</h2>
            <p className="text-center text-muted-foreground mb-8">We’ll guide you each step so you move with confidence and speed.</p>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="animate-enter">
                <CardHeader>
                  <div className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-accent" /><CardTitle>Create your account</CardTitle></div>
                  <CardDescription>Tell us about your goals and background.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Country & role targeting</li>
                    <li>Checklist & docs starter</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="animate-enter">
                <CardHeader>
                  <div className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-accent" /><CardTitle>Follow your checklist</CardTitle></div>
                  <CardDescription>Build strong evidence with templates and feedback.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Tailored document guidance</li>
                    <li>Expert reviews (Premium)</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="animate-enter">
                <CardHeader>
                  <div className="flex items-center gap-2"><Plane className="h-5 w-5 text-accent" /><CardTitle>Apply and win</CardTitle></div>
                  <CardDescription>Submit with confidence and prepare for interviews.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Visa/job submission support</li>
                    <li>Interview prep & strategy</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="brand" size="lg"><Link to="/signup">Start Free Today</Link></Button>
            </div>
          </div>
        </section>

        {/* StoryBrand: Pricing (3 tiers + CTA) */}
        <section id="pricing" className="bg-muted/20 border-t border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl">Choose Your Plan</h2>
              <p className="text-muted-foreground">Start with Freemium. Upgrade to unlock reviews, mentorship, and priority support.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Freemium */}
              <Card className="animate-enter">
                <CardHeader>
                  <CardTitle>Freemium</CardTitle>
                  <CardDescription>Essential tools to begin your journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-display text-2xl">Free</p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Visa & job guides</li>
                    <li>Community access</li>
                    <li>Checklists & templates</li>
                  </ul>
                  <div className="flex items-center gap-3 pt-2">
                    <Button asChild variant="outline" aria-label="Sign up free"><Link to="/signup">Sign up free</Link></Button>
                    <a href="#pricing" className="story-link text-sm">See inclusions</a>
                  </div>
                </CardContent>
              </Card>

              {/* Pro */}
              <Card className="animate-enter">
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>Accountability and advanced strategies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-display text-2xl">$9<span className="text-sm text-muted-foreground">/mo</span></p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Everything in Freemium</li>
                    <li>Advanced search tactics</li>
                    <li>Weekly group Q&A</li>
                  </ul>
                  <div className="flex items-center gap-3 pt-2">
                    <Button asChild variant="brand" aria-label="Subscribe to Pro"><Link to="/signup">Subscribe</Link></Button>
                    <a href="#pricing" className="story-link text-sm">See inclusions</a>
                  </div>
                </CardContent>
              </Card>

              {/* Premium */}
              <Card className="border-accent animate-enter">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">Premium <span className="text-xs rounded bg-accent text-accent-foreground px-2 py-0.5">Popular</span></CardTitle>
                  <CardDescription>Tailored 1:1 support and application reviews</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-display text-2xl">$29<span className="text-sm text-muted-foreground">/mo</span></p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Everything in Pro</li>
                    <li>1:1 mentorship & reviews</li>
                    <li>Priority support & office hours</li>
                  </ul>
                  <div className="flex items-center gap-3 pt-2">
                    <Button asChild variant="brand" aria-label="Subscribe to Premium"><Link to="/signup">Subscribe</Link></Button>
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
