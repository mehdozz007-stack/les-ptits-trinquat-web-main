import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import quizzRoomImage from "@/assets/quizzroomtombola.jpg";

// Import des logos
import quizRoomLogo from "@/assets/logos/quizRoom.webp";
import morpheeLogo from "@/assets/logos/Morphee_Logo2025.svg";
import lesPetitsBilinguesLogo from "@/assets/logos/lesPetitsBilingues.jpeg";
import atelierTufferyLogo from "@/assets/logos/atelier_tuffery_logo.svg";
import brinDeTerre from "@/assets/logos/brindeterre.jpg";
import manuCreation from "@/assets/logos/manucreation.jpg";
import astroludik from "@/assets/logos/logo-astroludik.png";
import massagesIsa from "@/assets/logos/isamassage.avif";
import frenchKissLogo from "@/assets/logos/frenchkiss.png";
import enviForm from "@/assets/logos/enviForm.png";

// Les 6 partenaires principaux
const mainPartners = [
  {
    id: 1,
    name: "Les petits bilingues",
    category: "Éducation",
    description: "Cours d'anglais ludiques pour les enfants, méthode immersive et adaptée à chaque âge.",
    logo: lesPetitsBilinguesLogo,
    website: "https://www.lespetitsbilingues.com/les-centres-lpb/montpellier/",
  },
  { id: 76, 
    name: "French Kiss", 
    category: "Restauration",
    description: "Restaurant français proposant une cuisine savoureuse et authentique dans un cadre convivial.", 
    logo: frenchKissLogo, website: "https://www.frenchkiss.fr/nos-adresses/montpellier",
  },
  {
    id: 2,
    name: "Atelier Tuffery",
    category: "Shopping",
    description: "Jean français fabriqué artisanalement en Lozère depuis 1892.",
    logo: atelierTufferyLogo,
    website: "https://www.ateliertuffery.com/pages/boutique-jeans-francais-montpellier",
  },
  {
    id: 3,
    name: "Enviform Sport Santé",
    category: "Bien être",
    description: "coaching sportif et bien-être.",
    logo: enviForm,
    website: "https://www.enviform-sport-sante.fr/",
  },
  {
    id: 4,
    name: "Manu Créations Couture",
    category: "Éducation",
    description: "Ateliers créatifs de couture pour enfants et adultes.",
    logo: manuCreation,
    website: "https://www.manu-creations.com/",
  },
  {
    id: 5,
    name: "Astroludik",
    category: "Éducation",
    description: "Animations ludiques autour de l'astronomie pour éveiller la curiosité des enfants.",
    logo: astroludik,
    website: "https://www.astroludik.com/",
  },
];

