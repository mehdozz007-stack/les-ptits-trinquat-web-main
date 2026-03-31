// ============================================================
// NewsCard Component
// Affiche une actualité dans une carte
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateFr } from '@/lib/actualites';
import { type NewsItem } from '@/hooks/useNews';
import { Calendar, Clock, MapPin, Archive, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  onEdit?: (news: NewsItem) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  onPublish?: (id: string, isPublished: boolean) => void;
  isAdmin?: boolean;
  index?: number;
}

const typeLabels: Record<string, string> = {
  evenement: '🎪 Événement',
  annonce: '📢 Annonce',
  information: 'ℹ️ Information',
  presse: '📰 Presse',
  document: '📄 Document',
};

const typeBadgeColors: Record<string, string> = {
  evenement: 'bg-gradient-to-r from-sky-500/70 to-blue-500/70 text-white',
  annonce: 'bg-gradient-to-r from-primary/70 to-pink-500/70 text-white',
  information: 'bg-gradient-to-r from-green-500/70 to-emerald-500/70 text-white',
  presse: 'bg-gradient-to-r from-purple-500/70 to-indigo-500/70 text-white',
  document: 'bg-gradient-to-r from-orange-500/70 to-amber-500/70 text-white',
};

export function NewsCard({
  news,
  onEdit,
  onDelete,
  onArchive,
  onPublish,
  isAdmin = false,
  index = 0,
}: NewsCardProps) {
  const isPastEvent = news.type === 'evenement' && news.event_date && new Date(news.event_date) < new Date();
  const isArchived = news.is_archived === 1;
  const isPublished = news.is_published === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-2 hover:shadow-lg transition-all duration-300">
        {/* Image */}
        {news.image_url && (
          <div className="overflow-hidden h-40 bg-muted">
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <CardContent className="p-4 space-y-3 flex flex-col h-[calc(100%-160px)]">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <Badge className={typeBadgeColors[news.type]}>
                {typeLabels[news.type]}
              </Badge>
            </div>
            {isAdmin && (
              <div className="flex gap-1">
                {!isPublished && (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                    Brouillon
                  </span>
                )}
                {isArchived && (
                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded">
                    Archivé
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg line-clamp-2 text-foreground">
            {news.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {news.content}
          </p>

          {/* Meta Info */}
          <div className="space-y-1 text-xs text-muted-foreground">
            {news.type === 'evenement' && news.event_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>{formatDateFr(news.event_date)}</span>
                {isPastEvent && <span className="text-gray-500">(Passé)</span>}
              </div>
            )}
            {news.event_time && (
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>{news.event_time}</span>
              </div>
            )}
            {news.event_location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>{news.event_location}</span>
              </div>
            )}
            {!news.event_date && (
              <div className="text-xs">
                {new Date(news.created_at).toLocaleDateString('fr-FR')}
              </div>
            )}
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex gap-2 pt-3 border-t flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit?.(news)}
                className="flex-1"
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Éditer
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onPublish?.(news.id, !isPublished)}
                className="flex-1"
              >
                {isPublished ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Publié
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Brouillon
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onArchive?.(news.id, !isArchived)}
                className="flex-1"
              >
                <Archive className="h-3 w-3 mr-1" />
                {isArchived ? 'Restaurer' : 'Archiver'}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
                    onDelete?.(news.id);
                  }
                }}
                className="flex-1"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Supprimer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
