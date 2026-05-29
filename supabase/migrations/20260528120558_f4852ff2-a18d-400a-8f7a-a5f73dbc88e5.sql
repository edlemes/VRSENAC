
-- Solicitações de participação (igrejas pedindo entrada no acervo)
CREATE TABLE public.solicitacoes_participacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  responsavel_nome text NOT NULL,
  responsavel_papel text NOT NULL DEFAULT '',
  email text NOT NULL,
  telefone text NOT NULL DEFAULT '',
  igreja_nome text NOT NULL,
  cidade text NOT NULL,
  estado text NOT NULL DEFAULT '',
  ano text NOT NULL DEFAULT '',
  estilo text NOT NULL DEFAULT '',
  descricao text NOT NULL DEFAULT '',
  mensagem text NOT NULL DEFAULT '',
  midias text[] NOT NULL DEFAULT '{}',
  origem text NOT NULL DEFAULT 'site',
  status text NOT NULL DEFAULT 'novo',
  observacoes_admin text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.solicitacoes_participacao TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.solicitacoes_participacao TO authenticated;
GRANT ALL ON public.solicitacoes_participacao TO service_role;

ALTER TABLE public.solicitacoes_participacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode enviar solicitação"
  ON public.solicitacoes_participacao FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin vê solicitações"
  ON public.solicitacoes_participacao FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin edita solicitações"
  ON public.solicitacoes_participacao FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin exclui solicitações"
  ON public.solicitacoes_participacao FOR DELETE
  TO authenticated
  USING (is_admin());

CREATE TRIGGER trg_solicitacoes_updated
  BEFORE UPDATE ON public.solicitacoes_participacao
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Bucket público para mídias enviadas no formulário
INSERT INTO storage.buckets (id, name, public)
VALUES ('solicitacoes', 'solicitacoes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Solicitações: leitura pública"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'solicitacoes');

CREATE POLICY "Solicitações: upload público"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'solicitacoes');

CREATE POLICY "Solicitações: admin exclui"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'solicitacoes' AND is_admin());

-- Tempo gasto no tour
ALTER TABLE public.tour_events
  ADD COLUMN IF NOT EXISTS duration_ms integer;
