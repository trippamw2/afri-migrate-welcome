import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function PricingPremium() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Afrimigrate Premium Plan",
    description: "Premium plan with 1:1 mentorship, application reviews, and priority support.",
    offers: {
      "@type": "Offer",
      price: "29",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Premium Plan | Afrimigrate Pricing</title>
        <meta name="description" content="Afrimigrate Premium plan featuring 1:1 mentorship, application reviews, and priority support." />
        <link rel="canonical" href={`${window.location.origin}/pricing/premium`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-10">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-display">Premium Plan</h1>
            <p className="text-muted-foreground mt-2">Get the fastest path with expert 1:1 support.</p>
          </header>

          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>What you get</CardTitle>
                <CardDescription>Complete support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[
                  "Everything in Pro",
                  "1:1 mentorship",
                  "Application reviews",
                  "Priority support",
                ].map((it) => (
                  <div key={it} className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" /> {it}</div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscribe</CardTitle>
                <CardDescription>Cancel anytime</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-2xl font-semibold">$29<span className="text-sm text-muted-foreground">/mo</span></p>
                <Button asChild variant="brand" size="lg"><Link to="/signup">Subscribe to Premium</Link></Button>
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
