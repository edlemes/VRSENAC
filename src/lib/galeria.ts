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
