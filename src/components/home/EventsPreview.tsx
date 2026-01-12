import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const upcomingEvents = [
  /*{
    id: 1,
    title: "Fête de l'école",
    date: "19 Juin 2026",
    time: "14h00 - 19h00",
    location: "Cour de l'école",
    description: "Jeux, spectacles et goûter pour célébrer la fin d'année !",
    color: "primary",
  },
  {
    id: 2,
    title: "Carnaval",
    date: "17 Avril 2026",
    time: "16h30 - 18h00",
    location: "Hall d'entrée",
    description: "Les enfants, participez avec des déguisements d'insectes et de fleurs pour célébrer le printemps.",
    color: "secondary",
  },*/
  {
   id: 1,
   title: "📣 TOMBOLA de la rentrée 2025-2026 est lancée ! 🎁",
   date: "8 Décembre 2025 - Lancée",
   time: "8 Décembre 2025 - 16 Février 2026",
   location: "Groupe scolaire FRANK-DICKENS",
   description: "Gagnez des gros lots avec notre TOMBOLA. Regardez la liste de nos partenaires !",
   color: "accent",
   status: "upcoming",
   attendees: 500,
   url: "/partenaires"
  },
  {
    id: 4,
    title: "📝 Conseil d'école SI 🌍",
    date: "20 Janvier 2026",
    time: "17h45 - 19h15",
    location: "Salle polyvalente",
    description: "Bilan de l'année, présentation des projets et resultats élection des parents.",
    color: "sky",
    status: "upcoming",
    attendees: 50,
  },
  {
    id: 5,
    title: "💞 Réunion mensuelle des parents 👨‍👩‍👧‍👦",
    date: "30 Janvier 2026",
    time: "17h30 - 19h30",
    location: "Salle polyvalente",
    description: "Un temps d’échange pour construire ensemble les futurs temps forts de l’école.",
    color: "secondary",
    status: "upcoming",
    attendees: 30,
  },
  /*{
    id: 3,
    title: "🎄 Vente de gâteaux de Noël 🎄",
    date: "19 Décembre 2025",
    time: "16h30 - 18h00",
    location: "Le parvis de l'école ou salle annexe Boris Vian selon la météo",
    description: "Participez à notre traditionnelle vente de gâteaux, un moment gourmand et convivial pour soutenir les projets de l'école.",
    color: "violet",
    status: "past",
    attendees: 300,
    url: "https://www.facebook.com/photo/?fbid=1161733842794558&set=pcb.1161735462794396"
  },*/
];

const colorClasses = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  sky: "bg-sky text-sky-foreground",
  accent: "bg-accent text-accent-foreground",
  violet: "bg-violet text-violet-foreground",
};

export function EventsPreview() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col sm:text-center items-start sm:items-center gap-2 sm:gap-4"
        >
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs sm:text-sm font-semibold text-primary">
            Événements
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Prochains rendez-vous
          </h2>
          <p className="max-w-2xl text-sm sm:text-lg text-muted-foreground">
            Retrouvez-nous lors de nos prochains événements et partagez des moments conviviaux avec la communauté scolaire.
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="playful" className="group h-full overflow-hidden">
                <CardContent className="p-0">
                  {/* Color Banner */}
                  <div className={`h-2 ${colorClasses[event.color as keyof typeof colorClasses]}`} />
                  
                  <div className="p-6">
                    {/* Date Badge */}
                    <div className={`mb-6 flex w-fit items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold ${colorClasses[event.color as keyof typeof colorClasses]}`}>
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>

                    {/* Title */}
                    {event.url ? (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors inline-block no-underline"
                      >
                        {event.title}
                      </a>
                    ) : (
                      <Link
                        to="/evenements"
                        className="mb-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors inline-block no-underline"
                      >
                        {event.title}
                      </Link>
                    )}
                    {/* Description */}
                    <p className="mb-4 text-muted-foreground">
                      {event.description}
                    </p>

                    {/* Read More Button */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 hover:bg-gradient-to-br hover:from-primary/10 hover:to-secondary/10 transition-all mb-4"
                      asChild
                    >
                      <Link to={`/evenements#event-${event.id}`}>
                        Lire plus
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>

                    {/* Meta */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/evenements">
              Voir tous les événements
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
