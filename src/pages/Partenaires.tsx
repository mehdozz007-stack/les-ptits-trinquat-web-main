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

const mainPartners = [
  {
    id: 1,
    name: "Mairie de Montpellier",
    category: "Institution",
    description: "La Mairie de Montpellier soutient nos actions et met à disposition des locaux pour nos événements.",
    logo: "🏛️",
    website: "#",
  },
  {
    id: 2,
    name: "Librairie Sauramps",
    category: "Culture",
    description: "Partenaire privilégié pour les projets lecture et les achats de livres pour l'école.",
    logo: "📚",
    website: "#",
  },
  {
    id: 3,
    name: "Théâtre La Vista",
    category: "Culture",
    description: "Tarifs préférentiels pour les sorties scolaires et interventions artistiques.",
    logo: "🎭",
    website: "#",
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
];

const carouselPartners = [
  { id: 7, name: "Planète Sciences", logo: "🔬" },
  { id: 8, name: "Décathlon", logo: "🏃" },
  { id: 9, name: "Carrefour", logo: "🛒" },
  { id: 10, name: "Fnac", logo: "📀" },
  { id: 11, name: "Nature & Découvertes", logo: "🌳" },
  { id: 12, name: "Cultura", logo: "🎵" },
  { id: 13, name: "Leclerc", logo: "🏪" },
  { id: 14, name: "Intersport", logo: "🎿" },
  { id: 15, name: "Go Sport", logo: "🏀" },
  { id: 16, name: "Oxybul", logo: "🧸" },
  { id: 17, name: "King Jouet", logo: "🎮" },
  { id: 18, name: "JouéClub", logo: "🎯" },
  { id: 19, name: "Maxi Toys", logo: "🚂" },
  { id: 20, name: "La Grande Récré", logo: "🎪" },
  { id: 21, name: "Picwic", logo: "🎨" },
  { id: 22, name: "Toys R Us", logo: "🦒" },
  { id: 23, name: "Boulanger", logo: "💻" },
  { id: 24, name: "Darty", logo: "📺" },
  { id: 25, name: "IKEA", logo: "🪑" },
  { id: 26, name: "Leroy Merlin", logo: "🔧" },
  { id: 27, name: "Castorama", logo: "🏠" },
  { id: 28, name: "Bricorama", logo: "🔨" },
  { id: 29, name: "Mr Bricolage", logo: "🪚" },
  { id: 30, name: "Jardiland", logo: "🌻" },
  { id: 31, name: "Truffaut", logo: "🌺" },
  { id: 32, name: "Gamm Vert", logo: "🌱" },
  { id: 33, name: "Botanic", logo: "🌷" },
  { id: 34, name: "Picard", logo: "❄️" },
  { id: 35, name: "Grand Frais", logo: "🥬" },
  { id: 36, name: "Biocoop", logo: "🥕" },
  { id: 37, name: "Naturalia", logo: "🍎" },
  { id: 38, name: "La Vie Claire", logo: "🥗" },
  { id: 39, name: "Lidl", logo: "🛍️" },
  { id: 40, name: "Aldi", logo: "🏬" },
  { id: 41, name: "Monoprix", logo: "🧺" },
  { id: 42, name: "Franprix", logo: "🥖" },
  { id: 43, name: "Casino", logo: "🎰" },
  { id: 44, name: "Auchan", logo: "🛵" },
  { id: 45, name: "Intermarché", logo: "⚓" },
  { id: 46, name: "Super U", logo: "🔴" },
  { id: 47, name: "Cora", logo: "🟠" },
  { id: 48, name: "Match", logo: "🟡" },
  { id: 49, name: "Netto", logo: "🟢" },
  { id: 50, name: "Leader Price", logo: "🔵" },
  { id: 51, name: "Cdiscount", logo: "📦" },
  { id: 52, name: "Amazon", logo: "📱" },
  { id: 53, name: "Rakuten", logo: "🛒" },
  { id: 54, name: "eBay", logo: "🏷️" },
  { id: 55, name: "Zalando", logo: "👟" },
  { id: 56, name: "La Redoute", logo: "👗" },
  { id: 57, name: "3 Suisses", logo: "👔" },
  { id: 58, name: "Kiabi", logo: "👶" },
  { id: 59, name: "Orchestra", logo: "🎒" },
  { id: 60, name: "Sergent Major", logo: "🧥" },
  { id: 61, name: "Okaïdi", logo: "👕" },
  { id: 62, name: "Jacadi", logo: "🎀" },
  { id: 63, name: "Petit Bateau", logo: "⛵" },
  { id: 64, name: "Tartine et Chocolat", logo: "🍫" },
  { id: 65, name: "Bonpoint", logo: "💐" },
  { id: 66, name: "Du Pareil au Même", logo: "👯" },
  { id: 67, name: "Vertbaudet", logo: "🌲" },
  { id: 68, name: "Cyrillus", logo: "🦋" },
  { id: 69, name: "Catimini", logo: "🌈" },
  { id: 70, name: "DPAM", logo: "🎈" },
  { id: 71, name: "Absorba", logo: "🍼" },
  { id: 72, name: "Tex Kids", logo: "⭐" },
  { id: 73, name: "La Halle", logo: "👢" },
  { id: 74, name: "Gémo", logo: "👠" },
  { id: 75, name: "Besson", logo: "🥾" },
  { id: 76, name: "San Marina", logo: "🩴" },
  { id: 77, name: "André", logo: "👞" },
  { id: 78, name: "Eram", logo: "👡" },
  { id: 79, name: "Minelli", logo: "👜" },
  { id: 80, name: "Jonak", logo: "💼" },
  { id: 81, name: "Bocage", logo: "🎁" },
  { id: 82, name: "Mephisto", logo: "🥿" },
  { id: 83, name: "Pimkie", logo: "👚" },
  { id: 84, name: "Camaïeu", logo: "🧣" },
  { id: 85, name: "Promod", logo: "👘" },
  { id: 86, name: "Etam", logo: "🩱" },
  { id: 87, name: "Morgan", logo: "💃" },
  { id: 88, name: "Naf Naf", logo: "🦢" },
  { id: 89, name: "Kookaï", logo: "🦚" },
  { id: 90, name: "Mango", logo: "🥭" },
  { id: 91, name: "Zara", logo: "👗" },
  { id: 92, name: "H&M", logo: "🛍️" },
  { id: 93, name: "Primark", logo: "🎀" },
  { id: 94, name: "C&A", logo: "👔" },
  { id: 95, name: "Uniqlo", logo: "🧵" },
  { id: 96, name: "Jules", logo: "👨" },
  { id: 97, name: "Celio", logo: "👕" },
  { id: 98, name: "Devred", logo: "🤵" },
  { id: 99, name: "Brice", logo: "🧥" },
  { id: 100, name: "Armand Thiery", logo: "🎩" },
  { id: 101, name: "Café Coton", logo: "☕" },
  { id: 102, name: "Façonnable", logo: "⚜️" },
  { id: 103, name: "Lacoste", logo: "🐊" },
  { id: 104, name: "Ralph Lauren", logo: "🏇" },
  { id: 105, name: "Tommy Hilfiger", logo: "🔷" },
  { id: 106, name: "Calvin Klein", logo: "🔳" },
  { id: 107, name: "Levi's", logo: "👖" },
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
                  delay: 1000,
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
