import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { getUser, signOut } from "@/lib/auth";
import { Bell, Briefcase, GraduationCap, FileCheck, User as UserIcon, Puzzle } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, []);

  if (!user) return null;

  const firstName = useMemo(() => {
    const local = user.email?.split("@")[0] || "there";
    const pretty = local
      .replace(/[._-]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
    return pretty || "there";
  }, [user.email]);

  // Mocked dashboard data (replace with real data when backend is ready)
  const unread = 3;
  const profileCompletion = 40;
  const subscription: "Freemium" | "Premium" = "Freemium";

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Dashboard | Afrimigrate</title>
        <meta name="description" content="Your Afrimigrate dashboard with quick actions, progress, and subscription status." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + "/dashboard" : "/dashboard"} />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-6 md:py-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl mb-1">Welcome, {firstName}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" aria-label={`Subscription: ${subscription}`}>{subscription}</Badge>
                <span className="text-sm text-muted-foreground">Profile {profileCompletion}% complete</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button aria-label={`Notifications: ${unread} unread`} className="relative rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring">
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] leading-5 text-center px-1">
                    {unread}
                  </span>
                )}
              </button>
              <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/", { replace: true }); }}>
                Sign Out
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <Progress value={profileCompletion} aria-label="Profile completion" />
          </div>

          {/* Quick Actions */}
          <section className="mt-8" aria-labelledby="quick-actions">
            <h2 id="quick-actions" className="sr-only">Quick actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Link to="/jobs" className="group">
                <Card className="h-full transition-colors hover:bg-muted">
                  <CardHeader className="py-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-accent" />
                      <CardTitle className="text-base">Job Search</CardTitle>
                    </div>
                    <CardDescription className="text-xs">Find roles globally</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/skills" className="group">
                <Card className="h-full transition-colors hover:bg-muted">
                  <CardHeader className="py-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-accent" />
                      <CardTitle className="text-base">Skills Training</CardTitle>
                    </div>
                    <CardDescription className="text-xs">Upskill fast</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/visa" className="group">
                <Card className="h-full transition-colors hover:bg-muted">
                  <CardHeader className="py-4">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-accent" />
                      <CardTitle className="text-base">Visa Processing</CardTitle>
                    </div>
                    <CardDescription className="text-xs">Guides & checks</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/profile" className="group">
                <Card className="h-full transition-colors hover:bg-muted">
                  <CardHeader className="py-4">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5 text-accent" />
                      <CardTitle className="text-base">Profile</CardTitle>
                    </div>
                    <CardDescription className="text-xs">Edit details</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/addons" className="group">
                <Card className="h-full transition-colors hover:bg-muted">
                  <CardHeader className="py-4">
                    <div className="flex items-center gap-2">
                      <Puzzle className="h-5 w-5 text-accent" />
                      <CardTitle className="text-base">Addon Services</CardTitle>
                    </div>
                    <CardDescription className="text-xs">Extras & support</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </section>

          {/* Upgrade CTA */}
          <section className="mt-10">
            <Card className="card-elevated">
              <CardContent className="py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Unlock more with Premium</CardTitle>
                  <CardDescription>Get reviews, priority support, and advanced guidance.</CardDescription>
                </div>
                <Button asChild variant="brand" size="lg" className="self-stretch md:self-auto">
                  <Link to="/#pricing" aria-label="Upgrade to Premium">Upgrade</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
