import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TombolaParticipantPublic } from "@/hooks/useTombolaParticipants";

interface ParticipantCardProps {
  participant: TombolaParticipantPublic;
  index: number;
}

export function ParticipantCard({ participant, index }: ParticipantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card 
        
        className="group h-full cursor-default transition-all duration-300 hover:-translate-y-2 hover:shadow-glow"
      >
        <CardContent className="flex flex-col items-center p-6 text-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.3 }}
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-sky/20 text-4xl shadow-soft"
          >
            {participant.emoji}
          </motion.div>
          
          <h3 className="mb-1 text-lg font-bold text-foreground">
            {participant.prenom}
          </h3>
          
          <span className="mb-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {participant.role}
          </span>
          
          {participant.classes && (
            <p className="text-sm text-muted-foreground">
              {participant.classes}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
