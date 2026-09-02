/**
 * Actualités - Source de données unique
 * Utilisée par :
 * - Section Actualités sur la homepage
 * - Page dédiée Actualités (complète avec filtres)
 * 
 * Champs:
 * - id: identifiant unique
 * - title: titre de l'actualité
 * - description: description courte
 * - content: contenu complet (pour la page détail si nécessaire)
 * - type: 'evenement' | 'document' | 'annonce' | 'information'
 * - date: date au format 'DD Mois YYYY'
 * - link: lien vers la ressource (PDF, page, URL externe, etc.)
 * - fileUrl: URL du fichier si téléchargeable
 * - affiche: chemin vers l'image de l'événement
 * - color: couleur de la carte ('primary' | 'secondary' | 'sky' | 'violet' | 'accent')
 * - time: heure de l'événement (optionnel)
 * - location: lieu de l'événement (optionnel)
 * - attendees: nombre de participants attendus (optionnel)
 * - status: 'upcoming' | 'past' (pour les événements)
 */

// Importer les images
import tomola from '@/assets/tomola.jpg';
import crepesParty from '@/assets/Crepes_party_Affiche.jpg';
import videGrenier from '@/assets/Vide-grenier.jpg';
import maman from '@/assets/Retour-maman.jpg';
import printemps from '@/assets/vente-printemps.png';
import feterentree from '@/assets/fete-rentree2026-2027.jpg';
/**
 * Formate une date ISO (YYYY-MM-DD) en format français lisible (DD Mois YYYY)
 */
