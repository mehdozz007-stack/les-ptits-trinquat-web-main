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
                        <li><strong>Adresse :</strong> École Frank Dickens, 686 avenue Pont Trinquat, 34070 Montpellier</li>
                        <li><strong>Contact :</strong> <a href="mailto:parents.frank.dickens@gmail.com" className="text-primary hover:underline">parents.frank.dickens@gmail.com</a></li>
                    </ul>
                    <p className="text-sm text-muted-foreground italic mt-3">En cas de question concernant vos données, n'hésitez pas à nous contacter directement.</p>
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
                        <li><strong>Données d'identité :</strong> Nom et prénom</li>
                        <li><strong>Données de contact :</strong> Adresse e-mail, numéro de téléphone</li>
                        <li><strong>Données scolaires :</strong> Nom de l'enfant et sa classe (le cas échéant)</li>
                        <li><strong>Données de participation :</strong> Informations transmises via les formulaires de contact, d'adhésion ou d'inscription à des événements</li>
                        <li><strong>Données de navigation :</strong> Cookies, adresse IP, statistiques anonymisées de fréquentation</li>
                        <li><strong>Données liées aux événements :</strong> Préférences, commentaires et contributions aux activités de l'association</li>
                    </ul>
                    <p className="mt-3"><strong>Important :</strong> Aucune donnée dite « sensible » n'est collectée (origine, opinions politiques, croyances religieuses, données de santé, etc.)</p>
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
                        <li>Gestion des adhésions à l'association et suivi des cotisations</li>
                        <li>Communication avec les parents d'élèves concernant les activités et les événements</li>
                        <li>Organisation d'événements scolaires et associatifs (sorties, tombola, réunions, ateliers)</li>
                        <li>Envoi d'informations, actualités, convocations et newsletters</li>
                        <li>Réponse aux demandes effectuées via les formulaires de contact</li>
                        <li>Amélioration du fonctionnement et du contenu du site web</li>
                        <li>Conformité avec les obligations légales et administratives</li>
                        <li>Gestion administrative et comptable de l'association</li>
                    </ul>
                    <p className="text-sm italic text-muted-foreground mt-4"><strong>Important :</strong> Les données ne sont jamais utilisées à des fins commerciales ou de marketing externe. Elles servent exclusivement à la vie de l'association.</p>
                </div>
            ),
        },
        {
            icon: Shield,
            title: "4. Sur quelle base légale utilisons-nous vos données ?",
            content: (
                <div className="space-y-3">
                    <p>Le traitement des données repose sur les fondements légaux suivants :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li><strong>Consentement :</strong> Le consentement explicite que vous donnez en remplissant nos formulaires</li>
                        <li><strong>Intérêt légitime :</strong> L'intérêt légitime de l'association dans le cadre de ses activités de communication et d'organisation d'événements</li>
                        <li><strong>Obligations légales :</strong> Les obligations légales liées à la gestion associative, comptable et administrative</li>
                        <li><strong>Exécution d'un contrat :</strong> Les données nécessaires au traitement de votre adhésion ou participation à des événements</li>
                    </ul>
                </div>
            ),
        },
        {
            icon: Lock,
            title: "5. Qui peut accéder aux données ?",
            content: (
                <div className="space-y-3">
                    <p>Les données personnelles sont destinées exclusivement à :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li><strong>Membres du bureau :</strong> Les membres du bureau de l'association habilités et autorisés à accéder aux données pour les besoins de gestion</li>
                        <li><strong>Prestataires techniques :</strong> Les prestataires techniques strictement nécessaires au fonctionnement du site (hébergement, outils d'email, services de formulaires)</li>
                    </ul>
                    <p className="mt-3"><strong>Garantie importante :</strong> Les données ne sont ni vendues, ni louées, ni cédées à des tiers sans votre consentement explicite.</p>
                    <p className="text-sm text-muted-foreground italic mt-2">Tous les prestataires ont signé des clauses de confidentialité appropriées.</p>
                </div>
            ),
        },
        {
            icon: Clock,
            title: "6. Combien de temps conservons-nous les données ?",
            content: (
                <div className="space-y-3">
                    <p>Les données personnelles sont conservées selon les durées suivantes :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li><strong>Adhésions actives :</strong> Pendant la durée de l'adhésion à l'association</li>
                        <li><strong>Anciens adhérents :</strong> Jusqu'à 3 ans après le dernier contact (sauf droit à l'oubli exprimé)</li>
                        <li><strong>Contacts de formulaire :</strong> Pendant 2 ans pour assurer le suivi des demandes</li>
                        <li><strong>Documents comptables :</strong> Conformément aux obligations légales (généralement 6 ans pour les documents comptables)</li>
                        <li><strong>Données de navigation :</strong> Les logs techniques sont conservés pendant 90 jours maximum</li>
                    </ul>
                    <p className="mt-3">Au-delà de ces périodes, les données sont supprimées ou anonymisées de manière irréversible.</p>
                </div>
            ),
        },
        {
            icon: Shield,
            title: "7. Comment protégeons-nous vos données ?",
            content: (
                <div className="space-y-3">
                    <p>L'association met en œuvre toutes les mesures techniques et organisationnelles appropriées pour assurer la sécurité et la confidentialité des données personnelles :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li><strong>Accès restreint :</strong> Les données ne sont accessibles qu'aux personnes autorisées</li>
                        <li><strong>Hébergement sécurisé :</strong> Utilisation de Cloudflare pour une infrastructure sécurisée et protégée</li>
                        <li><strong>Mots de passe :</strong> Tous les accès sont protégés par des mots de passe forts</li>
                        <li><strong>Chiffrement :</strong> Les données en transit sont chiffrées (HTTPS)</li>
                        <li><strong>Confidentialité :</strong> Seul le personnel autorisé a accès aux données sensibles</li>
                        <li><strong>Mises à jour :</strong> Les systèmes sont régulièrement mis à jour pour corriger les vulnérabilités</li>
                    </ul>
                    <p className="text-sm text-muted-foreground italic mt-3">Malgré toutes nos précautions, aucune sécurité n'est garantie à 100%.</p>
                </div>
            ),
        },
        {
            icon: Info,
            title: "8. Cookies et technologies de suivi",
            content: (
                <div className="space-y-3">
                    <p>Le site peut utiliser des cookies pour :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Assurer le bon fonctionnement du site et de ses fonctionnalités</li>
                        <li>Mémoriser vos préférences de navigation</li>
                        <li>Réaliser des statistiques de fréquentation anonymes et améliorer l'expérience utilisateur</li>
                    </ul>
                    <p className="mt-3"><strong>Aucun cookie publicitaire ou de suivi intrusif n'est utilisé.</strong></p>
                    <p className="text-sm text-muted-foreground mt-2">L'utilisateur peut configurer son navigateur pour refuser tout ou partie des cookies. Cependant, cela pourrait affecter le bon fonctionnement du site et certaines de ses fonctionnalités.</p>
                </div>
            ),
        },
        {
            icon: CheckCircle,
            title: "9. Vos droits",
            content: (
                <div className="space-y-3">
                    <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, chaque personne dispose des droits fondamentaux suivants :</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li><strong>Droit d'accès :</strong> Accès à l'ensemble de vos données personnelles traitées</li>
                        <li><strong>Droit de rectification :</strong> Correction de données inexactes ou incomplètes</li>
                        <li><strong>Droit à l'effacement (droit à l'oubli) :</strong> Suppression de vos données dans certaines conditions</li>
                        <li><strong>Droit à la limitation :</strong> Limitation du traitement de vos données</li>
                        <li><strong>Droit d'opposition :</strong> Opposition au traitement de vos données</li>
                        <li><strong>Droit à la portabilité :</strong> Récupération de vos données dans un format structuré et exploitable</li>
                        <li><strong>Droit de retirer le consentement :</strong> Retrait du consentement à tout moment</li>
                    </ul>
                    <p className="mt-4">Toute demande peut être adressée simplement par e-mail à :</p>
                    <p className="font-semibold"><a href="mailto:parents.frank.dickens@gmail.com" className="text-primary hover:underline">parents.frank.dickens@gmail.com</a></p>
                    <p className="text-sm italic text-muted-foreground mt-2">L'association s'engage à répondre à votre demande dans les meilleurs délais, dans un délai maximum d'un mois.</p>
                </div>
            ),
        },
        {
            icon: AlertCircle,
            title: "10. Réclamation auprès de l'autorité compétente",
            content: (
                <div className="space-y-3">
                    <p>En cas de litige non résolu ou si vous considérez que vos droits ne sont pas respectés, vous avez le droit de déposer une réclamation auprès de l'autorité compétente :</p>
                    <p className="mt-3"><strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong></p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a></li>
                        <li>Adresse : 3 Place de Fontenoy, 75007 Paris, France</li>
                    </ul>
                    <p className="text-sm text-muted-foreground italic mt-3">Nous vous recommandons de nous contacter en premier lieu pour résoudre tout litige.</p>
                </div>
            ),
        },
        {
            icon: Info,
            title: "11. Modification de la charte de confidentialité",
            content: (
                <div className="space-y-3">
                    <p>La présente charte peut être modifiée à tout moment afin de se conformer aux évolutions légales, réglementaires ou techniques. La version en vigueur est celle publiée sur le site.</p>
                    <p className="mt-3">En cas de modifications importantes, nous nous engageons à vous informer par email ou via une notification sur le site.</p>
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
