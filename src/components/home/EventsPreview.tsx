import React from 'react';
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateFr } from "@/lib/actualites";

// Bubble animation component
const FloatingBubble = ({ delay, duration, size }: { delay: number; duration: number; size: string }) => (
  <motion.div
    className={`absolute rounded-full ${size} bg-white/20 backdrop-blur-sm`}
    animate={{
      y: [0, -400, 0],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const upcomingEvents = [
  /*{
    id: 2,
    title: "La crèpe party de l'école - Participez à notre traditionnelle vente de crêpes !",
    date: "20 Février 2026",
    time: "16h30 - 18h00",
    location: "Le parvis de l'école",
    description: "Nous faisons le choix de reverser l'intégralité des bénéfices à la maman durement touchée par l'incendie ! Venez nombreux pour soutenir cette cause et déguster de délicieuses crêpes préparées par nos bénévoles ! 🥞❤️",
    color: "violet",
    status: "upcoming",
    attendees: 200,
    url: "/actualites/act-004"
  },*/
  {
    id: 2,
    title: "Deuxième conseil d'école de l'année",
    description: "Nous vous accueillons pour le deuxième conseil d'école de l'année. Un moment d'échange et de partage pour discuter de la vie de l'école et des projets pédagogiques.",
    date: "2026-03-24",
    time: "17h45 - 19h00",
    location: "Salle polyvalente de l'école",
    color: "sky",
    status: "upcoming",
    url: "/actualites/conseil-ecole-002",
  },
  {
    id: 1,
    title: "Vide Grenier à l'école: La Récré des bonnes affaires !",
    description: "Un vide grenier convivial avec animations, musique et bonne ambiance en famille. Venez dénicher de bonnes affaires tout en participant à la vie de l'école !",
    date: "2026-04-12",
    time: "10h00 - 16h00",
    location: "Cour de l'école",
    color: "emerald",
    status: "upcoming",
    attendees: 400,
    url: "/actualites/act-010",
  },
];

const titleGradients = {
  primary: "bg-gradient-to-r from-primary via-secondary to-pink bg-clip-text text-transparent font-extrabold",
  secondary: "bg-gradient-to-r from-secondary via-primary to-orange-500 bg-clip-text text-transparent font-extrabold",
  sky: "bg-gradient-to-r from-sky-600 via-blue-600 to-violet-600 bg-clip-text text-transparent font-extrabold",
  accent: "bg-gradient-to-r from-accent via-green-600 to-yellow-400 bg-clip-text text-transparent font-extrabold",
  violet: "bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold",
  rose: "bg-gradient-to-r from-rose-600 via-pink-500 to-rose-400 bg-clip-text text-transparent font-extrabold",
  emerald: "bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent font-extrabold",
  amber: "bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent font-extrabold",
  cyan: "bg-gradient-to-r from-cyan-600 via-blue-500 to-sky-500 bg-clip-text text-transparent font-extrabold",
  indigo: "bg-gradient-to-r from-indigo-600 via-purple-500 to-violet-500 bg-clip-text text-transparent font-extrabold",
  fuchsia: "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-500 bg-clip-text text-transparent font-extrabold",
};

const cardGradients: Record<string, string> = {
  primary: "border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-pink/10",
  secondary: "border-secondary/30 bg-gradient-to-br from-secondary/10 via-primary/5 to-orange-500/10",
  sky: "border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-violet-500/10",
  accent: "border-accent/30 bg-gradient-to-br from-accent/10 via-yellow-300/5 to-green-500/10",
  violet: "border-violet-500/30 bg-gradient-to-br from-violet-500/25 via-purple-300/15 to-pink-500/20",
  rose: "border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-pink-300/5 to-rose-200/10",
  emerald: "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-green-300/5 to-teal-200/10",
  amber: "border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-300/5 to-yellow-200/10",
  cyan: "border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-blue-300/5 to-sky-200/10",
  indigo: "border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-300/5 to-violet-200/10",
  fuchsia: "border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 via-pink-300/5 to-purple-200/10",
};

export function EventsPreview() {
  // Déterminer si l'utilisateur préfère les animations réduites
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="mb-6 flex justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF7B42] to-[#C55FA8] shadow-md flex-shrink-0"
          >

            <Clock className="h-10 w-10 sm:h-8 sm:w-8 text-white" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col text-center items-center gap-2 sm:gap-4"
        >
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Nos prochains <span className="text-gradient">rendez-vous</span>
          </h2>
          <p className="max-w-2xl text-sm sm:text-lg text-muted-foreground">
            Retrouvez-nous lors de nos prochains événements et partagez des moments conviviaux avec la communauté scolaire.
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="space-y-8">
          {upcomingEvents.map((event, index) => (
            <a key={event.id} href={event.url} className="block">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                animate={prefersReducedMotion ? {} : {
                  y: [0, -6, 0],
                  opacity: 1
                }}
                transition={prefersReducedMotion ? {} : {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  opacity: { duration: 0.8, ease: "easeOut" }
                }}
                className="relative mx-auto max-w-2xl"
              >
                {/* Animated background glow - simplifié sur mobile */}
                {!prefersReducedMotion && (
                  <motion.div
                    animate={{
                      opacity: isMobile ? [0.4, 0.5, 0.4] : [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`absolute -inset-1 rounded-2xl ${event.color === 'accent'
                      ? 'bg-gradient-to-r from-accent via-yellow-300 to-accent'
                      : event.color === 'rose'
                        ? 'bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500'
                        : event.color === 'emerald'
                          ? 'bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500'
                          : event.color === 'amber'
                            ? 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500'
                            : event.color === 'cyan'
                              ? 'bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500'
                              : event.color === 'indigo'
                                ? 'bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-500'
                                : event.color === 'fuchsia'
                                  ? 'bg-gradient-to-r from-fuchsia-500 via-purple-400 to-fuchsia-500'
                                  : 'bg-gradient-to-r from-violet-500 via-purple-400 to-pink-500'
                      } ${isMobile ? 'blur-md' : 'blur-lg'}`}
                  />
                )}

                {/* Card - bubbles seulement sur desktop */}
                <Card variant="playful" className={`group relative overflow-hidden border-2 ${cardGradients[event.color as keyof typeof cardGradients]}`}>
                  {/* Bubble columns - uniquement sur desktop */}
                  {!isMobile && !prefersReducedMotion && (
                    <div className="absolute inset-0 overflow-hidden">
                      {/* Column 1 */}
                      <div className="absolute left-1/4 top-0 h-full w-1/12">
                        <FloatingBubble delay={0} duration={4} size="w-3 h-3" />
                        <FloatingBubble delay={0.8} duration={5} size="w-2 h-2" />
                        <FloatingBubble delay={1.6} duration={4.5} size="w-4 h-4" />
                      </div>

                      {/* Column 2 */}
                      <div className="absolute left-1/2 top-0 h-full w-1/12">
                        <FloatingBubble delay={0.4} duration={4.5} size="w-2 h-2" />
                        <FloatingBubble delay={1.2} duration={5} size="w-3 h-3" />
                        <FloatingBubble delay={2} duration={4} size="w-2 h-2" />
                      </div>

                      {/* Column 3 */}
                      <div className="absolute right-1/4 top-0 h-full w-1/12">
                        <FloatingBubble delay={0.6} duration={5} size="w-4 h-4" />
                        <FloatingBubble delay={1.4} duration={4} size="w-2 h-2" />
                        <FloatingBubble delay={2.2} duration={4.5} size="w-3 h-3" />
                      </div>
                    </div>
                  )}

                  <CardContent className="relative z-10 p-8 sm:p-12">
                    {/* Title */}
                    <motion.h3
                      animate={prefersReducedMotion ? {} : { y: [0, -4, 0] }}
                      transition={prefersReducedMotion ? {} : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className={`text-base sm:text-xl font-bold mb-6 text-center ${titleGradients[event.color as keyof typeof titleGradients]}`}
                    >
                      {event.title}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                      animate={prefersReducedMotion ? {} : {
                        y: [0, -4, 0],
                      }}
                      transition={prefersReducedMotion ? {} : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-6 text-muted-foreground text-base sm:text-lg text-center"
                    >
                      {event.description}
                    </motion.p>

                    {/* Meta Information */}
                    <motion.div
                      className="space-y-3 text-sm sm:text-base text-muted-foreground"
                    >
                      {/* Date */}
                      {(event.date || event.time) && (
                        <motion.div
                          animate={prefersReducedMotion ? {} : { y: [0, -4, 0] }}
                          transition={prefersReducedMotion ? {} : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          className="flex items-center gap-3"
                        >
                          <Calendar className={`h-5 w-5 ${event.color === 'accent' ? 'text-accent' : event.color === 'rose' ? 'text-rose-500' : event.color === 'emerald' ? 'text-emerald-500' : event.color === 'amber' ? 'text-amber-500' : event.color === 'cyan' ? 'text-cyan-500' : event.color === 'indigo' ? 'text-indigo-500' : event.color === 'fuchsia' ? 'text-fuchsia-500' : 'text-violet-500'} flex-shrink-0`} />
                          <span>{event.date ? formatDateFr(event.date) : event.time}</span>
                        </motion.div>
                      )}
                      {event.time && (
                        <motion.div
                          animate={prefersReducedMotion ? {} : { y: [0, -4, 0] }}
                          transition={prefersReducedMotion ? {} : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          className="flex items-center gap-3"
                        >
                          <Clock className={`h-5 w-5 ${event.color === 'accent' ? 'text-accent' : event.color === 'rose' ? 'text-rose-500' : event.color === 'emerald' ? 'text-emerald-500' : event.color === 'amber' ? 'text-amber-500' : event.color === 'cyan' ? 'text-cyan-500' : event.color === 'indigo' ? 'text-indigo-500' : event.color === 'fuchsia' ? 'text-fuchsia-500' : 'text-violet-500'} flex-shrink-0`} />
                          <span>{event.time}</span>
                        </motion.div>
                      )}
                      {event.location && (
                        <motion.div
                          animate={prefersReducedMotion ? {} : { y: [0, -4, 0] }}
                          transition={prefersReducedMotion ? {} : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          className="flex items-center gap-3"
                        >
                          <MapPin className={`h-5 w-5 ${event.color === 'accent' ? 'text-accent' : event.color === 'rose' ? 'text-rose-500' : event.color === 'emerald' ? 'text-emerald-500' : event.color === 'amber' ? 'text-amber-500' : event.color === 'cyan' ? 'text-cyan-500' : event.color === 'indigo' ? 'text-indigo-500' : event.color === 'fuchsia' ? 'text-fuchsia-500' : 'text-violet-500'} flex-shrink-0`} />
                          <span>{event.location}</span>
                        </motion.div>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
