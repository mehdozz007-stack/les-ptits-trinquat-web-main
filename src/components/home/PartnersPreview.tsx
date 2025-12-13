import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const partners = [
  { id: 1, name: "Mairie de Montpellier", logo: "🏛️" },
  { id: 2, name: "Nomaïa", logo: "🍰"  },
  { id: 3, name: "ParfumeMoi", logo: "🌹" },
  { id: 4, name: "Sport et Loisirs", logo: "⚽" },
  { id: 5, name: "Centre Équestre Sud Occitanie", logo: "🐴" },
  { id: 6, name: "Musée Fabre", logo: "🎨" },
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
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-soft hover:-translate-y-1"
            >
              <div className="mb-3 text-4xl">{partner.logo}</div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {partner.name}
              </span>
            </motion.div>
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
