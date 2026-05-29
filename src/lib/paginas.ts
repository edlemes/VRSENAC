import { supabase } from "@/integrations/supabase/client";

export type PaginaChave = "sobre" | "parceria";

export type Pagina = {
  id: string;
  chave: PaginaChave;
  titulo: string;
  subtitulo: string;
  conteudo: string;
  hero_imagem_url: string;
};

export async function listPaginas(): Promise<Pagina[]> {
  const { data, error } = await supabase.from("paginas").select("*").order("chave");
  if (error) throw error;
  return (data ?? []) as Pagina[];
}

export async function getPagina(chave: PaginaChave): Promise<Pagina | null> {
  const { data, error } = await supabase.from("paginas").select("*").eq("chave", chave).maybeSingle();
  if (error) throw error;
  return (data as Pagina) ?? null;
}

export async function updatePagina(id: string, input: Partial<Omit<Pagina, "id" | "chave">>) {
  const { error } = await supabase.from("paginas").update(input).eq("id", id);
  if (error) throw error;
}
