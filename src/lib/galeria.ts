import { hasSupabaseConfig, supabase } from "@/integrations/supabase/client";

export type Foto = {
  id: string;
  titulo: string;
  descricao: string;
  alt_text: string;
  imagem_url: string;
  tags: string[];
  ordem: number;
};

export type FotoInput = Omit<Foto, "id">;

export type GaleriaSecao = {
  id: string;
  slug: string;
  titulo: string;
  descricao_card: string;
  imagem_card_url: string;
  imagem_card_alt: string;
  galeria_titulo: string;
  galeria_resumo: string;
  galeria_detalhes: string;
  recomendacoes: string;
  endereco: string;
  localizacao_curta: string;
  telefone: string;
  whatsapp: string;
  email: string;
  encontros: string;
  observacao_visita: string;
  fonte: string;
  palavras_chave: string[];
  icone: "church" | "landmark" | "moon";
  ordem: number;
};

export type GaleriaSecaoInput = Omit<GaleriaSecao, "id">;

export const DEFAULT_GALERIA_SECOES: GaleriaSecao[] = [
  {
    id: "default-bom-despacho",
    slug: "bom-despacho",
    titulo: "Santuário Eucarístico Nossa Senhora do Bom Despacho",
    descricao_card: "Registros do santuário, sua arquitetura, altar e detalhes devocionais.",
    imagem_card_url: "",
    imagem_card_alt: "Santuário Eucarístico Nossa Senhora do Bom Despacho",
    galeria_titulo: "Santuário Eucarístico Nossa Senhora do Bom Despacho",
    galeria_resumo:
      "Igreja católica de características neogóticas, localizada no alto do Morro do Seminário. A construção atual data de 1918 e o bem foi tombado em 1977.",
    galeria_detalhes: "",
    recomendacoes: "",
    endereco: "Praça do Seminário, s/n - Dom Aquino, Cuiabá - MT, 78015-325",
    localizacao_curta: "Dom Aquino, Cuiabá - MT",
    telefone: "(65) 99946-1183",
    whatsapp: "(65) 99946-1183",
    email: "santuarioeucaristico@cuiabaarquidiocese.net",
    encontros: "Missas: seg. a sex. 7h e 18h; sáb. 7h; dom. 7h, 9h, 17h e 19h.",
    observacao_visita: "Missas e visitação religiosa com programação da paróquia.",
    fonte: "Dados consolidados a partir da Arquidiocese de Cuiabá e registros públicos.",
    palavras_chave: ["bom despacho", "nossa senhora do bom despacho", "santuário eucarístico", "santuario eucaristico"],
    icone: "church",
    ordem: 1,
  },
  {
    id: "default-grande-templo",
    slug: "grande-templo",
    titulo: "Grande Templo",
    descricao_card: "Sede da Igreja Evangélica Assembleia de Deus do Estado de Mato Grosso.",
    imagem_card_url: "",
    imagem_card_alt: "Grande Templo em Cuiabá",
    galeria_titulo: "Grande Templo",
    galeria_resumo:
      "Sede da Igreja Evangélica Assembleia de Deus em Mato Grosso. Segundo a Wikipédia, a construção começou em 1985 e foi concluída em 1996.",
    galeria_detalhes: "",
    recomendacoes: "",
    endereco: "Av. Historiador Rubens de Mendonça, 3500 - Bosque da Saúde, Cuiabá - MT, 78050-000",
    localizacao_curta: "Bosque da Saúde, Cuiabá - MT",
    telefone: "(65) 3644-2233",
    whatsapp: "Não informado em fonte pública consultada",
    email: "Não informado em fonte oficial pública consultada",
    encontros: "Cultos, vigílias e eventos. Programação deve ser confirmada nos canais oficiais do templo.",
    observacao_visita: "Cultos e eventos religiosos. Confirme a programação antes da visita.",
    fonte: "Dados consolidados a partir da Wikipédia e registros públicos.",
    palavras_chave: ["grande templo", "assembleia de deus", "igreja evangélica", "igreja evangelica"],
    icone: "landmark",
    ordem: 2,
  },
  {
    id: "default-mesquita-cuiaba",
    slug: "mesquita-cuiaba",
    titulo: "Mesquita de Cuiabá",
    descricao_card: "Templo muçulmano aberto à visitação pública no bairro Bandeirantes.",
    imagem_card_url: "",
    imagem_card_alt: "Fachada da Mesquita de Cuiabá com minarete",
    galeria_titulo: "Mesquita de Cuiabá",
    galeria_resumo:
      "A Mesquita Muçulmana de Cuiabá preserva uma parte importante da história sírio-libanesa na capital mato-grossense. A visita apresenta arquitetura, cultura e fé islâmica em um espaço consolidado como ponto de turismo religioso.",
    galeria_detalhes:
      "Os primeiros registros da chegada de sírio-libaneses em Cuiabá aparecem por volta de 1890. No censo de 1920, já havia 91 cidadãos dessa origem na cidade.\n\nA pedra fundamental do templo foi lançada pela Sociedade Muçulmana em 1976, com apoio de cerca de 1.300 membros. A inauguração ocorreu em 1978, com a presença de autoridades locais, representantes de países árabes e lideranças religiosas.\n\nDurante a Copa de 2014, a mesquita recebeu centenas de visitantes, muitos vindos dos países que jogaram em Cuiabá.\n\nO edifício se destaca pelo minarete vindo da Arábia Saudita, visível de diferentes pontos da cidade. No interior, desenhos pintados à mão envolvem o ambiente com escrituras sagradas do Alcorão, vitrais coloridos e tapetes usados nas orações.",
    recomendacoes:
      "Entrar descalço, deixando os sapatos na entrada.\nMulheres devem cobrir cabelos e ombros com véu fornecido no local.\nUsar roupas abaixo dos joelhos para acessar o espaço sagrado.\nGrupos, escolas e turistas devem agendar visita guiada pelo telefone ou pela página oficial.",
    endereco: "Rua Baltazar Navarros, 09 - Morro da Luz, Bandeirantes, Cuiabá - MT, 78010-020",
    localizacao_curta: "Bandeirantes, Cuiabá - MT",
    telefone: "(65) 98416-7406",
    whatsapp: "(65) 98416-7406",
    email: "www.facebook.com/IslamCuiaba",
    encontros: "Orações diárias e visitas guiadas mediante agendamento.",
    observacao_visita: "Visitas guiadas mediante agendamento.",
    fonte: "Dados atualizados com base em publicação da Prefeitura de Cuiabá sobre turismo religioso.",
    palavras_chave: ["mesquita", "mesquita de cuiabá", "mesquita de cuiaba"],
    icone: "moon",
    ordem: 3,
  },
];