export function formatDateFr(dateIso: string): string {
    const months: Record<number, string> = {
        0: "Janvier",
        1: "Février",
        2: "Mars",
        3: "Avril",
        4: "Mai",
        5: "Juin",
        6: "Juillet",
        7: "Août",
        8: "Septembre",
        9: "Octobre",
        10: "Novembre",
        11: "Décembre",
    };

    const date = new Date(dateIso);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

export type EventStatus = "upcoming" | "past";
export type ActualiteType = "evenement" | "document" | "annonce" | "information" | "presse";
export interface Actualite {
    id: string;
    title: string;
    description: string;
    content?: string;
    type: ActualiteType;
    date?: string;
    link?: string;
    authLink?: string;
    fileUrl?: string;
    affiche?: string;
    galleryImage?: string;
    color: "primary" | "secondary" | "sky" | "violet" | "accent" | "rose" | "emerald" | "amber" | "cyan" | "indigo" | "fuchsia";
    time?: string;
    location?: string;
    attendees?: number;
    status?: EventStatus;
    reservationLink?: string;
    donationLink?: string;
    directLink?: boolean; // Si true, redirige directement vers link au lieu d'aller à la page description
}

export const actualitesData: Actualite[] = [
    {
        id: "act-0001",
        title: "Liste des classes pour la rentrée 2026-2027",
        type: "information",
        description: "Découvrez la répartition des classes pour la rentrée 2026-2027 par prénom des élèves. Les noms sont anonymisés.",
        date: "1 Septembre 2026",
        time: "",
        location: "Toute l'école",
        color: "amber",
        status: "upcoming",
        link: "https://www.ent-ecole.fr/cardboard/0197dbb8-a944-7dd7-9bf4-7043f0678482",
        directLink: true,
    },
    {
        id: "act-0002",
        title: "Fête de la rentrée à la MPT Boris Vian",
        description: "Fêter la rentrée scolaire à la MPT avec toutes les familles.",
        content: "Venez nombreux pour célébrer la rentrée scolaire avec des activités ludiques, des jeux et des moments conviviaux pour toute la famille.",
        type: "evenement",
        date: "2026-09-29",
        time: "16h30 - 19h30",
        location: "Maison pour tous Boris Vian",
        color: "primary",
        status: "upcoming",
        affiche: feterentree,
    },
    {
        id: "act-008",
        title: "Fiche RSST",
        description: "Document de sécurité relatif à l'organisation de la sécurité, de la santé et des conditions de travail à l'école.",
        content: "Fiche RSST - Document de sécurité relatif à l'organisation de la sécurité, de la santé et des conditions de travail (RSST) à l'école.",
        type: "document",
        date: "2026-01-01",
        fileUrl: "/documents/RSST_FICHE.pdf",
        color: "primary",
        status: "upcoming",
    },
    {
        id: "act-013",
        title: "Guide Parents : Comment aborder les violences sexuelles avec nos enfants ?",
        description: "Guide pratique pour les parents : comprendre et accompagner nos enfants dans la prévention des violences sexuelles.",
        content: "Guide à destination des parents pour discuter de manière bienveillante et efficace de la prévention des violences sexuelles avec nos enfants.",
        type: "document",
        date: "2026-04-20",
        fileUrl: "/documents/Guide_parents_violences_sexuelles.pdf",
        color: "violet",
        status: "upcoming",
    },

    // Événements passés
    {
        id: "annonce-charity-001",
        title: "💙 Collecte solidaire : Une famille de notre école a besoin de nous",
        description: "Suite à un incendie, une famille a tout perdu. Nous organisons une collecte solidaire de vêtements, jeux sensoriels et dons.",
        content: "Chères familles,\n\nL'une des nôtres a aujourd'hui besoin de nous.\n\nLe mercredi 18 Février, une famille de l'école a vu son domicile entièrement détruit par un violent incendie\nCette maman, ses deux adolescents et sa petite fille de 5 ans ont tout perdu.\nAfin de les aider à faire face à cette situation dramatique, nous organisons une collecte solidaire.\n\nBESOINS URGENTS (EN PAUSE POUR LE MOMENT. Merci à tous 💙)\nVêtements fille 6 ans et chaussures taille 26/27\nVêtements pour 2 adolescents (taille M) et chaussures taille 42,5\nVêtements femme taille M et chaussures taille 37/38\nLa petite fille étant autiste, elle apprécie particulièrement :\nLes jeux sensoriels\nLes fidgets\nLes dinettes et aliments factices\nLes squishies.\n\nUne cagnotte en ligne a également été mise en place pour celles et ceux qui souhaitent participer financièrement.\nChaque geste, petit ou grand, fera une réelle différence pour les aider à se reconstruire.",
        type: "annonce",
        link: "https://www.lagazettedemontpellier.fr/justice/2026-02-17-montpellier-incendie-en-cours-dans-un-immeuble-pres-de-l-hotel-de-police/",
        color: "rose",
        status: "past",
        galleryImage: maman,
        donationLink: "https://www.leetchi.com/fr/c/soutien-a-aliyah-et-sa-famille-victime-dun-incendie-1430829?utm_source=copylink&utm_medium=social_sharing",
    },
    {
        id: "presse-001",
        title: "Factures salées, froid en classe...",
        description: "Article de presse France Bleu - Découvrez comment une nouvelle chaudière impacte trois établissements scolaires de Montpellier. Une situation qui préoccupe les parents et l'équipe pédagogique.",
        content: "presse",
        type: "presse",
        date: "2026-02-08",
        link: "https://www.francebleu.fr/infos/societe/facture-multipliee-par-5-salles-de-classe-a-10-degres-une-chaudiere-plombe-le-budget-de-trois-ecoles-a-montpellier-7381973",
        color: "indigo",
        status: "past",
    },
];

/**
 * Récupère les dernières actualités (pour la section homepage)
 * @param limit Nombre d'actualités à retourner (défaut: 3)
 * @returns Tableau d'actualités triées par date croissante (proches d'abord), sans les passées, presse ou docs
 */
export function getLatestActualites(limit: number = 3): Actualite[] {
    return actualitesData
        .filter((a) => a.status !== "past" && a.type !== "presse" && a.type !== "document")
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA - dateB;
        })
        .slice(0, limit);
}

