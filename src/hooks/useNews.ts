// ============================================================
// Hook personnalisé - useNews
// Gestion des requêtes API pour les actualités
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: 'evenement' | 'annonce' | 'presse' | 'information' | 'document';
  image_url?: string;
  created_at: string;
  updated_at: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  is_published: number;
  is_archived: number;
  created_by?: string;
}

export interface CreateNewsRequest {
  title: string;
  content: string;
  type: 'evenement' | 'annonce' | 'presse' | 'information' | 'document';
  image_url?: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  is_published?: boolean;
}

const API_URL = import.meta.env.DEV
  ? '/api'  // Use Vite proxy in development
  : (import.meta.env.VITE_API_URL || '/api');

// ============================================================
// Hook pour récupérer toutes les actualités publiées
// ============================================================

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/news`);
      if (!res.ok) throw new Error('Failed to fetch news');
      const data = await res.json();
      return (data.data || []) as NewsItem[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime)
  });
}

// ============================================================
// Hook pour récupérer une actualité spécifique
// ============================================================

export function useNewsItem(id: string | undefined) {
  return useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/news/${id}`);
      if (!res.ok) throw new Error('Failed to fetch news item');
      const data = await res.json();
      return data.data as NewsItem;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

// ============================================================
// Hook pour récupérer toutes les actualités (admin)
// ============================================================

export function useAllNews() {
  return useQuery({
    queryKey: ['news-all'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/news/all`);
      if (!res.ok) throw new Error('Failed to fetch all news');
      const data = await res.json();
      return (data.data || []) as NewsItem[];
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
}

// ============================================================
// Hook pour créer une actualité
// ============================================================

export function useCreateNews() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateNewsRequest) => {
      const res = await fetch(`${API_URL}/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create news');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news-all'] });
      toast({
        title: 'Succès',
        description: 'Actualité créée avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    },
  });
}

// ============================================================
// Hook pour mettre à jour une actualité
// ============================================================

export function useUpdateNews() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateNewsRequest> }) => {
      const res = await fetch(`${API_URL}/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update news');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news-all'] });
      toast({
        title: 'Succès',
        description: 'Actualité mise à jour avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    },
  });
}

// ============================================================
// Hook pour supprimer une actualité
// ============================================================

export function useDeleteNews() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete news');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news-all'] });
      toast({
        title: 'Succès',
        description: 'Actualité supprimée avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    },
  });
}

// ============================================================
// Hook pour archiver/désarchiver une actualité
// ============================================================

export function useArchiveNews() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, is_archived }: { id: string; is_archived: boolean }) => {
      const res = await fetch(`${API_URL}/news/${id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_archived }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to archive news');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-all'] });
      toast({
        title: 'Succès',
        description: 'Actualité archivée avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    },
  });
}

// ============================================================
// Hook pour publier/dépublier une actualité
// ============================================================

export function usePublishNews() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const res = await fetch(`${API_URL}/news/${id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to publish news');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news-all'] });
      toast({
        title: 'Succès',
        description: 'Actualité publiée avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    },
  });
}
