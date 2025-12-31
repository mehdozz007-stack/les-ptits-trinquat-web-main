import { motion, AnimatePresence } from "framer-motion";
import { Heart, Gift, Star, MessageCircle, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TombolaValidation from "@/lib/tombola-validation";
import AuthService from "@/lib/authService";
import SecurityService from "@/lib/securityService";
import { HybridStorage } from "@/lib/db/hybridStorage";
import { Parent, Lot, ValidationError } from "@/lib/types";
import { AnimatedSuccessMessage, AnimatedErrorMessage } from "@/components/AnimatedMessage";
import { AnimatedFormContainer, FormFieldsContainer, AnimatedFormField } from "@/components/AnimatedForm";
import { AnimatedAuthStatus, AnimatedReconnectionPrompt, ConfettiCelebration } from "@/components/AnimatedAuth";
import { AnimatedSection, AnimatedEmptyState } from "@/components/AnimatedSection";

// Component
export default function Tombola() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [showFormParent, setShowFormParent] = useState(false);
  const [showFormLot, setShowFormLot] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("😊");
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<{ title: string; message: string; emoji?: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

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

  const emojis = ["😊", "😌", "🤗", "🙂", "☺️",
  "🤍", "💛", "💚", "💙", "💜",
  "🌿", "🍀", "🌸", "🌼", "🌻",
  "🦋", "✨", "🌟", "⭐", "🌈",
  "☀️", "🌙", "🍃", "🕊️"];
  const emojiLots = ["🎁", "🎀", "📦", "💝",
  "✨", "🌟", "⭐", "💎",
  "🎉", "🎊",
  "🏆", "🎯",
  "🎨", "🎭",
  "🎪", "🧸",
  "📚", "🖍️"];

  // Load data from server API (with IndexedDB cache fallback)
  useEffect(() => {
    const loadData = async () => {
      try {
        const { parents: parsedParents, lots: parsedLots } = await HybridStorage.loadData();

        // Clean orphan lots (critical rule)
        const cleanedLots = SecurityService.removeOrphanLots(parsedLots, parsedParents);
        
        setParents(parsedParents);
        setLots(cleanedLots);

        // Restore auth session (reconnect parent automatically)
        const session = AuthService.getSession();
        if (session) {
          const parent = parsedParents.find((p) => p.id === session.parentId);
          if (parent) {
            setCurrentParentId(session.parentId);
            console.log(`✅ Welcome back ${parent.prenom}!`);
          } else {
            // Parent was deleted, logout
            AuthService.logout();
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // Fallback to empty state
        setParents([]);
        setLots([]);
      }
    };

    loadData();
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Save parents to server (HybridStorage handles caching)
  const saveParents = async (newParents: Parent[]) => {
    setParents(newParents);
    // Sync with server happens when individual operations are performed
  };

  // Save lots to server (HybridStorage handles caching)
  const saveLots = async (newLots: Lot[]) => {
    setLots(newLots);
    // Sync with server happens when individual operations are performed
  };

  // Ajouter un parent
  const handleAddParent = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    // Validation complète
    const validation = TombolaValidation.validateParentRegistration({
      prenom: parentForm.prenom,
      email: parentForm.email,
      emoji: selectedEmoji,
      role: parentForm.role,
      classes: parentForm.classes,
    });

    if (!validation.valid) {
      setValidationErrors(
        validation.errors.map((msg) => ({ 
          field: "parent", 
          title: "Oups! 😊",
          message: msg 
        }))
      );
      return;
    }

    // Vérifier les doublons email
    if (TombolaValidation.checkEmailDuplicate(parentForm.email, parents)) {
      setValidationErrors([
        {
          field: "email",
          title: "Email déjà utilisé",
          message: "Un parent avec cet email est déjà inscrit",
        },
      ]);
      return;
    }

    // Générer un parentId unique
    const newParentId = AuthService.generateParentId();

    const newParent: Parent = {
      id: newParentId,
      prenom: parentForm.prenom,
      role: parentForm.role,
      classes: parentForm.classes,
      emoji: selectedEmoji,
      email: parentForm.email,
      createdAt: new Date().toISOString(),
    };

    // Save parent via HybridStorage (to server + IndexedDB cache)
    const savedParent = await HybridStorage.createParent({
      prenom: newParent.prenom,
      role: newParent.role,
      classes: newParent.classes,
      emoji: newParent.emoji,
      email: newParent.email,
      createdAt: newParent.createdAt,
    });

    if (savedParent) {
      setParents([...parents, savedParent]);
      
      // Create auth session for this parent
      AuthService.createSession(savedParent.id);
      setCurrentParentId(savedParent.id);

      setParentForm({ prenom: "", role: "Parent participant", classes: "", email: "" });
      setSelectedEmoji("😊");
      setShowFormParent(false);
      setSuccessMessage({
        title: `Bienvenue ${savedParent.prenom}! 🎉`,
        message: "Tu peux maintenant ajouter un lot à la tombola!",
        emoji: savedParent.emoji,
      });
      setShowFormLot(true);
    } else {
      setValidationErrors([
        {
          field: "parent",
          title: "Erreur d'inscription",
          message: "Impossible d'inscrire le parent. Veuillez réessayer.",
        },
      ]);
    }
  };

  // Ajouter un lot
  const handleAddLot = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    // Vérifier que le parent existe
    if (!currentParentId || !TombolaValidation.parentExists(currentParentId, parents)) {
      setValidationErrors([
        {
          field: "parent",
          title: "Non connecté",
          message: "Vous devez être inscrit pour ajouter un lot",
        },
      ]);
      return;
    }

    // Validation du lot
    const validation = TombolaValidation.validateLotCreation({
      nom: lotForm.nom,
      description: lotForm.description,
      emoji: lotForm.emoji,
    });

    if (!validation.valid) {
      setValidationErrors(
        validation.errors.map((msg) => ({ field: "lot", title: "Vérifiez vos infos 📝", message: msg }))
      );
      return;
    }

    const ownerParent = parents.find((p) => p.id === currentParentId);
    if (!ownerParent) return;

    const newLot: Lot = {
      id: Math.random().toString(36).substr(2, 9),
      nom: lotForm.nom,
      description: lotForm.description,
      emoji: lotForm.emoji,
      statut: "disponible",
      parentId: currentParentId,
      parentPrenom: ownerParent.prenom,
      parentEmail: ownerParent.email,
      dateAjout: new Date().toLocaleDateString("fr-FR"),
    };

    const savedLot = await HybridStorage.createLot(newLot);
    if (savedLot) {
      setLots([...lots, savedLot]);
      setLotForm({ nom: "", description: "", emoji: "🎁" });
      setShowFormLot(false);
      setSuccessMessage({
        title: `${savedLot.emoji} Lot ajouté! 🎉`,
        message: `"${savedLot.nom}" est maintenant en tombola!`,
        emoji: savedLot.emoji,
      });
    } else {
      setValidationErrors([
        {
          field: "lot",
          title: "Erreur lors de l'ajout",
          message: "Impossible d'ajouter le lot. Veuillez réessayer.",
        },
      ]);
    }
  };

  // Réserver un lot
  const handleReserveLot = async (lotId: string, reserverId: string) => {
    setValidationErrors([]);

    // Check access rights using SecurityService
    const canReserve = SecurityService.canReserveLot(lotId, lots);
    if (!canReserve.allowed) {
      setValidationErrors([
        {
          field: "reservation",
          title: "Réservation impossible",
          message: canReserve.reason,
        },
      ]);
      return;
    }

    const lot = lots.find((l) => l.id === lotId);
    if (!lot) return;

    const updatedLot = { ...lot, statut: "reserve" as const };
    
    const success = await HybridStorage.updateLot(lotId, updatedLot);
    
    if (success) {
      const updated = lots.map((l) =>
        l.id === lotId ? { ...l, statut: "reserve" as const } : l
      );
      setLots(updated);
      setSuccessMessage({
        title: `✨ Lot réservé! ✨`,
        message: `Tu peux contacter ${lot.parentPrenom} pour les détails.`,
        emoji: lot.emoji,
      });
    }
  };

  // Supprimer un parent (supprime aussi ses lots en cascade)
  const handleDeleteParent = async (id: string) => {
    // Check access rights: can only delete own parent
    if (!SecurityService.canDeleteParent(id)) {
      setValidationErrors([
        {
          field: "delete",
          title: "Accès refusé",
          message: "Vous ne pouvez supprimer que votre propre compte",
        },
      ]);
      return;
    }

    // Delete parent via HybridStorage
    const success = await HybridStorage.deleteParent(id);
    
    if (success) {
      // Supprimer le parent localement
      const updatedParents = parents.filter((p) => p.id !== id);
      setParents(updatedParents);
      
      // Supprimer TOUS ses lots (règle critique : pas d'orphelins)
      const parentLots = SecurityService.getParentLots(id, lots);
      const remainingLots = lots.filter((l) => l.parentId !== id);
      
      for (const lot of parentLots) {
        await HybridStorage.deleteLot(lot.id);
      }
      
      setLots(remainingLots);

      // If it was the current parent, logout
      if (id === currentParentId) {
        setCurrentParentId(null);
        AuthService.logout();
      }

      // Message de confirmation
      const deletedParent = parents.find((p) => p.id === id);
      if (parentLots.length > 0) {
        setSuccessMessage({
          title: `À bientôt ${deletedParent?.prenom}! 👋`,
          message: `Profil supprimé. Ses ${parentLots.length} lot(s) ont été retirés.`,
          emoji: "👋",
        });
      }
    }
  };

  // Supprimer un lot (only if it's yours)
  const handleDeleteLot = async (id: string, lotName: string) => {
    // Check access rights: can only delete own lots
    if (!SecurityService.canModifyLot(id, lots)) {
      setValidationErrors([
        {
          field: "delete",
          title: "Accès refusé",
          message: "Vous ne pouvez supprimer que vos propres lots",
        },
      ]);
      return;
    }

    // Confirmation
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer le lot "${lotName}"? Cette action est irréversible.`
    );

    if (!confirmed) return;

    const success = await HybridStorage.deleteLot(id);
    
    if (success) {
      setLots(lots.filter((l) => l.id !== id));
      setSuccessMessage({
        title: `Lot supprimé 👋`,
        message: `"${lotName}" a été retiré de la tombola.`,
        emoji: "✨",
      });
    }
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Layout>
      {/* Message de succès */}
      <AnimatePresence>
        {successMessage && (
          <AnimatedSuccessMessage
            title={successMessage.title}
            message={successMessage.message}
            emoji={successMessage.emoji}
          />
        )}
      </AnimatePresence>

      {/* Erreurs de validation */}
      <AnimatePresence>
        {validationErrors.length > 0 && (
          <AnimatedErrorMessage
            title={validationErrors[0].title || "Vérifiez vos infos"}
            message={validationErrors[0].message}
            emoji={validationErrors[0].title === "Non connecté" ? "👤" : "⚠️"}
          />
        )}
      </AnimatePresence>

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

            {/* Auth status */}
            <AnimatePresence>
              {currentParentId && (
                <AnimatedAuthStatus
                  isConnected={true}
                  parentName={parents.find((p) => p.id === currentParentId)?.prenom}
                  parentEmoji={parents.find((p) => p.id === currentParentId)?.emoji}
                  onDisconnect={() => {
                    AuthService.logout();
                    setCurrentParentId(null);
                    setSuccessMessage({
                      title: "À bientôt! 👋",
                      message: "Vous avez été déconnecté avec succès.",
                      emoji: "👋",
                    });
                  }}
                />
              )}
            </AnimatePresence>

            {/* Reconnection section */}
            <AnimatePresence>
              {!currentParentId && parents.length > 0 && (
                <AnimatedReconnectionPrompt>
                  <Card variant="playful" className="border-2 border-sky-300/50 bg-sky-50/30 shadow-md">
                    <CardContent className="p-6">
                      <motion.p
                        className="text-sm font-semibold text-sky-700 mb-2 flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="text-xl">👤</span>
                        Vous êtes déconnecté
                      </motion.p>
                      <motion.p
                        className="text-xs text-sky-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        Cliquez sur votre profil ci-dessous pour vous reconnecter instantanément!
                      </motion.p>
                    </CardContent>
                  </Card>
                </AnimatedReconnectionPrompt>
              )}
            </AnimatePresence>

            {!showFormParent && !currentParentId && (
              <Button variant="playful" size="lg" onClick={() => setShowFormParent(true)} className="mb-8">
                <Plus className="mr-2 h-5 w-5" />
                Je m'inscris
              </Button>
            )}
          </motion.div>

          {/* Formulaire inscription parent */}
          <AnimatedFormContainer isOpen={showFormParent}>
            <motion.div
              className="mb-12 max-w-2xl mx-auto"
            >
              <Card variant="playful" className="border-2 border-primary/30 shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <motion.h3 
                      className="text-2xl font-bold"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Inscrivez-vous ! 👋
                    </motion.h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowFormParent(false);
                        setValidationErrors([]);
                      }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Erreurs du formulaire parent */}
                  {validationErrors.some((e) => e.field === "parent" || e.field === "email") && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                      {validationErrors
                        .filter((e) => e.field === "parent" || e.field === "email")
                        .map((error, idx) => (
                          <p key={idx} className="text-red-700 text-sm font-semibold mb-1">
                            ⚠️ {error.message}
                          </p>
                        ))}
                    </div>
                  )}

                  <form onSubmit={handleAddParent} className="space-y-6">
                    {/* Choix emoji */}
                    <div>
                      <label className="text-sm font-semibold mb-3 block">Choisissez votre emoji</label>
                      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setSelectedEmoji(emoji)}
                            className={`h-12 w-12 inline-flex items-center justify-center text-3xl rounded-lg transition-all ${
                              selectedEmoji === emoji
                                ? "bg-primary/20"
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
          </AnimatedFormContainer>

          {/* Grille des parents */}
          {parents.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {parents.map((parent) => {
                const isCurrentParent = parent.id === currentParentId;
                return (
                  <motion.div key={parent.id} variants={itemVariants}>
                    <Card
                      variant="playful"
                      className={`group h-full transition-all duration-300 ${
                        isCurrentParent
                          ? "border-2 border-green-500/50 bg-green-50/50 hover:shadow-lg hover:shadow-green-500/30"
                          : "hover:shadow-lg hover:shadow-primary/20"
                      }`}
                    >
                      <CardContent className="p-4 sm:p-5 flex flex-col items-center text-center h-full justify-between">
                        {isCurrentParent && (
                          <div className="mb-2 inline-block bg-green-500/20 px-2 py-1 rounded-full text-xs font-semibold text-green-700">
                            ✨ C'est toi!
                          </div>
                        )}

                        {/* Emoji */}
                        <div className={`mb-3 transition-transform ${isCurrentParent ? "text-6xl animate-bounce" : "text-5xl"} group-hover:scale-110`}>
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
                        {isCurrentParent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-3 text-xs"
                            onClick={() => {
                              handleDeleteParent(parent.id);
                              if (isCurrentParent) setCurrentParentId(null);
                            }}
                            disabled={!isCurrentParent}
                            title={!isCurrentParent ? "Vous ne pouvez supprimer que votre propre compte" : ""}
                          >
                            {isCurrentParent ? "Supprimer mon compte" : "N/A"}
                          </Button>
                        )}

                        {!isCurrentParent && !currentParentId && (
                          <Button
                            variant="playful"
                            size="sm"
                            className="w-full mt-3 text-xs"
                            onClick={() => {
                              AuthService.createSession(parent.id);
                              setCurrentParentId(parent.id);
                              setSuccessMessage({
                                title: `Bienvenue de retour ${parent.prenom}! 🎉`,
                                message: "Vous êtes maintenant connecté.",
                                emoji: parent.emoji,
                              });
                            }}
                          >
                            C'est moi
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

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
              {lots.length} lot{lots.length !== 1 ? "s" : ""} ({lots.filter((l) => l.statut === "disponible").length} disponible{lots.filter((l) => l.statut === "disponible").length !== 1 ? "s" : ""})
            </p>

            {parents.length > 0 && !showFormLot && (
              <Button variant="playful" size="lg" onClick={() => setShowFormLot(true)} className="mb-8">
                <Gift className="mr-2 h-5 w-5" />
                Ajouter un lot
              </Button>
            )}
          </motion.div>

          {/* Formulaire ajout lot */}
          <AnimatedFormContainer isOpen={showFormLot && parents.length > 0}>
            <motion.div
              className="mb-12 max-w-2xl mx-auto"
            >
              <Card variant="playful" className="border-2 border-primary/30 shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <motion.h3 
                      className="text-2xl font-bold"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Ajouter un lot 🎁
                    </motion.h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowFormLot(false);
                        setValidationErrors([]);
                      }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Erreurs du formulaire lot */}
                  {validationErrors.some((e) => e.field === "lot") && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                      {validationErrors
                        .filter((e) => e.field === "lot")
                        .map((error, idx) => (
                          <p key={idx} className="text-red-700 text-sm font-semibold mb-1">
                            ⚠️ {error.message}
                          </p>
                        ))}
                    </div>
                  )}

                  <form onSubmit={handleAddLot} className="space-y-6">
                    {/* Emoji */}
                    <div>
                      <label className="text-sm font-semibold mb-3 block">Choisissez une icône</label>
                      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                        {emojiLots.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setLotForm({ ...lotForm, emoji })}
                            className={`h-12 w-12 inline-flex items-center justify-center text-3xl rounded-lg transition-all ${
                              lotForm.emoji === emoji
                                ? "bg-primary/20"
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
          </AnimatedFormContainer>

          {/* Lots du parent actuel */}
          {currentParentId && lots.filter(lot => lot.parentId === currentParentId).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                ✨ Tes lots
                <span className="text-sm font-normal text-muted-foreground">
                  ({lots.filter(lot => lot.parentId === currentParentId).length})
                </span>
              </h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {lots.filter(lot => lot.parentId === currentParentId).map((lot) => (
                  <motion.div key={lot.id} variants={itemVariants}>
                    <Card
                      variant="playful"
                      className={`h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-blue-500/50 bg-blue-50/30 ${
                        lot.statut === "disponible"
                          ? "border-2 border-green-500/50"
                          : lot.statut === "reserve"
                          ? "border-2 border-yellow-500/50"
                          : "border-2 border-red-500/50 opacity-75"
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
                        <div className="bg-blue-100/50 p-3 rounded-lg mb-4 border border-blue-200/50">
                          <p className="text-xs text-muted-foreground mb-1">C'est ton lot</p>
                          <p className="font-semibold text-blue-700">{lot.parentPrenom} 🎁</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {lot.statut === "reserve" && (
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
                                Partager
                              </a>
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 hover:bg-red-100 text-red-600"
                            onClick={() => handleDeleteLot(lot.id, lot.nom)}
                            disabled={!SecurityService.isOwnLot(lot)}
                            title={!SecurityService.isOwnLot(lot) ? "Vous ne pouvez supprimer que vos propres lots" : ""}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Tous les lots */}
          {lots.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                🎁 Tous les lots
                <span className="text-sm font-normal text-muted-foreground">
                  ({lots.length})
                </span>
              </h3>
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
                      {lot.statut === "disponible" && currentParentId !== lot.parentId && (
                        <Button
                          variant="playful"
                          size="sm"
                          className="flex-1"
                          onClick={() => currentParentId && handleReserveLot(lot.id, currentParentId)}
                          disabled={!currentParentId}
                        >
                          Réserver
                        </Button>
                      )}

                      {lot.statut === "reserve" && (
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
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-red-600 hover:bg-red-100"
                        onClick={() => handleDeleteLot(lot.id, lot.nom)}
                        disabled={!SecurityService.isOwnLot(lot)}
                        title={!SecurityService.isOwnLot(lot) ? "Vous ne pouvez supprimer que vos propres lots" : ""}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
              </motion.div>
            </motion.div>
          )}

          {/* Lots des autres parents (filtre optionnel) */}
          {currentParentId && lots.filter(lot => lot.parentId !== currentParentId).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                👥 Propositions des autres parents
                <span className="text-sm font-normal text-muted-foreground">
                  ({lots.filter(lot => lot.parentId !== currentParentId).length})
                </span>
              </h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {lots.filter(lot => lot.parentId !== currentParentId).map((lot) => (
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
                          onClick={() => currentParentId && handleReserveLot(lot.id, currentParentId)}
                          disabled={!currentParentId}
                        >
                          Réserver
                        </Button>
                      )}

                      {lot.statut === "reserve" && (
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
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-red-600 hover:bg-red-100"
                        onClick={() => handleDeleteLot(lot.id, lot.nom)}
                        disabled={!SecurityService.isOwnLot(lot)}
                        title={!SecurityService.isOwnLot(lot) ? "Vous ne pouvez supprimer que vos propres lots" : ""}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
              </motion.div>
            </motion.div>
          )}

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
