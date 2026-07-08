import React from "react";
import { motion } from "framer-motion";
import { FileText, MapPin, Mail, Globe, Lock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { LAST_UPDATE_DATE } from "@/lib/buildInfo";

const MentionsLegales = () => {
    useScrollToTop();

    const sections = [
        {
            icon: FileText,
            title: "Qui sommes-nous ?",
            content: (
                <div className="space-y-3">
                    <p>Ce site est édité par l'association de parents d'élèves <strong>Les P'tits Trinquat</strong>. Association loi 1901 à but non lucratif.</p>
                    <div className="space-y-2">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <strong>Adresse :</strong>
                                <p>École Frank Dickens, 686 avenue pont trinquat, 34070, Montpellier</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <strong>Contact :</strong>
                                <p>parents.frank.dickens@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            icon: FileText,
            title: "Responsable du site",
            content: (
                <p>Le site est géré bénévolement par les membres du bureau de l'association.</p>
            ),
        },
        {
            icon: Globe,
            title: "Hébergement",
            content: (
                <div className="space-y-3">
                    <p>Le site est hébergé par : <strong>CloudFlare Pages</strong></p>
                    <div className="space-y-2">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <strong>Adresse :</strong>
                                <p>Cloudflare, Inc. Att Legal Department 101 Townsend St, San Francisco, CA 94107</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Globe className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <strong>Site web :</strong>
                                <p><a href="https://www.cloudflare.com/fr-fr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.cloudflare.com/fr-fr/</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            icon: FileText,
            title: "Utilisation du site",
            content: (
                <div className="space-y-3">
                    <p>Le contenu de ce site (textes, images, logos, documents) est destiné à informer les familles sur la vie de l'association et les événements liés à l'école.</p>
                    <p>Sauf mention contraire, les contenus sont la propriété de l'association. Merci de ne pas les utiliser sans autorisation 😊</p>
                </div>
            ),
        },
        {
            icon: Lock,
            title: "Données personnelles",
            content: (
                <div className="space-y-3">
                    <p>Nous respectons votre vie privée ❤️</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Le site ne collecte que les informations nécessaires (par exemple via le formulaire de contact).</li>
                        <li>Ces données servent uniquement à répondre à vos messages ou à la vie de l'association.</li>
                        <li>Aucune donnée n'est vendue ou transmise à des tiers.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground italic mt-4">Conformément à la loi, vous pouvez demander :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>L'accès à vos données</li>
                        <li>Leur modification</li>
                        <li>Leur suppression</li>
                    </ul>
                    <p>📮 Il suffit de nous contacter via le formulaire du site</p>
                </div>
            ),
        },
        {
            icon: FileText,
            title: "Cookies",
            content: (
                <div className="space-y-3">
                    <p>Ce site peut utiliser des cookies techniques pour fonctionner correctement.</p>
                    <p>Aucun cookie publicitaire ou de suivi intrusif n'est utilisé.</p>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            {/* Hero */}
            <section className="relative overflow-hidden bg-hero py-12 sm:py-16 md:py-20">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 right-1/4 h-60 w-60 rounded-full bg-sky/20 watercolor-blob" />
                    <div className="absolute bottom-10 left-10 h-40 w-40 rounded-full bg-primary/20 watercolor-blob" />
                </div>

                <div className="container relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl text-center mx-auto"
                    >
                        <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                            Mentions <span className="text-gradient">légales</span>
                        </h1>
                        <p className="text-base sm:text-lg text-muted-foreground">
                            Informations légales et conditions d'utilisation du site.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 sm:py-16 md:py-20">
                <div className="container">
                    <div className="mx-auto max-w-3xl space-y-8">
                        {sections.map((section, index) => {
                            const Icon = section.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                                    </div>
                                    <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        {section.content}
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Thank You Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 p-6 sm:p-8 space-y-4 border border-primary/10"
                        >
                            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                💛 Merci !
                            </h3>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                Ce site est animé par des parents bénévoles, avec l'envie de créer du lien entre les familles et l'école.
                            </p>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                Merci de votre confiance et de votre participation à la vie de l'association 💛
                            </p>
                            <p className="text-xs text-muted-foreground italic mt-6 pt-4 border-t border-primary/10">
                                <strong>Dernière mise à jour :</strong> {LAST_UPDATE_DATE}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default MentionsLegales;
