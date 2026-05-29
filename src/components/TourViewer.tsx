import { useEffect, useRef, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { TourHotspot, TourScene } from "@/lib/tours";
import { trackTourEvent } from "@/lib/tracking";

type Props = {
  scenes: TourScene[];
  hotspots: TourHotspot[];
  initialSceneId?: string | null;
  controlledSceneId?: string | null;
  igrejaId?: string | null;
  igrejaSlug?: string;
};

export function TourViewer({ scenes, hotspots, initialSceneId, controlledSceneId, igrejaId, igrejaSlug }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(
    initialSceneId ?? scenes[0]?.id ?? null,
  );
  const [lightbox, setLightbox] = useState<{ url: string; titulo: string } | null>(null);
  const [infoPopup, setInfoPopup] = useState<{ titulo: string; descricao: string } | null>(null);

  // Sync controlled scene id from parent
  useEffect(() => {
    if (controlledSceneId && controlledSceneId !== currentSceneId) {
      setCurrentSceneId(controlledSceneId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledSceneId]);


  // Mount viewer once + track tour_open / tour_close
  useEffect(() => {
    if (!containerRef.current || scenes.length === 0) return;
    const initial = scenes.find((s) => s.id === currentSceneId) ?? scenes[0];
    const viewer = new Viewer({
      container: containerRef.current,
      panorama: initial.panorama_url,
      navbar: ["zoom", "move", "fullscreen"],
      defaultZoomLvl: 0,
      plugins: [[MarkersPlugin, {}]],
    });
    viewerRef.current = viewer;

    const markers = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
    markers.addEventListener("select-marker", ({ marker }) => {
      const data = marker.data as { hotspot: TourHotspot } | undefined;
      if (!data) return;
      const h = data.hotspot;
      trackTourEvent({
        type: "hotspot_click",
        igrejaId,
        igrejaSlug,
        sceneId: h.scene_id,
        hotspotId: h.id,
      });
      if (h.tipo === "cena" && h.target_scene_id) {
        setCurrentSceneId(h.target_scene_id);
      } else if (h.tipo === "imagem" && h.imagem_url) {
        setLightbox({ url: h.imagem_url, titulo: h.titulo });
      } else if (h.tipo === "info") {
        setInfoPopup({ titulo: h.titulo, descricao: h.descricao });
      }
    });

    const startedAt = Date.now();
    trackTourEvent({ type: "tour_open", igrejaId, igrejaSlug, sceneId: initial.id });

    return () => {
      const duration = Date.now() - startedAt;
      trackTourEvent({ type: "tour_close", igrejaId, igrejaSlug, durationMs: duration });
      viewer.destroy();
      viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [igrejaId, igrejaSlug, scenes.length > 0]);

  // React to scene changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !currentSceneId) return;
    const scene = scenes.find((s) => s.id === currentSceneId);
    if (!scene) return;
    trackTourEvent({ type: "scene_change", igrejaId, igrejaSlug, sceneId: currentSceneId });
    viewer.setPanorama(scene.panorama_url).then(() => {
      const markers = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
      const sceneHotspots = hotspots.filter((h) => h.scene_id === currentSceneId);
      markers.setMarkers(
        sceneHotspots.map((h) => ({
          id: h.id,
          position: { yaw: h.yaw, pitch: h.pitch },
          html:
            h.tipo === "cena"
              ? `<div class="psv-hotspot psv-hotspot--cena"><span></span></div>`
              : `<div class="psv-hotspot"><span></span></div>`,
          anchor: "center center",
          tooltip: h.titulo || (h.tipo === "cena" ? "Ir para cena" : ""),
          data: { hotspot: h },
        })),
      );
    });
  }, [currentSceneId, scenes, hotspots]);

  if (scenes.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center bg-secondary text-muted-foreground md:aspect-[21/9]">
        Tour 360° em produção. Volte em breve.
      </div>
    );
  }

  const currentScene = scenes.find((s) => s.id === currentSceneId);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="aspect-[16/9] w-full bg-ink md:aspect-[21/9]"
      />
      {/* Scene selector */}
      {scenes.length > 1 && (
        <div className="absolute left-1/2 top-4 z-10 flex max-w-[90%] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-full border border-background/20 bg-ink/70 px-3 py-2 backdrop-blur">
          {scenes.map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrentSceneId(s.id)}
              className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest transition ${
                s.id === currentScene?.id
                  ? "bg-gold text-ink"
                  : "text-background/80 hover:bg-background/10"
              }`}
            >
              {s.nome}
            </button>
          ))}
        </div>
      )}

      {/* Info popup */}
      <Dialog open={!!infoPopup} onOpenChange={(o) => !o && setInfoPopup(null)}>
        <DialogContent className="max-w-md border-border bg-background">
          <h3 className="font-serif text-2xl">{infoPopup?.titulo}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {infoPopup?.descricao}
          </p>
        </DialogContent>
      </Dialog>

      {/* Image lightbox */}
      <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-3xl border-border bg-background p-2">
          {lightbox && (
            <>
              <img src={lightbox.url} alt={lightbox.titulo} className="w-full" />
              {lightbox.titulo && (
                <p className="px-4 py-3 text-center font-serif text-lg">{lightbox.titulo}</p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
