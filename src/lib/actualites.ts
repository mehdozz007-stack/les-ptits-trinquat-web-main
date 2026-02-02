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
 * - color: couleur de la carte ('primary' | 'secondary' | 'sky' | 'violet' | 'accent')
 * - time: heure de l'événement (optionnel)
 * - location: lieu de l'événement (optionnel)
 * - attendees: nombre de participants attendus (optionnel)
 * - status: 'upcoming' | 'past' (pour les événements)
 */

export type ActualiteType = "evenement" | "document" | "annonce" | "information";
export type EventStatus = "upcoming" | "past";

export interface Actualite {
    id: string;
    title: string;
    description: string;
    content?: string;
    type: ActualiteType;
    date: string;
    link?: string;
    fileUrl?: string;
    color: "primary" | "secondary" | "sky" | "violet" | "accent" | "rose" | "emerald" | "amber" | "cyan" | "indigo" | "fuchsia";
    time?: string;
    location?: string;
    attendees?: number;
    status?: EventStatus;
}

export const actualitesData: Actualite[] = [
    {
        id: "act-001",
        title: "TOMBOLA 2026 est lancée !",
        description: "Gagnez des gros lots avec notre TOMBOLA. Regardez la liste de nos partenaires. Bonne chance à tous !",
        content: "Notre TOMBOLA annuelle est lancée pour soutenir les projets de l'école. Remise de tickets jusqu'au 20 janvier 2026. Tirage au sort le 16 février 2026 en présence des enfants.",
        type: "evenement",
        date: "Lancement 8 Décembre 2025",
        link: "/partenaires",
        color: "accent",
        status: "upcoming",
        attendees: 500,
    },
    {
        id: "act-002",
        title: "À l'attention des parents de CM2 Section Internationale",
        description: "Réunion d'information Lundi 16 février 2026 au collège des Aiguerelles.",
        content: "Une réunion d'information est organisée pour les familles intéressées par la section internationale. Consultez ou téléchargez l'affiche pour plus de détails.",
        type: "annonce",
        date: "16 Février 2026",
        fileUrl: "/documents/Affiche_SI_écoles_260115_044150.pdf",
        color: "primary",
    },
    {
        id: "act-004",
        title: "La crèpe party de l'école !",
        description: "Participez à notre traditionnelle vente de crêpes, un moment gourmand et convivial pour soutenir les projets de l'école.",
        content: "Une vente de crêpes est organisée sur le parvis de l'école. C'est un moment convivial et gourmand pour récolter des fonds.",
        type: "evenement",
        date: "20 Février 2026",
        time: "16h30 - 18h00",
        location: "Le parvis de l'école",
        color: "sky",
        status: "upcoming",
        attendees: 500,
    },
    {
        id: "act-006",
        title: "Information : Conseil d'école SI du 20 Janvier",
        description: "Retrouvez les points clés abordés lors du dernier conseil d'école et les prochaines étapes pour l'école.",
        content: "Le conseil d'école s'est réuni le 20 janvier pour discuter des projets pédagogiques, de l'organisation de l'année scolaire et des événements à venir.",
        type: "information",
        date: "20 Janvier 2026",
        link: "https://www.ent-ecole.fr/cardboard/0193c594-bf68-798a-97b7-aedda95767a2",
        location: "Salle polyvalente",
        color: "violet",
        attendees: 30,
    },
    {
        id: "act-007",
        title: "Carnaval à l'école",
        description: "Le carnaval s'invite à l'école pendant le temps de classe pour un moment joyeux et coloré. Les enfants pourront venir déguisés en insectes ou en fleurs afin de célébrer ensemble l'arrivée du printemps.",
        content: "Le carnaval s'invite à l'école pendant le temps de classe pour un moment joyeux et coloré.\nLes enfants pourront venir déguisés en insectes ou en fleurs afin de célébrer ensemble l'arrivée du printemps dans leurs classes.",
        type: "evenement",
        date: "17 Avril 2026",
        time: "08h30 - 16h30",
        location: "Toute l'école",
        color: "accent",
        status: "upcoming",
        attendees: 380,
    },
    {
        id: "act-008",
        title: "Fiche RSST",
        description: "Document de sécurité relatif à l'organisation de la sécurité, de la santé et des conditions de travail à l'école.",
        content: "Fiche RSST - Document de sécurité relatif à l'organisation de la sécurité, de la santé et des conditions de travail (RSST) à l'école.",
        type: "document",
        date: "2026",
        fileUrl: "/documents/RSST_FICHE.pdf",
        color: "primary",
    },
    {
        id: "act-009",
        title: "Fête d'école",
        description: "Rires, jeux, spectacles et douceurs gourmandes vous attendent pour partager ensemble un moment joyeux et festif et célébrer la fin de l'année scolaire 🌟🍭",
        content: "La fête d'école est l'occasion de célébrer ensemble une belle année scolaire. Au programme : rires, jeux, spectacles des enfants, douceurs gourmandes et animations pour petits et grands. Un moment convivial et festif en famille !",
        type: "evenement",
        date: "19 Juin 2026",
        time: "14h00 - 19h00",
        location: "Cour de l'école",
        color: "primary",
        status: "upcoming",
        attendees: 800,
    },
    // Événements passés
    {
        id: "evt-005",
        title: "💞 Réunion mensuelle des parents 👨‍👩‍👧‍👦",
        description: "Un temps d'échange pour construire ensemble les futurs temps forts de l'école.",
        content: "Rejoignez-nous pour notre réunion mensuelle. C'est l'occasion de discuter des projets en cours et de partager vos idées.",
        type: "evenement",
        date: "30 Janvier 2026",
        time: "17h30 - 19h30",
        location: "Salle polyvalente",
        color: "secondary",
        status: "past",
        attendees: 30,
    },
    {
        id: "evt-004",
        title: "📝 Conseil d'école SI 🌍",
        description: "Un temps de partage pour revenir ensemble sur l'année écoulée, découvrir les projets menés et ceux à venir.",
        content: "Un temps de partage pour revenir ensemble sur l'année écoulée, découvrir les projets menés et ceux à venir, et connaître les résultats de l'élection des parents.",
        type: "evenement",
        date: "20 Janvier 2026",
        time: "17h45 - 19h15",
        location: "Salle polyvalente",
        link: "https://www.ent-ecole.fr/cardboard/0193c594-bf68-798a-97b7-aedda95767a2",
        color: "sky",
        status: "past",
        attendees: 50,
    },
    {
        id: "evt-003",
        title: "🎄 Vente de gâteaux de Noël 🎅",
        description: "Participez à notre traditionnelle vente de gâteaux, un moment gourmand et convivial pour soutenir les projets de l'école.",
        content: "Participez à notre traditionnelle vente de gâteaux, un moment gourmand et convivial pour soutenir les projets de l'école.\nSelon la météo, l'événement pourra se dérouler à la salle d'événement annexe de la Maison pour Tous Boris Vian.",
        type: "evenement",
        date: "19 Décembre 2025",
        time: "16h30 - 18h00",
        location: "Le parvis de l'école ou salle annexe Boris Vian selon la météo",
        link: "https://www.instagram.com/p/DSdZRPHCL8J/?img_index=1",
        color: "violet",
        status: "past",
        attendees: 300,
    },
    {
        id: "evt-008",
        title: "🧛 Vente de Toussaint 🎃",
        description: "Stands de créations, boissons chaudes et animations pour petits et grands.",
        content: "Stands de créations, boissons chaudes et animations pour petits et grands.",
        type: "evenement",
        date: "16 et 17 Octobre 2025",
        time: "16h30 - 19h00",
        location: "Préau de l'école",
        link: "https://www.instagram.com/p/DPn9cLdiBTC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        color: "violet",
        status: "past",
        attendees: 250,
    },
    {
        id: "evt-009",
        title: "🏮 Fête des Lanternes 🕯️",
        description: "Goûter d'automne et parcourir le parc de la Rauze à la tombée de la nuit en chantant des chansons célébrant Saint Martin.",
        content: "Goûter d'automne et parcourir le parc de la Rauze à la tombée de la nuit en chantant des chansons célébrant Saint Martin.",
        type: "evenement",
        date: "10 Novembre 2025",
        time: "14h00 - 17h00",
        location: "Cour de l'école",
        link: "https://www.instagram.com/p/DQVIRmDiF5Q/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        color: "accent",
        status: "past",
        attendees: 350,
    },
];

/**
 * Récupère les dernières actualités (pour la section homepage)
 * @param limit Nombre d'actualités à retourner (défaut: 3)
 * @returns Tableau d'actualités triées par date décroissante
 */
export function getLatestActualites(limit: number = 3): Actualite[] {
    return actualitesData
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
        })
        .slice(0, limit);
}

/**
 * Récupère toutes les actualités (pour la page Actualités)
 * Exclut les événements passés qui sont affichés dans leur propre section
 */
export function getAllActualites(): Actualite[] {
    return actualitesData
        .filter((a) => !(a.type === "evenement" && a.status === "past"))
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
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
