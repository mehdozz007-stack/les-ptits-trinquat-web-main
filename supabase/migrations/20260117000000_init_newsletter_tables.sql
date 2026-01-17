-- Migration: Créer le système de rôles et tables newsletter
-- Date: 2026-01-17

-- 1. Créer l'enum des rôles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Créer la table des rôles utilisateurs
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. Créer la fonction de vérification de rôle (SECURITY DEFINER pour éviter récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. Créer la table newsletter_subscribers
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  email TEXT NOT NULL UNIQUE,
  consent BOOLEAN DEFAULT false NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Créer la table newsletters
CREATE TABLE public.newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipients_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Créer les index pour les performances
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX idx_newsletters_status ON public.newsletters(status);
CREATE INDEX idx_newsletters_created_at ON public.newsletters(created_at DESC);

-- 7. Activer RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

-- 8. Créer les politiques RLS pour user_roles
CREATE POLICY "Admins can view user roles" ON public.user_roles
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert user roles" ON public.user_roles
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update user roles" ON public.user_roles
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user roles" ON public.user_roles
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 9. Créer les politiques RLS pour newsletter_subscribers
-- Inscription publique avec consentement obligatoire
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (consent = true);

-- Admins peuvent voir les abonnés
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins peuvent mettre à jour les abonnés
CREATE POLICY "Admins can update subscribers" ON public.newsletter_subscribers
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins peuvent supprimer les abonnés
CREATE POLICY "Admins can delete subscribers" ON public.newsletter_subscribers
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 10. Créer les politiques RLS pour newsletters
-- Admins peuvent créer, voir, modifier et supprimer les newsletters
CREATE POLICY "Admins can view newsletters" ON public.newsletters
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert newsletters" ON public.newsletters
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update newsletters" ON public.newsletters
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete newsletters" ON public.newsletters
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 11. Créer le trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_newsletter_subscribers_updated_at BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_newsletters_updated_at BEFORE UPDATE ON public.newsletters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 12. Accorder les permissions publiques pour l'inscription
ALTER TABLE public.newsletter_subscribers DISABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert newsletter subscribers" ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (consent = true);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
