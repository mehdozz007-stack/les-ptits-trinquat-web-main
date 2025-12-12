import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const partners = [
  {
    id: 1,
    name: "Mairie de Montpellier",
    category: "Institution",
    description: "La Mairie de Montpellier soutient nos actions et met à disposition des locaux pour nos événements.",
    logo: "🏛️",
    website: "https://www.montpellier.fr",
  },
  {
    id: 2,
    name: "Librairie Sauramps",
    category: "Culture",
    description: "Partenaire privilégié pour les projets lecture et les achats de livres pour l'école.",
    logo: "📚",
    website: "https://www.sauramps.com",
  },
  {
    id: 3,
    name: "Théâtre La Vista",
    category: "Culture",
    description: "Tarifs préférentiels pour les sorties scolaires et interventions artistiques.",
    logo: "🎭",
    website: "https://www.theatrelavista.fr/",
  },
  {
    id: 4,
    name: "Sport et Loisirs",
    category: "Sport",
    description: "Fournisseur d'équipements sportifs pour les activités périscolaires.",
    logo: "⚽",
    website: "#",
  },
  {
    id: 5,
    name: "Bio&Co",
    category: "Alimentation",
    description: "Partenaire pour les goûters bio et les ateliers nutrition à l'école.",
    logo: "🌿",
    website: "#",
  },
  {
    id: 6,
    name: "Musée Fabre",
    category: "Culture",
    description: "Visites guidées et ateliers créatifs pour les classes du groupe scolaire.",
    logo: "🎨",
    website: "#",
  },
  {
    id: 7,
    name: "Planète Sciences",
    category: "Éducation",
    description: "Animations scientifiques et ateliers de découverte pour les enfants.",
    logo: "🔬",
    website: "#",
  },
  {
    id: 8,
    name: "Décathlon Odysseum",
    category: "Sport",
    description: "Partenaire pour les équipements sportifs et les journées découverte sport.",
    logo: "🏃",
    website: "#",
  },
];

const categories = ["Tous", "Institution", "Culture", "Sport", "Alimentation", "Éducation"];

const Partenaires = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/4 h-60 w-60 rounded-full bg-accent/20 watercolor-blob" />
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-secondary/20 watercolor-blob" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-center mx-auto"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent-foreground">
              <Heart className="h-4 w-4 text-secondary" />
              Merci à eux
            </span>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Nos <span className="text-gradient">partenaires</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Grâce à leur soutien, nous pouvons organiser des événements et des activités enrichissantes pour nos enfants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="playful" className="group h-full">
                  <CardContent className="flex flex-col items-center p-6 text-center h-full">
                    {/* Logo */}
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-4xl transition-transform group-hover:scale-110">
                      {partner.logo}
                    </div>

                    {/* Category Badge */}
                    <span className="mb-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {partner.category}
                    </span>

                    {/* Name */}
                    <h3 className="mb-2 text-lg font-bold text-foreground">
                      {partner.name}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 flex-1 text-sm text-muted-foreground">
                      {partner.description}
                    </p>

                    {/* Link */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-auto"
                      asChild
                    >
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visiter
                        <ExternalLink className="ml-2 h-3.5 w-3.5" />
                      </a>
                    </Button>

                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Become Partner CTA */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <Heart className="mx-auto mb-4 h-12 w-12 text-secondary" />
            <h2 className="mb-4 text-2xl font-bold">Devenir partenaire</h2>
            <p className="mb-6 text-muted-foreground">
              Vous souhaitez soutenir nos actions et participer à la vie scolaire ? Contactez-nous pour discuter d'un partenariat.
            </p>
            <Button asChild variant="playful" size="lg">
              <Link to="/contact">
                Nous contacter
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Partenaires;
