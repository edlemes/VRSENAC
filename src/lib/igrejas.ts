import { supabase } from "@/integrations/supabase/client";

export type Igreja = {
  id: string;
  slug: string;
  nome: string;
  cidade: string;
  estado: string;
  ano: string;
  estilo: string;
  resumo: string;
  descricao: string;
  imagem_url: string;
  destaque: boolean;
  pontos_de_fe: string[];
  cena_inicial_id: string | null;
  tours_externos: string[];
};

export type IgrejaInput = Omit<Igreja, "id" | "cena_inicial_id">;

const GRANDE_TEMPLO_PUBLIC_DEFAULTS: Partial<Igreja> = {
  nome: "Grande Templo Assembleia de Deus",
  ano: "1985-1996",
  estilo: "Templo-auditório contemporâneo",
  resumo:
    "Sede da Igreja Evangélica Assembleia de Deus em Mato Grosso, localizada em Cuiabá, reconhecida pela escala monumental e pela função religiosa, administrativa e comunitária.",
  descricao:
    "O Grande Templo é a sede da Igreja Evangélica Assembleia de Deus do Estado de Mato Grosso, localizado na Avenida Historiador Rubens de Mendonça, no bairro Bosque da Saúde, em Cuiabá. Segundo dados públicos reunidos na Wikipédia, a construção começou em 1985 e foi concluída em 1996, com projeto atribuído ao arquiteto Walter Peixoto.\n\nA edificação se destaca pela escala de templo-auditório. Fontes públicas descrevem o espaço como um dos maiores templos religiosos da América Latina, com grande nave central, áreas administrativas, salas de apoio, auditórios, biblioteca, livraria, espaços de acolhimento e estrutura para eventos religiosos de grande público.\n\nO conjunto é também um marco urbano da capital mato-grossense. Sua forma arredondada, sua área construída e sua posição em uma das principais avenidas de Cuiabá fazem do Grande Templo uma referência visual e religiosa para moradores e visitantes.\n\nFontes públicas consultadas: Wikipédia, Wikimedia Commons e guia turístico com referência à Prefeitura de Cuiabá.",
  imagem_url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Grande%20Templo.jpg",
  pontos_de_fe: [
    "Sede estadual da Assembleia de Deus em Mato Grosso",
    "Construção iniciada em 1985 e concluída em 1996",
    "Capacidade para grandes celebrações, congressos e eventos religiosos",
    "Marco religioso e urbano de Cuiabá",
  ],
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isGrandeTemplo(igreja: Igreja) {
  const haystack = normalizeText(`${igreja.slug} ${igreja.nome}`);
  return haystack.includes("grande-templo") || haystack.includes("grande templo");
}

function isEmpty(value: string | null | undefined) {
  return !value || value.trim().length === 0;
}

function shouldReplaceGrandeTemploName(nome: string) {
  const normalized = normalizeText(nome);
  return normalized.includes("o grande templo e a sede da igreja evangelica assembleia de deus");
}

function applyPublicDefaults(igreja: Igreja): Igreja {
  const normalizedIgreja: Igreja = {
    ...igreja,
    slug: igreja.slug ?? "",
    nome: igreja.nome ?? "",
    cidade: igreja.cidade ?? "",
    estado: igreja.estado ?? "",
    ano: igreja.ano ?? "",
    estilo: igreja.estilo ?? "",
    resumo: igreja.resumo ?? "",
    descricao: igreja.descricao ?? "",
    imagem_url: igreja.imagem_url ?? "",
    destaque: Boolean(igreja.destaque),
    pontos_de_fe: Array.isArray(igreja.pontos_de_fe) ? igreja.pontos_de_fe : [],
    tours_externos: Array.isArray(igreja.tours_externos) ? igreja.tours_externos : [],
  };

  if (!isGrandeTemplo(normalizedIgreja)) return normalizedIgreja;

  return {
    ...normalizedIgreja,
    nome:
      isEmpty(normalizedIgreja.nome) || shouldReplaceGrandeTemploName(normalizedIgreja.nome)
        ? GRANDE_TEMPLO_PUBLIC_DEFAULTS.nome!
        : normalizedIgreja.nome,
    ano: isEmpty(normalizedIgreja.ano) ? GRANDE_TEMPLO_PUBLIC_DEFAULTS.ano! : normalizedIgreja.ano,
    estilo: isEmpty(normalizedIgreja.estilo) ? GRANDE_TEMPLO_PUBLIC_DEFAULTS.estilo! : normalizedIgreja.estilo,
    resumo: isEmpty(normalizedIgreja.resumo) ? GRANDE_TEMPLO_PUBLIC_DEFAULTS.resumo! : normalizedIgreja.resumo,
    descricao: isEmpty(normalizedIgreja.descricao) ? GRANDE_TEMPLO_PUBLIC_DEFAULTS.descricao! : normalizedIgreja.descricao,
    imagem_url: isEmpty(normalizedIgreja.imagem_url) ? GRANDE_TEMPLO_PUBLIC_DEFAULTS.imagem_url! : normalizedIgreja.imagem_url,
    pontos_de_fe:
      normalizedIgreja.pontos_de_fe.length > 0
        ? normalizedIgreja.pontos_de_fe
        : GRANDE_TEMPLO_PUBLIC_DEFAULTS.pontos_de_fe!,
  };
}

/**
 * Aceita: URL completa, iframe colado, ou só o ID Matterport.
 * Retorna URL normalizada `https://my.matterport.com/show/?m=ID` ou "" se inválido.
 */
export function normalizeMatterportUrl(raw: string): string {
  const s = (raw ?? "").trim();
  if (!s) return "";
  const mMatch = s.match(/[?&]m=([A-Za-z0-9]+)/);
  if (mMatch) return `https://my.matterport.com/show/?m=${mMatch[1]}`;
  if (/^[A-Za-z0-9]{6,}$/.test(s)) return `https://my.matterport.com/show/?m=${s}`;
  return "";
}


export async function listIgrejas(): Promise<Igreja[]> {
  const { data, error } = await supabase
    .from("igrejas")
    .select("*")
    .order("destaque", { ascending: false })
    .order("nome", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as Igreja[]).map(applyPublicDefaults);
}

export async function getIgrejaBySlug(slug: string): Promise<Igreja | null> {
  const { data, error } = await supabase
    .from("igrejas")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? applyPublicDefaults(data as Igreja) : null;
}

export async function getIgrejaById(id: string): Promise<Igreja | null> {
  const { data, error } = await supabase
    .from("igrejas")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? applyPublicDefaults(data as Igreja) : null;
}

export async function createIgreja(input: IgrejaInput) {
  const { error } = await supabase.from("igrejas").insert(input);
  if (error) throw error;
}

export async function updateIgreja(id: string, input: Partial<IgrejaInput>) {
  const { error } = await supabase.from("igrejas").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteIgreja(id: string) {
  const { error } = await supabase.from("igrejas").delete().eq("id", id);
  if (error) throw error;
}

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
