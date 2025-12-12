import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 watercolor-blob animate-pulse-soft" />
        <div className="absolute bottom-20 -left-20 h-80 w-80 rounded-full bg-secondary/20 watercolor-blob animate-pulse-soft" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container relative text-center">
        <div className="mb-8 text-9xl font-extrabold text-gradient">404</div>
        <h1 className="mb-4 text-3xl font-bold text-foreground">Page introuvable</h1>
        <p className="mb-8 text-lg text-muted-foreground max-w-md mx-auto">
          Oups ! La page que vous cherchez semble s'être envolée. Pas de panique, retournons à l'accueil !
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" asChild>
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Page précédente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
