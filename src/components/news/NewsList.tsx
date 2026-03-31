// ============================================================
// NewsList Component
// Liste des actualités avec filtrage et pagination
// ============================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { NewsCard } from './NewsCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type NewsItem } from '@/hooks/useNews';
import { Input } from '@/components/ui/input';

interface NewsListProps {
  news: NewsItem[] | undefined;
  isLoading?: boolean;
  onEdit?: (news: NewsItem) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  onPublish?: (id: string, isPublished: boolean) => void;
  isAdmin?: boolean;
}

export function NewsList({
  news,
  isLoading = false,
  onEdit,
  onDelete,
  onArchive,
  onPublish,
  isAdmin = false,
}: NewsListProps) {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les actualités
  const filteredNews = news?.filter((item) => {
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && item.is_published === 1) ||
      (statusFilter === 'draft' && item.is_published === 0) ||
      (statusFilter === 'archived' && item.is_archived === 1) ||
      (statusFilter === 'active' && item.is_archived === 0);
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Impossible de charger les actualités</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Input
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64"
        />
        
        <div className="flex gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="evenement">🎪 Événements</SelectItem>
              <SelectItem value="annonce">📢 Annonces</SelectItem>
              <SelectItem value="information">ℹ️ Informations</SelectItem>
              <SelectItem value="presse">📰 Presse</SelectItem>
              <SelectItem value="document">📄 Documents</SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="published">Publiés</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="archived">Archivés</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Résultats */}
      <div className="text-sm text-muted-foreground">
        {filteredNews.length} actualité{filteredNews.length !== 1 ? 's' : ''}
      </div>

      {/* Grille d'actualités */}
      {filteredNews.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item, index) => (
            <NewsCard
              key={item.id}
              news={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onArchive={onArchive}
              onPublish={onPublish}
              isAdmin={isAdmin}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">
            {searchQuery ? 'Aucune actualité correspondant à votre recherche' : 'Aucune actualité'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
