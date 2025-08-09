import { FormEvent, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "@/lib/auth";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock auth (replace with Supabase later)
      if (!email || !password) throw new Error("Please enter email and password");
      signIn(email);
      toast({ title: "Welcome back", description: "Logged in successfully" });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" as any });
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    // Mock Google OAuth (wire to Supabase later)
    try {
      signIn("user@gmail.com");
      toast({ title: "Welcome", description: "Signed in with Google" });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      toast({ title: "Google sign-in failed", description: err.message, variant: "destructive" as any });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Log In | Afrimigrate</title>
        <meta name="description" content="Log in to Afrimigrate to access your personalized migration dashboard." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + "/login" : "/login"} />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-10">
          <h1 className="sr-only">Log In</h1>
          <div className="mx-auto max-w-md rounded-lg border bg-card p-6 shadow-sm animate-enter">
            <div className="space-y-1 mb-6 text-center">
              <h2 className="font-display text-2xl">Welcome back</h2>
              <p className="text-sm text-muted-foreground">Use your email and password or continue with Google.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Logging in..." : "Log In"}</Button>
            </form>

            <div className="my-4 text-center text-sm text-muted-foreground">or</div>

            <Button type="button" variant="outline" className="w-full" onClick={onGoogle}>
              <span className="mr-2" aria-hidden>🔶</span> Continue with Google
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account? <Link to="/signup" className="underline underline-offset-4">Sign up</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
