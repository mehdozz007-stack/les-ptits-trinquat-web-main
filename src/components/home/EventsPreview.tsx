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
    id: 1,
    title: " TOMBOLA 2026 - Tirage au sort par les enfants le 16 Février 2026 !",
    time: "16 Février 2026",
    location: "Groupe scolaire FRANK-DICKENS",
    description: "Bonne chance à tous !",
    color: "accent",
    status: "upcoming",
    attendees: 500,
    url: "/partenaires"
  },
  /*{
    id: 10,
    title: "La crèpe party de l'école !",
    date: "20 Février 2026",
    time: "16h30 - 18h00",
    location: "Le parvis de l'école",
    description: "Participez à notre traditionnelle vente de crêpes, un moment gourmand et convivial pour soutenir les projets de l'école.",
    color: "violet",
    status: "upcoming",
    attendees: 500,
    url: "/evenements#event-10"
  },
  {
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

export function EventsPreview() {
  const event = upcomingEvents[0];

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
            Notre prochain <span className="text-gradient">rendez-vous</span>
          </h2>
          <p className="max-w-2xl text-sm sm:text-lg text-muted-foreground">
            Retrouvez-nous lors de nos prochains événements et partagez des moments conviviaux avec la communauté scolaire.
          </p>
        </motion.div>

        {/* Featured Event */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotateX: [0, 5, 0],
            rotateY: [0, 3, 0],
            z: [0, 20, 0]
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ perspective: "1200px" }}
          className="relative mx-auto max-w-2xl"
        >
          {/* Animated background glow */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(255, 193, 7, 0.3), 0 0 40px rgba(255, 193, 7, 0.2)",
                "0 0 40px rgba(255, 193, 7, 0.5), 0 0 80px rgba(255, 193, 7, 0.3)",
                "0 0 20px rgba(255, 193, 7, 0.3), 0 0 40px rgba(255, 193, 7, 0.2)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent via-yellow-300 to-accent opacity-75 blur-lg"
          />

          {/* Card with bubbles */}
          <Card variant="playful" className="group relative overflow-hidden border-2 border-accent/50 bg-gradient-to-br from-accent/20 via-yellow-100/30 to-accent/20">
            {/* Bubble columns */}
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

            <CardContent className="relative z-10 p-8 sm:p-12">
              {/* Title */}
              <motion.h3
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className={`text-base sm:text-xl font-bold mb-6 text-center ${titleGradients[event.color as keyof typeof titleGradients]}`}
              >
                {event.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                animate={{
                  y: [0, -12, 0],
                  textShadow: [
                    "0 0 15px rgba(255, 193, 7, 0.2)",
                    "0 0 35px rgba(255, 193, 7, 0.8)",
                    "0 0 15px rgba(255, 193, 7, 0.2)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="mb-6 text-muted-foreground text-base sm:text-lg text-center"
              >
                {event.description}
              </motion.p>

              {/* Meta Information */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="space-y-3 text-sm sm:text-base text-muted-foreground"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    animate={{
                      textShadow: [
                        "0 0 8px rgba(255, 193, 7, 0.2)",
                        "0 0 20px rgba(255, 193, 7, 0.8)",
                        "0 0 8px rgba(255, 193, 7, 0.2)",
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                  </motion.div>
                  <span>{event.time}</span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    animate={{
                      textShadow: [
                        "0 0 8px rgba(255, 193, 7, 0.2)",
                        "0 0 20px rgba(255, 193, 7, 0.8)",
                        "0 0 8px rgba(255, 193, 7, 0.2)",
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                  </motion.div>
                  <span>{event.location}</span>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
