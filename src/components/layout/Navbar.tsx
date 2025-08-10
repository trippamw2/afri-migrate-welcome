import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-md">
          <div aria-hidden className="h-8 w-8 rounded-md bg-accent" />
          <span className="font-display text-xl">Afrimigrate</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/jobs" className="text-sm hover:text-foreground/80">Jobs</NavLink>
          <NavLink to="/skills" className="text-sm hover:text-foreground/80">Skills</NavLink>
          <NavLink to="/visa" className="text-sm hover:text-foreground/80">Visa</NavLink>
          <NavLink to="/#pricing" className="text-sm hover:text-foreground/80">Pricing</NavLink>
          <NavLink to="/#contact" className="text-sm hover:text-foreground/80">Contact</NavLink>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild variant="brand">
            <Link to="/signup">Sign Up</Link>
          </Button>
          <button className="md:hidden ml-2 p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </header>
  );
}
