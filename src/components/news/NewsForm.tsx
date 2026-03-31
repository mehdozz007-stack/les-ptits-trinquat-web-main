// ============================================================
// NewsForm Component
// Formulaire pour créer/modifier les actualités
// ============================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateNews, useUpdateNews, type CreateNewsRequest, type NewsItem } from '@/hooks/useNews';
import { X } from 'lucide-react';

interface NewsFormProps {
  onClose?: () => void;
  initialData?: NewsItem;
}

const newsTypes = [
  { value: 'evenement', label: '🎪 Événement' },
  { value: 'annonce', label: '📢 Annonce' },
  { value: 'information', label: 'ℹ️ Information' },
  { value: 'presse', label: '📰 Article de presse' },
  { value: 'document', label: '📄 Document' },
];

export function NewsForm({ onClose, initialData }: NewsFormProps) {
  const [formData, setFormData] = useState<CreateNewsRequest>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    type: initialData?.type || 'annonce',
    image_url: initialData?.image_url || '',
    event_date: initialData?.event_date || '',
    event_time: initialData?.event_time || '',
    event_location: initialData?.event_location || '',
    is_published: initialData?.is_published === 1,
  });

  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleChange = (field: keyof CreateNewsRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    try {
      if (initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
        setFormData({
          title: '',
          content: '',
          type: 'annonce',
          image_url: '',
          event_date: '',
          event_time: '',
          event_location: '',
          is_published: true,
        });
      }
      onClose?.();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-slate-900 rounded-lg shadow-xl"
    >
      <div className="p-6 overflow-y-auto max-h-[80vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {initialData ? 'Modifier une actualité' : 'Créer une nouvelle actualité'}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              placeholder="Titre de l'actualité"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange('type', value as any)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {newsTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contenu */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              placeholder="Contenu de l'actualité"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={8}
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 caractères
            </p>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url">URL de l'image</Label>
            <Input
              id="image_url"
              placeholder="https://..."
              value={formData.image_url || ''}
              onChange={(e) => handleChange('image_url', e.target.value)}
              type="url"
            />
            {formData.image_url && (
              <div className="mt-2 rounded overflow-hidden max-w-xs">
                <img
                  src={formData.image_url}
                  alt="Aperçu"
                  className="w-full h-auto object-cover"
                  onError={() => {
                    console.error('Image failed to load');
                  }}
                />
              </div>
            )}
          </div>

          {/* Champs événement - condition */}
          {formData.type === 'evenement' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {/* Date événement */}
                <div className="space-y-2">
                  <Label htmlFor="event_date">Date de l'événement</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date || ''}
                    onChange={(e) => handleChange('event_date', e.target.value)}
                  />
                </div>

                {/* Heure événement */}
                <div className="space-y-2">
                  <Label htmlFor="event_time">Heure de l'événement</Label>
                  <Input
                    id="event_time"
                    type="time"
                    value={formData.event_time || ''}
                    onChange={(e) => handleChange('event_time', e.target.value)}
                  />
                </div>
              </div>

              {/* Lieu événement */}
              <div className="space-y-2">
                <Label htmlFor="event_location">Lieu de l'événement</Label>
                <Input
                  id="event_location"
                  placeholder="Ex: Cour de l'école"
                  value={formData.event_location || ''}
                  onChange={(e) => handleChange('event_location', e.target.value)}
                />
              </div>
            </>
          )}

          {/* Publier */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => handleChange('is_published', checked)}
            />
            <Label htmlFor="is_published" className="font-normal cursor-pointer">
              Publier immédiatement
            </Label>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4 border-t">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
            >
              {isLoading ? 'Enregistrement...' : initialData ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
