import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

// Les 6 partenaires principaux
const mainPartners = [
  {
    id: 1,
    name: "Les petits bilingues",
    category: "Éducation",
    description: "Cours d'anglais ludiques pour les enfants, méthode immersive et adaptée à chaque âge.",
    logo: "🇬🇧",
    website: "#",
  },
  {
    id: 2,
    name: "Atelier Tuffery",
    category: "Shopping",
    description: "Jean français fabriqué artisanalement en Lozère depuis 1892.",
    logo: "👖",
    website: "#",
  },
  {
    id: 3,
    name: "Brin de Terre",
    category: "Éducation",
    description: "Ateliers nature et jardinage pour sensibiliser les enfants à l'environnement.",
    logo: "🌱",
    website: "#",
  },
  {
    id: 4,
    name: "Manu Créations Couture",
    category: "Éducation",
    description: "Ateliers créatifs de couture pour enfants et adultes.",
    logo: "🧵",
    website: "#",
  },
  {
    id: 5,
    name: "Astroludik",
    category: "Éducation",
    description: "Animations ludiques autour de l'astronomie pour éveiller la curiosité des enfants.",
    logo: "🔭",
    website: "#",
  },
  {
    id: 6,
    name: "Massages d'Isa",
    category: "Bien-être",
    description: "Massages bien-être et relaxation pour toute la famille.",
    logo: "💆",
    website: "https://isabellerichez34.wixsite.com/monsite-6",
  },
];

// Partenaires par catégorie pour le carrousel
const carouselPartners = [
  // Restauration
  { id: 7, name: "Moutarde et Wasabi", logo: "🍣", category: "Restauration" },
  { id: 8, name: "Pate'oche", logo: "🍝", category: "Restauration" },
  { id: 9, name: "Yo & Co", logo: "🍦", category: "Restauration" },
  { id: 10, name: "M&lice", logo: "🧁", category: "Restauration" },
  { id: 11, name: "Cafés et Gourmandises", logo: "☕", category: "Restauration" },
  { id: 12, name: "Café Joyeux", logo: "😊", category: "Restauration" },
  
  // Culture & Spectacles
  { id: 13, name: "South Comédie", logo: "🎤", category: "Culture" },
  { id: 14, name: "Cinéma Diagonal", logo: "🎬", category: "Culture" },
  { id: 15, name: "Théâtre Jean Vilar", logo: "🎭", category: "Culture" },
  { id: 16, name: "Rêves de Cirques", logo: "🎪", category: "Culture" },
  { id: 17, name: "Théâtre la Chocolaterie", logo: "🍫", category: "Culture" },
  { id: 18, name: "Théâtre de la Plume", logo: "🪶", category: "Culture" },
  
  // Éducation
  { id: 19, name: "Kitty English School", logo: "🐱", category: "Éducation" },
  
  // Shopping
  { id: 20, name: "Atol", logo: "👓", category: "Shopping" },
  { id: 21, name: "Comme Avant", logo: "🧴", category: "Shopping" },
  { id: 22, name: "Cartapapa", logo: "📮", category: "Shopping" },
  { id: 23, name: "Parfume Moi", logo: "🌸", category: "Shopping" },
  
  // Bien-être & Services
  { id: 24, name: "Self Défense Féminine Occitanie", logo: "🥋", category: "Bien-être" },
  { id: 25, name: "Centre Équestre Occitanie", logo: "🐴", category: "Bien-être" },
  { id: 26, name: "Cocon des Doulas", logo: "🤱", category: "Bien-être" },
  { id: 27, name: "Terres de Lumières", logo: "✨", category: "Bien-être" },
  { id: 28, name: "Nails by Marion", logo: "💅", category: "Bien-être" },
  
  // Photo & Événements
  { id: 29, name: "Sticker Kid", logo: "🏷️", category: "Événements" },
  { id: 30, name: "Fabrique Photos", logo: "📸", category: "Événements" },
  { id: 31, name: "Festikid", logo: "🎉", category: "Événements" },
  { id: 32, name: "Morphée", logo: "😴", category: "Événements" },
  { id: 33, name: "Civiletti Elodie Photographie", logo: "📷", category: "Événements" },
  { id: 34, name: "Royaume des Princesses", logo: "👑", category: "Événements" },
  { id: 35, name: "L'Atelier des Pelotes", logo: "🧶", category: "Événements" },
  { id: 36, name: "Studio Nyps", logo: "🎞️", category: "Événements" },
  
  // Loisirs & Parcs
  { id: 37, name: "Roc de Massereau", logo: "🏕️", category: "Loisirs" },
  { id: 38, name: "Micropolis", logo: "🐜", category: "Loisirs" },
  { id: 39, name: "Rochers de Maguelone", logo: "🦪", category: "Loisirs" },
  { id: 40, name: "Green Park", logo: "🌳", category: "Loisirs" },
  { id: 41, name: "Ferme du Dolmen", logo: "🐄", category: "Loisirs" },
  { id: 42, name: "Domaine de Launac", logo: "🏰", category: "Loisirs" },
  { id: 43, name: "Parc Spirou", logo: "🎢", category: "Loisirs" },
  { id: 44, name: "Aquaforest", logo: "🌊", category: "Loisirs" },
  { id: 45, name: "Mad Monkey", logo: "🐒", category: "Loisirs" },
  { id: 46, name: "Teraventura", logo: "🗺️", category: "Loisirs" },
  { id: 47, name: "Tyroliane", logo: "🧗", category: "Loisirs" },
  { id: 48, name: "Europark Indoor", logo: "🎠", category: "Loisirs" },
  { id: 49, name: "Space Games", logo: "🚀", category: "Loisirs" },
  { id: 50, name: "Petits Fermiers", logo: "🐑", category: "Loisirs" },
  { id: 51, name: "Dinopedia", logo: "🦕", category: "Loisirs" },
  { id: 52, name: "Seaquarium", logo: "🦈", category: "Loisirs" },
  { id: 53, name: "Village des Enfants", logo: "🏡", category: "Loisirs" },
  { id: 54, name: "Planet Océan", logo: "🐋", category: "Loisirs" },
  { id: 55, name: "Creamondes", logo: "🎨", category: "Loisirs" },
  { id: 56, name: "Train Vapeur des Cévennes", logo: "🚂", category: "Loisirs" },
  { id: 57, name: "Vélorail Cévennes", logo: "🚴", category: "Loisirs" },
  { id: 58, name: "Goolfy", logo: "⛳", category: "Loisirs" },
];

const categories = ["Tous", "Restauration", "Culture", "Éducation", "Shopping", "Bien-être", "Événements", "Loisirs"];

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

      {/* Partners Grid - First 6 partners */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mainPartners.map((partner, index) => (
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
                    <Button variant="ghost" size="sm" className="mt-auto">
                      Visiter
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Carousel - Remaining partners */}
      {carouselPartners.length > 0 && (
        <section className="py-12 bg-muted/30 overflow-hidden">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-foreground">Ils nous soutiennent aussi</h2>
            </motion.div>
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 1500,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="mx-auto max-w-6xl"
            >
              <CarouselContent className="-ml-2">
                {carouselPartners.map((partner) => (
                  <CarouselItem key={partner.id} className="pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                    <div className="flex flex-col items-center p-3">
                      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-background text-2xl shadow-sm transition-transform hover:scale-110">
                        {partner.logo}
                      </div>
                      <span className="text-xs font-medium text-foreground text-center line-clamp-1">
                        {partner.name}
                      </span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>
      )}

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
            <Button variant="playful" size="lg">
              Nous contacter
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Partenaires;
