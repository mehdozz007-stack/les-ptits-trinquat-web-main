import { motion } from "framer-motion";
import { MapPin, Users, BookOpen, Heart, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const schoolFeatures = [
  {
    icon: MapPin,
    title: "Localisation privilégiée",
    description: "Située au cœur du quartier Trinité-Préfecture à Montpellier, notre école bénéficie d'un environnement calme et verdoyant, idéal pour l'apprentissage.",
    color: "primary",
  },
  {
    icon: Users,
    title: "Effectifs à taille humaine",
    description: "Avec des classes de taille raisonnable, chaque enfant bénéficie d'une attention individualisée et d'un suivi personnalisé par l'équipe pédagogique.",
    color: "secondary",
  },
  {
    icon: BookOpen,
    title: "Projets éducatifs innovants",
    description: "Nous proposons des projets pédagogiques variés mêlant apprentissages fondamentaux, arts, sciences et activités sportives pour un développement harmonieux.",
    color: "sky",
  },
  {
    icon: Heart,
    title: "Environnement bienveillant",
    description: "Une école où chaque enfant se sent en sécurité, valorisé et capable d'exprimer ses talents dans le respect et la tolérance.",
    color: "accent",
  },
];

const schoolLevels = [
  {
    title: "Petite Section",
    description: "Accueil à partir de 3 ans. Découverte du monde à travers le jeu et les activités sensorielles.",
    emoji: "🧒",
  },
  {
    title: "Maternelle",
    description: "Développement de l'autonomie et des premières acquisitions langagières et mathématiques.",
    emoji: "👧",
  },
  {
    title: "Élémentaire",
    description: "Enseignement des bases (français, mathématiques) enrichi par des activités culturelles et sportives.",
    emoji: "📚",
  },
];

const schoolValues = [
  {
    title: "Excellence académique",
    description: "Un apprentissage de qualité fondé sur des méthodes reconnues et l'engagement des enseignants.",
    icon: "🎯",
  },
  {
    title: "Épanouissement personnel",
    description: "Chaque enfant est accompagné pour grandir, se dépasser et découvrir ses passions.",
    icon: "🌟",
  },
  {
    title: "Citoyenneté active",
    description: "Éducation aux valeurs civiques, à l'environnement et au respect de la diversité.",
    icon: "🌍",
  },
  {
    title: "Famille, l'acteur clé",
    description: "Partenariat étroit entre l'école et les familles pour la réussite des enfants.",
    icon: "❤️",
  },
];

const galleryImages = [
  {
    src: "/api/placeholder/400/300",
    title: "Cour de récréation",
    category: "Espaces",
  },
  {
    src: "/api/placeholder/400/300",
    title: "Classe de maternelle",
    category: "Classes",
  },
  {
    src: "/api/placeholder/400/300",
    title: "Activité artistique",
    category: "Activités",
  },
  {
    src: "/api/placeholder/400/300",
    title: "Bibliothèque",
    category: "Ressources",
  },
  {
    src: "/api/placeholder/400/300",
    title: "Atelier sciences",
    category: "Activités",
  },
  {
    src: "/api/placeholder/400/300",
    title: "Salle de sport",
    category: "Espaces",
  },
];

const NotreEcole = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 watercolor-blob" />
          <div className="absolute bottom-10 left-10 h-40 w-40 rounded-full bg-secondary/20 watercolor-blob" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <BookOpen className="h-4 w-4" />
              Notre école
            </span>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Bienvenue au groupe scolaire<br />
              <span className="text-gradient">Anne FRANK - Charles DICKENS</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Un lieu d'apprentissage bienveillant où chaque enfant grandit, se épanouit et s'épanouit à son rythme, accompagné par une équipe pédagogique engagée et des parents investis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* School Presentation */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative h-80 overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="/api/placeholder/600/400"
                  alt="École Anne FRANK - Charles DICKENS"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-bold">
                Un cadre de vie<br />
                <span className="text-gradient">optimal pour apprendre</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Notre groupe scolaire se distingue par son engagement envers l'excellence éducative et le bien-être de chaque enfant. Nous créons un environnement inclusif où la bienveillance, le respect et l'écoute sont les piliers de notre action quotidienne.
                </p>
                <p>
                  Nos locaux, régulièrement rénovés et adaptés, offrent des espaces modernes de vie et d'apprentissage. Des salles de classe lumineuses, des zones de jeu sécurisées, et des espaces de détente complètent nos installations.
                </p>
                <p>
                  Grâce au soutien de l'Association des Parents d'Élèves <strong className="font-bold text-foreground">Les P'tits Trinquat</strong>, nous enrichissons régulièrement les projets pédagogiques et les activités périscolaires pour le plus grand bénéfice de nos élèves.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* School Features */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Nos points forts</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Ce qui fait la singularité et la force de notre groupe scolaire.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {schoolFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="elevated" className="h-full">
                  <CardContent className="p-6">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-${feature.color}/10`}>
                      <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                    </div>
                    <h3 className="mb-2 font-bold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* School Levels */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Les niveaux scolaires</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Nous accueillons les enfants de la petite section à l'élémentaire.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {schoolLevels.map((level, index) => (
              <motion.div
                key={level.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="playful" className="h-full overflow-hidden">
                  <CardContent className="p-6">
                    <div className="mb-4 text-4xl">{level.emoji}</div>
                    <h3 className="mb-3 text-xl font-bold text-foreground">{level.title}</h3>
                    <p className="text-muted-foreground">{level.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* School Values */}
      <section className="bg-gradient-to-b from-primary/5 to-secondary/5 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Nos valeurs éducatives</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Les principes qui guident nos actions et nos décisions quotidiennes.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {schoolValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-primary/20 bg-white/50 p-6 text-center backdrop-blur"
              >
                <div className="mb-3 text-4xl">{value.icon}</div>
                <h3 className="mb-2 font-bold text-foreground">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Galerie photo</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Découvrez les coulisses et l'ambiance de notre école.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative h-64 overflow-hidden rounded-lg shadow-md"
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
                  <div className="text-white">
                    <p className="text-sm font-semibold text-primary/80">{image.category}</p>
                    <h3 className="font-bold">{image.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 watercolor-blob" />
          <div className="absolute -bottom-10 -left-20 h-40 w-40 rounded-full bg-secondary/20 watercolor-blob" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Envie d'en savoir plus ?</h2>
            <p className="mb-8 text-muted-foreground">
              Vous avez des questions sur l'école, ses projets, ou l'implication de l'APE ? N'hésitez pas à nous contacter. Nous serons ravis d'échanger avec vous !
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/contact">
                  Nous contacter
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/a-propos">
                  En savoir plus sur l'APE
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NotreEcole;
