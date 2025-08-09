import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-background" role="contentinfo">
      <div className="container mx-auto px-4 py-8 grid gap-4 sm:flex sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Afrimigrate. All rights reserved.</p>
        <nav aria-label="Legal links" className="flex items-center gap-6 text-sm">
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
