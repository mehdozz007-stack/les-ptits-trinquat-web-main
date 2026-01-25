import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface AnimatedMessageProps {
  type: "success" | "error";
  title: string;
  message: string;
  emoji?: string;
}

export function AnimatedSuccessMessage({
  title,
  message,
  emoji = "✨",
}: Omit<AnimatedMessageProps, "type">) {
  // Réduire le nombre de confetti sur mobile (8) vs desktop (12)
  const confettiCount = typeof window !== "undefined" && window.innerWidth < 640 ? 8 : 12;
  const confetti = Array.from({ length: confettiCount }).map((_, i) => ({
    id: i,
    delay: i * 0.05,
    duration: 2 + Math.random() * 0.5,
    x: (Math.random() - 0.5) * 150,
    y: Math.random() * -100,
    rotation: Math.random() * 360,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -30 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="fixed top-24 sm:top-20 left-0 right-0 z-50 mx-auto px-2 sm:px-0 max-w-md"
    >
      {/* Confetti particles */}
      {confetti.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0, x: particle.x, y: particle.y, rotate: particle.rotation }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut",
          }}
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
          }}
        >
          <div className="text-2xl">{emoji}</div>
        </motion.div>
      ))}

      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 shadow-lg">
        <CardContent className="p-3 sm:p-6">
          <motion.div
            className="flex items-start gap-3 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CheckCircle2 className="h-5 sm:h-6 w-5 sm:w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h3
                className="font-bold text-emerald-900 text-sm sm:text-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h3>
              <motion.p
                className="text-emerald-700 text-xs sm:text-sm mt-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                {message}
              </motion.p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AnimatedErrorMessage({
  title,
  message,
  emoji = "⚠️",
}: Omit<AnimatedMessageProps, "type">) {
  const shakeVariant = {
    initial: { opacity: 0, y: -30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 15 },
    },
    shake: {
      x: [0, -10, 10, -10, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit={{ opacity: 0, scale: 0.8, y: -30 }}
      variants={shakeVariant}
      className="fixed top-24 sm:top-20 left-0 right-0 z-50 mx-auto px-2 sm:px-0 max-w-md"
      onAnimationComplete={(definition) => {
        if (definition === "animate") {
          setTimeout(() => {
            // Trigger shake animation
          }, 500);
        }
      }}
    >
      <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 shadow-lg">
        <CardContent className="p-3 sm:p-6">
          <motion.div
            className="flex items-start gap-3 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.5, repeat: 2, delay: 0.2 }}
            >
              <AlertCircle className="h-5 sm:h-6 w-5 sm:w-6 text-rose-600 flex-shrink-0 mt-0.5" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h3
                className="font-bold text-rose-900 text-sm sm:text-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h3>
              <motion.p
                className="text-rose-700 text-xs sm:text-sm mt-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                {message}
              </motion.p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
