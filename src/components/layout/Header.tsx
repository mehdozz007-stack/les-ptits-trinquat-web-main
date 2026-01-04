import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar, FileText, Users, Heart, Mail, Home, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-children.jpg";

const navItems = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "À propos", href: "/a-propos", icon: Users },
  { label: "Événements", href: "/evenements", icon: Calendar },
  { label: "Comptes-rendus", href: "/comptes-rendus", icon: FileText },
  { label: "Notre école", href: "/notre-ecole", icon: School },
  { label: "Partenaires", href: "/partenaires", icon: Heart },
  { label: "Contact", href: "/contact", icon: Mail },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-lg">
      <div className="container flex h-14 sm:h-16 md:h-20 items-center justify-between px-3 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-secondary shadow-soft transition-transform group-hover:scale-110 flex-shrink-0">
            <img 
            src={heroImage} 
            alt="Logo enfants"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl object-cover"
            />
          </div>
          <div>
            <h1 className="text-xs sm:text-base md:text-lg font-bold leading-tight text-foreground">
              Les P'tits Trinquat
            </h1>
            <p className="text-xs text-muted-foreground">
              Association parents d'élèves
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm font-medium transition-all duration-200",
                location.pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button - Desktop */}
        <div className="hidden lg:block">
          <Button variant="playful" size="lg" className="text-base sm:text-base font-semibold px-6 sm:px-8 py-3">
            <a href="https://www.helloasso.com/associations/les-p-tits-trinquat/adhesions/nous-soutenir" target="_blank" rel="noopener noreferrer">
              Rejoindre l'association
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 bg-card"
          >
            <nav className="container py-3 sm:py-4 space-y-1 px-3 sm:px-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all",
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                className="pt-2"
              >
                <Button variant="playful" className="w-full text-sm sm:text-base">
                  <a href="https://www.helloasso.com/associations/les-p-tits-trinquat#membership" target="_blank" rel="noopener noreferrer" className="w-full">
                    Rejoindre l'association
                  </a>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
