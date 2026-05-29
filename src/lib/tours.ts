import { hasSupabaseConfig, supabase } from "@/integrations/supabase/client";

export type TourScene = {
  id: string;
  igreja_id: string;
  key: string;
  nome: string;
  panorama_url: string;
  ordem: number;
};

export type HotspotTipo = "info" | "imagem" | "cena";

export type TourHotspot = {
  id: string;
  scene_id: string;
  tipo: HotspotTipo;
  titulo: string;
  descricao: string;
  imagem_url: string;
  target_scene_id: string | null;
  yaw: number;
  pitch: number;
};

export async function listScenes(igrejaId: string): Promise<TourScene[]> {
  if (!hasSupabaseConfig()) return [];

  const { data, error } = await supabase
    .from("tour_scenes")
    .select("*")
    .eq("igreja_id", igrejaId)
    .order("ordem", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TourScene[];
}

export async function listHotspotsByIgreja(igrejaId: string): Promise<TourHotspot[]> {
  if (!hasSupabaseConfig()) return [];

  // join via scenes
  const { data: scenes, error: sErr } = await supabase
    .from("tour_scenes")
    .select("id")
    .eq("igreja_id", igrejaId);
  if (sErr) throw sErr;
  const ids = (scenes ?? []).map((s) => s.id);
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("tour_hotspots")
    .select("*")
    .in("scene_id", ids);
  if (error) throw error;
  return (data ?? []) as TourHotspot[];
}

export async function listHotspots(sceneId: string): Promise<TourHotspot[]> {
  if (!hasSupabaseConfig()) return [];

  const { data, error } = await supabase
    .from("tour_hotspots")
    .select("*")
    .eq("scene_id", sceneId);
  if (error) throw error;
  return (data ?? []) as TourHotspot[];
}

export async function createScene(input: Omit<TourScene, "id">) {
  const { data, error } = await supabase
    .from("tour_scenes")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as TourScene;
}

export async function updateScene(id: string, input: Partial<Omit<TourScene, "id">>) {
  const { error } = await supabase.from("tour_scenes").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteScene(id: string) {
  const { error } = await supabase.from("tour_scenes").delete().eq("id", id);
  if (error) throw error;
}

export async function setCenaInicial(igrejaId: string, sceneId: string | null) {
  const { error } = await supabase
    .from("igrejas")
    .update({ cena_inicial_id: sceneId })
    .eq("id", igrejaId);
  if (error) throw error;
}

export async function createHotspot(input: Omit<TourHotspot, "id">) {
  const { error } = await supabase.from("tour_hotspots").insert(input);
  if (error) throw error;
}

export async function updateHotspot(id: string, input: Partial<Omit<TourHotspot, "id">>) {
  const { error } = await supabase.from("tour_hotspots").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteHotspot(id: string) {
  const { error } = await supabase.from("tour_hotspots").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadPanorama(file: File, igrejaSlug: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `tours/${igrejaSlug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("igrejas")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("igrejas").getPublicUrl(path).data.publicUrl;
}
