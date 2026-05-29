
-- Tour 360° scenes
CREATE TABLE public.tour_scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  igreja_id uuid NOT NULL REFERENCES public.igrejas(id) ON DELETE CASCADE,
  key text NOT NULL,
  nome text NOT NULL,
  panorama_url text NOT NULL,
  ordem int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (igreja_id, key)
);

GRANT SELECT ON public.tour_scenes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tour_scenes TO authenticated;
GRANT ALL ON public.tour_scenes TO service_role;

ALTER TABLE public.tour_scenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acervo público pode ver cenas" ON public.tour_scenes FOR SELECT USING (true);
CREATE POLICY "Admin cria cenas" ON public.tour_scenes FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin edita cenas" ON public.tour_scenes FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin exclui cenas" ON public.tour_scenes FOR DELETE TO authenticated USING (public.is_admin());

CREATE TRIGGER trg_tour_scenes_updated
BEFORE UPDATE ON public.tour_scenes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Hotspots
CREATE TABLE public.tour_hotspots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id uuid NOT NULL REFERENCES public.tour_scenes(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('info','imagem','cena')),
  titulo text NOT NULL DEFAULT '',
  descricao text NOT NULL DEFAULT '',
  imagem_url text NOT NULL DEFAULT '',
  target_scene_id uuid REFERENCES public.tour_scenes(id) ON DELETE SET NULL,
  yaw double precision NOT NULL DEFAULT 0,
  pitch double precision NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tour_hotspots TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tour_hotspots TO authenticated;
GRANT ALL ON public.tour_hotspots TO service_role;

ALTER TABLE public.tour_hotspots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acervo público pode ver hotspots" ON public.tour_hotspots FOR SELECT USING (true);
CREATE POLICY "Admin cria hotspots" ON public.tour_hotspots FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin edita hotspots" ON public.tour_hotspots FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin exclui hotspots" ON public.tour_hotspots FOR DELETE TO authenticated USING (public.is_admin());

CREATE TRIGGER trg_tour_hotspots_updated
BEFORE UPDATE ON public.tour_hotspots
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Cena inicial da igreja
ALTER TABLE public.igrejas
  ADD COLUMN cena_inicial_id uuid REFERENCES public.tour_scenes(id) ON DELETE SET NULL;

CREATE INDEX idx_tour_scenes_igreja ON public.tour_scenes(igreja_id);
CREATE INDEX idx_tour_hotspots_scene ON public.tour_hotspots(scene_id);
