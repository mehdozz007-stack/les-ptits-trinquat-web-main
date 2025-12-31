// Shared types for Tombola application

export interface Parent {
  id: string;
  prenom: string;
  role: string;
  classes: string;
  emoji: string;
  email: string;
  createdAt?: string;
}

export interface Lot {
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

export interface ValidationError {
  field: string;
  title: string;
  message: string;
}
