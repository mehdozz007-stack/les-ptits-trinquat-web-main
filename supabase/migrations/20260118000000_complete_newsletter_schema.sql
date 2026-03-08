-- Migration: Schéma complet Newsletter avec sécurité RLS - Version Corrigée
-- Date: 2026-01-18
-- Description: Schéma complet avec toutes les tables, fonctions, policies et triggers
-- Correction: Tables créées AVANT les fonctions qui les référencent

-- ============================================================================
-- SECTION 1: TYPES
-- ============================================================================

-- Créer l'enum des rôles (avec gestion d'erreur)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- ============================================================================
-- SECTION 2: TABLES (CRÉÉES AVANT LES FONCTIONS QUI LES RÉFÉRENCENT)
-- ============================================================================

-- Créer la table user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Activer RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Créer la table newsletter_subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Créer la table newsletters
CREATE TABLE IF NOT EXISTS public.newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft' ou 'sent'
  recipients_count INTEGER DEFAULT 0,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 3: FONCTIONS (CRÉÉES APRÈS LES TABLES)
-- ============================================================================

-- Fonction de vérification des rôles (SECURITY DEFINER pour éviter récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fonction de mise à jour du timestamp updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================================================
-- SECTION 4: POLICIES RLS (CRÉÉES APRÈS LES FONCTIONS)
-- ============================================================================

-- === POLICIES pour user_roles ===

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "Admins can view user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Créer la policy RLS
CREATE POLICY "Admins can view user roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- === POLICIES pour newsletter_subscribers ===

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can delete subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated admins can view subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated admins can update subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated admins can delete subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Public can insert newsletter subscribers" ON public.newsletter_subscribers;

-- Créer les policies RLS
-- Inscription publique (consentement obligatoire)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (consent = true);

-- Lecture réservée aux admins
CREATE POLICY "Admins can view subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Modification réservée aux admins
CREATE POLICY "Admins can update subscribers"
ON public.newsletter_subscribers
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Suppression réservée aux admins
CREATE POLICY "Admins can delete subscribers"
ON public.newsletter_subscribers
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- === POLICIES pour newsletters ===

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "Admins can view newsletters" ON public.newsletters;
DROP POLICY IF EXISTS "Admins can insert newsletters" ON public.newsletters;
DROP POLICY IF EXISTS "Admins can update newsletters" ON public.newsletters;
DROP POLICY IF EXISTS "Admins can delete newsletters" ON public.newsletters;
DROP POLICY IF EXISTS "Authenticated admins can view newsletters" ON public.newsletters;
DROP POLICY IF EXISTS "Authenticated admins can insert newsletters" ON public.newsletters;
DROP POLICY IF EXISTS "Authenticated admins can update newsletters" ON public.newsletters;
DROP POLICY IF EXISTS "Authenticated admins can delete newsletters" ON public.newsletters;

-- Créer les policies RLS
-- Lecture réservée aux admins
CREATE POLICY "Admins can view newsletters"
ON public.newsletters
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Création réservée aux admins
CREATE POLICY "Admins can insert newsletters"
ON public.newsletters
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Modification réservée aux admins
CREATE POLICY "Admins can update newsletters"
ON public.newsletters
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Suppression réservée aux admins
CREATE POLICY "Admins can delete newsletters"
ON public.newsletters
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- SECTION 5: INDEXES (PERFORMANCE OPTIMIZATION)
-- ============================================================================

-- Indexes pour user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Indexes pour newsletter_subscribers
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_is_active ON public.newsletter_subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON public.newsletter_subscribers(created_at DESC);

-- Indexes pour newsletters
CREATE INDEX IF NOT EXISTS idx_newsletters_status ON public.newsletters(status);
CREATE INDEX IF NOT EXISTS idx_newsletters_created_at ON public.newsletters(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletters_sent_at ON public.newsletters(sent_at DESC);

-- ============================================================================
-- SECTION 6: TRIGGERS (AUTOMATION)
-- ============================================================================

-- Trigger pour updated_at sur newsletter_subscribers
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON public.newsletter_subscribers;
CREATE TRIGGER update_newsletter_subscribers_updated_at
BEFORE UPDATE ON public.newsletter_subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour updated_at sur newsletters
DROP TRIGGER IF EXISTS update_newsletters_updated_at ON public.newsletters;
CREATE TRIGGER update_newsletters_updated_at
BEFORE UPDATE ON public.newsletters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- SECTION 7: VÉRIFICATIONS ET VALIDATION
-- ============================================================================

-- Vérifier que les tables existent et RLS est activé
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_roles', 'newsletter_subscribers', 'newsletters')
ORDER BY tablename;

-- Vérifier que la fonction has_role existe
SELECT 
  proname, 
  prosecdef as is_security_definer 
FROM pg_proc 
WHERE proname = 'has_role' 
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Vérifier les indexes créés
SELECT 
  indexname, 
  tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('user_roles', 'newsletter_subscribers', 'newsletters')
ORDER BY tablename, indexname;

-- Vérifier les triggers créés
SELECT 
  trigger_name,
  event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ✅ Migration complètement exécutée
