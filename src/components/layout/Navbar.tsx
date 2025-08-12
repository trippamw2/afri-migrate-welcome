import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ArrowLeft, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="md:hidden p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-md">
            <div aria-hidden className="h-8 w-8 rounded-md bg-accent" />
            <span className="font-display text-xl">Afrimigrate</span>
          </Link>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/jobs" className="text-sm hover:text-foreground/80">Jobs</NavLink>
          <NavLink to="/profile" className="text-sm hover:text-foreground/80">Profile</NavLink>
          <NavLink to="/visa" className="text-sm hover:text-foreground/80">Visa</NavLink>
          <NavLink to="/support" className="text-sm hover:text-foreground/80">Support</NavLink>

          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring">
              Pricing <ChevronDown className="h-4 w-4" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="z-50 bg-popover">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Plans</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <a href="/#pricing-freemium">Freemium</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/#pricing-pro">Pro</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/#pricing-premium">Premium</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/pricing">Full Pricing</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
