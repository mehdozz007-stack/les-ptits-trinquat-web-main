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
}

export const actualitesData: Actualite[] = [
    {
        id: "conseil-ecole-002",
        title: "Deuxième conseil d'école de l'année",
        description: "Nous vous accueillons pour le deuxième conseil d'école de l'année. Un moment d'échange et de partage pour discuter de la vie de l'école et des projets pédagogiques.",
        content: "Nous vous invitons à ce moment privilégié de partage et d'échange, où nous discuterons ensemble de la vie de l'école et des projets pédagogiques menés. 📚\n\nC'est l'occasion idéale de revenir sur les beaux projets mis en place, 🌟 de partager vos préoccupations et vos idées, 💬 et de construire ensemble une école plus forte et plus épanouissante pour tous nos enfants. 💚\n\nVotre présence et vos retours sont précieux pour nous. Ensemble, nous créons une communauté bienveillante au service du bien-être de tous. 🤝",
        type: "annonce",
        date: "2026-03-24",
        time: "17h45 - 19h00",
        location: "Salle polyvalente de l'école",
        color: "sky",
        status: "upcoming",
    },
    {
        id: "act-010",
        title: "Vide Grenier : La Récré des bonnes affaires !",
        description: "Un vide grenier convivial avec animations, musique et bonne ambiance en famille. Venez dénicher de bonnes affaires tout en participant à la vie de l'école !",
        content: "Nous vous accueillons avec grand plaisir pour un vide grenier festif et bienveillant, un moment magique où petits et grands peuvent vivre une belle expérience ensemble. ✨ Animations joyeuses, musique entraînante et bonne ambiance familiale créeront une atmosphère chaleureuse toute la journée. 🎵\n\nC'est l'occasion idéale de découvrir des trésors oubliés, 🎁 de donner une seconde vie à vos affaires, ♻️ et de soutenir les projets ludiques chers à nos enfants. Chaque achat, chaque échange contribue à construire ensemble une belle histoire pour notre école. 💚\n\nVenez partager ce moment de partage et de convivialité ! 🤝",
        type: "evenement",
        date: "2026-04-12",
        time: "10h00 - 16h00",
        location: "Cour de l'école",
        affiche: videGrenier,
        color: "emerald",
        status: "upcoming",
        attendees: 400,
        reservationLink: "https://www.helloasso.com/associations/les-p-tits-trinquat/evenements/recre-des-bonnes-affaires",
    },
    {
        id: "annonce-charity-001",
        title: "💙 Collecte solidaire : Une famille de notre école a besoin de nous",
        description: "Suite à un incendie, une famille a tout perdu. Nous organisons une collecte solidaire de vêtements, jeux sensoriels et dons.",
        content: "Chères familles,\n\nL'une des nôtres a aujourd'hui besoin de nous.\n\nLe mercredi 18 Février, une famille de l'école a vu son domicile entièrement détruit par un violent incendie\nCette maman, ses deux adolescents et sa petite fille de 5 ans ont tout perdu.\nAfin de les aider à faire face à cette situation dramatique, nous organisons une collecte solidaire.\n\nBESOINS URGENTS (EN PAUSE POUR LE MOMENT. Merci à tous 💙) \nVêtements fille 6 ans et chaussures taille 26/27\nVêtements pour 2 adolescents (taille M) et chaussures taille 42,5\nVêtements femme taille M et chaussures taille 37/38\nLa petite fille étant autiste, elle apprécie particulièrement :\nLes jeux sensoriels\nLes fidgets\nLes dinettes et aliments factices\nLes squishies.\n\nUne cagnotte en ligne a également été mise en place pour celles et ceux qui souhaitent participer financièrement.\nChaque geste, petit ou grand, fera une réelle différence pour les aider à se reconstruire.",
        type: "annonce",
        link: "https://www.lagazettedemontpellier.fr/justice/2026-02-17-montpellier-incendie-en-cours-dans-un-immeuble-pres-de-l-hotel-de-police/",
        color: "rose",
        status: "upcoming",
        galleryImage: maman,
        donationLink: "https://www.leetchi.com/fr/c/soutien-a-aliyah-et-sa-famille-victime-dun-incendie-1430829?utm_source=copylink&utm_medium=social_sharing",
    },
    {
        id: "act-007",
        title: "Carnaval à l'école",
        description: "Le carnaval s'invite à l'école pendant le temps de classe pour un moment joyeux et coloré. Les enfants pourront venir déguisés en insectes ou en fleurs afin de célébrer ensemble l'arrivée du printemps.",
        content: "Le carnaval s'invite à l'école pendant le temps de classe pour un moment joyeux, coloré et rempli de magie ! 🎭 C'est une belle occasion de célébrer ensemble l'arrivée du printemps et la joie de vivre. 🌸\n\nLes enfants sont invités à venir déguisés en insectes ou en fleurs dans leurs classes, créant ainsi une ambiance festive et poétique. 🦋🌺 Dans leurs déguisements enchanteurs, ils découvriront la beauté de la nature qui s'éveille et partageront des rires complices. 😄\n\nC'est un moment privilégié où la créativité, l'imaginaire et la bienveillance se rencontrent pour créer des souvenirs précieux et inspirer les enfants à s'exprimer librement. 🐝🌿✨",
        type: "evenement",
        date: "2026-04-17",
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
        date: "2026-01-01",
        fileUrl: "/documents/RSST_FICHE.pdf",
        color: "primary",
        status: "upcoming",
    },
    {
        id: "act-011",
        title: "Dossier Section Internationale Allemand 2026-2027",
        description: "Découvrez le dossier complet pour la Section Internationale avec option Allemand. Toutes les informations pour préparer la candidature.",
        content: "Dossier complet pour la Section Internationale Allemand 2026-2027",
        type: "document",
        date: "2026-02-19",
        fileUrl: "/documents/dossier-de-section-internationale-allemand-2026-2027.pdf",
        color: "sky",
        status: "upcoming",
    },

    {
        id: "act-009",
        title: "Fête d'école",
        description: "Rires, jeux, spectacles et douceurs gourmandes vous attendent pour partager ensemble un moment joyeux et festif et célébrer la fin de l'année scolaire 🌟🍭",
        content: "La fête d'école est bien plus qu'une simple célébration : c'est un moment privilégié où l'école se transforme en lieu de partage et de bonheur. 🌟 Nous vous invitons chaleureusement à célébrer ensemble une belle année scolaire, riche d'apprentissages, de rires et de beaux souvenirs. 📚💕\n\nAu programme de ce jour festif : 🎪 jeux divertissants en famille, 🎮 animations pour petits et grands, 🎉 douceurs gourmandes à savourer ensemble, 🍰 et une atmosphère bienveillante qui réchauffe le cœur. ❤️\n\nC'est l'occasion rêvée de renforcer les liens entre familles et l'école, de valoriser les efforts de nos enfants, et de clore cette année avec la joie et la gratitude. ✨ Venez profiter de cette belle journée en famille, c'est un cadeau à ne pas manquer ! 🎁",
        type: "evenement",
        date: "2026-06-19",
        time: "14h00 - 19h00",
        location: "Cour de l'école",
        color: "primary",
        status: "upcoming",
        attendees: 800,
    },
    // Événements passés
    {
        id: "act-004",
        title: "La crèpe party de l'école !",
        description: "Participez à notre traditionnelle vente de crêpes, un moment gourmand et convivial pour soutenir les projets de l'école.",
        content: "Nous vous invitons chaleureusement à notre crèpe party, un moment gourmand et convivial organisé sur le parvis de l'école. 🥞 Au programme : délicieuses crêpes préparées avec soin, ambiance joyeuse et échanges en famille. 😊\n\nC'est une belle occasion de déguster ensemble tout en soutenant les projets ludiques de nos enfants. 🎈 Chaque achat contribue directement à enrichir leur expérience scolaire et à créer des souvenirs inoubliables. 💝\n\nNous vous attendons nombreux pour ce moment de convivialité et de gourmandise ! 🤗",
        link: "/actualites/act-004",
        type: "evenement",
        date: "2026-02-20",
        time: "16h30 - 18h00",
        location: "Le parvis de l'école",
        affiche: crepesParty,
        color: "fuchsia",
        status: "past",
        attendees: 500,
    },
    {
        id: "act-001",
        title: "TOMBOLA 2026",
        description: "Partagez la joie et échangez vos superbes lots !",
        content: "La tombola de l'association est un moment convivial qui permet aux enfants de s'impliquer dans la vie de leur école, en vendant des tickets avec fierté et confiance. 🎟️\n\nGrâce au soutien de nos partenaires, Près de 500 lots ont été distribués aux participants. Chaque ticket a contribué directement aux projets ludiques de l'association. 🎁\n\nVotre espace en ligne tombola est désormais disponible, facilitant les échanges autour des lots, pour prolonger l'esprit de partage après le tirage. 💻✨\n\nMerci infiniment pour votre participation ! Consultez la liste de nos partenaires et bonne navigation sur notre application ! 🍀",
        type: "evenement",
        date: "2026-02-16",
        link: "/actualites/act-001",
        authLink: "/tombola",
        affiche: tomola,
        location: "Groupe scolaire FRANK-DICKENS",
        color: "accent",
        status: "past",
        attendees: 500,
    },
    {
        id: "act-002",
        title: "À l'attention des parents de CM2 Section Internationale",
        description: "Réunion d'information Lundi 16 février 2026 au collège des Aiguerelles.",
        content: "Une réunion d'information est organisée pour les familles intéressées par la section internationale. Consultez ou téléchargez l'affiche pour plus de détails.",
        type: "annonce",
        date: "2026-02-16",
        fileUrl: "/documents/Affiche_SI_écoles_260115_044150.pdf",
        color: "primary",
        status: "past",
        location: "Collège des Aiguerelles",
    },
    {
        id: "act-006",
        title: "Conseil d'école SI du 20 Janvier",
        description: "Retrouvez les points clés abordés lors du dernier conseil d'école et les prochaines étapes pour l'école.",
        content: "Le conseil d'école s'est réuni le 20 janvier pour discuter des projets ludiques, de l'organisation de l'année scolaire et des événements à venir. 📚",
        type: "information",
        date: "2026-01-20",
        link: "https://www.ent-ecole.fr/cardboard/0193c594-bf68-798a-97b7-aedda95767a2",
        location: "Salle polyvalente",
        color: "violet",
        attendees: 30,
        status: "past",
    },
    {
        id: "evt-005",
        title: "💞 Réunion mensuelle des parents 👨‍👩‍👧‍👦",
        description: "Un temps d'échange pour construire ensemble les futurs temps forts de l'école.",
        content: "Nous vous accueillons chaleureusement pour notre réunion mensuelle, un moment de partage et de collaboration bienveillante. 🤝 C'est l'occasion précieuse de discuter ensemble des projets en cours, 💬 de partager vos idées et vos envies, 💡 et de construire avec confiance les beaux moments qui enrichiront la vie scolaire de nos enfants. 🎈\n\nVotre présence et vos idées sont précieuses pour nous. ✨ Ensemble, nous créons une communauté solidaire et engagée au service du bien-être et du développement de nos enfants. 💚",
        type: "evenement",
        date: "2026-01-30",
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
        date: "2026-01-20",
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
        date: "2025-12-19",
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
        date: "2025-10-16",
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
        date: "2025-11-10",
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
        content: "presse",
        type: "presse",
        date: "2026-02-08",
        link: "https://www.francebleu.fr/infos/societe/facture-multipliee-par-5-salles-de-classe-a-10-degres-une-chaudiere-plombe-le-budget-de-trois-ecoles-a-montpellier-7381973",
        color: "indigo",
        status: "upcoming",
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
