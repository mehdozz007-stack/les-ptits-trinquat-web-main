/**
 * EXEMPLE D'INTÉGRATION : Comment utiliser la BD Prisma dans les composants React
 * Ce fichier montre les patterns recommandés pour Tombola.tsx
 */

// ============================================================================
// EXEMPLE 1: Afficher la liste des parents (Trombinoscope)
// ============================================================================

import { useEffect, useState } from "react";
import { parentService, type Parent } from "@/lib/db";

export function TromboscopeExample() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadParents() {
      try {
        // ✅ getAllParents() retourne les parents SANS email
        const data = await parentService.getAllParents();
        setParents(data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setLoading(false);
      }
    }

    loadParents();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {parents.map((parent) => (
        <div key={parent.id} className="p-4 border rounded">
          <div className="text-3xl">{parent.emoji}</div>
          <h3 className="font-bold">{parent.firstName}</h3>
          <p className="text-sm text-gray-600">{parent.role}</p>
          {parent.classes && (
            <span className="text-xs bg-blue-100 px-2 py-1 rounded">
              {parent.classes}
            </span>
          )}
          {/* ❌ NE PAS AFFICHER parent.email ❌ */}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXEMPLE 2: Inscrire un nouveau parent (formulaire)
// ============================================================================

export function RegisterParentExample() {
  const [form, setForm] = useState({
    firstName: "",
    emoji: "😊",
    role: "Parent participant",
    classes: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string[]>([]);

  const emojis = ["😊", "😃", "🤗", "😎", "🧡", "💪"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError([]);

    try {
      // Créer le parent dans la BD
      const newParent = await parentService.createParent(form);
      console.log("Parent créé:", newParent);

      // Réinitialiser le formulaire
      setForm({
        firstName: "",
        emoji: "😊",
        role: "Parent participant",
        classes: "",
        email: "",
      });
      // Afficher un message de succès
    } catch (err: any) {
      setError([err.message || "Une erreur s'est produite"]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error.length > 0 && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error.map((e) => (
            <p key={e}>{e}</p>
          ))}
        </div>
      )}

      <div>
        <label>Emoji</label>
        <div className="flex gap-2">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setForm({ ...form, emoji })}
              className={`text-2xl p-2 rounded ${
                form.emoji === emoji ? "bg-blue-100" : ""
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label>Prénom</label>
        <input
          type="text"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Email (privé)</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Inscription..." : "S'inscrire"}
      </button>
    </form>
  );
}

// ============================================================================
// EXEMPLE 3: Afficher les lots disponibles
// ============================================================================

import { lotService, type Lot } from "@/lib/db";

export function AvailableLotsExample({ currentParentId }: { currentParentId: string }) {
  const [lots, setLots] = useState<any[]>([]);

  useEffect(() => {
    async function loadLots() {
      const data = await lotService.getAvailableLots();
      setLots(data);
    }
    loadLots();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {lots.map((lot) => (
        <div key={lot.id} className="p-4 border rounded">
          <div className="text-4xl mb-2">{lot.icon}</div>
          <h3 className="font-bold">{lot.title}</h3>
          <p className="text-sm text-gray-600">{lot.description}</p>
          <p className="text-xs">Par {lot.owner.firstName}</p>
          <button
            onClick={() => reserveThisLot(lot.id, currentParentId)}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm"
          >
            Réserver
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXEMPLE 4: Créer un lot (utilisateur connecté)
// ============================================================================

export function CreateLotExample({ currentParentId }: { currentParentId: string }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "🎁",
  });
  const [loading, setLoading] = useState(false);

  const lotEmojis = ["🎁", "🧸", "📚", "🎮", "🎲", "🍫"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Créer le lot avec le parent actuel comme propriétaire
      const newLot = await lotService.createLot({
        title: form.title,
        description: form.description,
        icon: form.icon,
        ownerId: currentParentId, // ← Utiliser le parent connecté
      });

      console.log("Lot créé:", newLot);
      setForm({ title: "", description: "", icon: "🎁" });
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label>Icône du lot</label>
        <div className="flex gap-2">
          {lotEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setForm({ ...form, icon: emoji })}
              className={`text-2xl p-2 rounded ${
                form.icon === emoji ? "bg-yellow-100" : ""
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label>Nom du lot</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-yellow-600 text-white rounded"
      >
        {loading ? "Création..." : "Ajouter un lot"}
      </button>
    </form>
  );
}

// ============================================================================
// EXEMPLE 5: Réserver un lot (sans accéder à l'email!)
// ============================================================================

export async function reserveThisLot(lotId: string, currentParentId: string) {
  try {
    // Vérifier que la réservation est possible
    const { canReserve, reason } = await import("@/lib/db/utils").then(
      (m) => m.canParentReserveLot(currentParentId, lotId)
    );

    if (!canReserve) {
      alert(`Impossible de réserver: ${reason}`);
      return;
    }

    // Réserver le lot
    const updatedLot = await lotService.reserveLot(lotId, currentParentId);
    console.log("Lot réservé:", updatedLot);

    // Afficher un message de succès
    alert("Lot réservé avec succès!");

    // Recharger la liste
    window.location.reload();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// ============================================================================
// EXEMPLE 6: Contacter le propriétaire d'un lot (sécurisé!)
// ============================================================================

export function ContactOwnerButton({ lotId }: { lotId: string }) {
  async function handleContact() {
    try {
      // Appel à une API sécurisée (à créer côté backend)
      const response = await fetch("/api/lots/contact-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lotId }),
      });

      const { mailto } = await response.json();

      // Ouvrir le client email
      window.location.href = mailto;
      // ✅ L'email du propriétaire reste PRIVÉ
      // ✅ Jamais exposé dans le code frontend
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de contacter le propriétaire");
    }
  }

  return (
    <button
      onClick={handleContact}
      className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
    >
      📧 Contacter
    </button>
  );
}

// ============================================================================
// PATTERN: Comment obtenir les STATISTIQUES des lots
// ============================================================================

export function LotStatsExample() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function loadStats() {
      const data = await lotService.getLotStats();
      setStats(data);
    }
    loadStats();
  }, []);

  if (!stats) return <div>Chargement...</div>;

  return (
    <div className="flex gap-4">
      <div className="p-4 bg-gray-100 rounded">
        <div className="text-2xl font-bold">{stats.available}</div>
        <p className="text-sm">🟢 Disponibles</p>
      </div>
      <div className="p-4 bg-gray-100 rounded">
        <div className="text-2xl font-bold">{stats.reserved}</div>
        <p className="text-sm">🟡 Réservés</p>
      </div>
      <div className="p-4 bg-gray-100 rounded">
        <div className="text-2xl font-bold">{stats.given}</div>
        <p className="text-sm">🔴 Remis</p>
      </div>
    </div>
  );
}

export default {
  TromboscopeExample,
  RegisterParentExample,
  AvailableLotsExample,
  CreateLotExample,
  ContactOwnerButton,
  LotStatsExample,
  reserveThisLot,
};
