import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Import des logos
import lesPetitsBilinguesLogo from "@/assets/logos/lesPetitsBilingues.jpeg";
import atelierTufferyLogo from "@/assets/logos/atelier_tuffery_logo.svg";
import enviForm from "@/assets/logos/enviForm.png";
import manuCreation from "@/assets/logos/manucreation.jpg";
import astroludik from "@/assets/logos/logo-astroludik.png";
import massagesIsa from "@/assets/logos/isamassage.avif";
import frenchKissLogo from "@/assets/logos/frenchkiss.png";

const partners = [
  {
    id: 1,
    name: "Les petits bilingues",
    category: "Éducation",
    description: "Cours d'anglais ludiques pour les enfants, méthode immersive et adaptée à chaque âge.",
    logo: lesPetitsBilinguesLogo,
    website: "https://www.lespetitsbilingues.com/les-centres-lpb/montpellier/",
  },
  {
    id: 2,
    name: "French Kiss",
    category: "Restauration",
    description: "Restaurant français proposant une cuisine savoureuse et authentique dans un cadre convivial.",
    logo: frenchKissLogo,
    website: "https://www.frenchkiss.fr/nos-adresses/montpellier",
  },
  {
    id: 3,
    name: "Atelier Tuffery",
    category: "Shopping",
    description: "Jean français fabriqué artisanalement en Lozère depuis 1892.",
    logo: atelierTufferyLogo,
    website: "https://www.ateliertuffery.com/pages/boutique-jeans-francais-montpellier",
  },
  {
    id: 4,
    name: "Enviform Sport Santé",
    category: "Bien être",
    description: "Coaching sportif et bien-être.",
    logo: enviForm,
    website: "https://www.enviform-sport-sante.fr/",
  },
  {
    id: 5,
    name: "Méla Wing",
    category: "Éducation",
    description: "Coaching pour les wingfoileurs et wingfoileuses.",
    logo: "🌊",
    website: "https://www.facebook.com/melanie.garin.1/directory_work?locale=fr_FR",
  },
  {
    id: 6,
    name: "Astroludik",
    category: "Éducation",
    description: "Animations ludiques autour de l'astronomie pour éveiller la curiosité des enfants.",
    logo: astroludik,
    website: "https://www.astroludik.com/",
  },
];

export function PartnersPreview() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent-foreground">
            <Heart className="h-4 w-4 text-secondary" />
            Merci à nos partenaires
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ils nous font confiance
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Grâce à leur soutien, nous pouvons organiser des événements et des activités pour nos enfants.
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner, index) => (
            <motion.a
              key={partner.id}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-1 text-center transition-all hover:border-primary/30 hover:shadow-soft hover:-translate-y-1 cursor-pointer aspect-square"
            >
              <div className="mt-5 mb-2 flex h-40 w-40 items-center justify-center overflow-hidden flex-shrink-0">
                {typeof partner.logo === 'string' && (partner.logo.startsWith('http') || partner.logo.startsWith('/')) ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-full w-full object-contain p-2 rounded-lg"
                  />
                ) : (
                  <div className="text-6xl">{partner.logo}</div>
                )}
              </div>
              <span className="mb-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {partner.category}
              </span>
              <span className="mb-2 rounded-lg bg-amber-50 px-3 py-1.5 text-base font-bold text-foreground inline-block">
                {partner.name}
              </span>
              <p className="text-base text-muted-foreground text-center line-clamp-3 px-6 py-6">
                {partner.description}
              </p>

            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/partenaires">
              Découvrir tous nos partenaires
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
