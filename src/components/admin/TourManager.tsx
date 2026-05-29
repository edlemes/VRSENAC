import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { toast } from "sonner";
import { Loader2, Plus, Star, Trash2, Upload, X } from "lucide-react";
import {
  createHotspot,
  createScene,
  deleteHotspot,
  deleteScene,
  listHotspots,
  listScenes,
  setCenaInicial,
  updateHotspot,
  uploadPanorama,
  type HotspotTipo,
  type TourHotspot,
  type TourScene,
} from "@/lib/tours";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Props = {
  igrejaId: string;
  igrejaSlug: string;
  cenaInicialId: string | null;
};

export function TourManager({ igrejaId, igrejaSlug, cenaInicialId }: Props) {
  const qc = useQueryClient();
  const [editingScene, setEditingScene] = useState<TourScene | null>(null);

  const { data: scenes = [] } = useQuery({
    queryKey: ["tour-scenes", igrejaId],
    queryFn: () => listScenes(igrejaId),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["tour-scenes", igrejaId] });
    qc.invalidateQueries({ queryKey: ["igreja-id", igrejaId] });
    qc.invalidateQueries({ queryKey: ["tour-hotspots", igrejaId] });
  };

  const del = useMutation({
    mutationFn: deleteScene,
    onSuccess: () => {
      toast.success("Cena excluída");
      invalidate();
    },
  });

  const setInicial = useMutation({
    mutationFn: (sceneId: string) => setCenaInicial(igrejaId, sceneId),
    onSuccess: () => {
      toast.success("Cena inicial definida");
      invalidate();
    },
  });

  return (
    <div className="border-t border-border pt-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl">Tour 360°</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Adicione fotos panorâmicas equirretangulares (proporção 2:1, ex 4096×2048 .jpg) e
            posicione hotspots clicáveis.
          </p>
        </div>
        <NewSceneButton igrejaId={igrejaId} igrejaSlug={igrejaSlug} onCreated={invalidate} />
      </div>

      {scenes.length === 0 ? (
        <p className="mt-8 rounded-sm border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Nenhuma cena cadastrada ainda.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-border border border-border">
          {scenes.map((s) => (
            <div key={s.id} className="flex items-center gap-4 p-4">
              <img
                src={s.panorama_url}
                alt={s.nome}
                className="h-14 w-28 object-cover"
                loading="lazy"
              />
              <div className="flex-1">
                <p className="font-serif text-lg">{s.nome}</p>
                <p className="text-xs text-muted-foreground">
                  Ordem {s.ordem} · /{s.key}
                  {s.id === cenaInicialId && (
                    <span className="ml-2 text-gold">· cena inicial</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setInicial.mutate(s.id)}
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-gold"
                disabled={s.id === cenaInicialId}
                title="Definir como cena inicial"
              >
                <Star size={14} />
              </button>
              <button
                onClick={() => setEditingScene(s)}
                className="text-xs uppercase tracking-widest text-foreground hover:text-gold"
              >
                Hotspots
              </button>
              <button
                onClick={() => {
                  if (confirm(`Excluir cena "${s.nome}"?`)) del.mutate(s.id);
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {editingScene && (
        <HotspotEditor
          scene={editingScene}
          allScenes={scenes}
          igrejaSlug={igrejaSlug}
          onClose={() => setEditingScene(null)}
        />
      )}
    </div>
  );
}

function NewSceneButton({
  igrejaId,
  igrejaSlug,
  onCreated,
}: {
  igrejaId: string;
  igrejaSlug: string;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [key, setKey] = useState("");
  const [ordem, setOrdem] = useState(0);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const u = await uploadPanorama(file, igrejaSlug);
      setUrl(u);
      toast.success("Panorama enviada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!nome || !key || !url) {
      toast.error("Preencha nome, key e envie a panorama");
      return;
    }
    setSaving(true);
    try {
      await createScene({ igreja_id: igrejaId, nome, key, ordem, panorama_url: url });
      toast.success("Cena criada");
      setOpen(false);
      setNome(""); setKey(""); setOrdem(0); setUrl("");
      onCreated();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-foreground px-4 py-2 text-xs uppercase tracking-widest text-background hover:bg-foreground/90"
      >
        <Plus size={14} /> Nova cena
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg border-border bg-background">
          <h3 className="font-serif text-2xl">Nova cena 360°</h3>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Nome</label>
              <input
                className="form-input mt-1"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (!key) setKey(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                }}
                placeholder="Nave principal"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Key</label>
                <input className="form-input mt-1" value={key} onChange={(e) => setKey(e.target.value)} placeholder="nave" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Ordem</label>
                <input
                  type="number"
                  className="form-input mt-1"
                  value={ordem}
                  onChange={(e) => setOrdem(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Panorama equirretangular (2:1)
              </label>
              {url ? (
                <div className="mt-1 flex items-center gap-3 border border-border p-2">
                  <img src={url} alt="" className="h-12 w-24 object-cover" />
                  <button onClick={() => setUrl("")} className="ml-auto text-muted-foreground hover:text-destructive">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 border border-dashed border-border p-6 text-xs text-muted-foreground hover:border-gold">
                  {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                  {uploading ? "Enviando…" : "Selecionar arquivo .jpg"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                  />
                </label>
              )}
            </div>
            <button
              onClick={submit}
              disabled={saving}
              className="w-full bg-gold px-4 py-3 text-xs uppercase tracking-widest text-ink hover:bg-gold-soft disabled:opacity-50"
            >
              {saving ? "Salvando…" : "Criar cena"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function HotspotEditor({
  scene,
  allScenes,
  igrejaSlug,
  onClose,
}: {
  scene: TourScene;
  allScenes: TourScene[];
  igrejaSlug: string;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [draft, setDraft] = useState<Partial<TourHotspot> | null>(null);

  const { data: hotspots = [], refetch } = useQuery({
    queryKey: ["scene-hotspots", scene.id],
    queryFn: () => listHotspots(scene.id),
  });

  // Mount viewer
  useEffect(() => {
    if (!containerRef.current) return;
    const v = new Viewer({
      container: containerRef.current,
      panorama: scene.panorama_url,
      navbar: ["zoom", "move", "fullscreen"],
      plugins: [[MarkersPlugin, {}]],
    });
    viewerRef.current = v;
    v.addEventListener("click", (e) => {
      const data = e.data;
      if (data.rightclick) return;
      setDraft({
        scene_id: scene.id,
        tipo: "info",
        titulo: "",
        descricao: "",
        imagem_url: "",
        target_scene_id: null,
        yaw: data.yaw,
        pitch: data.pitch,
      });
    });
    return () => {
      v.destroy();
      viewerRef.current = null;
    };
  }, [scene.id, scene.panorama_url]);

  // Render markers
  useEffect(() => {
    const v = viewerRef.current;
    if (!v) return;
    const markers = v.getPlugin<MarkersPlugin>(MarkersPlugin);
    markers.setMarkers(
      hotspots.map((h) => ({
        id: h.id,
        position: { yaw: h.yaw, pitch: h.pitch },
        html: `<div class="psv-hotspot ${h.tipo === "cena" ? "psv-hotspot--cena" : ""}"><span></span></div>`,
        anchor: "center center",
        tooltip: h.titulo || h.tipo,
        data: { hotspot: h },
      })),
    );
    const handler = (e: { marker?: { data?: { hotspot?: TourHotspot } } }) => {
      const h = e.marker?.data?.hotspot;
      if (h) setDraft(h);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    markers.addEventListener("select-marker", handler as any);
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      markers.removeEventListener("select-marker", handler as any);
    };
  }, [hotspots]);

  const save = async () => {
    if (!draft) return;
    try {
      if (draft.id) {
        await updateHotspot(draft.id, draft);
        toast.success("Hotspot atualizado");
      } else {
        await createHotspot(draft as Omit<TourHotspot, "id">);
        toast.success("Hotspot criado");
      }
      setDraft(null);
      refetch();
      qc.invalidateQueries({ queryKey: ["tour-hotspots", scene.igreja_id] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    }
  };

  const remove = async () => {
    if (!draft?.id) return;
    if (!confirm("Excluir hotspot?")) return;
    try {
      await deleteHotspot(draft.id);
      setDraft(null);
      refetch();
      qc.invalidateQueries({ queryKey: ["tour-hotspots", scene.igreja_id] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    }
  };

  const uploadImg = async (file: File) => {
    try {
      const u = await uploadPanorama(file, `${igrejaSlug}/hotspots`);
      setDraft((d) => (d ? { ...d, imagem_url: u } : d));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Editando hotspots</p>
          <p className="font-serif text-xl">{scene.nome}</p>
        </div>
        <p className="hidden text-xs text-muted-foreground md:block">
          Clique no panorama para criar um hotspot. Clique num existente para editar.
        </p>
        <button onClick={onClose} className="text-foreground hover:text-gold">
          <X size={20} />
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div ref={containerRef} className="flex-1 bg-ink" />
        <aside className="w-96 overflow-y-auto border-l border-border bg-background p-6">
          {draft ? (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-gold">
                {draft.id ? "Editar hotspot" : "Novo hotspot"}
              </p>
              <p className="text-xs text-muted-foreground">
                yaw: {draft.yaw?.toFixed(3)} · pitch: {draft.pitch?.toFixed(3)}
              </p>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Tipo</label>
                <select
                  className="form-input mt-1"
                  value={draft.tipo}
                  onChange={(e) => setDraft({ ...draft, tipo: e.target.value as HotspotTipo })}
                >
                  <option value="info">Texto informativo</option>
                  <option value="imagem">Imagem em destaque</option>
                  <option value="cena">Ir para outra cena</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Título</label>
                <input
                  className="form-input mt-1"
                  value={draft.titulo ?? ""}
                  onChange={(e) => setDraft({ ...draft, titulo: e.target.value })}
                />
              </div>
              {draft.tipo === "info" && (
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Descrição</label>
                  <textarea
                    rows={4}
                    className="form-input mt-1"
                    value={draft.descricao ?? ""}
                    onChange={(e) => setDraft({ ...draft, descricao: e.target.value })}
                  />
                </div>
              )}
              {draft.tipo === "imagem" && (
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Imagem detalhe</label>
                  {draft.imagem_url ? (
                    <div className="mt-1 flex items-center gap-2 border border-border p-2">
                      <img src={draft.imagem_url} alt="" className="h-12 w-20 object-cover" />
                      <button
                        onClick={() => setDraft({ ...draft, imagem_url: "" })}
                        className="ml-auto text-muted-foreground hover:text-destructive"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 border border-dashed border-border p-4 text-xs text-muted-foreground hover:border-gold">
                      <Upload size={14} /> Enviar imagem
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && uploadImg(e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              )}
              {draft.tipo === "cena" && (
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Cena destino</label>
                  <select
                    className="form-input mt-1"
                    value={draft.target_scene_id ?? ""}
                    onChange={(e) =>
                      setDraft({ ...draft, target_scene_id: e.target.value || null })
                    }
                  >
                    <option value="">Selecione…</option>
                    {allScenes
                      .filter((s) => s.id !== scene.id)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nome}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <div className="flex gap-2 pt-3">
                <button
                  onClick={save}
                  className="flex-1 bg-gold px-4 py-2 text-xs uppercase tracking-widest text-ink hover:bg-gold-soft"
                >
                  Salvar
                </button>
                {draft.id && (
                  <button
                    onClick={remove}
                    className="bg-destructive px-4 py-2 text-xs uppercase tracking-widest text-destructive-foreground hover:opacity-90"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <button
                  onClick={() => setDraft(null)}
                  className="border border-border px-4 py-2 text-xs uppercase tracking-widest hover:bg-secondary"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Clique no panorama para criar um hotspot.</p>
              <p className="text-xs">Hotspots existentes ({hotspots.length}):</p>
              <ul className="space-y-1">
                {hotspots.map((h) => (
                  <li key={h.id} className="flex items-center justify-between border-b border-border py-2 text-xs">
                    <span>
                      <span className="text-gold">[{h.tipo}]</span> {h.titulo || "(sem título)"}
                    </span>
                    <button onClick={() => setDraft(h)} className="hover:text-gold">
                      editar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
