import { motion } from "framer-motion";
import { Users, Heart, Target, History, UserCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const bureauMembers = [
  { name: "Cindy", role: "Co-Présidente", emoji: "👩‍💼" },
  { name: "Vincent", role: "Co-Président", emoji: "👨‍💼" },
  { name: "Mehdi", role: "Co-Secrétaire", emoji: "👩‍💻" },
  { name: "Alexia", role: "Co-Secrétaire", emoji: "📝" },
  { name: "Camille", role: "Co-Trésorière", emoji: "💰" },
  { name: "Chiara", role: "Co-Trésorière", emoji: "🧮" },
  { name: "Nora", role: "Responsable reseaux", emoji: "📢" },
  { name: "Yasmine", role: "Responsable communication", emoji: "🤝" },
  { name: "Maité", role: "Responsable SI", emoji: "🌍" },
  { name: "Hanan", role: "Responsable événements", emoji: "🎈" },
];

const values = [
  {
    icon: Heart,
    title: "Bienveillance",
    description: "Un accompagnement chaleureux et positif pour tous les enfants et leurs familles.",
    color: "secondary",
  },
  {
    icon: Users,
    title: "Solidarité",
    description: "Ensemble, nous créons une communauté soudée autour de l'école.",
    color: "sky",
  },
  {
    icon: Target,
    title: "Engagement",
    description: "Des parents investis pour améliorer le quotidien scolaire de nos enfants.",
    color: "accent",
  },
];

const APropos = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-sky-gradient py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-sky/20 watercolor-blob" />
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-primary/20 watercolor-blob" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <Users className="h-4 w-4" />
              Notre association
            </span>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              À propos des<br />
              <span className="text-gradient">P'tits Trinquat</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Depuis plus de 20 ans, notre association rassemble les parents d'élèves du groupe scolaire Anne Frank – Charles Dickens pour accompagner et enrichir la vie scolaire de nos enfants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-bold">
                Notre <span className="text-gradient">mission</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Les P'tits Trinquat est une association de parents d'élèves qui œuvre pour le bien-être et l'épanouissement des enfants au sein du groupe scolaire Anne Frank – Charles Dickens à Montpellier.
                </p>
                <p>
                  Notre mission est triple : <strong>accompagner</strong> les familles dans leur relation avec l'école, <strong>enrichir</strong> la vie scolaire par des activités et événements, et <strong>financer</strong> des projets pédagogiques grâce à nos actions.
                </p>
                <p>
                  Nous travaillons en étroite collaboration avec l'équipe enseignante et la direction pour créer un environnement éducatif stimulant et bienveillant.
                </p>
              </div>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {values.map((value, index) => (
                <Card key={value.title} variant="elevated">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-${value.color}/20`}>
                      <value.icon className={`h-6 w-6 text-${value.color}`} />
                    </div>
                    <div>
                      <h3 className="mb-1 font-bold text-foreground">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bureau */}
      <section id="bureau" className="bg-muted/50 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Le bureau</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Notre équipe de bénévoles dévoués qui font vivre l'association au quotidien.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bureauMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="elevated" className="text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-4xl">
                      {member.emoji}
                    </div>
                    <h3 className="font-bold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl"
          >
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet/20">
                <History className="h-7 w-7 text-violet" />
              </div>
              <h2 className="text-3xl font-bold">Notre histoire</h2>
            </div>

            <div className="space-y-6 text-muted-foreground">
              <p>
                Fondée en 2019, l'association Les P'tits Trinquat est née de la volonté de quelques parents de créer un lien fort entre les familles et l'école. Le nom "Trinquat" fait référence au quartier de Montpellier où se situe notre groupe scolaire.
              </p>
              <p>
                Au fil des années, nous avons organisé des centaines d'événements : fêtes de l'école, marchés de Noël, ventes de gâteaux, sorties scolaires... Chaque action contribue à financer des projets pédagogiques et à créer des moments de partage inoubliables.
              </p>
              <p>
                Aujourd'hui, nous sommes fiers de rassembler plus de 150 familles et de compter sur une équipe de bénévoles engagés qui font vivre l'association au quotidien.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Join CTA */}
      <section id="adherer" className="bg-gradient-to-br from-primary via-primary to-secondary py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <UserCheck className="mx-auto mb-6 h-16 w-16 text-primary-foreground/80" />
            <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground sm:text-4xl">
              Rejoignez l'aventure !
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80">
              L'adhésion annuelle est de seulement <strong className="text-primary-foreground">1€ par personne</strong>. Elle nous permet de financer nos actions et vous donne accès à tous nos événements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                className="bg-background text-primary hover:bg-background/90 shadow-lg rounded-2xl font-bold"
                >
                  <Link to="https://www.helloasso.com/associations/les-p-tits-trinquat#membership" target="_blank">
                    Adhérer maintenant
                  </Link>
              </Button>
              <Button
                size="xl"
                variant="ghost"
                className="text-primary-foreground border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 rounded-2xl font-bold"
                asChild
              >
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default APropos;