// Partenaires par catégorie pour le carrousel
const carouselPartners = [
  // Restauration
  
  { id: 7, name: "Moutarde et Wasabi", logo: "🍣", category: "Restauration", website: "http://moutarde-et-wasabi.fr/index.html" },
  { id: 8, name: "Pate'oche", logo: "🍝", category: "Restauration", website: "https://www.instagram.com/pate_oche34/?hl=en" },
  { id: 9, name: "Yo & Co", logo: "🍦", category: "Restauration", website: "https://www.yoandco.net/" },
  { id: 10, name: "M&lice", logo: "🧁", category: "Restauration", website: "https://www.melice.fr/" },
  { id: 11, name: "Cafés et Gourmandises", logo: "☕", category: "Restauration", website: "https://www.facebook.com/CafesGourmandises/" },
  { id: 12, name: "Café Joyeux", logo: "😊", category: "Restauration", website: "https://www.cafejoyeux.com/fr/content/49-cafe-joyeux-montpellier?srsltid=AfmBOopcympFwDGMq35jj09dnuDK-4HepNBcUHO6_0wtv8BrtiZDJEI6" },
  { id: 70, name: "BC Végé", logo: "🥗", category: "Restauration", website: "https://bc-vege.fr/" },
  { id: 75, name: "French Kiss", logo: "🍽️", category: "Restauration", website: "https://www.frenchkiss.fr/nos-adresses/montpellier" },
  
  // Culture & Spectacles
  { id: 13, name: "South Comédie", logo: "🎤", category: "Culture", website: "https://www.instagram.com/south.comedyclub/?hl=en" },
  { id: 14, name: "Cinéma Diagonal", logo: "🎬", category: "Culture", website: "https://www.cinediagonal.com/" }, // official site found :contentReference[oaicite:0]{index=0}
  { id: 15, name: "Théâtre Jean Vilar", logo: "🎭", category: "Culture", website: "https://theatrejeanvilar.montpellier.fr/" }, // official Montpellier site :contentReference[oaicite:1]{index=1}
  { id: 16, name: "Rêves de Cirques", logo: "🎪", category: "Culture", website: "https://www.reves-de-cirque.com/montpellier" },
  { id: 17, name: "Théâtre la Chocolaterie", logo: "🍫", category: "Culture", website: "https://lachocolaterie.org/" },
  { id: 18, name: "Théâtre de la Plume", logo: "🎭", category: "Culture", website: "https://www.theatredelaplume.com/" },
  { id: 60, name: "Théâtre La Vista", logo: "👏", category: "Culture", website: "https://www.theatrelavista.fr/" },
  { id: 74, name: "Théâtre Le Point Comedie", logo: "🎬", category: "Culture", website: "https://www.lepointcomedie.fr/" },
  

  { id: 19, name: "Kitty English School", logo: "🐱", category: "Éducation", website: "https://www.kittyenglishschool.fr/" },
  //{ id: 5, name: "Astroludik", category: "Éducation", logo: "🔭", website: "https://www.astroludik.com/"},
  { id: 62, name: "L'Atelier de Mo", logo: "🎨", category: "Éducation", website: "https://www.latelier-de-mo.com/" },
  {
    id: 83,
    name: "Brin de Terre",
    category: "Éducation",
    description: "Ateliers poterie pour enfants et adultes.",
    logo: "🏺",
    website: "https://www.instagram.com/atelierbrindeterre/",
  },
  { id: 20, name: "Atol", logo: "👓", category: "Shopping", website: "https://www.atol.fr/" },
  { id: 21, name: "Comme Avant", logo: "🧴", category: "Shopping", website: "https://www.comme-avant.bio/pages/la-boutique-comme-avant-a-montpellier?srsltid=AfmBOoohHGzktxYXZLmUaSKHOB5aUJogOp5ZJ8hL9f7HQ2kCpYTb3T5C" },
  { id: 22, name: "Cartapapa", logo: "📮", category: "Shopping", website: "https://cartapapa.fr/" },
  { id: 23, name: "Parfume Moi", logo: "🌸", category: "Shopping", website: "https://parfumemoi.fr/" },
  { id: 64, name: "Uniikon", logo: "👔", category: "Shopping", website: "https://uniikon.com/pages/store-map?srsltid=AfmBOopXaLEZjulU-VHfOEUrzOhNcIX9Mp_YF15niXmHvl5dacBBq8w3" },
  { id: 82, name: "La Salamandre", logo: "🦎", category: "Shopping", website: "https://www.salamandre.org/" },
  
  { id: 6, name: "Massages d'Isa", category: "Bien-être", logo: "💆‍♀️", website: "https://isabellerichez34.wixsite.com/monsite-6"},
  { id: 24, name: "Self Défense Féminine Occitanie", logo: "🥋", category: "Bien-être", website: "https://www.helloasso.com/associations/self-defense-feminine-occitanie" },
  { id: 25, name: "Centre Équestre Occitanie", logo: "🐴", category: "Bien-être", website: "https://sites.google.com/ceso34.com/info/accueil" },
  { id: 26, name: "Cocon des Doulas", logo: "🤱", category: "Bien-être", website: "https://lecocondesdoulas.wixsite.com/le-cocon-des-doulas" },
  { id: 27, name: "Terres de Lumières", logo: "✨", category: "Bien-être", website: "https://www.terres-de-lumiere.fr/" },
  { id: 28, name: "Nails by Marion", logo: "💅", category: "Bien-être", website: "https://www.instagram.com/nails_by_marion34/" },
  { id: 71, name: "Mademoiselle Coiff", logo: "💇", category: "Bien-être", website: "https://mademoiselle-coiffe.fr/" },
  { id: 72, name: "Just Fit", logo: "💪", category: "Bien-être", website: "" },
  { id: 73, name: "Fit Family", logo: "🏃", category: "Bien-être", website: "https://fitfamily.fr/" },
  { id: 68, name: "Nomaïa", logo: "🧘", category: "Bien-être", website: "https://www.instagram.com/nomaia_montpellier/" },
  { id: 61, name: "Sport Break", logo: "🏋️‍♀️", category: "Bien-être", website: "https://www.sport-break.fr/" },
  { id: 77, name: "Dali Berber", logo: "💇‍♂️", category: "Bien-être", website: "https://share.google/SYtjN5i9ed5u1nKPK" },
  { id: 78, name: "Harmonie de l'âme", logo: "💇", category: "Bien-être", website: "https://share.google/UwSsbW8NWxhp0QiBe" },
  
  { id: 29, name: "Sticker Kid", logo: "🏷️", category: "Événements", website: "https://www.stickerkid.fr/fr_fr/?gc_id=22380077972&h_ga_id=177763846235&h_ad_id=741963232215&h_keyword_id=kwd-3117029590&h_keyword=commander%20stickers&h_placement=&gad_source=1&gad_campaignid=22380077972&gclid=Cj0KCQiAuvTJBhCwARIsAL6DemgaL7OxCXFNHQau9UlzioyJXf4UmNtsAzqCMynLY3KGKkVPhdE15U0aAs-vEALw_wcB" },
  { id: 30, name: "Fabrique Photos", logo: "📸", category: "Événements", website: "https://lafabriquephotos.fr/" },
  { id: 31, name: "Festikid", logo: "🎉", category: "Événements", website: "https://www.festikid.com/" },
  { id: 32, name: "Morphée", logo: "🐈", category: "Événements", website: "https://danslespattesdemorphee.jimdofree.com/" },
  { id: 33, name: "Civiletti Elodie Photographie", logo: "📷", category: "Événements", website: "https://www.elodie-civiletti-photographie.fr/" },
  { id: 34, name: "Royaume des Princesses", logo: "👑", category: "Événements", website: "https://anniversaireprincesse.fr/" },
  { id: 35, name: "L'Atelier des Pelotes", logo: "🧶", category: "Événements", website: "https://antigonedesassociations.montpellier.fr/latelier-des-pelotes" },
  { id: 36, name: "Studio Nyps", logo: "🎞️", category: "Événements", website: "https://www.studionyps.fr/montpellier/" },

  { id: 37, name: "Roc de Massereau", logo: "🏕️", category: "Loisirs", website: "https://rocdemassereau.com/" },
  { id: 38, name: "Micropolis", logo: "🐜", category: "Loisirs", website: "https://www.micropolis-aveyron.com/" },
  { id: 39, name: "Rochers de Maguelone", logo: "🦪", category: "Loisirs", website: "https://www.les-rochers-de-maguelone.com/" },
  { id: 40, name: "Green Park", logo: "🌳", category: "Loisirs", website: "https://www.uzes-pontdugard.com/equipement/green-park/" },
  { id: 41, name: "Ferme du Dolmen", logo: "🐄", category: "Loisirs", website: "https://lafermedudolmen.fr/" },
  { id: 42, name: "Domaine de Launac", logo: "🏰", category: "Loisirs", website: "https://www.ledomainedelaunac.com/" },
  { id: 43, name: "Parc Spirou", logo: "🎢", category: "Loisirs", website: "https://www.parc-spirou.com/" },
  { id: 44, name: "Aquaforest", logo: "🌊", category: "Loisirs", website: "https://aquaforest.fr/" },
  { id: 45, name: "Mad Monkey", logo: "🐒", category: "Loisirs", website: "https://madmonkey.fr/montpellier/" },
  { id: 46, name: "Teraventura", logo: "🗺️", category: "Loisirs", website: "https://www.teraventura.fr/" },
  { id: 47, name: "Tyroliane", logo: "🧗", category: "Loisirs", website: "https://www.tyroliane.fr/" },
  { id: 48, name: "Europark Indoor", logo: "🎠", category: "Loisirs", website: "https://www.europarkindoor.com/" },
  { id: 49, name: "Space Games", logo: "🚀", category: "Loisirs", website: "https://spacegamesindustry.com/" },
  { id: 50, name: "Petits Fermiers", logo: "🐑", category: "Loisirs", website: "https://www.lespetitsfermiers.fr/" },
  { id: 51, name: "Dinopedia", logo: "🦕", category: "Loisirs", website: "https://www.le-monde-de-dinopedia.fr/nos-parcs/dinopedia-parc-cevennes/" },
  { id: 52, name: "Seaquarium", logo: "🦈", category: "Loisirs", website: "https://www.seaquarium.fr/" },
  { id: 53, name: "Village des Enfants", logo: "🏡", category: "Loisirs", website: "https://www.levillagedesenfants.net/" },
  { id: 54, name: "Planet Océan", logo: "🐋", category: "Loisirs", website: "https://www.planetoceanworld.fr/" },
  { id: 55, name: "Creamondes", logo: "🎨", category: "Loisirs", website: "https://www.creamondes.com/" },
  { id: 56, name: "Train Vapeur des Cévennes", logo: "🚂", category: "Loisirs", website: "https://www.trainavapeur.com/" },
  { id: 57, name: "Vélorail Cévennes", logo: "🚴", category: "Loisirs", website: "https://www.veloraildescevennes.fr/" },
  { id: 58, name: "Goolfy", logo: "⛳", category: "Loisirs", website: "https://goolfy-montpellier.com/" },
  { id: 65, name: "Ptit Club", logo: "🎮", category: "Loisirs", website: "https://leptitclub.fr/nos-clubs/montpellier/" },
  { id: 66, name: "Quiz Room", logo: "🧩", category: "Loisirs", website: "https://escapegame.lol/salle/quizz-room-apero/?gad_source=1&gad_campaignid=23380697435&gclid=EAIaIQobChMIq_i6t6rbkQMVGKb9BR1wYBz2EAAYASAAEgI1y_D_BwE#/catalog/dce14b71-57cc-4da9-8bd2-2ea7d73db283" },
  { id: 67, name: "Times Xpérience", logo: "⏰", category: "Loisirs", website: "https://timexperience-montpellier.fr/" },
  { id: 59, name: "Pirates Paradise", logo: "🏴‍☠️", category: "Loisirs", website: "https://montpellier.pirates-paradise.fr/" },
  { id: 63, name: "Grottes de Trabuc", logo: "⛏️", category: "Loisirs", website: "https://www.grottesdetrabuc.com/" },
  { id: 69, name: "Swim Stars", logo: "🏊‍♀️", category: "Loisirs", website: "https://swimstars.co/piscines/montpellier/" },
  { id: 79, name: "Boulder Line", logo: "🧗‍♀️", category: "Loisirs", website: "https://boulderline.fr/" },
  { id: 80, name: "La Bambouseraie", logo: "🚶", category: "Loisirs", website: "https://bambouseraie.fr/" },
  { id: 81, name: "Librairie Nemo", logo: "📚", category: "Loisirs", website: "https://www.librairienemo.com/" },
];

