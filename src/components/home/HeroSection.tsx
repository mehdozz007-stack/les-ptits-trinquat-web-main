import { motion } from "framer-motion";
import { ArrowRight, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-children.jpg";

// Spark component for floating particles
const Spark = ({ color }: { color: string }) => {
  const x = Math.random() * 120 - 10; // horizontal offset %
  const y = Math.random() * 120 - 10; // vertical offset %
  const duration = 1 + Math.random() * 1.5;

  return (
    <motion.span
      className={`absolute h-1 w-1 rounded-full ${color}`}
      style={{ top: `${y}%`, left: `${x}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        x: [`0px`, `${Math.random() * 20 - 10}px`, `0px`],
        y: [`0px`, `${Math.random() * 20 - 10}px`, `0px`],
      }}
      transition={{ duration, repeat: Infinity, repeatDelay: Math.random() }}
    />
  );
};

export function HeroSection() {
  const sparks = Array.from({ length: 150 }); // total sparks around the TOMBOLA

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-hero">
      {/* Decorative watercolor blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/30 watercolor-blob animate-pulse-soft" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-secondary/30 watercolor-blob animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-20 right-1/4 h-60 w-60 rounded-full bg-sky/30 watercolor-blob animate-pulse-soft" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/4 right-1/3 h-40 w-40 rounded-full bg-accent/30 watercolor-blob animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container relative flex min-h-[90vh] items-center py-8 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-8 items-center w-full">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl w-full"
          >
            {/* TOMBOLA Block with sparks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative mb-6 inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-2xl sm:rounded-full bg-primary/10 px-3 sm:px-4 py-3 sm:py-2 text-sm sm:text-lg font-bold text-blue-900 overflow-visible"
            >
              {/* Dynamic Sparks */}
              {sparks.map((_, i) => (
              <Spark
                key={i}
                color={
                  [
                    "bg-pink-400",
                    "bg-violet-400",
                    "bg-yellow-300",
                    "bg-teal-300",
                    "bg-orange-400",
                    "bg-green-400",
                    "bg-white-400",
                    "bg-red-400",
                  ][i % 6]
                }
              />
            ))}

              {/* Ping indicator */}
              <span className="text-lg sm:text-xl">📣</span>
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 font-kid text-transparent bg-clip-text 
               bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 
               text-xs sm:text-base font-bold leading-tight drop-shadow-lg">
  
              {/* Point vert */}
              <span className="relative flex h-2 w-2 sm:h-3 sm:w-3 flex-shrink-0 mt-1 sm:mt-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-600 opacity-75" />
                <span className="relative inline-flex h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500" />
              </span>
              {/* Texte */}
              <span className="leading-snug">
              Notre TOMBOLA 2025-2026 est lancée !
              </span>
             </div>
              {/* Link */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 sm:mt-0"
                      asChild
                    >
                      <a
                        href="https://scontent.fmpl1-1.fna.fbcdn.net/v/t39.30808-6/595919813_1156492949985314_3198213975125715598_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=111&ccb=1-7&_nc_sid=f727a1&_nc_ohc=MhGfL8XhkN4Q7kNvwG3LwiC&_nc_oc=AdlneLmL5sgCAG0kn9ZPZ2piCEtOPrJwsoOuOf1LJCCNHz7Mvtc7G30TUbPkVTS--ts&_nc_zt=23&_nc_ht=scontent.fmpl1-1.fna&_nc_gid=iAqTz6VIFvvqTIU3lGSLMw&oh=00_AfmtrcqdRkCloIDTmJtimBFHUaUDAPqdx-yf4oTeVECKMw&oe=69403F03"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visiter
                        <ExternalLink className="ml-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </a>
                    </Button>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
            >
              <span className="text-gradient">Grandir ensemble</span>
              <br />
              <span className="text-foreground">pour nos enfants !</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              L'association Les P'tits Trinquât rassemble les parents d'élèves du groupe scolaire FRANK-DICKENS, les Aiguerelles, pour accompagner et enrichir la vie scolaire de nos enfants à travers des événements, des projets et une communauté bienveillante.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
            >
              <Button variant="hero" size="lg" asChild>
                <Link to="/evenements">
                  <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Nos événements</span>
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/a-propos">
                  <span className="text-sm sm:text-base">Qui sommes-nous ?</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8 sm:flex"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#A8D479]">100+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Familles</div>
              </div>
              <div className="h-8 sm:h-12 w-px bg-border hidden sm:block" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#E89AB1]">10+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Événements</div>
              </div>
              <div className="h-8 sm:h-12 w-px bg-border hidden sm:block" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#87CEEB]">10</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Ans</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative flex justify-center lg:justify-end w-full"
          >
            <div className="relative w-full max-w-sm lg:max-w-none">
              {/* Background decoration */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-sky/20 blur-2xl" />
              
              <div className="text-center mb-4 lg:hidden">
              <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight"
            >
              <span className="text-gradient">Les P'tits Trinquât</span>
              <br />
              <p className="text-xs sm:text-sm mt-1 font-semibold text-black">
               Association de parents.
              </p>
            </motion.h1>
            </div>

              {/* Main image */}
              <img
                src={heroImage}
                alt="Enfants joyeux - Les P'tits Trinquât"
                className="relative rounded-3xl shadow-2xl w-full h-auto"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-card p-3 sm:p-4 shadow-card text-xs sm:text-sm"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-accent flex-shrink-0">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Communauté active</div>
                  <div className="text-xs text-muted-foreground">Parents engagés</div>
                </div>
              </motion.div>
            </div>
            
            {/* Social Links */}
            <div className="absolute -right-3 sm:-right-6 bottom-6 sm:bottom-6 flex flex-col gap-2 sm:gap-3">
              <a
                href="https://www.instagram.com/Les_ptits_trinquat?fbclid=IwY2xjawOmlxFleHRuA2FlbQIxMABicmlkETFnZjNRdDdMVHp6cHdIM3pwc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHvXM-UMnkp69r5uScbYVykNF5ZVtr9MQa1_k2se0iqZ3IfRUEmOZXgHqWCes_aem_hUyrVdxiVyWFisTvxVlyRw&brid=boREg9T10BACz4NodPBJ3w"
                target="_blank"
                className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-primary text-primary-foreground shadow-md hover:scale-105 transition flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16.5 7.51h.01M12 8.25A3.75 3.75 0 1 0 12 15.75A3.75 3.75 0 1 0 12 8.25Z" />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/LesPtitsTrinquats"
                target="_blank"
                className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-primary text-primary-foreground shadow-md hover:scale-105 transition flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5 8.5V6.75c0-.62.5-1.12 1.12-1.12H16V3h-2.25A3.75 3.75 0 0 0 10 6.75V8.5H8v3h2v9h3v-9h2.25l.25-3h-2.5z"/>
                </svg>
              </a>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L48 110C96 100 192 80 288 75C384 70 480 80 576 85C672 90 768 90 864 85C960 80 1056 70 1152 70C1248 70 1344 80 1392 85L1440 90V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}
