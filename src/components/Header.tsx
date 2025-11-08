import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Leaf, User, ShoppingBag } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-botanical">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Swan Botanicals
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/quiz" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Skin Quiz
          </Link>
          <Link to="/products" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Products
          </Link>
          <Link to="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            My Profile
          </Link>
          <Link to="/routine" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            My Routine
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