const categories = ["Tous", "Restauration", "Culture", "Éducation", "Shopping", "Bien-être", "Événements", "Loisirs"];

// Événements spéciaux et partenariats
const specialEventCards = [
  {
    id: 1,
    title: "Quiz Room Montpellier - Tombola Familiale",
    description: "Une expérience immersive de jeu et divertissement en famille. Offre spéciale pour nos membres !",
    partner: "Escape Game",
    gradientFrom: "from-violet-200/40",
    gradientTo: "to-purple-200/40",
    borderColor: "border-violet-200/60",
    logo: quizRoomLogo,
    url: quizzRoomImage,
    type: "image"
  },
  {
    id: 2,
    title: "Morphée Breathe & Shine",
    description: "Avec le code TRINQUAT10, bénéficiez de 10% de réduction sur vos commandes. (Offre valable uniquement sur site, sans limite de validité !)",
    partner: "Shopping",
    gradientFrom: "from-rose-200/40",
    gradientTo: "to-pink-200/40",
    borderColor: "border-rose-200/60",
    logo: morpheeLogo,
    url: "https://www.morphee.co/products/mon-petit-morphee?utm_source=GoogleAds&utm_medium=cpc&utm_campaign=elio",
    type: "link"
  },
  /*{
    id: 3,
    title: "Animations astronomie",
    description: "Éveillez la curiosité des enfants avec les animations ludiques autour des étoiles et de l'espace.",
    partner: "Astroludik",
    gradientFrom: "from-sky-200/40",
    gradientTo: "to-blue-200/40",
    borderColor: "border-sky-200/60",
    emoji: "🔭",
    url: "https://www.astroludik.com",
    type: "link"
  }*/
];

