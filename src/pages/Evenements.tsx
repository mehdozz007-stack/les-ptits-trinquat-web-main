import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { url } from "inspector";

const events = [
    {
    id: 7,
    title: "📣 Notre TOMBOLA de la rentrée est lancée ! Jouez et gagnez avec nous de superbes lots ! 🎁",
    date: "8 Décembre 2025 - Lancement",
    time: "8 Décembre 2025 - 16 Février 2026",
    location: "Groupe scolaire FRANK-DICKENS",
    description: "Gagnez des gros cadeaux avec notre TOMBOLA.\nSuivez la liste de nos lots à gagner sur nos réseaux et achetez vos billets pour soutenir les projets de l'association.",
    color: "accent",
    status: "upcoming",
    attendees: 500,
    url: "/partenaires"
  },
  {
    id: 3,
    title: "Réunion mensuelle des parents",
    date: "12 Décembre 2025",
    time: "17h30 - 19h30",
    location: "Salle polyvalente",
    description: "Bilan du trimestre et préparation aux prochains événements.",
    color: "secondary",
    status: "past",
    attendees: 30,
  },
  {
    id: 2,
    title: "🎄 Vente de gâteaux de Noël 🎄",
    date: "19 Décembre 2025",
    time: "16h30 - 18h00",
    location: "Le parvis de l'école ou salle annexe Boris Vian selon la météo",
    description: "Participez à notre traditionnelle vente de gâteaux pour financer les projets scolaires.\nLes conditions météorologiques peuvent influencer le lieu. L'événement pourra se tenir à la salle d'événement annexe de la maison pour tous Boris Vian.",
    color: "violet",
    status: "upcoming",
    attendees: 300,
    url: "https://www.facebook.com/photo/?fbid=1161733842794558&set=pcb.1161735462794396"
  },
  {
    id: 4,
    title: "📝 Conseil d'école SI 🌍",
    date: "7 Janvier 2026",
    time: "18h30 - 20h00",
    location: "Salle polyvalente",
    description: "Bilan de l'année, présentation des projets et resultats élection des parents.",
    color: "sky",
    status: "upcoming",
    attendees: 50,
  },
  {
    id: 9,
    title: "💞 Réunion mensuelle des parents 👨‍👩‍👧‍👦",
    date: "30 Janvier 2026",
    time: "17h30 - 19h30",
    location: "Salle polyvalente",
    description: "Préparation aux prochains événements.",
    color: "secondary",
    status: "upcoming",
    attendees: 30,
  },
  {
    id: 8,
    title: "🎉 Carnaval 🎭",
    date: "17 Avril 2026",
    time: "08h30 - 16h30",
    location: "Toute l'école",
    description: "Les enfants auront le choix de se déguiser en des insectes ou des fleurs, pour célébrer le printemps dans les classes.",
    color: "accent",
    status: "upcoming",
    attendees: 380,
  },
  {
    id: 1,
    title: "🏫 Fête d'école 🎊",
    date: "19 Juin 2026",
    time: "14h00 - 19h00",
    location: "Cour de l'école",
    description: "Jeux, spectacles, stands gourmands et animations pour célébrer ensemble la fin d'année scolaire !",
    color: "primary",
    status: "upcoming",
    attendees: 800,
  },
  {
    id: 5,
    title: "Vente de Toussaint",
    date: "16 et 17 Octobre 2025",
    time: "16h30 - 19h00",
    location: "Préau de l'école",
    description: "Stands de créations, boissons chaudes et animations pour petits et grands.",
    color: "violet",
    status: "past",
    attendees: 250,
    url: "https://www.instagram.com/p/DPn9cLdiBTC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
  },
  {
    id: 6,
    title: "Fête des Lanternes",
    date: "10 Novembre 2025",
    time: "14h00 - 17h00",
    location: "Cour de l'école",
    description: "Goûter d'automne et parcourir le parc de la Rauze à la tombée de la nuit en chantant des chansons célébrant Saint Martin.",
    color: "accent",
    status: "past",
    attendees: 350,
    url: "https://www.instagram.com/p/DQVIRmDiF5Q/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
  },
];

const colorClasses = {
  primary: { bg: "bg-primary", text: "text-primary", light: "bg-primary/10" },
  secondary: { bg: "bg-secondary", text: "text-secondary", light: "bg-secondary/10" },
  sky: { bg: "bg-sky", text: "text-sky", light: "bg-sky/10" },
  accent: { bg: "bg-accent", text: "text-accent", light: "bg-accent/10" },
  violet: { bg: "bg-violet", text: "text-violet", light: "bg-violet/10" },
};

const Evenements = () => {
  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const pastEvents = events.filter((e) => e.status === "past");

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-sky/20 watercolor-blob" />
          <div className="absolute bottom-10 left-10 h-40 w-40 rounded-full bg-primary/20 watercolor-blob" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky/20 px-4 py-1.5 text-sm font-semibold text-sky-foreground">
              <Calendar className="h-4 w-4" />
              Événements
            </span>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Nos rendez-vous<br />
              <span className="text-gradient">tout au long de l'année</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Découvrez les événements organisés par Les P'tits Trinquat pour animer la vie scolaire et créer des moments de partage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 text-2xl font-bold">Prochains événements</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event, index) => {
              const colors = colorClasses[event.color as keyof typeof colorClasses];
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="playful" className="group h-full overflow-hidden">
                    <CardContent className="p-0">
                      <div className={`h-2 ${colors.bg}`} />
                      <div className="p-6">
                        <div className={`mb-4 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold ${colors.bg} text-primary-foreground`}>
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </div>

                        <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>

                        <p className="mb-4 text-muted-foreground whitespace-pre-line">
                          {event.description}
                        </p>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className={`h-4 w-4 ${colors.text}`} />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className={`h-4 w-4 ${colors.text}`} />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className={`h-4 w-4 ${colors.text}`} />
                            {event.attendees} participants attendus
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-6"
                          disabled={!event.url} // désactive le bouton si pas d'URL
                        >
                          {event.url ? (
                            <a
                              href={event.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              En savoir plus
                              <ChevronRight className="ml-2 h-5 w-5" />
                            </a>
                          ) : (
                            <span className="flex items-center text-muted-foreground cursor-not-allowed">
                              En savoir plus
                              <ChevronRight className="ml-2 h-5 w-5" />
                            </span>
                          )}
                        </Button>

                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="bg-muted/50 py-12 sm:py-16">
        <div className="container">
          <h2 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-bold">Événements passés</h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            {pastEvents.map((event, index) => {
              const colors = colorClasses[event.color as keyof typeof colorClasses];
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="elevated" className="group h-full">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`flex h-12 sm:h-14 w-12 sm:w-14 shrink-0 items-center justify-center rounded-xl ${colors.light}`}>
                            <Calendar className={`h-5 sm:h-6 w-5 sm:w-6 ${colors.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm sm:text-base text-foreground line-clamp-2">{event.title}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                        {event.url ? (
                          <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto">
                            <a href={event.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-xs sm:text-sm sm:justify-start">
                              Voir
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <div className="flex items-center justify-center sm:justify-start text-muted-foreground text-xs sm:text-sm cursor-default">
                            Voir
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Evenements;
