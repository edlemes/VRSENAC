import { useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { Upload, X, Link as LinkIcon, ImageIcon, Move, ZoomIn, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Props = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: number;
};

type DragState = {
  startX: number;
  startY: number;
  baseX: number;
  baseY: number;
};

type EditorImage = {
  file: File;
  url: string;
};

export function ImageUpload({ value, onChange, folder = "geral", label = "Imagem", aspectRatio = 16 / 9 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preparingEditor, setPreparingEditor] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">(value && /^https?:\/\//.test(value) && !value.includes("/storage/") ? "url" : "upload");
  const [editorImage, setEditorImage] = useState<EditorImage | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<DragState | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const cropRef = useRef<HTMLDivElement>(null);

  const cropAspect = useMemo(() => `${aspectRatio} / 1`, [aspectRatio]);

  const openEditor = (file: File) => {
    setEditorImage({ file, url: URL.createObjectURL(file) });
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setNaturalSize({ width: 0, height: 0 });
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Imagem maior que 8MB. Reduza o tamanho e tente novamente.");
      return;
    }
    openEditor(file);
  };

  const adjustCurrentImage = async () => {
    if (!value) return;
    setPreparingEditor(true);
    try {
      const response = await fetch(value);
      if (!response.ok) throw new Error("Não foi possível baixar a imagem atual.");
      const blob = await response.blob();
      if (!blob.type.startsWith("image/")) throw new Error("O arquivo atual não parece ser uma imagem.");
      const name = decodeURIComponent(value.split("/").pop()?.split("?")[0] || "imagem-atual");
      openEditor(new File([blob], name, { type: blob.type }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível ajustar essa imagem.");
    } finally {
      setPreparingEditor(false);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const { error } = await supabase.storage.from("igrejas").upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("igrejas").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Imagem enviada com sucesso.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  };

  const resetEditor = () => {
    if (editorImage) URL.revokeObjectURL(editorImage.url);
    setEditorImage(null);
    setDrag(null);
  };

  const confirmCrop = async () => {
    if (!editorImage || !naturalSize.width || !naturalSize.height || !cropRef.current) return;

    const cropBox = cropRef.current.getBoundingClientRect();
    const outputWidth = aspectRatio >= 1 ? 1600 : Math.round(1200 * aspectRatio);
    const outputHeight = Math.round(outputWidth / aspectRatio);
    const baseScale = Math.max(
      outputWidth / naturalSize.width,
      outputHeight / naturalSize.height,
    );
    const previewToOutput = outputWidth / cropBox.width;
    const scale = baseScale * zoom;
    const drawWidth = naturalSize.width * scale;
    const drawHeight = naturalSize.height * scale;
    const drawX = (outputWidth - drawWidth) / 2 + offset.x * previewToOutput;
    const drawY = (outputHeight - drawHeight) / 2 + offset.y * previewToOutput;

    const image = new Image();
    image.src = editorImage.url;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast.error("Não foi possível preparar a imagem.");
      return;
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outputWidth, outputHeight);
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9),
    );
    if (!blob) {
      toast.error("Não foi possível gerar a imagem ajustada.");
      return;
    }

    const adjusted = new File(
      [blob],
      `${editorImage.file.name.replace(/\.[^.]+$/, "")}-ajustada.jpg`,
      { type: "image/jpeg" },
    );
    resetEditor();
    await uploadFile(adjusted);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    setOffset({
      x: drag.baseX + event.clientX - drag.startX,
      y: drag.baseY + event.clientY - drag.startY,
    });
  };

  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>

      <div className="mt-2 flex gap-1 border border-border w-fit text-xs">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-2 px-3 py-2 uppercase tracking-widest ${mode === "upload" ? "bg-gold text-ink" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Upload size={12} /> Enviar arquivo
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-2 px-3 py-2 uppercase tracking-widest ${mode === "url" ? "bg-gold text-ink" : "text-muted-foreground hover:text-foreground"}`}
        >
          <LinkIcon size={12} /> Colar URL
        </button>
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">
        Você pode enviar uma foto do seu computador ou colar o link de uma imagem da internet.
      </p>

      <div className="mt-3 flex items-start gap-3">
        {value ? (
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={adjustCurrentImage}
              disabled={preparingEditor || uploading}
              className="group block border border-border bg-ink disabled:cursor-wait disabled:opacity-70"
              aria-label="Ajustar enquadramento da imagem"
              title="Clique para ajustar o enquadramento"
            >
              <img
                src={value}
                alt="Pré-visualização"
                className="h-24 w-36 object-cover transition group-hover:opacity-75"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-ink/75 px-2 py-1 text-center text-[10px] uppercase tracking-widest text-background opacity-0 transition group-hover:opacity-100">
                {preparingEditor ? "Abrindo" : "Clique para ajustar"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -right-2 -top-2 rounded-full bg-background p-1 shadow"
              aria-label="Remover imagem"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="flex h-24 w-36 items-center justify-center border border-dashed border-border text-muted-foreground">
            <ImageIcon size={20} />
          </div>
        )}
        <div className="flex-1 space-y-2">
          {mode === "upload" ? (
            <>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                disabled={uploading}
                className="block w-full text-xs file:mr-3 file:border file:border-border file:bg-secondary file:px-3 file:py-2 file:text-xs file:uppercase file:tracking-widest"
              />
              <p className="text-[11px] text-muted-foreground">PNG, JPG ou WEBP · até 8MB.</p>
              {uploading && <p className="text-xs text-gold">Enviando…</p>}
            </>
          ) : (
            <>
              <input
                type="url"
                placeholder="https://exemplo.com/imagem.jpg"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none"
              />
              <p className="text-[11px] text-muted-foreground">Cole o endereço completo da imagem (deve começar com https://).</p>
            </>
          )}
        </div>
      </div>

      {editorImage && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur"
          onClick={resetEditor}
        >
          <div
            className="my-8 w-full max-w-4xl border border-border bg-background p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl">Ajustar imagem</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Arraste a foto e use a roda do mouse ou o controle de zoom para enquadrar.
                </p>
              </div>
              <button type="button" onClick={resetEditor} aria-label="Fechar">
                <X size={20} />
              </button>
            </div>

            <div
              ref={cropRef}
              className="relative mt-6 w-full cursor-move overflow-hidden border border-border bg-ink select-none"
              style={{ aspectRatio: cropAspect }}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setDrag({
                  startX: event.clientX,
                  startY: event.clientY,
                  baseX: offset.x,
                  baseY: offset.y,
                });
              }}
              onPointerMove={onPointerMove}
              onPointerUp={(event) => {
                event.currentTarget.releasePointerCapture(event.pointerId);
                setDrag(null);
              }}
              onPointerCancel={() => setDrag(null)}
              onWheel={(event) => {
                event.preventDefault();
                const direction = event.deltaY > 0 ? -0.08 : 0.08;
                setZoom((current) => Math.min(2.8, Math.max(1, Number((current + direction).toFixed(2)))));
              }}
            >
              <img
                src={editorImage.url}
                alt="Imagem para ajustar"
                draggable={false}
                onLoad={(event) => {
                  setNaturalSize({
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  });
                }}
                className="absolute left-1/2 top-1/2 h-full w-full max-w-none object-cover"
                style={{
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
                }}
              />
              <div className="pointer-events-none absolute inset-4 border border-background/60" />
              <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 bg-ink/70 px-3 py-2 text-xs uppercase tracking-widest text-background backdrop-blur">
                <Move size={13} /> Arraste para ajustar
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <label className="flex flex-1 items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
                <ZoomIn size={14} />
                Zoom
                <input
                  type="range"
                  min="1"
                  max="2.8"
                  step="0.05"
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                  className="w-full accent-[oklch(0.75_0.13_85)]"
                />
              </label>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setOffset({ x: 0, y: 0 });
                  }}
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-widest hover:bg-secondary"
                >
                  <RotateCcw size={13} /> Centralizar
                </button>
                <button
                  type="button"
                  onClick={resetEditor}
                  className="border border-border px-4 py-2 text-xs uppercase tracking-widest hover:bg-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmCrop}
                  disabled={uploading}
                  className="bg-gold px-5 py-2 text-xs uppercase tracking-widest text-ink hover:bg-gold-soft disabled:opacity-50"
                >
                  {uploading ? "Enviando…" : "Aplicar e enviar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
