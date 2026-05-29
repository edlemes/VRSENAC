import { supabase } from "@/integrations/supabase/client";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let s = sessionStorage.getItem("sd_sid");
    if (!s) {
      s = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem("sd_sid", s);
    }
    return s;
  } catch {
    return "anon";
  }
}

let lastPath = "";
let lastAt = 0;

export async function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (path === lastPath && now - lastAt < 1500) return;
  lastPath = path;
  lastAt = now;
  try {
    await supabase.from("page_views").insert({
      path: path.slice(0, 500),
      referrer: (document.referrer || "").slice(0, 500),
      user_agent: (navigator.userAgent || "").slice(0, 500),
      session_id: getSessionId(),
    });
  } catch {
    /* silent */
  }
}

export type TourEventType =
  | "tour_open"
  | "tour_close"
  | "scene_change"
  | "hotspot_click"
  | "gallery_open";

export async function trackTourEvent(params: {
  type: TourEventType;
  igrejaId?: string | null;
  igrejaSlug?: string;
  sceneId?: string | null;
  hotspotId?: string | null;
  durationMs?: number | null;
}) {
  if (typeof window === "undefined") return;
  try {
    await supabase.from("tour_events").insert({
      event_type: params.type,
      igreja_id: params.igrejaId ?? null,
      igreja_slug: (params.igrejaSlug || "").slice(0, 200),
      scene_id: params.sceneId ?? null,
      hotspot_id: params.hotspotId ?? null,
      duration_ms: params.durationMs ?? null,
      session_id: getSessionId(),
    });
  } catch {
    /* silent */
  }
}
