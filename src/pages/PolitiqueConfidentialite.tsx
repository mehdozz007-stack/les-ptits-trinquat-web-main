import React from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Shield, Clock, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { LAST_UPDATE_DATE } from "@/lib/buildInfo";

const PolitiqueConfidentialite = () => {
    useScrollToTop();

    const sections = [
        {
            icon: Info,
            title: "1. Responsable du traitement",
            content: (
                <div className="space-y-3">
                    <p>Le responsable du traitement des données personnelles est :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li><strong>Association Les P'tits Trinquat</strong></li>
                        <li>Association de parents d'élèves (loi 1901)</li>
                        <li>Contact : <a href="mailto:parents.frank.dickens@gmail.com" className="text-primary hover:underline">parents.frank.dickens@gmail.com</a></li>
                    </ul>
                </div>
            ),
        },
        {
            icon: Lock,
            title: "2. Quelles données sont collectées ?",
            content: (
                <div className="space-y-3">
                    <p>Dans le cadre de ses activités et via les formulaires présents sur le site, l'association peut être amenée à collecter les données personnelles suivantes :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Nom et prénom</li>
                        <li>Adresse e-mail</li>
                        <li>Numéro de téléphone</li>
                        <li>Nom de l'enfant et sa classe (le cas échéant)</li>
                        <li>Données transmises via les formulaires de contact ou d'adhésion</li>
                        <li>Données de navigation (cookies, adresse IP, statistiques anonymisées)</li>
                        <li><strong>Aucune donnée dite « sensible » n'est collectée</strong> (origine, opinions, santé, etc.)</li>
                    </ul>
                </div>
            ),
        },
        {
            icon: CheckCircle,
            title: "3. Pourquoi collectons-nous ces données ?",
            content: (
                <div className="space-y-3">
                    <p>Les données personnelles sont collectées uniquement afin de permettre à l'association de fonctionner et de rester en contact avec les familles :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Gestion des adhésions à l'association</li>
                        <li>Communication avec les parents d'élèves</li>
                        <li>Organisation d'événements scolaires et associatifs</li>
                        <li>Envoi d'informations, actualités ou convocations</li>
                        <li>Réponse aux demandes effectuées via le site</li>
                        <li>Amélioration du fonctionnement et du contenu du site</li>
                    </ul>
                    <p className="text-sm italic text-muted-foreground mt-4">Les données ne sont jamais utilisées à des fins commerciales et ne servent qu'à la vie de l'association.</p>
                </div>
            ),
        },
        {
            icon: Shield,
            title: "4. Sur quelle base utilisons-nous vos données ?",
            content: (
                <div className="space-y-3">
                    <p>Le traitement des données repose sur :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Le consentement de l'utilisateur</li>
                        <li>L'intérêt légitime de l'association dans le cadre de ses activités</li>
                        <li>Les obligations légales liées à la gestion associative</li>
                    </ul>
                </div>
            ),
        },
        {
            icon: Lock,
            title: "5. Qui peut accéder aux données ?",
            content: (
                <div className="space-y-3">
                    <p>Les données personnelles sont destinées exclusivement :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Aux membres du bureau de l'association habilités</li>
                        <li>Aux prestataires techniques strictement nécessaires (hébergement du site, outils de messagerie)</li>
                    </ul>
                    <p className="mt-3"><strong>Les données ne sont ni vendues, ni louées, ni cédées à des tiers.</strong></p>
                </div>
            ),
        },
        {
            icon: Clock,
            title: "6. Combien de temps conservons-nous les données ?",
            content: (
                <div className="space-y-3">
                    <p>Les données personnelles sont conservées :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Pendant la durée de l'adhésion à l'association</li>
                        <li>Jusqu'à 3 ans après le dernier contact pour les non-adhérents</li>
                        <li>Conformément aux obligations légales pour les documents comptables ou administratifs</li>
                        <li>Au-delà, les données sont supprimées ou anonymisées.</li>
                    </ul>
                </div>
            ),
        },
        {
            icon: Shield,
            title: "7. Comment protégeons-nous vos données ?",
            content: (
                <div className="space-y-3">
                    <p>L'association met en œuvre toutes les mesures techniques et organisationnelles appropriées pour assurer la sécurité et la confidentialité des données personnelles, notamment :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Accès restreint aux données</li>
                        <li>Hébergement sécurisé</li>
                        <li>Mots de passe protégés</li>
                    </ul>
                </div>
            ),
        },
        {
            icon: Info,
            title: "8. Cookies et navigation sur le site",
            content: (
                <div className="space-y-3">
                    <p>Le site peut utiliser des cookies pour :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Assurer le bon fonctionnement du site</li>
                        <li>Réaliser des statistiques de fréquentation anonymes</li>
                    </ul>
                    <p className="mt-3">L'utilisateur peut configurer son navigateur pour refuser tout ou partie des cookies.</p>
                </div>
            ),
        },
        {
            icon: CheckCircle,
            title: "9. Vos droits",
            content: (
                <div className="space-y-3">
                    <p>Conformément à la réglementation en vigueur, chaque utilisateur dispose des droits suivants :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Droit d'accès à ses données</li>
                        <li>Droit de rectification</li>
                        <li>Droit d'effacement (droit à l'oubli)</li>
                        <li>Droit à la limitation du traitement</li>
                        <li>Droit d'opposition</li>
                        <li>Droit à la portabilité des données</li>
                    </ul>
                    <p className="mt-4">Toute demande peut être adressée simplement par e-mail à :</p>
                    <p className="font-semibold"><a href="mailto:parents.frank.dickens@gmail.com" className="text-primary hover:underline">parents.frank.dickens@gmail.com</a></p>
                    <p className="text-sm italic text-muted-foreground mt-2">L'association s'engage à répondre dans les meilleurs délais.</p>
                </div>
            ),
        },
        {
            icon: AlertCircle,
            title: "10. Réclamation",
            content: (
                <div className="space-y-3">
                    <p>En cas de litige non résolu, l'utilisateur peut déposer une réclamation auprès de la <strong>CNIL</strong></p>
                    <p><a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a></p>
                </div>
            ),
        },
        {
            icon: Info,
            title: "11. Modification de la charte",
            content: (
                <div className="space-y-3">
                    <p>La présente charte peut être modifiée à tout moment afin de se conformer aux évolutions légales ou techniques. La version en vigueur est celle publiée sur le site.</p>
                    <p className="text-sm italic text-muted-foreground mt-4"><strong>Dernière mise à jour :</strong> {LAST_UPDATE_DATE}</p>
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
                            Politique de <span className="text-gradient">confidentialité</span>
                        </h1>
                        <p className="text-base sm:text-lg text-muted-foreground">
                            Comprendre comment nous protégeons vos données personnelles.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 sm:py-16 md:py-20">
                <div className="container">
                    <div className="mx-auto max-w-3xl space-y-8">
                        {/* Introduction */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 p-6 sm:p-8 border border-primary/10"
                        >
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                La présente charte de confidentialité a pour objectif d'expliquer, de manière simple et transparente, comment l'association Les P'tits Trinquat collecte, utilise et protège les données personnelles des parents et des familles qui visitent son site internet, conformément au Règlement Général sur la Protection des Données (RGPD – UE 2016/679) et à la loi Informatique et Libertés.
                            </p>
                        </motion.div>

                        {/* Sections */}
                        {sections.map((section, index) => {
                            const Icon = section.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{section.title}</h2>
                                    </div>
                                    <div className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-0">
                                        {section.content}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default PolitiqueConfidentialite;