const Partenaires = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-sky-gradient py-20" >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/4 h-60 w-60 rounded-full bg-accent/20 watercolor-blob" />
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-secondary/20 watercolor-blob" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-center mx-auto"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent-foreground">
              <Heart className="h-4 w-4 text-secondary" />
              Merci à eux
            </span>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Nos <span className="text-gradient">partenaires</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Grâce à leur soutien, nous pouvons organiser des événements et des activités enrichissantes pour nos enfants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Événements spéciaux & Partenariats */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-12  text-center"
          >
            <h2 className="mb-2 text-2xl font-bold">
              Événements spéciaux <span className="text-gradient">& Partenariats exclusifs</span>
            </h2>
            <p className="text-muted-foreground">
              Découvrez les collaborations exclusives et activités spéciales proposées par nos partenaires pour enrichir la vie de nos enfants.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {specialEventCards.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              >
                <Card 
                  variant="playful" 
                  className={`h-full overflow-hidden border-2 ${event.borderColor} transition-all hover:shadow-lg hover:shadow-current/20`}
                  id={index === 0 ? "special-event-1" : undefined}
                >
                  <CardContent className="flex flex-col p-0 h-full">
                    {/* Logo Background */}
                    <div className={`h-32 bg-gradient-to-br ${event.gradientFrom} ${event.gradientTo} relative flex items-center justify-center overflow-hidden`}>
                      <img 
                        src={event.logo}
                        alt={event.partner}
                        className="h-full w-full object-contain p-4"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Partner Badge */}
                      <div className="mb-2 flex justify-center w-full">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {event.partner}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-2 text-xl font-bold text-foreground">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {event.description}
                      </p>

                      {/* Link Button */}
                      <div className="flex justify-center w-full">
                        <Button variant="ghost" size="sm" className="mt-4" asChild>
                          <a href={event.url} target="_blank" rel="noopener noreferrer">
                            Visiter
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Grid - First 6 partners */}
      <section className="bg-muted/50 py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -left-20 top-1/2 h-72 w-72 rounded-full bg-secondary/10 watercolor-blob" />
        <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-accent/10 watercolor-blob" />
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 text-center"
          >
            <h2 className="mb-2 text-2xl font-bold">Nos partenaires</h2>
            <p className="text-muted-foreground">Découvrez les entreprises et organismes qui soutiennent nos actions</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mainPartners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.6, ease: "easeOut" }}
              >
                <Card variant="playful" className="group h-full">
                  <CardContent className="flex flex-col items-center p-6 text-center h-full">
                    {/* Logo */}
                    <motion.div 
                      className="mb-4 flex h-48 w-48 items-center justify-center overflow-hidden transition-all"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="h-full w-full object-contain p-2 rounded-lg"
                      />
                    </motion.div>

                    {/* Category Badge */}
                    <span className="mb-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {partner.category}
                    </span>

                    {/* Name */}
                    <h3 className="mb-2 text-lg font-bold text-foreground">
                      {partner.name}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 flex-1 text-sm text-muted-foreground">
                      {partner.description}
                    </p>

                    {/* Link */}
                    <Button variant="ghost" size="sm" className="mt-auto" asChild>
                      <a href={partner.website} target="_blank" rel="noopener noreferrer">
                        Visiter
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Carousel - Remaining partners */}
      {carouselPartners.length > 0 && (
        <section className="py-12 bg-muted/30 overflow-hidden">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-foreground">Ils nous soutiennent aussi</h2>
            </motion.div>
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 1500,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="mx-auto max-w-6xl"
            >
              <CarouselContent className="-ml-2">
                {carouselPartners.map((partner) => (
                  <CarouselItem key={partner.id} className="pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                    {partner.website ? (
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center p-3 cursor-pointer hover:opacity-80 transition-opacity rounded-lg"
                      >
                        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-background text-2xl shadow-sm transition-transform hover:scale-110">
                          {partner.logo}
                        </div>
                        <span className="text-xs font-medium text-foreground text-center">
                          {partner.name}
                        </span>
                      </a>
                    ) : (
                      <div className="flex flex-col items-center p-3">
                        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-background text-2xl shadow-sm transition-transform hover:scale-110">
                          {partner.logo}
                        </div>
                        <span className="text-xs font-medium text-foreground text-center">
                          {partner.name}
                        </span>
                      </div>
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>
      )}

      {/* Become Partner CTA */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <Heart className="mx-auto mb-4 h-12 w-12 text-secondary" />
            <h2 className="mb-4 text-2xl font-bold">Devenir partenaire</h2>
            <p className="mb-6 text-muted-foreground">
              Vous souhaitez soutenir nos actions et participer à la vie scolaire ? Contactez-nous pour discuter d'un partenariat.
            </p>
            <Button variant="playful" size="lg" asChild>
              <Link to="/contact">
                Nous contacter
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Partenaires;
