import { motion } from "framer-motion";
import { CheckCircle, Heart, ArrowLeft, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const MessageEnvoye = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero min-h-screen flex items-center justify-center py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 right-1/4 h-60 w-60 rounded-full bg-secondary/20 watercolor-blob" />
          <div className="absolute bottom-10 left-10 h-40 w-40 rounded-full bg-accent/20 watercolor-blob" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-center mx-auto"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/20 rounded-full blur-2xl animate-pulse" />
                <CheckCircle className="h-24 w-24 text-secondary relative z-10" strokeWidth={1.5} />
              </div>
            </motion.div>

            {/* Main Message */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
            >
              Merci <span className="text-gradient">beaucoup !</span>
            </motion.h1>

            {/* Warm Message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-lg sm:text-xl text-muted-foreground leading-relaxed"
            >
              Votre message a bien été reçu ! Nous sommes heureux de vous lire.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8 text-base sm:text-lg text-muted-foreground"
            >
              Notre équipe vous répondra dans les plus brefs délais. Merci de faire partie de notre belle communauté !
            </motion.p>

            {/* Heart Icon Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8 flex justify-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-12 w-12 text-primary fill-primary" />
              </motion.div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild variant="playful" size="lg">
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Retourner à l'accueil
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/partenaires">
                  Découvrir nos partenaires
                </Link>
              </Button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 p-6 rounded-2xl bg-muted/30 border border-muted-foreground/10 max-w-md mx-auto"
            >
              <p className="text-sm text-muted-foreground">
                En attendant, n'hésitez pas à nous suivre sur les réseaux pour rester informé de nos événements !
              </p>
              <div className="mt-4 flex gap-3 justify-center">
                <Button variant="ghost" size="icon" asChild className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-pink-200 hover:bg-pink-300">
                      <a href="https://www.instagram.com/Les_ptits_trinquat" target="_blank" rel="noopener noreferrer" title="Instagram">
                        <Instagram className="h-6 w-6 sm:h-7 sm:w-7 text-pink-600" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-sky-200 hover:bg-sky-300">
                      <a href="https://www.facebook.com/LesPtitsTrinquats" target="_blank" rel="noopener noreferrer" title="Facebook">
                        <Facebook className="h-6 w-6 sm:h-7 sm:w-7 text-sky-600" />
                      </a>
                    </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default MessageEnvoye;
