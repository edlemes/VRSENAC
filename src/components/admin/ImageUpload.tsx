import { useState } from "react";
import { Upload, X, Link as LinkIcon, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Props = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
};

export function ImageUpload({ value, onChange, folder = "geral", label = "Imagem" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">(value && /^https?:\/\//.test(value) && !value.includes("/storage/") ? "url" : "upload");

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Imagem maior que 8MB. Reduza o tamanho e tente novamente.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("igrejas").upload(path, file, { cacheControl: "3600", upsert: false });
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
          <div className="relative">
            <img src={value} alt="Pré-visualização" className="h-24 w-36 border border-border object-cover" />
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
    </div>
  );
}
