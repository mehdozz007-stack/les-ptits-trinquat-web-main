import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

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
  {
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
  },
  {
    id: 1,
    title: " TOMBOLA 2026 - Merci pour votre participation !",
    description: "Échangez vos lots avec les familles ! 🎁 ✨",
    color: "accent",
    status: "upcoming",
    attendees: 500,
    url: "/auth"
  },
  /*{
    id: 6,
    title: "Carnaval à l'école",
    date: "17 Avril 2026",
    time: "08h30 - 16h30",
    location: "Toute l'école",
    description: "Le carnaval s'invite à l'école pendant le temps de classe pour un moment joyeux et coloré.\nLes enfants pourront venir déguisés en insectes ou en fleurs afin de célébrer ensemble l'arrivée du printemps dans leurs classes 🌼🐝",
    color: "sky",
    status: "upcoming",
    attendees: 380,
  },*/
];

const titleGradients = {
  primary: "bg-gradient-to-r from-primary via-secondary to-pink bg-clip-text text-transparent font-extrabold",
  secondary: "bg-gradient-to-r from-secondary via-primary to-orange-500 bg-clip-text text-transparent font-extrabold",
  sky: "bg-gradient-to-r from-sky-600 via-blue-600 to-violet-600 bg-clip-text text-transparent font-extrabold",
  accent: "bg-gradient-to-r from-accent via-green-600 to-yellow-400 bg-clip-text text-transparent font-extrabold",
  violet: "bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold",
};

const cardGradients: Record<string, string> = {
  primary: "border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-pink/10",
  secondary: "border-secondary/30 bg-gradient-to-br from-secondary/10 via-primary/5 to-orange-500/10",
  sky: "border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-violet-500/10",
  accent: "border-accent/30 bg-gradient-to-br from-accent/10 via-yellow-300/5 to-green-500/10",
  violet: "border-violet-500/30 bg-gradient-to-br from-violet-500/25 via-purple-300/15 to-pink-500/20",
};

export function EventsPreview() {
  // Déterminer si l'utilisateur préfère les animations réduites
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col text-center items-center gap-2 sm:gap-4"
        >
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs sm:text-sm font-semibold text-primary">
            Événements
          </span>
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
                          <Calendar className={`h-5 w-5 ${event.color === 'accent' ? 'text-accent' : 'text-violet-500'} flex-shrink-0`} />
                          <span>{event.date || event.time}</span>
                        </motion.div>
                      )}
                      {event.time && (
                        <motion.div
                          animate={prefersReducedMotion ? {} : { y: [0, -4, 0] }}
                          transition={prefersReducedMotion ? {} : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          className="flex items-center gap-3"
                        >
                          <Clock className={`h-5 w-5 ${event.color === 'accent' ? 'text-accent' : 'text-violet-500'} flex-shrink-0`} />
                          <span>{event.time}</span>
                        </motion.div>
                      )}
                      {event.location && (
                        <motion.div
                          animate={prefersReducedMotion ? {} : { y: [0, -4, 0] }}
                          transition={prefersReducedMotion ? {} : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          className="flex items-center gap-3"
                        >
                          <MapPin className={`h-5 w-5 ${event.color === 'accent' ? 'text-accent' : 'text-violet-500'} flex-shrink-0`} />
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
