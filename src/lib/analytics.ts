import { supabase } from "@/integrations/supabase/client";

const DOW_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export type Period = { from: Date; to: Date };

export function defaultPeriod(days = 30): Period {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days);
  from.setHours(0, 0, 0, 0);
  return { from, to };
}

export type AnalyticsSummary = {
  totalViews: number;
  uniqueSessions: number;
  toursOpened: number;
  hotspotClicks: number;
  avgTourSeconds: number;
  galleryOpens: number;
  viewsByDay: { date: string; views: number }[];
  viewsByDow: { dow: string; views: number; isPeak: boolean }[];
  viewsByHour: { hour: string; views: number; isPeak: boolean }[];
  topIgrejas: { igreja_slug: string; opens: number }[];
  topHotspots: { hotspot_id: string; clicks: number }[];
  topScenes: { scene_id: string; igreja_slug: string; views: number }[];
  galleryByIgreja: { igreja_slug: string; opens: number }[];
  tourTimeByIgreja: { igreja_slug: string; avgSeconds: number; totalSeconds: number; sessions: number }[];
};

export async function loadAnalytics(period: Period): Promise<AnalyticsSummary> {
  const fromISO = period.from.toISOString();
  const toISO = period.to.toISOString();

  const [pv, te] = await Promise.all([
    supabase
      .from("page_views")
      .select("path, session_id, created_at")
      .gte("created_at", fromISO)
      .lte("created_at", toISO)
      .limit(50000),
    supabase
      .from("tour_events")
      .select("event_type, igreja_slug, hotspot_id, scene_id, duration_ms, created_at")
      .gte("created_at", fromISO)
      .lte("created_at", toISO)
      .limit(50000),
  ]);

  if (pv.error) throw pv.error;
  if (te.error) throw te.error;

  const views = pv.data ?? [];
  const events = te.data ?? [];

  const sessions = new Set<string>();
  views.forEach((v) => v.session_id && sessions.add(v.session_id));

  const toursOpened = events.filter((e) => e.event_type === "tour_open").length;
  const hotspotClicks = events.filter((e) => e.event_type === "hotspot_click").length;
  const galleryOpens = events.filter((e) => e.event_type === "gallery_open").length;

  // Avg tour duration (seconds) from tour_close events
  const closes = events.filter((e) => e.event_type === "tour_close" && typeof e.duration_ms === "number");
  const totalMs = closes.reduce((acc, e) => acc + (e.duration_ms as number), 0);
  const avgTourSeconds = closes.length > 0 ? Math.round(totalMs / closes.length / 1000) : 0;

  // By day
  const dayMap = new Map<string, number>();
  const days = Math.max(1, Math.ceil((period.to.getTime() - period.from.getTime()) / 86400000));
  for (let i = 0; i <= days; i++) {
    const d = new Date(period.from);
    d.setDate(d.getDate() + i);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }
  views.forEach((v) => {
    const k = new Date(v.created_at).toISOString().slice(0, 10);
    if (dayMap.has(k)) dayMap.set(k, (dayMap.get(k) || 0) + 1);
  });
  const viewsByDay = Array.from(dayMap.entries()).map(([date, views]) => ({ date, views }));

  // By day of week
  const dow = new Array(7).fill(0);
  views.forEach((v) => {
    dow[new Date(v.created_at).getDay()]++;
  });
  const peakDow = Math.max(...dow);
  const viewsByDow = dow.map((views, i) => ({
    dow: DOW_LABELS[i],
    views,
    isPeak: views === peakDow && views > 0,
  }));

  // By hour
  const hours = new Array(24).fill(0);
  views.forEach((v) => {
    hours[new Date(v.created_at).getHours()]++;
  });
  const peakHour = Math.max(...hours);
  const viewsByHour = hours.map((views, i) => ({
    hour: `${String(i).padStart(2, "0")}h`,
    views,
    isPeak: views === peakHour && views > 0,
  }));

  // Top igrejas
  const igrejaCount = new Map<string, number>();
  events
    .filter((e) => e.event_type === "tour_open" && e.igreja_slug)
    .forEach((e) => igrejaCount.set(e.igreja_slug!, (igrejaCount.get(e.igreja_slug!) || 0) + 1));
  const topIgrejas = Array.from(igrejaCount.entries())
    .map(([igreja_slug, opens]) => ({ igreja_slug, opens }))
    .sort((a, b) => b.opens - a.opens)
    .slice(0, 10);

  // Top hotspots
  const hsCount = new Map<string, number>();
  events
    .filter((e) => e.event_type === "hotspot_click" && e.hotspot_id)
    .forEach((e) => hsCount.set(e.hotspot_id!, (hsCount.get(e.hotspot_id!) || 0) + 1));
  const topHotspots = Array.from(hsCount.entries())
    .map(([hotspot_id, clicks]) => ({ hotspot_id, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  // Top scenes (scene_change events)
  const sceneCount = new Map<string, { scene_id: string; igreja_slug: string; views: number }>();
  events
    .filter((e) => e.event_type === "scene_change" && e.scene_id)
    .forEach((e) => {
      const key = e.scene_id!;
      const cur = sceneCount.get(key);
      if (cur) cur.views++;
      else sceneCount.set(key, { scene_id: key, igreja_slug: e.igreja_slug ?? "", views: 1 });
    });
  const topScenes = Array.from(sceneCount.values())
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Gallery opens by igreja
  const galleryCount = new Map<string, number>();
  events
    .filter((e) => e.event_type === "gallery_open" && e.igreja_slug)
    .forEach((e) => galleryCount.set(e.igreja_slug!, (galleryCount.get(e.igreja_slug!) || 0) + 1));
  const galleryByIgreja = Array.from(galleryCount.entries())
    .map(([igreja_slug, opens]) => ({ igreja_slug, opens }))
    .sort((a, b) => b.opens - a.opens)
    .slice(0, 10);

  // Tour time by igreja
  const timeMap = new Map<string, { total: number; n: number }>();
  closes
    .filter((e) => e.igreja_slug)
    .forEach((e) => {
      const cur = timeMap.get(e.igreja_slug!) ?? { total: 0, n: 0 };
      cur.total += e.duration_ms as number;
      cur.n += 1;
      timeMap.set(e.igreja_slug!, cur);
    });
  const tourTimeByIgreja = Array.from(timeMap.entries())
    .map(([igreja_slug, v]) => ({
      igreja_slug,
      avgSeconds: Math.round(v.total / v.n / 1000),
      totalSeconds: Math.round(v.total / 1000),
      sessions: v.n,
    }))
    .sort((a, b) => b.avgSeconds - a.avgSeconds)
    .slice(0, 10);

  return {
    totalViews: views.length,
    uniqueSessions: sessions.size,
    toursOpened,
    hotspotClicks,
    avgTourSeconds,
    galleryOpens,
    viewsByDay,
    viewsByDow,
    viewsByHour,
    topIgrejas,
    topHotspots,
    topScenes,
    galleryByIgreja,
    tourTimeByIgreja,
  };
}

