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
                    <p>Ce site est édité par l'association de parents d'élèves <strong>Les P'tits Trinquat</strong>. Association loi 1901 à but non lucratif regroupant les parents et les familles de l'école Frank Dickens à Montpellier.</p>
                    <div className="space-y-2">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <strong>Adresse :</strong>
                                <p>École Frank Dickens<br />686 avenue Pont Trinquat<br />34070 Montpellier</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <strong>Contact :</strong>
                                <p><a href="mailto:parents.frank.dickens@gmail.com" className="text-primary hover:underline">parents.frank.dickens@gmail.com</a></p>
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
                <div className="space-y-3">
                    <p>Le site est géré bénévolement par les membres du bureau de l'association. L'ensemble de l'équipe s'engage à maintenir le site en bon état de fonctionnement et à assurer la qualité des informations publiées.</p>
                    <p className="text-sm italic text-muted-foreground">Pour toute question ou réclamation concernant le contenu du site, veuillez nous contacter par e-mail.</p>
                </div>
            ),
        },
        {
            icon: Globe,
            title: "Hébergement et infrastructure technique",
            content: (
                <div className="space-y-3">
                    <p>Le site est hébergé par : <strong>Cloudflare Pages</strong></p>
                    <p className="text-sm text-muted-foreground">Cloudflare fournit l'infrastructure de distribution de contenu (CDN) et d'hébergement du site pour assurer sa disponibilité et sa performance.</p>
                    <div className="space-y-2">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <strong>Siège social :</strong>
                                <p>Cloudflare, Inc.<br />Att Legal Department<br />101 Townsend St<br />San Francisco, CA 94107<br />États-Unis</p>
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
            title: "Propriété intellectuelle et utilisation du contenu",
            content: (
                <div className="space-y-3">
                    <p>Le contenu de ce site (textes, images, logos, documents, vidéos) est destiné à informer les familles sur la vie de l'association et les événements liés à l'école.</p>
                    <p><strong>Droits d'auteur :</strong> Sauf mention contraire, l'ensemble des contenus publiés sur ce site sont la propriété de l'association ou de leurs auteurs respectifs. Toute reproduction, adaptation ou représentation, totale ou partielle, du contenu de ce site est interdite sans l'autorisation préalable écrite de l'association.</p>
                    <p className="text-sm italic text-muted-foreground">Les logos, marques et éléments graphiques utilisés sur le site sont protégés par les lois en vigueur sur la propriété intellectuelle.</p>
                </div>
            ),
        },
        {
            icon: Lock,
            title: "Données personnelles et formulaires",
            content: (
                <div className="space-y-3">
                    <p>Nous respectons votre vie privée ❤️</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Le site ne collecte que les informations nécessaires (par exemple via le formulaire de contact).</li>
                        <li>Ces données servent uniquement à répondre à vos messages ou à la vie de l'association.</li>
                        <li>Aucune donnée n'est vendue, louée ou transmise à des tiers sans votre consentement.</li>
                        <li>Les données peuvent être partagées avec des prestataires techniques strictement nécessaires (hébergement, email).</li>
                    </ul>
                    <p className="text-sm text-muted-foreground italic mt-4"><strong>Conformément aux lois sur la protection des données (RGPD), vous avez le droit de :</strong></p>
                    <ul className="space-y-2 list-disc list-inside mt-2">
                        <li>Accéder à vos données</li>
                        <li>Demander leur modification</li>
                        <li>Demander leur suppression</li>
                        <li>Vous opposer à leur traitement</li>
                    </ul>
                    <p className="mt-4">📮 <strong>Pour exercer ces droits :</strong> Veuillez nous contacter via le formulaire du site ou par email à <a href="mailto:parents.frank.dickens@gmail.com" className="text-primary hover:underline">parents.frank.dickens@gmail.com</a></p>
                </div>
            ),
        },
        {
            icon: FileText,
            title: "Cookies et technologies de suivi",
            content: (
                <div className="space-y-3">
                    <p>Ce site peut utiliser des cookies techniques pour fonctionner correctement, notamment pour :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Assurer le bon fonctionnement du site et de ses fonctionnalités</li>
                        <li>Maintenir votre session utilisateur</li>
                        <li>Réaliser des statistiques de fréquentation anonymes</li>
                    </ul>
                    <p className="mt-3"><strong>Aucun cookie publicitaire ou de suivi intrusif n'est utilisé.</strong></p>
                    <p className="text-sm text-muted-foreground">L'utilisateur peut configurer son navigateur pour refuser tout ou partie des cookies. Cependant, cela peut affecter le bon fonctionnement du site.</p>
                </div>
            ),
        },
        {
            icon: Globe,
            title: "Liens externes et sites tiers",
            content: (
                <div className="space-y-3">
                    <p>Ce site peut contenir des liens vers d'autres sites externes. L'association ne peut pas être responsable du contenu, des pratiques de confidentialité ou de la disponibilité de ces sites externes.</p>
                    <p className="text-sm italic text-muted-foreground">En cliquant sur un lien externe, vous acceptez de quitter notre site et de consulter le site tiers à vos propres risques.</p>
                </div>
            ),
        },
        {
            icon: Lock,
            title: "Limitation de responsabilité",
            content: (
                <div className="space-y-3">
                    <p>L'association met tous les efforts raisonnables pour assurer l'exactitude et l'actualité des informations publiées sur ce site. Cependant :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Les informations sont fournies « telles quelles » sans garantie d'aucune sorte</li>
                        <li>L'association ne peut être tenue responsable des erreurs ou omissions</li>
                        <li>L'association décline toute responsabilité en cas d'indisponibilité du site ou de dysfonctionnement technique</li>
                        <li>L'association ne peut être responsable des dommages directs ou indirects résultant de l'utilisation du site</li>
                    </ul>
                </div>
            ),
        },
        {
            icon: FileText,
            title: "Modifications et mise à jour",
            content: (
                <div className="space-y-3">
                    <p>L'association se réserve le droit de modifier le contenu de ce site, ses services et ces mentions légales à tout moment et sans préavis.</p>
                    <p>Les utilisateurs sont invités à consulter régulièrement cette page pour connaître les éventuelles modifications.</p>
                    <p className="text-sm italic text-muted-foreground"><strong>Dernière mise à jour :</strong> {LAST_UPDATE_DATE}</p>
                </div>
            ),
        },
        {
            icon: FileText,
            title: "Conditions d'accès et d'utilisation",
            content: (
                <div className="space-y-3">
                    <p>En accédant et en utilisant ce site, vous acceptez :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Les présentes mentions légales</li>
                        <li>Notre politique de confidentialité</li>
                        <li>D'utiliser le site à des fins légales et conformément à la loi</li>
                        <li>De ne pas transmettre de contenus offensants, diffamatoires ou illégaux</li>
                        <li>De respecter les droits d'auteur et la propriété intellectuelle</li>
                    </ul>
                    <p className="mt-3">L'association se réserve le droit de suspendre ou d'interdire l'accès au site en cas de non-respect de ces conditions.</p>
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
