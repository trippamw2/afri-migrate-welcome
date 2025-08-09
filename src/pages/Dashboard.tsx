import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getUser, signOut } from "@/lib/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Dashboard | Afrimigrate</title>
        <meta name="description" content="Your Afrimigrate dashboard." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + "/dashboard" : "/dashboard"} />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-10">
          <h1 className="font-display text-3xl mb-2">Welcome, {user.email}</h1>
          <p className="text-muted-foreground mb-6">This is your dashboard. We'll add personalized guidance and progress tracking here.</p>
          <Button variant="brand" onClick={() => { signOut(); navigate("/", { replace: true }); }}>Sign Out</Button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
