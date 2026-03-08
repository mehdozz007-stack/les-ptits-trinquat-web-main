import React from 'react';
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { url } from "inspector";
import crepesParty from "@/assets/Crepes_party_Affiche.jpg";
const events = [
  {
    id: 1,
    title: "📣 Notre TOMBOLA de la rentrée est lancée ! Jouez et gagnez avec nous de superbes lots ! 🎁",
    date: "8 Décembre 2025 - Lancement",
    time: "Remise de tickets jusqu'au 20 janvier 2026",
    location: "Groupe scolaire FRANK-DICKENS",
    description: "La tombola de l'association est un moment convivial qui permet aux enfants de s'impliquer dans la vie de leur école, en vendant des tickets avec fierté et confiance.\nGrâce au soutien de nos partenaires, de nombreux lots attendent les participants. Chaque ticket contribue directement aux projets ludiques de l'association.\nUn futur espace en ligne viendra également faciliter les échanges autour des lots, pour prolonger l'esprit de partage après le tirage.\n\nConsultez la liste de nos partenaires et tentez votre chance !\n16 Février 2026 le tirage au sort. Bonne chance à tous !",
    color: "accent",
    status: "upcoming",
    attendees: 500,
    url: "/partenaires"
  },
  {
    id: 5,
    title: "💞 Réunion mensuelle des parents 👨‍👩‍👧‍👦",
    date: "30 Janvier 2026",
    time: "17h30 - 19h30",
    location: "Salle polyvalente",
    description: "Un temps d'échange pour construire ensemble les futurs temps forts de l'école.",
    color: "secondary",
    status: "past",
    attendees: 30,
  },
  {
    id: 4,
    title: "📝 Conseil d'école SI 🌍",
    date: "20 Janvier 2026",
    time: "17h45 - 19h15",
    location: "Salle polyvalente",
    description: "Un temps de partage pour revenir ensemble sur l'année écoulée, découvrir les projets menés et ceux à venir, et connaître les résultats de l'élection des parents.",
    color: "sky",
    status: "past",
    attendees: 50,
  },
  {
    id: 3,
    title: "🎄 Vente de gâteaux de Noël 🎅",
    date: "19 Décembre 2025",
    time: "16h30 - 18h00",
    location: "Le parvis de l'école ou salle annexe Boris Vian selon la météo",
    description: "Participez à notre traditionnelle vente de gâteaux, un moment gourmand et convivial pour soutenir les projets de l'école.\nSelon la météo, l'événement pourra se dérouler à la salle d'événement annexe de la Maison pour Tous Boris Vian.",
    color: "violet",
    status: "past",
    attendees: 300,
    url: "https://www.instagram.com/p/DSdZRPHCL8J/?img_index=1"
  },
  {
    id: 10,
    title: "La crèpe party de l'école ! 🥞🎉",
    date: "20 Février 2026",
    time: "16h30 - 18h00",
    location: "Le parvis de l'école",
    description: "Partagez un doux moment de gourmandise lors de notre vente de crêpes, une belle occasion de se retrouver et de soutenir ensemble les projets de l'école.",
    color: "violet",
    status: "upcoming",
    attendees: 500,
    url: crepesParty
  },
  {
    id: 6,
    title: "🎉 Carnaval 🎭",
    date: "17 Avril 2026",
    time: "08h30 - 16h30",
    location: "Toute l'école",
    description: "Le carnaval s'invite à l'école pendant le temps de classe pour un moment joyeux et coloré.\nLes enfants pourront venir déguisés en insectes ou en fleurs afin de célébrer ensemble l'arrivée du printemps dans leurs classes 🌼🐝",
    color: "accent",
    status: "upcoming",
    attendees: 380,
  },
  {
    id: 7,
    title: "🏫 Fête d'école 🎊",
    date: "19 Juin 2026",
    time: "14h00 - 19h00",
    location: "Cour de l'école",
    description: "Rires, jeux, spectacles et douceurs gourmandes vous attendent pour partager ensemble un moment joyeux et festif et célébrer la fin de l'année scolaire 🌟🍭",
    color: "primary",
    status: "upcoming",
    attendees: 800,
  },
  {
    id: 8,
    title: "🧛 Vente de Toussaint 🎃",
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
    id: 9,
    title: "🏮 Fête des Lanternes 🕯️",
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
                  key={event.id} id={`event-${event.id}`} initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="playful" className="group h-full overflow-hidden flex flex-col">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className={`h-2 ${colors.bg}`} />
                      <div className="p-6 flex-1 flex flex-col">
                        <div className={`mb-4 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold ${colors.bg} text-primary-foreground w-fit`}>
                          <Calendar className="h-4 w-4" />
                          {formatDateFr(event.date)}
                        </div>

                        <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>

                        <p className="mb-4 text-muted-foreground whitespace-pre-line flex-1">
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
                      </div>

                      <div className="p-6 pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled={!event.url}
                        >
                          {event.url ? (
                            <a
                              href={event.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-full"
                            >
                              En savoir plus
                              <ChevronRight className="ml-2 h-5 w-5" />
                            </a>
                          ) : (
                            <span className="flex items-center justify-center text-muted-foreground cursor-not-allowed">
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
                            <p className="text-xs sm:text-sm text-muted-foreground">{formatDateFr(event.date)}</p>
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
