import { supabase } from "@/integrations/supabase/client";

export type Noticia = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  imagem_url: string;
  publicado: boolean;
  publicado_em: string | null;
  created_at: string;
  updated_at: string;
};

export type NoticiaInput = Omit<Noticia, "id" | "created_at" | "updated_at">;

export async function listNoticias(opts?: { onlyPublicadas?: boolean }) {
  let q = supabase.from("noticias").select("*").order("publicado_em", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false });
  if (opts?.onlyPublicadas) q = q.eq("publicado", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Noticia[];
}

export async function getNoticiaBySlug(slug: string) {
  const { data, error } = await supabase.from("noticias").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as Noticia) ?? null;
}

export async function createNoticia(input: NoticiaInput) {
  const { error } = await supabase.from("noticias").insert(input);
  if (error) throw error;
}

export async function updateNoticia(id: string, input: Partial<NoticiaInput>) {
  const { error } = await supabase.from("noticias").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteNoticia(id: string) {
  const { error } = await supabase.from("noticias").delete().eq("id", id);
  if (error) throw error;
}
