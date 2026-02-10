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
export type EventStatus = "upcoming" | "past";
export type ActualiteType = "evenement" | "document" | "annonce" | "information" | "presse";
export interface Actualite {
    id: string;
    title: string;
    description: string;
    content?: string;
    type: ActualiteType;
    date: string;
    link?: string;
    fileUrl?: string;
    affiche?: string;
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
        content: "La tombola de l'association est un moment convivial qui permet aux enfants de s'impliquer dans la vie de leur école, en vendant des tickets avec fierté et confiance. 🎟️\nGrâce au soutien de nos partenaires, de nombreux lots attendent les participants. Chaque ticket contribue directement aux projets ludiques de l'association. 🎁\nUn futur espace en ligne viendra également faciliter les échanges autour des lots, pour prolonger l'esprit de partage après le tirage. 💻\n\nConsultez la liste de nos partenaires et tentez votre chance ! ✨\n16 Février 2026 le tirage au sort. Bonne chance à tous ! 🍀",
        type: "evenement",
        date: "Lancement 8 Décembre 2025",
        link: "/partenaires",
        affiche: tomola,
        location: "Groupe scolaire FRANK-DICKENS",
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
        location: "Collège des Aiguerelles",
    },
    {
        id: "act-004",
        title: "La crèpe party de l'école !",
        description: "Participez à notre traditionnelle vente de crêpes, un moment gourmand et convivial pour soutenir les projets de l'école.",
        content: "Nous vous invitons chaleureusement à notre crèpe party, un moment gourmand et convivial organisé sur le parvis de l'école. 🥞 Au programme : délicieuses crêpes préparées avec soin, ambiance joyeuse et échanges en famille. 😊\n\nC'est une belle occasion de déguster ensemble tout en soutenant les projets ludiques de nos enfants. 🎈 Chaque achat contribue directement à enrichir leur expérience scolaire et à créer des souvenirs inoubliables. 💝\n\nNous vous attendons nombreux pour ce moment de convivialité et de gourmandise ! 🤗",
        type: "evenement",
        date: "20 Février 2026",
        time: "16h30 - 18h00",
        location: "Le parvis de l'école",
        affiche: crepesParty,
        color: "fuchsia",
        status: "upcoming",
        attendees: 500,
    },
    {
        id: "act-006",
        title: "Conseil d'école SI du 20 Janvier",
        description: "Retrouvez les points clés abordés lors du dernier conseil d'école et les prochaines étapes pour l'école.",
        content: "Le conseil d'école s'est réuni le 20 janvier pour discuter des projets ludiques, de l'organisation de l'année scolaire et des événements à venir. 📚",
        type: "information",
        date: "20 Janvier 2026",
        link: "https://www.ent-ecole.fr/cardboard/0193c594-bf68-798a-97b7-aedda95767a2",
        location: "Salle polyvalente",
        color: "violet",
        attendees: 30,
    },
    {
        id: "act-010",
        title: "Vide Grenier : La Récré des bonnes affaires !",
        description: "Un vide grenier convivial avec animations, musique et bonne ambiance en famille. Venez dénicher de bonnes affaires tout en participant à la vie de l'école !",
        content: "Nous vous accueillons avec grand plaisir pour un vide grenier festif et bienveillant, un moment magique où petits et grands peuvent vivre une belle expérience ensemble. ✨ Animations joyeuses, musique entraînante et bonne ambiance familiale créeront une atmosphère chaleureuse toute la journée. 🎵\n\nC'est l'occasion idéale de découvrir des trésors oubliés, 🎁 de donner une seconde vie à vos affaires, ♻️ et de soutenir les projets ludiques chers à nos enfants. Chaque achat, chaque échange contribue à construire ensemble une belle histoire pour notre école. 💚\n\nVenez partager ce moment de partage et de convivialité ! 🤝",
        type: "evenement",
        date: "12 Avril 2026",
        time: "10h00 - 16h00",
        location: "Cour de l'école",
        affiche: videGrenier,
        color: "emerald",
        status: "upcoming",
        attendees: 400,
    },
    {
        id: "act-007",
        title: "Carnaval à l'école",
        description: "Le carnaval s'invite à l'école pendant le temps de classe pour un moment joyeux et coloré. Les enfants pourront venir déguisés en insectes ou en fleurs afin de célébrer ensemble l'arrivée du printemps.",
        content: "Le carnaval s'invite à l'école pendant le temps de classe pour un moment joyeux, coloré et rempli de magie ! 🎭 C'est une belle occasion de célébrer ensemble l'arrivée du printemps et la joie de vivre. 🌸\n\nLes enfants sont invités à venir déguisés en insectes ou en fleurs dans leurs classes, créant ainsi une ambiance festive et poétique. 🦋🌺 Dans leurs déguisements enchanteurs, ils découvriront la beauté de la nature qui s'éveille et partageront des rires complices. 😄\n\nC'est un moment privilégié où la créativité, l'imaginaire et la bienveillance se rencontrent pour créer des souvenirs précieux et inspirer les enfants à s'exprimer librement. 🐝🌿✨",
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
        content: "La fête d'école est bien plus qu'une simple célébration : c'est un moment privilégié où l'école se transforme en lieu de partage et de bonheur. 🌟 Nous vous invitons chaleureusement à célébrer ensemble une belle année scolaire, riche d'apprentissages, de rires et de beaux souvenirs. 📚💕\n\nAu programme de ce jour festif : 🎪 jeux divertissants en famille, 🎮 animations pour petits et grands, 🎉 douceurs gourmandes à savourer ensemble, 🍰 et une atmosphère bienveillante qui réchauffe le cœur. ❤️\n\nC'est l'occasion rêvée de renforcer les liens entre familles et l'école, de valoriser les efforts de nos enfants, et de clore cette année avec la joie et la gratitude. ✨ Venez profiter de cette belle journée en famille, c'est un cadeau à ne pas manquer ! 🎁",
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
        content: "Nous vous accueillons chaleureusement pour notre réunion mensuelle, un moment de partage et de collaboration bienveillante. 🤝 C'est l'occasion précieuse de discuter ensemble des projets en cours, 💬 de partager vos idées et vos envies, 💡 et de construire avec confiance les beaux moments qui enrichiront la vie scolaire de nos enfants. 🎈\n\nVotre présence et vos idées sont précieuses pour nous. ✨ Ensemble, nous créons une communauté solidaire et engagée au service du bien-être et du développement de nos enfants. 💚",
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
        content: "Nous vous invitons à ce moment privilégié de partage et de bienveillance, où nous célébrons ensemble les beaux moments de l'année écoulée et ses accomplissements. 🎉\n\nC'est l'occasion idéale de revenir sur les projets menés avec soin et enthousiasme, 📚 de découvrir les belles initiatives à venir, 🌟 et de connaître les résultats de l'élection des parents qui vous représenteront. 🗳️\n\nEnsemble, nous construisons une école plus forte, plus unie et plus épanouissante pour tous nos enfants. 💪💕",
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
        content: "Nous vous invitons avec joie à participer à notre traditionnelle vente de gâteaux de Noël, un moment gourmand et convivial rempli de la magie des fêtes. 🎄 Dégustez des gourmandises préparées avec amour 🍪 et partagez des instants chaleureux en famille. ❄️\n\nChaque achat, chaque sourire contribue à soutenir généreusement les beaux projets ludiques de notre école, pour le bien-être et l'épanouissement de nos enfants. 🎁💝\n\nSelon la météo, l'événement se déroulera soit sur le parvis enchanteur de l'école, soit à la chaleur de la salle d'événement annexe de la Maison pour Tous Boris Vian. ☃️ Dans les deux cas, ce sera un moment de partage bienveillant ! 🤗",
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
        content: "Nous vous accueillons chaleureusement pour cette belle vente de Toussaint, un moment festif qui ravira petits et grands ! 🎃 Découvrez nos stands créatifs remplis d'idées originales et de créations, 🎨 savourez des boissons chaudes réconfortantes, ☕ et profitez des animations joyeuses organisées avec bienveillance. 🎉\n\nC'est une belle occasion de vivre ensemble l'esprit d'automne, 🍂 de soutenir les projets ludiques de l'école et de créer des souvenirs précieux en famille. 💛 Nous vous attendons nombreux ! 🤗",
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
        content: "Venez vivre un moment magique et poétique lors de notre Fête des Lanternes, une belle célébration de Saint Martin pleine de douceur et de lumière. 🏮✨\n\nAu cœur de l'automne, nous vous invitons à partager un goûter réconfortant en famille, 🧁 puis à parcourir ensemble le magnifique parc de la Rauze à la tombée de la nuit. 🌙 Les lanternes illumineront votre chemin tandis que les chansons célébrant Saint Martin résonnent doucement, 🎵 créant une atmosphère enchantée et bienveillante. ✨\n\nC'est un moment unique où la magie, la transmission et la solidarité se rencontrent pour toucher nos cœurs et illuminer nos âmes. 💫❤️",
        type: "evenement",
        date: "10 Novembre 2025",
        time: "14h00 - 17h00",
        location: "Cour de l'école",
        link: "https://www.instagram.com/p/DQVIRmDiF5Q/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        color: "accent",
        status: "past",
        attendees: 350,
    },
    {
        id: "presse-001",
        title: "Factures salées, froid en classe...",
        description: "Article de presse France Bleu - Découvrez comment une nouvelle chaudière impacte trois établissements scolaires de Montpellier. Une situation qui préoccupe les parents et l'équipe pédagogique.",
        content: "Une nouvelle chaudière a créé une situation problématique dans trois établissements scolaires de Montpellier, entraînant des factures énergétiques multipliées et des conditions d'enseignement difficiles avec des salles à classe à basse température. Consultez l'article complet sur France Bleu pour plus de détails sur cette situation.",
        type: "presse",
        date: "8 Février 2026",
        link: "https://www.francebleu.fr/infos/societe/facture-multipliee-par-5-salles-de-classe-a-10-degres-une-chaudiere-plombe-le-budget-de-trois-ecoles-a-montpellier-7381973",
        color: "indigo",
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
 * Exclut les événements passés et les documents (qui ont leur propre page)
 * Tri: événements à venir par date croissante (proches d'abord), autres par date décroissante (récentes d'abord)
 */
export function getAllActualites(): Actualite[] {
    const actualites = actualitesData.filter((a) => !(a.type === "evenement" && a.status === "past") && a.type !== "document");

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
