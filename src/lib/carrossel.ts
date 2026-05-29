import { supabase } from "@/integrations/supabase/client";

export type Slide = {
  id: string;
  titulo: string;
  subtitulo: string;
  imagem_url: string;
  link: string;
  ordem: number;
  ativo: boolean;
};

export type SlideInput = Omit<Slide, "id">;

export async function listSlides(opts?: { onlyAtivos?: boolean }): Promise<Slide[]> {
  let q = supabase.from("home_carrossel").select("*").order("ordem", { ascending: true });
  if (opts?.onlyAtivos) q = q.eq("ativo", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Slide[];
}

export async function createSlide(input: SlideInput) {
  const { error } = await supabase.from("home_carrossel").insert(input);
  if (error) throw error;
}

export async function updateSlide(id: string, input: Partial<SlideInput>) {
  const { error } = await supabase.from("home_carrossel").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteSlide(id: string) {
  const { error } = await supabase.from("home_carrossel").delete().eq("id", id);
  if (error) throw error;
}