export async function listFotos(): Promise<Foto[]> {
  if (!hasSupabaseConfig()) return [];

  const { data, error } = await supabase.from("galeria_fotos").select("*").order("ordem", { ascending: true }).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Foto[];
}

export async function listFotosByTag(tag: string): Promise<Foto[]> {
  if (!hasSupabaseConfig()) return [];

  const { data, error } = await supabase
    .from("galeria_fotos")
    .select("*")
    .contains("tags", [tag])
    .order("ordem", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Foto[];
}

export async function createFoto(input: FotoInput) {
  const { error } = await supabase.from("galeria_fotos").insert(input);
  if (error) throw error;
}

export async function updateFoto(id: string, input: Partial<FotoInput>) {
  const { error } = await supabase.from("galeria_fotos").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteFoto(id: string) {
  const { error } = await supabase.from("galeria_fotos").delete().eq("id", id);
  if (error) throw error;
}

export async function listGaleriaSecoes(): Promise<GaleriaSecao[]> {
  if (!hasSupabaseConfig()) return DEFAULT_GALERIA_SECOES;

  const { data, error } = await supabase
    .from("galeria_secoes")
    .select("*")
    .order("ordem", { ascending: true });

  if (error) {
    console.warn("[Galeria] usando seções padrão:", error.message);
    return DEFAULT_GALERIA_SECOES;
  }

  return data && data.length > 0 ? (data as GaleriaSecao[]) : DEFAULT_GALERIA_SECOES;
}

export async function saveGaleriaSecao(id: string, input: Partial<GaleriaSecaoInput>) {
  const { error } = await supabase.from("galeria_secoes").update(input).eq("id", id);
  if (error) throw error;
}
