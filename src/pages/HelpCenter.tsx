import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import HelpAssistant from "@/components/help/HelpAssistant";

export default function HelpCenter() {
  const faqs = [
    { q: "How do I start my migration journey?", a: "Create a free account, choose your target country, and follow the 3‑step plan on the Home page." },
    { q: "Where can I find visa requirements?", a: "Open the Visa page, pick a destination, and review visa types, documents, and processing timelines." },
    { q: "How do I upgrade to Premium?", a: "Visit the Pricing section and select a plan to unlock mentorship, reviews, and priority support." },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Help Center | Afrimigrate</title>
        <meta name="description" content="Afrimigrate Help Center with FAQs, quick links, and resources for visas, jobs, and profile." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + "/support" : "/support"} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-8 md:py-10">
          <header className="mb-6 text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-display">Help Center</h1>
            <p className="text-muted-foreground mt-2">Find answers fast and jump to the right tools.</p>
          </header>

          <div className="mx-auto max-w-xl mb-8">
            <div className="flex gap-2">
              <Input placeholder="Search help articles… (e.g., Skilled Worker, IELTS)" aria-label="Search help center" />
              <Button variant="brand">Search</Button>
            </div>
          </div>

          <Tabs defaultValue="guides" className="w-full">
            <TabsList className="flex-wrap">
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="faq">FAQs</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="guides" className="mt-6 grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Visa Processing</CardTitle>
                  <CardDescription>Requirements, wizard, and tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline"><Link to="/visa">Open Visa</Link></Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Search</CardTitle>
                  <CardDescription>Visa‑friendly filters and tips</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline"><Link to="/jobs">Open Jobs</Link></Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile & Documents</CardTitle>
                  <CardDescription>Keep details and CV up to date</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline"><Link to="/profile">Open Profile</Link></Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Addon Services</CardTitle>
                  <CardDescription>Consultations, letters, training</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline"><Link to="/addons">Open Addons</Link></Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Plans</CardTitle>
                  <CardDescription>Compare tiers and benefits</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button asChild variant="outline"><Link to="/pricing">View Pricing</Link></Button>
                  <Button asChild variant="brand"><Link to="/signup">Get Started</Link></Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="mt-6 grid gap-4 md:grid-cols-2">
              {faqs.map((f) => (
                <Card key={f.q}>
                  <CardHeader>
                    <CardTitle className="text-lg">{f.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{f.a}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="resources" className="mt-6 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Official Links</CardTitle>
                  <CardDescription>Trusted government portals</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>• IRCC (Canada)</p>
                  <p>• UKVI (United Kingdom)</p>
                  <p>• USCIS (United States)</p>
                  <p>• BAMF (Germany)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need more help?</CardTitle>
                  <CardDescription>Priority support on Premium</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">For 1:1 guidance, upgrade and use Premium Support in Addons.</p>
                  <div className="flex gap-2">
                    <Button asChild variant="outline"><Link to="/addons">Open Premium Support</Link></Button>
                    <Button asChild variant="brand"><Link to="/#pricing">Upgrade</Link></Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
        <HelpAssistant faqs={faqs} />
      </main>
      <Footer />
    </div>
  );
}
