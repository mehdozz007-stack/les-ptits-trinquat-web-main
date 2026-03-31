// ============================================================
// Page AdminNews
// Interface d'administration complète pour les actualités
// ============================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { NewsForm } from '@/components/news/NewsForm';
import { NewsList } from '@/components/news/NewsList';
import {
  useAllNews,
  useDeleteNews,
  useArchiveNews,
  usePublishNews,
  type NewsItem,
} from '@/hooks/useNews';
import { Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminNewsPageProps {
  onNavigateBack?: () => void;
}

export default function AdminNewsPage({ onNavigateBack }: AdminNewsPageProps) {
  const { data: allNews, isLoading } = useAllNews();
  const deleteMutation = useDeleteNews();
  const archiveMutation = useArchiveNews();
  const publishMutation = usePublishNews();

  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  const handleEdit = (news: NewsItem) => {
    setEditingNews(news);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleArchive = async (id: string, isArchived: boolean) => {
    try {
      await archiveMutation.mutateAsync({ id, is_archived: isArchived });
    } catch (error) {
      console.error('Archive error:', error);
    }
  };

  const handlePublish = async (id: string, isPublished: boolean) => {
    try {
      await publishMutation.mutateAsync({ id, is_published: isPublished });
    } catch (error) {
      console.error('Publish error:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNews(null);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] py-12">
        <div className="container">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link to="/" className="text-muted-foreground hover:text-foreground transition">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-3xl font-bold">Gestion des actualités</h1>
              </div>
              <p className="text-muted-foreground">
                Créez, modifiez et gérez les actualités de l'école
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingNews(null);
                setShowForm(true);
              }}
              className="gap-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Créer une actualité
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <AnimatePresence mode="wait">
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="lg:col-span-1"
                >
                  <div className="sticky top-20">
                    <NewsForm
                      onClose={handleCloseForm}
                      initialData={editingNews || undefined}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List */}
            <motion.div
              layout
              className={showForm ? 'lg:col-span-2' : 'lg:col-span-3'}
            >
              <NewsList
                news={allNews}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onPublish={handlePublish}
                isAdmin={true}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
