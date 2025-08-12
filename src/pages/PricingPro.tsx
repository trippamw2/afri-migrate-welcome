import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function PricingPro() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Afrimigrate Pro Plan",
    description: "Pro plan with advanced strategies and group Q&A for faster progress.",
    offers: {
      "@type": "Offer",
      price: "9",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Pro Plan | Afrimigrate Pricing</title>
        <meta name="description" content="Afrimigrate Pro plan with advanced strategies, templates, and group Q&A for professionals." />
        <link rel="canonical" href={`${window.location.origin}/pricing/pro`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-10">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-display">Pro Plan</h1>
            <p className="text-muted-foreground mt-2">More support for real momentum.</p>
          </header>

          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>What you get</CardTitle>
                <CardDescription>Level up your process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[
                  "Everything in Free",
                  "Advanced strategies",
                  "Group Q&A sessions",
                ].map((it) => (
                  <div key={it} className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" /> {it}</div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscribe</CardTitle>
                <CardDescription>Flexible monthly billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-2xl font-semibold">$9<span className="text-sm text-muted-foreground">/mo</span></p>
                <Button asChild variant="brand" size="lg"><Link to="/signup">Subscribe to Pro</Link></Button>
                <Button asChild variant="outline"><Link to="/pricing">Back to pricing</Link></Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
