import { motion } from "framer-motion";
import { ArrowRight, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary py-20 md:py-28">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-background/10 watercolor-blob" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-background/10 watercolor-blob" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 rounded-full bg-background/5 watercolor-blob" />
      </div>

      {/* Floating decorative icons */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] hidden lg:block"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/20 backdrop-blur-sm">
          <Heart className="h-8 w-8 text-background" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[10%] hidden lg:block"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/20 backdrop-blur-sm">
          <Users className="h-8 w-8 text-background" />
        </div>
      </motion.div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
            Rejoignez l'aventure des<br />
            P'tits Trinquat !
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/80 leading-relaxed">
            Que vous souhaitiez participer activement au bureau, donner un coup de main ponctuel lors des événements, ou simplement adhérer pour soutenir nos actions, votre engagement compte !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="xl"
              className="bg-background text-primary hover:bg-background/90 shadow-lg hover:shadow-xl hover:-translate-y-1 rounded-2xl font-bold"
              asChild
            >
              <Link to="https://www.helloasso.com/associations/les-p-tits-trinquat/adhesions/nous-soutenir" target="_blank">
                Adhérer à l'association
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="ghost"
              className="text-primary-foreground border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 rounded-2xl font-bold"
              asChild
            >
              <Link to="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