/**
 * Récupère toutes les actualités (pour la page Actualités)
 * Exclut les événements passés et les documents (qui ont leur propre page)
 * Tri: événements à venir par date croissante (proches d'abord), autres par date décroissante (récentes d'abord)
 */
export function getAllActualites(): Actualite[] {
    const actualites = actualitesData.filter((a) => !(a.type === "evenement" && a.status === "past") && a.type !== "document" && !(a.status === "past" && (a.type === "annonce" || a.type === "information" || a.type === "presse")));

    return actualites.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        // Les événements à venir en premier, triés par date croissante (proches d'abord)
        if (a.type === "evenement" && a.status === "upcoming" && (b.type !== "evenement" || b.status !== "upcoming")) {
            return -1;
        }
        if (b.type === "evenement" && b.status === "upcoming" && (a.type !== "evenement" || a.status !== "upcoming")) {
            return 1;
        }

        // Entre événements à venir: ordre croissant (proches d'abord)
        if (a.type === "evenement" && a.status === "upcoming" && b.type === "evenement" && b.status === "upcoming") {
            return dateA - dateB;
        }

        // Autres actualités: ordre décroissant (récentes d'abord)
        return dateB - dateA;
    });
}

/**
 * Récupère les événements à venir
 */
export function getUpcomingEvents(): Actualite[] {
    return actualitesData
        .filter((a) => a.type === "evenement" && a.status === "upcoming")
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA - dateB;
        });
}

/**
 * Récupère les événements passés
 */
export function getPastEvents(): Actualite[] {
    return actualitesData
        .filter((a) => a.type === "evenement" && a.status === "past")
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
        });
}

/**
 * Récupère les annonces, informations et articles de presse passés
 */
export function getPastAnnouncements(): Actualite[] {
    return actualitesData
        .filter((a) => a.status === "past" && (a.type === "annonce" || a.type === "information" || a.type === "presse"))
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
        });
}

/**
 * Filtre les actualités par type
 * @param type Type d'actualité à filtrer
 * @returns Actualités du type spécifié
 */
export function getActualitesByType(type: ActualiteType): Actualite[] {
    return getAllActualites().filter((a) => a.type === type);
}

/**
 * Récupère une actualité par son ID
 */
export function getActualiteById(id: string): Actualite | undefined {
    return actualitesData.find((a) => a.id === id);
}

/**
 * Mappe les types pour l'affichage
 */
export const actualiteTypeLabels: Record<ActualiteType, string> = {
    evenement: "Événement",
    document: "Document",
    annonce: "Annonce",
    information: "Information",
    presse: "Article de presse",
};

/**
 * Mappe les couleurs pour les cartes
 */
export const actualiteColorClasses = {
    primary: "bg-gradient-to-br from-primary/15 via-secondary/10 to-pink/10 border-primary/25",
    secondary: "bg-gradient-to-br from-secondary/15 via-primary/10 to-orange/10 border-secondary/25",
    sky: "bg-gradient-to-br from-sky/15 via-blue/10 to-violet/10 border-sky/25",
    violet: "bg-gradient-to-br from-violet/15 via-purple/10 to-pink/10 border-violet/25",
    accent: "bg-gradient-to-br from-accent/15 via-green/10 to-yellow/10 border-accent/25",
    rose: "bg-gradient-to-br from-rose-500/20 via-pink-500/15 to-red-500/10 border-rose-500/30",
    emerald: "bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/10 border-emerald-500/30",
    amber: "bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-yellow-500/10 border-amber-500/30",
    cyan: "bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-teal-500/10 border-cyan-500/30",
    indigo: "bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-blue-500/10 border-indigo-500/30",
    fuchsia: "bg-gradient-to-br from-fuchsia-500/20 via-pink-500/15 to-purple-500/10 border-fuchsia-500/30",
};
