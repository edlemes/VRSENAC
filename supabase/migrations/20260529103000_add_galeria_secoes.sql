CREATE TABLE IF NOT EXISTS public.galeria_secoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  titulo text NOT NULL DEFAULT '',
  descricao_card text NOT NULL DEFAULT '',
  imagem_card_url text NOT NULL DEFAULT '',
  imagem_card_alt text NOT NULL DEFAULT '',
  galeria_titulo text NOT NULL DEFAULT '',
  galeria_resumo text NOT NULL DEFAULT '',
  galeria_detalhes text NOT NULL DEFAULT '',
  recomendacoes text NOT NULL DEFAULT '',
  endereco text NOT NULL DEFAULT '',
  localizacao_curta text NOT NULL DEFAULT '',
  telefone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  encontros text NOT NULL DEFAULT '',
  observacao_visita text NOT NULL DEFAULT '',
  fonte text NOT NULL DEFAULT '',
  palavras_chave text[] NOT NULL DEFAULT '{}',
  icone text NOT NULL DEFAULT 'church' CHECK (icone IN ('church','landmark','moon')),
  ordem integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_galeria_secoes_ordem ON public.galeria_secoes(ordem);

GRANT SELECT ON public.galeria_secoes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.galeria_secoes TO authenticated;
GRANT ALL ON public.galeria_secoes TO service_role;

ALTER TABLE public.galeria_secoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Público vê seções da galeria" ON public.galeria_secoes;
CREATE POLICY "Público vê seções da galeria"
  ON public.galeria_secoes FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin cria seção da galeria" ON public.galeria_secoes;
CREATE POLICY "Admin cria seção da galeria"
  ON public.galeria_secoes FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin edita seção da galeria" ON public.galeria_secoes;
CREATE POLICY "Admin edita seção da galeria"
  ON public.galeria_secoes FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin exclui seção da galeria" ON public.galeria_secoes;
CREATE POLICY "Admin exclui seção da galeria"
  ON public.galeria_secoes FOR DELETE
  TO authenticated
  USING (is_admin());

DROP TRIGGER IF EXISTS set_galeria_secoes_updated_at ON public.galeria_secoes;
CREATE TRIGGER set_galeria_secoes_updated_at
  BEFORE UPDATE ON public.galeria_secoes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.galeria_secoes (
  slug, titulo, descricao_card, imagem_card_alt, galeria_titulo, galeria_resumo,
  galeria_detalhes, recomendacoes, endereco, localizacao_curta, telefone, whatsapp,
  email, encontros, observacao_visita, fonte, palavras_chave, icone, ordem
) VALUES
  (
    'bom-despacho',
    'Santuário Eucarístico Nossa Senhora do Bom Despacho',
    'Registros do santuário, sua arquitetura, altar e detalhes devocionais.',
    'Santuário Eucarístico Nossa Senhora do Bom Despacho',
    'Santuário Eucarístico Nossa Senhora do Bom Despacho',
    'Igreja católica de características neogóticas, localizada no alto do Morro do Seminário. A construção atual data de 1918 e o bem foi tombado em 1977.',
    '',
    '',
    'Praça do Seminário, s/n - Dom Aquino, Cuiabá - MT, 78015-325',
    'Dom Aquino, Cuiabá - MT',
    '(65) 99946-1183',
    '(65) 99946-1183',
    'santuarioeucaristico@cuiabaarquidiocese.net',
    'Missas: seg. a sex. 7h e 18h; sáb. 7h; dom. 7h, 9h, 17h e 19h.',
    'Missas e visitação religiosa com programação da paróquia.',
    'Dados consolidados a partir da Arquidiocese de Cuiabá e registros públicos.',
    ARRAY['bom despacho','nossa senhora do bom despacho','santuário eucarístico','santuario eucaristico'],
    'church',
    1
  ),
  (
    'grande-templo',
    'Grande Templo',
    'Sede da Igreja Evangélica Assembleia de Deus do Estado de Mato Grosso.',
    'Grande Templo em Cuiabá',
    'Grande Templo',
    'Sede da Igreja Evangélica Assembleia de Deus em Mato Grosso. Segundo a Wikipédia, a construção começou em 1985 e foi concluída em 1996.',
    '',
    '',
    'Av. Historiador Rubens de Mendonça, 3500 - Bosque da Saúde, Cuiabá - MT, 78050-000',
    'Bosque da Saúde, Cuiabá - MT',
    '(65) 3644-2233',
    'Não informado em fonte pública consultada',
    'Não informado em fonte oficial pública consultada',
    'Cultos, vigílias e eventos. Programação deve ser confirmada nos canais oficiais do templo.',
    'Cultos e eventos religiosos. Confirme a programação antes da visita.',
    'Dados consolidados a partir da Wikipédia e registros públicos.',
    ARRAY['grande templo','assembleia de deus','igreja evangélica','igreja evangelica'],
    'landmark',
    2
  ),
  (
    'mesquita-cuiaba',
    'Mesquita de Cuiabá',
    'Templo muçulmano aberto à visitação pública no bairro Bandeirantes.',
    'Fachada da Mesquita de Cuiabá com minarete',
    'Mesquita de Cuiabá',
    'A Mesquita Muçulmana de Cuiabá preserva uma parte importante da história sírio-libanesa na capital mato-grossense. A visita apresenta arquitetura, cultura e fé islâmica em um espaço consolidado como ponto de turismo religioso.',
    'Os primeiros registros da chegada de sírio-libaneses em Cuiabá aparecem por volta de 1890. No censo de 1920, já havia 91 cidadãos dessa origem na cidade.

A pedra fundamental do templo foi lançada pela Sociedade Muçulmana em 1976, com apoio de cerca de 1.300 membros. A inauguração ocorreu em 1978, com a presença de autoridades locais, representantes de países árabes e lideranças religiosas.

Durante a Copa de 2014, a mesquita recebeu centenas de visitantes, muitos vindos dos países que jogaram em Cuiabá.

O edifício se destaca pelo minarete vindo da Arábia Saudita, visível de diferentes pontos da cidade. No interior, desenhos pintados à mão envolvem o ambiente com escrituras sagradas do Alcorão, vitrais coloridos e tapetes usados nas orações.',
    'Entrar descalço, deixando os sapatos na entrada.
Mulheres devem cobrir cabelos e ombros com véu fornecido no local.
Usar roupas abaixo dos joelhos para acessar o espaço sagrado.
Grupos, escolas e turistas devem agendar visita guiada pelo telefone ou pela página oficial.',
    'Rua Baltazar Navarros, 09 - Morro da Luz, Bandeirantes, Cuiabá - MT, 78010-020',
    'Bandeirantes, Cuiabá - MT',
    '(65) 98416-7406',
    '(65) 98416-7406',
    'www.facebook.com/IslamCuiaba',
    'Orações diárias e visitas guiadas mediante agendamento.',
    'Visitas guiadas mediante agendamento.',
    'Dados atualizados com base em publicação da Prefeitura de Cuiabá sobre turismo religioso.',
    ARRAY['mesquita','mesquita de cuiabá','mesquita de cuiaba'],
    'moon',
    3
  )
ON CONFLICT (slug) DO NOTHING;
