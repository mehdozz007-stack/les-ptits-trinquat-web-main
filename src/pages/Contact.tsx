import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, HelpCircle, Clock } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  {
    question: "Comment adhérer à l'association ?",
    answer: "L'adhésion se fait en ligne ou lors de nos événements. Le coût est à partir de 1€ par personne pour l'année scolaire.",
  },
  {
    question: "Comment participer aux événements ?",
    answer: "Tous les parents sont les bienvenus ! Inscrivez-vous via notre formulaire de contact ou sur la plateforme en ligne HelloAsso.",
  },
  {
    question: "Comment devenir bénévole ?",
    answer: "Contactez-nous par email ou venez à nos réunions mensuelles. Toute aide, même ponctuelle, est précieuse !",
  },
  {
    question: "Comment proposer un projet ?",
    answer: "Envoyez-nous votre idée via le formulaire de contact. Nous l'étudierons lors de notre prochaine réunion de bureau.",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);

  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);

  // Required fields for FormSubmit
  formData.append("_captcha", "false");
  formData.append("_template", "box");
  formData.append("_subject", "📩 Nouveau message depuis le site Les P'tits Trinquat");

  try {
    const response = await fetch("https://formsubmit.co/ajax/mehdozz007@gmail.com", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Submission failed");
    }

    toast({
      title: "📩 Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });

    form.reset();
  } catch (err) {
    toast({
      title: "Erreur",
      description: "Impossible d’envoyer le message. Merci de réessayer.",
      variant: "destructive",
    });
  }

  setIsSubmitting(false);
};

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 right-1/4 h-60 w-60 rounded-full bg-sky/20 watercolor-blob" />
          <div className="absolute bottom-10 left-10 h-40 w-40 rounded-full bg-primary/20 watercolor-blob" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-center mx-auto"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky/20 px-4 py-1.5 text-sm font-semibold text-sky-foreground">
              <MessageSquare className="h-4 w-4" />
              Contact
            </span>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Nous <span className="text-gradient">contacter</span>
            </h1>
            <p className="inline-flex text-lg text-muted-foreground">
              Une question, une suggestion, envie de nous rejoindre ? N'hésitez pas à nous écrire. 
              Nous sommes là pour vous écouter et vous répondre dans les plus brefs délais.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="mb-6 text-2xl font-bold">Envoyez-nous un message</h2>
                  <form 
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  >
                    {/* Anti-spam honeypot */}
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_template" value="box" />
                    <input type="hidden" name="_subject" value="📩 Nouveau message depuis le site Les P'tits Trinquat" />
                    <input type="hidden" name="_next" value="#" />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input name="Prénom" id="firstName" placeholder="Marie" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input name="Nom" id="lastName" placeholder="Dupont" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        name="Email"
                        id="email"
                        type="email"
                        placeholder="marie.dupont@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Input name="Sujet" id="subject" placeholder="Votre sujet..." required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        name="Message"
                        id="message"
                        placeholder="Votre message..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" variant="playful" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ?
                        "Envoi en cours..." : (
                        <>
                          Envoyer
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Contact Cards */}
              <Card variant="elevated">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Email</h3>
                    <p className="text-muted-foreground">Ecrivez-nous depuis le formulaire</p>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/20">
                    <Phone className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Téléphone</h3>
                    <p className="text-muted-foreground">04 00 00 00 00</p>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky/20">
                    <MapPin className="h-6 w-6 text-sky" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Adresse</h3>
                    <p className="text-muted-foreground">
                      Groupe scolaire Anne Frank – Charles Dickens<br />
                      Montpellier, France
                      {/* Link */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-auto"
                      asChild
                    >
                      <a
                        href="https://digipad.app/p/1394770/39b6b0ff88979"
                        target="_blank"
                        rel="noopener noreferrer"
                      > 
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                      Code d'accès nécessaire.
                      </a>
                    </Button>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Permanences</h3>
                    <p className="text-muted-foreground">
                      Mardi et vendredi de 16h30 à 18h00<br />
                      devant l'école élémentaire
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet/20 px-4 py-1.5 text-sm font-semibold text-violet-foreground">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </div>
            <h2 className="mb-4 text-3xl font-bold">Questions fréquentes</h2>
          </motion.div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="elevated">
                  <CardContent className="p-6">
                    <h3 className="mb-2 font-bold text-foreground">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
