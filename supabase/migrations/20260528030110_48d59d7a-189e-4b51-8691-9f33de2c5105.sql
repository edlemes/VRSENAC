-- ============ TRACKING ============
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL CHECK (char_length(path) <= 500),
  referrer text CHECK (char_length(coalesce(referrer,'')) <= 500),
  user_agent text CHECK (char_length(coalesce(user_agent,'')) <= 500),
  session_id text CHECK (char_length(coalesce(session_id,'')) <= 100),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX idx_page_views_path ON public.page_views(path);
GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer um pode registrar visita" ON public.page_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin pode ver visitas" ON public.page_views FOR SELECT TO authenticated USING (is_admin());

CREATE TABLE public.tour_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  igreja_id uuid,
  igreja_slug text CHECK (char_length(coalesce(igreja_slug,'')) <= 200),
  scene_id uuid,
  hotspot_id uuid,
  event_type text NOT NULL CHECK (event_type IN ('tour_open','scene_change','hotspot_click')),
  session_id text CHECK (char_length(coalesce(session_id,'')) <= 100),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_tour_events_created_at ON public.tour_events(created_at DESC);
CREATE INDEX idx_tour_events_igreja ON public.tour_events(igreja_id);
CREATE INDEX idx_tour_events_type ON public.tour_events(event_type);
GRANT INSERT ON public.tour_events TO anon, authenticated;
GRANT SELECT ON public.tour_events TO authenticated;
GRANT ALL ON public.tour_events TO service_role;
ALTER TABLE public.tour_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer um pode registrar evento" ON public.tour_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin pode ver eventos" ON public.tour_events FOR SELECT TO authenticated USING (is_admin());

-- ============ NOTÍCIAS ============
CREATE TABLE public.noticias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  titulo text NOT NULL,
  resumo text NOT NULL DEFAULT '',
  conteudo text NOT NULL DEFAULT '',
  imagem_url text NOT NULL DEFAULT '',
  publicado boolean NOT NULL DEFAULT false,
  publicado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_noticias_publicado_em ON public.noticias(publicado_em DESC);
GRANT SELECT ON public.noticias TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.noticias TO authenticated;
GRANT ALL ON public.noticias TO service_role;
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Público vê notícias publicadas" ON public.noticias FOR SELECT TO anon, authenticated USING (publicado OR is_admin());
CREATE POLICY "Admin cria notícias" ON public.noticias FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin edita notícias" ON public.noticias FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin exclui notícias" ON public.noticias FOR DELETE TO authenticated USING (is_admin());
CREATE TRIGGER set_noticias_updated_at BEFORE UPDATE ON public.noticias FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ CARROSSEL ============
CREATE TABLE public.home_carrossel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL DEFAULT '',
  subtitulo text NOT NULL DEFAULT '',
  imagem_url text NOT NULL,
  link text NOT NULL DEFAULT '',
  ordem integer NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_home_carrossel_ordem ON public.home_carrossel(ordem);
GRANT SELECT ON public.home_carrossel TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.home_carrossel TO authenticated;
GRANT ALL ON public.home_carrossel TO service_role;
ALTER TABLE public.home_carrossel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Público vê slides" ON public.home_carrossel FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin cria slides" ON public.home_carrossel FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin edita slides" ON public.home_carrossel FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin exclui slides" ON public.home_carrossel FOR DELETE TO authenticated USING (is_admin());
CREATE TRIGGER set_home_carrossel_updated_at BEFORE UPDATE ON public.home_carrossel FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ GALERIA ============
CREATE TABLE public.galeria_fotos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL DEFAULT '',
  descricao text NOT NULL DEFAULT '',
  imagem_url text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_galeria_fotos_ordem ON public.galeria_fotos(ordem);
GRANT SELECT ON public.galeria_fotos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.galeria_fotos TO authenticated;
GRANT ALL ON public.galeria_fotos TO service_role;
ALTER TABLE public.galeria_fotos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Público vê galeria" ON public.galeria_fotos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin cria foto" ON public.galeria_fotos FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin edita foto" ON public.galeria_fotos FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin exclui foto" ON public.galeria_fotos FOR DELETE TO authenticated USING (is_admin());
CREATE TRIGGER set_galeria_fotos_updated_at BEFORE UPDATE ON public.galeria_fotos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ PÁGINAS ============
CREATE TABLE public.paginas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL UNIQUE CHECK (chave IN ('sobre','parceria')),
  titulo text NOT NULL DEFAULT '',
  subtitulo text NOT NULL DEFAULT '',
  conteudo text NOT NULL DEFAULT '',
  hero_imagem_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.paginas TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.paginas TO authenticated;
GRANT ALL ON public.paginas TO service_role;
ALTER TABLE public.paginas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Público vê páginas" ON public.paginas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin cria página" ON public.paginas FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin edita página" ON public.paginas FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin exclui página" ON public.paginas FOR DELETE TO authenticated USING (is_admin());
CREATE TRIGGER set_paginas_updated_at BEFORE UPDATE ON public.paginas FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.paginas (chave, titulo, subtitulo) VALUES
  ('sobre', 'Sobre o Projeto', 'Manifesto'),
  ('parceria', 'Para Igrejas e Paróquias', 'Para Paróquias');