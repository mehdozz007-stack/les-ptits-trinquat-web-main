import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import {
  MapPin,
  GraduationCap,
  Heart,
  Users,
  Sparkles,
  BookOpen,
  TreePine,
  Bus,
  Calendar,
  HandHeart,
  Mail,
  School,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import panneauImage from "@/assets/logos/PanneauDickensMontpellier.jpg";

const schoolLevels = [
  {
    title: "Maternelle",
    description: "Petite, Moyenne et Grande section - Un premier pas vers l'apprentissage dans un cadre bienveillant.",
    icon: Sparkles,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Élémentaire",
    description: "Du CP au CM2 - Un parcours complet pour grandir, apprendre et s'épanouir.",
    icon: BookOpen,
    color: "bg-secondary/20 text-secondary",
  },
];

const schoolValues = [
  {
    title: "Bienveillance",
    description: "Un accompagnement chaleureux et attentif pour chaque enfant.",
    icon: Heart,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Épanouissement",
    description: "Des activités variées pour développer tous les talents.",
    icon: Sparkles,
    color: "bg-secondary/20 text-secondary",
  },
  {
    title: "Collectif",
    description: "Une communauté soudée où parents et enseignants collaborent.",
    icon: Users,
    color: "bg-sky/20 text-sky",
  },
  {
    title: "Excellence",
    description: "Un enseignement de qualité dans un cadre structurant.",
    icon: GraduationCap,
    color: "bg-violet/20 text-violet",
  },
];

const schoolActivities = [
  {
    title: "Projets pédagogiques",
    description: "Sorties culturelles, classes découvertes, projets artistiques tout au long de l'année.",
    icon: Calendar,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Activités sportives",
    description: "Piscine, gymnastique, jeux collectifs et découverte de nouveaux sports.",
    icon: Sparkles,
    color: "bg-sky/20 text-sky",
  },
  {
    title: "Temps forts",
    description: "Fêtes de l'école, spectacles, carnaval et moments de partage en famille.",
    icon: Heart,
    color: "bg-secondary/20 text-secondary",
  },
  {
    title: "Ateliers créatifs",
    description: "Arts plastiques, musique et expression corporelle pour stimuler la créativité.",
    icon: BookOpen,
    color: "bg-violet/20 text-violet",
  },
];

const galleryImages = [
  { src: "/placeholder.svg", alt: "Cour de récréation" },
  { src: "/placeholder.svg", alt: "Salle de classe" },
  { src: "/placeholder.svg", alt: "Bibliothèque" },
  { src: "/placeholder.svg", alt: "Cantine" },
  { src: "/placeholder.svg", alt: "Jardin pédagogique" },
  { src: "/placeholder.svg", alt: "Salle de motricité" },
];

const NotreEcole = () => {
  useScrollToTop();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 right-1/4 h-60 w-60 rounded-full bg-sky/20 watercolor-blob" />
          <div className="absolute bottom-10 -left-20 h-40 w-40 rounded-full bg-primary/20 watercolor-blob" />
          <div className="absolute top-1/2 right-10 h-32 w-32 rounded-full bg-secondary/15 watercolor-blob" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-center mx-auto"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <School className="h-4 w-4" />
              Notre école
            </span>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Un lieu où grandir <span className="text-gradient">avec bonheur</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
              Au cœur de notre groupe scolaire, chaque enfant trouve sa place dans un environnement chaleureux, 
              stimulant et bienveillant. Découvrez un cadre idéal pour apprendre et s'épanouir.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Présentation générale */}
      <section className="py-16 md:py-20">
        <div className="container">
          <h2 className="mb-10 text-3xl font-bold md:text-4xl text-center">
            Une école à <span className="text-gradient">taille humaine</span>
          </h2>
          
          {/* Photo à gauche, texte à droite */}
          <div className="grid gap-10 lg:grid-cols-2 items-center mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-2xl shadow-lg"
            >
              <img 
                src={panneauImage}
                alt="École Anne Frank - Charles Dickens" 
                className="w-full h-80 object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4 text-muted-foreground leading-relaxed"
            >
              <p>
                Le groupe scolaire Anne Frank - Charles Dickens accueille les enfants de la maternelle au CM2 
                dans un cadre pensé pour leur épanouissement. Nos équipes pédagogiques dévouées accompagnent 
                chaque élève avec attention et bienveillance.
              </p>
              <p>
                Ici, l'apprentissage rime avec plaisir. Les enseignants travaillent main dans la main avec 
                les familles pour offrir aux enfants les meilleures conditions de réussite, dans le respect 
                du rythme de chacun.
              </p>
              <p>
                Notre école est un lieu de vie où se tissent des liens durables, où les valeurs de respect, 
                de partage et d'entraide sont cultivées au quotidien.
              </p>
            </motion.div>
          </div>

          {/* Valeurs alignées sur une ligne */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {schoolValues.map((value, index) => (
              <Card key={index} variant="elevated" className="overflow-hidden">
                <CardContent className="p-5">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${value.color}`}>
                    <value.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1 font-bold text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Niveaux et parcours */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <GraduationCap className="h-4 w-4" />
              Parcours scolaire
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">De la maternelle au CM2</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Un parcours complet et cohérent pour accompagner votre enfant 
              dans toutes les étapes de sa scolarité.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {schoolLevels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card variant="playful" className="h-full">
                  <CardContent className="p-8">
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${level.color}`}>
                      <level.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-3 text-2xl font-bold">{level.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{level.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vie des élèves */}
      <section className="bg-muted/50 py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet/20 px-4 py-1.5 text-sm font-semibold text-violet-foreground">
              <Sparkles className="h-4 w-4" />
              Vie scolaire
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Une école vivante et dynamique</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Tout au long de l'année, les élèves participent à des projets enrichissants 
              qui développent leur curiosité et leur créativité.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {schoolActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="elevated" className="h-full">
                  <CardContent className="p-6">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${activity.color}`}>
                      <activity.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-bold text-foreground">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lien avec l'APE */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <Card variant="playful" className="overflow-hidden">
                <CardContent className="p-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20">
                    <HandHeart className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">Parents et école, main dans la main</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      Organisation d'événements festifs et éducatifs
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                      Financement de projets pédagogiques
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky" />
                      Accompagnement des sorties scolaires
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet" />
                      Lien entre les familles et l'équipe éducative
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent-foreground">
                <Users className="h-4 w-4" />
                L'APE et l'école
              </div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Une communauté <span className="text-gradient">engagée</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  L'Association des Parents d'Élèves « Les P'tits Trinquat » joue un rôle essentiel 
                  dans la vie de l'école. En collaboration étroite avec l'équipe pédagogique, 
                  nous œuvrons pour le bien-être et l'épanouissement de tous les enfants.
                </p>
                <p>
                  Grâce à l'implication des familles bénévoles, nous organisons des événements 
                  qui rythment l'année scolaire et créons des liens durables entre tous les 
                  membres de notre communauté éducative.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild variant="playful" size="lg">
                  <Link to="/a-propos">
                    Découvrir l'APE
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="bg-muted/50 py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sunshine/20 px-4 py-1.5 text-sm font-semibold text-sunshine-foreground">
              <Sparkles className="h-4 w-4" />
              Galerie
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Découvrez notre école en images</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Un aperçu des espaces où vos enfants grandissent, apprennent et s'épanouissent au quotidien.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-card shadow-card"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-card opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="font-medium">{image.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-sky/5" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-1/4 h-40 w-40 rounded-full bg-primary/10 watercolor-blob" />
          <div className="absolute bottom-10 right-1/4 h-32 w-32 rounded-full bg-secondary/10 watercolor-blob" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Pourquoi choisir notre école ?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Parce que chaque enfant mérite un environnement où il peut grandir en confiance, 
              s'épanouir et développer tout son potentiel. Rejoignez notre belle communauté !
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="playful" size="xl">
                <Link to="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Nous contacter
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
