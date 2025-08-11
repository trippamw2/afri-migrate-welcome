import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Pricing() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Afrimigrate Premium",
    description: "Premium immigration support with AI wizard, tracking, and community.",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: "9.99",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Pricing | Afrimigrate</title>
        <meta name="description" content="Simple pricing for visa tracking, AI wizard, and community support." />
        <link rel="canonical" href={`${window.location.origin}/pricing`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-10">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-display">Pricing Plans</h1>
            <p className="text-muted-foreground mt-2">Choose a plan that fits your migration journey.</p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            <Card className="relative">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Get started with the essentials.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="text-sm space-y-2">
                  <li>• Visa requirements by country</li>
                  <li>• AI Visa Wizard (preview)</li>
                  <li>• Local application tracking</li>
                </ul>
                <div className="pt-2">
                  <Button asChild variant="outline"><a href="/signup">Start Free</a></Button>
                </div>
              </CardContent>
            </Card>

            <Card className="relative border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Premium</CardTitle>
                  <Badge>Best value</Badge>
                </div>
                <CardDescription>Unlock full power and priority support.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="text-sm space-y-2">
                  <li>• Smart checklists & document guidance</li>
                  <li>• Advanced AI assistance</li>
                  <li>• Sync tracking to cloud</li>
                  <li>• Exclusive community groups & webinars</li>
                </ul>
                <div className="pt-2 flex items-end gap-2">
                  <div className="text-3xl font-semibold">$9.99</div>
                  <div className="text-sm text-muted-foreground">/month</div>
                </div>
                <div className="pt-2">
                  <Button asChild variant="brand"><a href="/signup">Go Premium</a></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
