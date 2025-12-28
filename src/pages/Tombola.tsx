import { motion } from "framer-motion";
import { Heart, Gift, Star, MessageCircle, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Types
interface Parent {
  id: string;
  prenom: string;
  role: string;
  classes: string;
  emoji: string;
  email: string;
}

interface Lot {
  id: string;
  nom: string;
  description: string;
  emoji: string;
  statut: "disponible" | "reserve" | "remis";
  parentId: string;
  parentPrenom: string;
  parentEmail: string;
  dateAjout: string;
}

// Component
export default function Tombola() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [showFormParent, setShowFormParent] = useState(false);
  const [showFormLot, setShowFormLot] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("😊");

  // Form states
  const [parentForm, setParentForm] = useState({
    prenom: "",
    role: "Parent participant",
    classes: "",
    email: "",
  });

  const [lotForm, setLotForm] = useState({
    nom: "",
    description: "",
    emoji: "🎁",
  });

  const emojis = ["😊", "😃", "🤗", "😎", "🧡", "💪", "🌟", "✨", "🎨", "🎭", "🎪", "🎸"];
  const emojiLots = ["🎁", "🧸", "📚", "🎮", "🎲", "🍫", "🎫", "📱", "⌚", "👕", "🧦", "🎀"];

  // Load data from localStorage
  useEffect(() => {
    const savedParents = localStorage.getItem("tombola_parents");
    const savedLots = localStorage.getItem("tombola_lots");
    if (savedParents) setParents(JSON.parse(savedParents));
    if (savedLots) setLots(JSON.parse(savedLots));
  }, []);

  // Save parents to localStorage
  const saveParents = (newParents: Parent[]) => {
    setParents(newParents);
    localStorage.setItem("tombola_parents", JSON.stringify(newParents));
  };

  // Save lots to localStorage
  const saveLots = (newLots: Lot[]) => {
    setLots(newLots);
    localStorage.setItem("tombola_lots", JSON.stringify(newLots));
  };

  // Ajouter un parent
  const handleAddParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentForm.prenom || !parentForm.email) return;

    const newParent: Parent = {
      id: Date.now().toString(),
      prenom: parentForm.prenom,
      role: parentForm.role,
      classes: parentForm.classes,
      emoji: selectedEmoji,
      email: parentForm.email,
    };

    saveParents([...parents, newParent]);
    setParentForm({ prenom: "", role: "Parent participant", classes: "", email: "" });
    setShowFormParent(false);
  };

  // Ajouter un lot
  const handleAddLot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotForm.nom || !parents.length) return;

    const currentParent = parents[0]; // Prendre le premier parent comme exemple
    const newLot: Lot = {
      id: Date.now().toString(),
      nom: lotForm.nom,
      description: lotForm.description,
      emoji: lotForm.emoji,
      statut: "disponible",
      parentId: currentParent.id,
      parentPrenom: currentParent.prenom,
      parentEmail: currentParent.email,
      dateAjout: new Date().toLocaleDateString("fr-FR"),
    };

    saveLots([...lots, newLot]);
    setLotForm({ nom: "", description: "", emoji: "🎁" });
    setShowFormLot(false);
  };

  // Réserver un lot
  const handleReserveLot = (lotId: string) => {
    const updated = lots.map((lot) =>
      lot.id === lotId ? { ...lot, statut: "reserve" as const } : lot
    );
    saveLots(updated);
  };

  // Supprimer un parent
  const handleDeleteParent = (id: string) => {
    saveParents(parents.filter((p) => p.id !== id));
  };

  // Supprimer un lot
  const handleDeleteLot = (id: string) => {
    saveLots(lots.filter((l) => l.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/4 h-60 w-60 rounded-full bg-primary/20 watercolor-blob" />
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-secondary/20 watercolor-blob" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="mb-4 text-6xl">🎁</div>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              La Tombola des <span className="text-gradient">P'tits Trinquat</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Un moment de partage, de sourires et de solidarité entre familles
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section Parents */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-2 text-3xl font-bold">
              Nos <span className="text-gradient">parents participants</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              {parents.length} parent{parents.length !== 1 ? "s" : ""} inscrit{parents.length !== 1 ? "s" : ""}
            </p>

            {!showFormParent && (
              <Button variant="playful" size="lg" onClick={() => setShowFormParent(true)} className="mb-8">
                <Plus className="mr-2 h-5 w-5" />
                Je m'inscris
              </Button>
            )}
          </motion.div>

          {/* Formulaire inscription parent */}
          {showFormParent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12 max-w-2xl mx-auto"
            >
              <Card variant="playful" className="border-2 border-primary/30">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Inscrivez-vous ! 👋</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFormParent(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <form onSubmit={handleAddParent} className="space-y-6">
                    {/* Choix emoji */}
                    <div>
                      <label className="text-sm font-semibold mb-3 block">Choisissez votre emoji</label>
                      <div className="grid grid-cols-6 gap-2">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setSelectedEmoji(emoji)}
                            className={`text-3xl p-2 rounded-lg transition-all ${
                              selectedEmoji === emoji
                                ? "bg-primary/20 scale-125"
                                : "hover:bg-muted"
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Prénom */}
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Votre prénom *</label>
                      <Input
                        type="text"
                        placeholder="Ex: Marie"
                        value={parentForm.prenom}
                        onChange={(e) => setParentForm({ ...parentForm, prenom: e.target.value })}
                        required
                      />
                    </div>

                    {/* Rôle */}
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Votre rôle</label>
                      <select
                        value={parentForm.role}
                        onChange={(e) => setParentForm({ ...parentForm, role: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                      >
                        <option>Parent participant</option>
                        <option>Membre du bureau</option>
                        <option>Bénévole</option>
                      </select>
                    </div>

                    {/* Classes */}
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Classe(s) de l'enfant</label>
                      <Input
                        type="text"
                        placeholder="Ex: CM1 A"
                        value={parentForm.classes}
                        onChange={(e) => setParentForm({ ...parentForm, classes: e.target.value })}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Votre email * (privé)</label>
                      <Input
                        type="email"
                        placeholder="vous@example.com"
                        value={parentForm.email}
                        onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        ✅ Votre email ne sera jamais affiché publiquement
                      </p>
                    </div>

                    <Button type="submit" variant="playful" className="w-full">
                      Valider mon inscription
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Grille des parents */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            {parents.map((parent) => (
              <motion.div key={parent.id} variants={itemVariants}>
                <Card
                  variant="playful"
                  className="group h-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                >
                  <CardContent className="p-4 sm:p-5 flex flex-col items-center text-center h-full justify-between">
                    {/* Emoji */}
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                      {parent.emoji}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">{parent.prenom}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{parent.role}</p>
                      {parent.classes && (
                        <span className="inline-block bg-primary/10 px-2 py-1 rounded-full text-xs font-medium text-primary">
                          {parent.classes}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-3 text-xs"
                      onClick={() => handleDeleteParent(parent.id)}
                    >
                      Supprimer
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {parents.length === 0 && !showFormParent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground mb-6">
                Aucun parent inscrit pour le moment. Soyez le premier !
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Section Lots */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-2 text-3xl font-bold">
              Les <span className="text-gradient">lots de tombola</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              {lots.length} lot{lots.length !== 1 ? "s" : ""} disponible{lots.filter((l) => l.statut === "disponible").length > 0 ? "s" : ""}
            </p>

            {parents.length > 0 && !showFormLot && (
              <Button variant="playful" size="lg" onClick={() => setShowFormLot(true)} className="mb-8">
                <Gift className="mr-2 h-5 w-5" />
                Ajouter un lot
              </Button>
            )}
          </motion.div>

          {/* Formulaire ajout lot */}
          {showFormLot && parents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12 max-w-2xl mx-auto"
            >
              <Card variant="playful" className="border-2 border-primary/30">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Ajouter un lot 🎁</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFormLot(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <form onSubmit={handleAddLot} className="space-y-6">
                    {/* Emoji */}
                    <div>
                      <label className="text-sm font-semibold mb-3 block">Choisissez une icône</label>
                      <div className="grid grid-cols-6 gap-2">
                        {emojiLots.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setLotForm({ ...lotForm, emoji })}
                            className={`text-3xl p-2 rounded-lg transition-all ${
                              lotForm.emoji === emoji
                                ? "bg-primary/20 scale-125"
                                : "hover:bg-muted"
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Nom */}
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Nom du lot *</label>
                      <Input
                        type="text"
                        placeholder="Ex: Tablette tactile"
                        value={lotForm.nom}
                        onChange={(e) => setLotForm({ ...lotForm, nom: e.target.value })}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Description courte</label>
                      <Textarea
                        placeholder="Décrivez brièvement votre lot..."
                        value={lotForm.description}
                        onChange={(e) => setLotForm({ ...lotForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <Button type="submit" variant="playful" className="w-full">
                      Ajouter ce lot
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Grille des lots */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {lots.map((lot) => (
              <motion.div key={lot.id} variants={itemVariants}>
                <Card
                  variant="playful"
                  className={`h-full overflow-hidden hover:shadow-lg transition-all duration-300 ${
                    lot.statut === "disponible"
                      ? "border-2 border-green-500/30"
                      : lot.statut === "reserve"
                      ? "border-2 border-yellow-500/30"
                      : "border-2 border-red-500/30 opacity-75"
                  }`}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Header avec emoji et statut */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-4xl">{lot.emoji}</div>
                      <div className="text-right">
                        {lot.statut === "disponible" && (
                          <span className="inline-block bg-green-500/20 px-3 py-1 rounded-full text-xs font-semibold text-green-700">
                            🟢 Disponible
                          </span>
                        )}
                        {lot.statut === "reserve" && (
                          <span className="inline-block bg-yellow-500/20 px-3 py-1 rounded-full text-xs font-semibold text-yellow-700">
                            🟡 Réservé
                          </span>
                        )}
                        {lot.statut === "remis" && (
                          <span className="inline-block bg-red-500/20 px-3 py-1 rounded-full text-xs font-semibold text-red-700">
                            🔴 Remis
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contenu */}
                    <h3 className="text-lg font-bold text-foreground mb-2">{lot.nom}</h3>
                    {lot.description && (
                      <p className="text-sm text-muted-foreground mb-4 flex-1">{lot.description}</p>
                    )}

                    {/* Info parent */}
                    <div className="bg-muted/50 p-3 rounded-lg mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Proposé par</p>
                      <p className="font-semibold">{lot.parentPrenom}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {lot.statut === "disponible" && (
                        <Button
                          variant="playful"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleReserveLot(lot.id)}
                        >
                          Réserver
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a
                          href={`mailto:${lot.parentEmail}?subject=Lot: ${lot.nom}`}
                          className="flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Contacter
                        </a>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeleteLot(lot.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {lots.length === 0 && !showFormLot && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground mb-6">
                Aucun lot pour le moment. Soyez le premier à en proposer un !
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Section Esprit associatif */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card variant="playful" className="border-2 border-secondary/30 bg-gradient-to-br from-secondary/10 to-accent/10">
              <CardContent className="p-8 sm:p-12">
                <Heart className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">L'esprit de notre tombola</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Un lot ne correspond pas à vos besoins ? Échangez-le en toute simplicité entre familles. Notre tombola, c'est avant tout un moment de partage, d'entraide et de solidarité pour soutenir les projets de nos enfants.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  "Ensemble, nous créons une communauté où chaque famille se sent accueillie et soutenue." 🤝
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
