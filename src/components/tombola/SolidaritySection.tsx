import { motion } from "framer-motion";
import { Heart, Users, Sparkles } from "lucide-react";

export function SolidaritySection() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-sky/10 p-8 md:p-12">
            {/* Decorative elements */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />

            <div className="relative z-10">
              <div className="mb-6 flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
                >
                  <Heart className="h-8 w-8 text-primary" />
                </motion.div>
              </div>

              <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
                L'esprit solidaire de la tombola ❤️
              </h2>

              <p className="mb-8 text-center text-muted-foreground">
                Un lot ne correspond pas à vos besoins ? Échangez-le en toute simplicité 
                entre familles. La tombola, c'est avant tout un moment de partage et de 
                convivialité au service des projets de notre école.
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl bg-card/80 p-6 text-center shadow-soft backdrop-blur-sm"
                >
                  <div className="mb-3 flex justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 font-bold">Solidarité</h3>
                  <p className="text-sm text-muted-foreground">
                    Chaque participation soutient les projets scolaires
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl bg-card/80 p-6 text-center shadow-soft backdrop-blur-sm"
                >
                  <div className="mb-3 flex justify-center">
                    <Heart className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="mb-2 font-bold">Bienveillance</h3>
                  <p className="text-sm text-muted-foreground">
                    Des échanges simples et chaleureux entre familles
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl bg-card/80 p-6 text-center shadow-soft backdrop-blur-sm"
                >
                  <div className="mb-3 flex justify-center">
                    <Sparkles className="h-8 w-8 text-sky" />
                  </div>
                  <h3 className="mb-2 font-bold">Convivialité</h3>
                  <p className="text-sm text-muted-foreground">
                    Un moment festif pour toute la communauté
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
