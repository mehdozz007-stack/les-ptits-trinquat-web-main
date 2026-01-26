import { motion } from "framer-motion";
import { Gift } from "lucide-react";

export function TombolaHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-sky/5 py-16 md:py-24">
      {/* Decorative elements */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/4 h-32 w-32 -translate-x-1/2 rounded-full bg-sky/10 blur-2xl" />

      {/* Floating emojis */}
      <motion.div
        className="absolute left-[10%] top-[20%] text-4xl"
        animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        🎁
      </motion.div>
      <motion.div
        className="absolute right-[20%] top-[40%] text-3xl"
        animate={{ y: [0, -10, 0], rotate: [5, -5, 5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        🎈
      </motion.div>
      <motion.div
        className="absolute left-[20%] bottom-[25%] text-3xl"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute right-[10%] bottom-[20%] text-4xl"
        animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        🎉
      </motion.div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", bounce: 0.5 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-soft"
          >
            <Gift className="h-10 w-10 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
          >
            La Tombola des{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-sky bg-clip-text text-transparent">
              P'tits Trinquât
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mx-auto max-w-xl text-lg text-muted-foreground md:text-xl"
          >
            Un moment de partage, de sourires et de solidarité entre familles 💖
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-soft">
              <span className="text-xl">👨‍👩‍👧‍👦</span>
              <span>Inscrivez-vous</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-soft">
              <span className="text-xl">🎁</span>
              <span>Proposez des lots</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-soft">
              <span className="text-xl">🤝</span>
              <span>Échangez entre familles</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block h-12 w-full md:h-16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,140.83,94.17,208.18,70.28,googl285.6,43.39,254.29,63.65,321.39,56.44Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
