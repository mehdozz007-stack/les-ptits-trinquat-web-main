import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedAuthStatusProps {
  isConnected: boolean;
  parentName?: string;
  parentEmoji?: string;
  onDisconnect?: () => void;
}

export function AnimatedAuthStatus({
  isConnected,
  parentName,
  parentEmoji = "😊",
  onDisconnect,
}: AnimatedAuthStatusProps) {
  const containerVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const emojiVariants = {
    animate: {
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mb-6 flex justify-center items-center gap-3 flex-wrap"
    >
      <motion.div variants={emojiVariants} className="text-2xl">
        {parentEmoji}
      </motion.div>
      <div className="text-sm font-semibold text-emerald-600">
        ✅ Connecté en tant que {parentName}
      </div>
      <motion.button
        onClick={onDisconnect}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-1.5 bg-rose-100 text-rose-700 rounded-full text-sm font-semibold hover:bg-rose-200 transition-colors"
      >
        Déconnexion
      </motion.button>
    </motion.div>
  );
}

// Animated reconnection prompt
export function AnimatedReconnectionPrompt({
  children,
}: {
  children: ReactNode;
}) {
  const floatingVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      variants={floatingVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mb-8 max-w-2xl mx-auto"
    >
      {children}
    </motion.div>
  );
}

// Confetti animation for celebrations
export function ConfettiCelebration() {
  // Réduire le nombre de confetti sur mobile (10) vs desktop (15)
  const confettiCount = typeof window !== "undefined" && window.innerWidth < 640 ? 10 : 15;
  const confetti = Array.from({ length: confettiCount }).map((_, i) => ({
    id: i,
    delay: i * 0.05,
    duration: 2.5 + Math.random() * 0.5,
    x: (Math.random() - 0.5) * 200,
    y: Math.random() * -120,
    rotation: Math.random() * 720,
    emoji: ["🎉", "🎊", "✨", "🌟", "💫", "🎈", "🎀", "💝"][
      Math.floor(Math.random() * 8)
    ],
  }));

  return (
    <>
      {confetti.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: 0,
            x: particle.x,
            y: particle.y,
            rotate: particle.rotation,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut",
          }}
          className="fixed pointer-events-none text-3xl"
          style={{
            top: "30%",
            left: "50%",
            zIndex: 10,
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </>
  );
}
