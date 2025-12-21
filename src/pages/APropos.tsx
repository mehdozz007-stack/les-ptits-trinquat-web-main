import { motion } from "framer-motion";
import { useState } from "react";
import { Users, Heart, Target, History, UserCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bureauMembers = [
  { name: "Cindy", role: "Co-Présidente", emoji: "👩‍💼", classe: [12, 14, 18] },
  { name: "Vincent", role: "Co-Président", emoji: "👨‍💼", classe: [9, 17] },
  { name: "Mehdi", role: "Co-Secrétaire", emoji: "👨‍💻", classe: [1, 3] },
  { name: "Alexia", role: "Co-Secrétaire", emoji: "📝", classe: [12] },
  { name: "Camille L", role: "Co-Trésorière", emoji: "💰", classe: [1] },
  { name: "Chiara", role: "Co-Trésorière", emoji: "🧮", classe: [4, 11, 18] },
  { name: "Nora D", role: "Responsable réseaux sociaux", emoji: "📢", classe: [6, 7] },
  { name: "Yasmine", role: "Responsable communication", emoji: "🤝", classe: [4, 5] },
  { name: "Maité", role: "Responsable section internationale", emoji: "🌍", classe: [17] },
  { name: "Hanane S", role: "Co-Responsable événementiel", emoji: "🎊", classe: [6] },
  { name: "Hanan A", role: "Co-Responsable événementiel", emoji: "🎈", classe: [7, 13, 18] },
  { name: "Frédérique", role: "Conseillère principale", emoji: "🌸", classe: [14] },
   
  { name: "Linda", emoji: "🎨", classe: [12, 14, 18] },
  { name: "Redha", emoji: "🎉", classe: [10] },
  { name: "Sana", emoji: "🧸", classe: [5, 12, 15] },
  { name: "Benjamin", emoji: "🎲", classe: [13] },
  { name: "Ophélie", emoji: "🎭", classe: [6] },
  { name: "Khalem", emoji: "⚽", classe: [18] },
  { name: "Leïa", emoji: "🦋", classe: [5, 16] },
  { name: "Asma", emoji: "🌺", classe: [6] },
  { name: "Camille A", emoji: "🖍️", classe: [5] },
  { name: "Julie", emoji: "🎶", classe: [10, 15] },
  { name: "Loraine", emoji: "🌷", classe: [14] },
  { name: "Nadira", emoji: "✨", classe: [11] },
  { name: "Nora S", emoji: "🎊", classe: [12, 13] },
  { name: "Sebastien", emoji: "🎯", classe: [7, 11] },
  { name: "Juliette", emoji: "🎤", classe: [10] },
  { name: "Akila", emoji: "🧩", classe: [12, 16] },
  { name: "Guilhem", emoji: "🚲", classe: [14] },
  { name: "Ghania", emoji: "🎪", classe: [14, 16] },
  { name: "Cassandra", emoji: "🎨", classe: [7] },
  { name: "Mathieu", emoji: "⚽", classe: [1] },
  { name: "Olga", emoji: "🌻", classe: [14] },
  { name: "Zohra", emoji: "🍀", classe: [5] },
  { name: "Feriel", emoji: "🎈", classe: [6, 9] },
  { name: "Marie", emoji: "🎀", classe: [5] },
];



const values = [
  {
    icon: Heart,
    title: "Bienveillance",
    description: "Un accompagnement chaleureux et positif pour tous les enfants et leurs familles.",
    color: "secondary",
  },
  {
    icon: Users,
    title: "Solidarité",
    description: "Ensemble, nous créons une communauté soudée autour de l'école.",
    color: "sky",
  },
  {
    icon: Target,
    title: "Engagement",
    description: "Des parents investis pour améliorer le quotidien scolaire de nos enfants.",
    color: "accent",
  },
];

const APropos = () => {
  const parentsElus = bureauMembers.slice(6);
  const bureau = bureauMembers.slice(0, 6);
  const allMembers = bureauMembers; // Tous les membres (bureau + parents)
  
  // Parser les classes (array de nombres) et extraire toutes les classes uniques
  const parseClasses = (classes: number[] | string): string[] => {
    if (!classes) return [];
    
    // Si c'est un array de nombres
    if (Array.isArray(classes)) {
      return classes.map(c => `Classe [${c}]`);
    }
    
    // Sinon retourner la classe telle quelle
    return [classes];
  };
  
  // Formater les classes pour l'affichage avec "&"
  const formatClasses = (classes: number[] | string): string => {
    if (!classes) return "";
    
    if (Array.isArray(classes)) {
      const count = classes.length;
      const classesStr = classes.join(" & ");
      return count > 1 ? `Classes : ${classesStr}` : `Classe : ${classesStr}`;
    }
    
    return `Classe : ${String(classes)}`;
  };
  
  // Créer une map classe -> tous les parents (bureau + parents élus)
  const classeParentMap: { [key: string]: typeof allMembers } = {};
  allMembers.forEach(member => {
    const classes = parseClasses(member.classe);
    classes.forEach(classe => {
      if (!classeParentMap[classe]) {
        classeParentMap[classe] = [];
      }
      classeParentMap[classe].push(member);
    });
  });
  
  const classesUniques = Object.keys(classeParentMap).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.match(/\d+/)?.[0] || "0");
    return numA - numB;
  });
  
  const [selectedClasse, setSelectedClasse] = useState<string>("");
  
  // Afficher tous les parents (bureau + parents élus) si une classe est sélectionnée
  const parentsFiltrés = selectedClasse && classeParentMap[selectedClasse] 
    ? classeParentMap[selectedClasse] 
    : [];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-sky-gradient py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-sky/20 watercolor-blob" />
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-primary/20 watercolor-blob" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="mb-4 inline-flex items-sdfcenter gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <Users className="h-4 w-4" />
              Notre association
            </span>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              À propos des<br />
              <span className="text-gradient">P'tits Trinquat</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Depuis 2019, notre association rassemble les parents d'élèves du groupe scolaire <strong className="font-bold text-foreground">Anne FRANK - Charles DICKENS</strong> pour accompagner et enrichir la vie scolaire de nos enfants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-bold">
                Notre <span className="text-gradient">mission</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Les P'tits Trinquat est une association de parents d'élèves qui œuvre pour le bien-être et l'épanouissement des enfants au sein du groupe scolaire <strong className="font-bold text-foreground">Anne FRANK - Charles DICKENS</strong> à Montpellier.
                </p>
                <p>
                  Notre mission est triple : <strong>accompagner</strong> les familles dans leur relation avec l'école, <strong>enrichir</strong> la vie scolaire par des activités et événements, et <strong>financer</strong> les activités ludiques pour nos enfants grâce à nos actions.
                </p>
                <p>
                  Nous travaillons en étroite collaboration avec l'équipe pédagogique pour créer un environnement éducatif stimulant et bienveillant.
                </p>
              </div>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {values.map((value, index) => (
                <Card key={value.title} variant="elevated">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-${value.color}/20`}>
                      <value.icon className={`h-6 w-6 text-${value.color}`} />
                    </div>
                    <div>
                      <h3 className="mb-1 font-bold text-foreground">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bureau */}
      <section id="bureau" className="bg-muted/50 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Le bureau</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Notre équipe exécutive de bénévoles dévoués qui pilotent l'association.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bureauMembers.slice(0, 6).map((member, index) => (
              <motion.div
                key={`${member.name}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="elevated" className="text-center h-full bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20 hover:border-orange-300 shadow-soft hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                  {/* Animated background elements */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{ scale: [1, 1.5], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  <CardContent className="p-6 relative z-10">
                    <motion.div
                      className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-300/40 to-orange-200/40 text-4xl shadow-soft"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.15,
                        transition: { duration: 0.6 }
                      }}
                    >
                      {member.emoji}
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <h3 className="font-bold text-foreground text-center group-hover:text-orange-600 transition-colors duration-300">{member.name}</h3>
                    </motion.div>
                    
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 + 0.15 }}
                      className="text-sm font-semibold text-orange-500 mb-2 text-center group-hover:text-orange-600 transition-colors duration-300"
                    >
                      {member.role}
                    </motion.p>
                    
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                      className="text-xs text-muted-foreground italic text-center"
                    >
                      {formatClasses(member.classe)}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parents élus */}
      {bureauMembers.length > 6 && (
        <section className="py-16 bg-gradient-to-b from-transparent via-secondary/5 to-pink-30/20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100 }}
                className="flex flex-col items-center justify-center gap-6"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent-foreground">
                  <Heart className="h-4 w-4 text-secondary" />
                  Sans eux, rien ne serait possible
                </span>
                <h2 className="text-3xl font-bold">Parents représentants</h2>
              </motion.div>

              {/* Filtre par classe */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex justify-center"
              >
                <div className="w-full max-w-xs">
                  <motion.label 
                    className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-lg">🎓</span>
                    Filtrer par classe
                  </motion.label>
                  <Select value={selectedClasse} onValueChange={setSelectedClasse}>
                    <SelectTrigger className="bg-gradient-to-r from-orange-50 via-pink-50 to-white border-2 border-orange-200/60 hover:border-orange-300 hover:shadow-lg transition-all duration-300 rounded-2xl shadow-soft">
                      <SelectValue placeholder="✨ Sélectionnez votre classe..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-2 border-orange-200/50 bg-gradient-to-b from-orange-50/95 via-pink-50/95 to-white/95 backdrop-blur-sm">
                      {classesUniques.map((classe, idx) => (
                        <SelectItem 
                          key={classe} 
                          value={classe}
                          className="rounded-lg hover:bg-gradient-to-r hover:from-orange-200/60 hover:via-orange-100/60 hover:to-pink-100/60 cursor-pointer py-3 px-2 transition-colors duration-200 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-300/40 data-[state=checked]:via-orange-200/40 data-[state=checked]:to-pink-200/40"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{['🎯', '📚', '🌟', '💡', '🎨', '🚀', '🎭', '🎪', '🎬', '🎸', '🎯', '📖', '✏️', '🖊️', '📐', '🔬', '🧪', '🧬'][idx % 18]}</span>
                            {classe}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            </motion.div>

            {parentsFiltrés.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl p-8 bg-gradient-to-br from-orange-50/80 via-pink-50/80 to-orange-50/40 mb-8"
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {parentsFiltrés.map((member, index) => (
                    <motion.div
                      key={`${member.name}-${index}`}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: index * 0.08,
                        type: "spring",
                        stiffness: 120,
                        damping: 12
                      }}
                      whileHover={{ 
                        y: -8,
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Card variant="elevated" className="h-full bg-gradient-to-br from-secondary/5 via-accent/5 to-primary/5 border-secondary/20 hover:border-orange-300 shadow-soft hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                        {/* Animated background elements */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          animate={{ scale: [1, 1.5], opacity: [0, 0.5, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        
                        <CardContent className="p-4 text-center relative z-10">
                          <motion.div
                            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-200/40 to-orange-100/40 text-3xl sm:text-2xl shadow-soft"
                            whileHover={{ 
                              rotate: 360,
                              scale: 1.15,
                              transition: { duration: 0.6 }
                            }}
                          >
                            {member.emoji}
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 + 0.1 }}
                          >
                            <h3 className="font-bold text-foreground text-sm group-hover:text-orange-600 transition-colors duration-300">
                              {member.name}
                            </h3>
                          </motion.div>
                          
                          <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 + 0.15 }}
                            className="text-xs text-orange-500 font-semibold mb-1 group-hover:text-orange-600 transition-colors duration-300"
                          >
                            {member.role}
                          </motion.p>
                          
                          <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 + 0.2 }}
                            className="text-xs text-muted-foreground italic"
                          >
                            {formatClasses(member.classe)}
                          </motion.p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* History */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl"
          >
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet/20">
                <History className="h-7 w-7 text-violet" />
              </div>
              <h2 className="text-3xl font-bold">Notre histoire</h2>
            </div>

            <div className="space-y-6 text-muted-foreground">
              <p>
                Fondée en 2019, l'association Les P'tits Trinquat est née de la volonté de quelques parents de créer un lien fort entre les familles et l'école. Le nom "Trinquat" fait référence au quartier de Montpellier où se situe notre groupe scolaire.
              </p>
              <p>
                Au fil des années, nous avons organisé des centaines d'événements : fêtes d'école, marchés de Noël, ventes de gâteaux, vides-grenier, sorties scolaires... Chaque action contribue à financer des projets ludiques pour nos enfants et à créer des moments de partage inoubliables avec notre équipe enseignante.
              </p>
              <p>
                Aujourd'hui, nous sommes fiers de rassembler plus de 100 familles et de compter sur une équipe de bénévoles engagés qui font vivre l'association au quotidien.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Join CTA */}
      <section id="adherer" className="bg-gradient-to-br from-primary via-primary to-secondary py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <UserCheck className="mx-auto mb-6 h-16 w-16 text-primary-foreground/80" />
            <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground sm:text-4xl">
              Rejoignez l'aventure !
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80">
              L'adhésion annuelle est de seulement <strong className="text-primary-foreground">2€ par personne</strong>. Elle nous permet de financer nos actions et vous donne accès à tous nos événements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                className="bg-background text-primary hover:bg-background/90 shadow-lg rounded-2xl font-bold"
                >
                  <Link to="https://www.helloasso.com/associations/les-p-tits-trinquat/adhesions/nous-soutenir" target="_blank">
                    Adhérer maintenant
                  </Link>
              </Button>
              <Button
                size="xl"
                variant="ghost"
                className="text-primary-foreground border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 rounded-2xl font-bold"
                asChild
              >
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default APropos;
