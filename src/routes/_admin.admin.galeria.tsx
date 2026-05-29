import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { listFotos, createFoto, updateFoto, deleteFoto, type Foto, type FotoInput } from "@/lib/galeria";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_admin/admin/galeria")({
  component: AdminGaleria,
});

const EMPTY: FotoInput = { titulo: "", descricao: "", alt_text: "", imagem_url: "", tags: [], ordem: 0 };

function AdminGaleria() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-galeria"], queryFn: listFotos });
  const [editing, setEditing] = useState<Foto | "new" | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const del = useMutation({
    mutationFn: (id: string) => deleteFoto(id),
    onSuccess: () => {
      toast.success("Foto excluída.");
      qc.invalidateQueries({ queryKey: ["admin-galeria"] });
      qc.invalidateQueries({ queryKey: ["galeria_fotos"] });
    },
  });

  return (
    <div className="px-6 py-10 lg:px-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Acervo visual</p>
          <h1 className="mt-2 font-serif text-4xl">Galeria de fotos</h1>
          <p className="mt-2 text-sm text-muted-foreground">Imagens exibidas em /galeria.</p>
        </div>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-xs uppercase tracking-widest text-ink hover:bg-gold-soft">
          <Plus size={14} /> Nova foto
        </button>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading ? <p className="col-span-full p-8 text-center text-muted-foreground">Carregando…</p>
          : items.length === 0 ? <p className="col-span-full p-12 text-center text-muted-foreground">Nenhuma foto ainda.</p>
          : items.map((f) => (
            <div key={f.id} className="group relative border border-border bg-card">
              {f.imagem_url ? <img src={f.imagem_url} alt={f.titulo} className="aspect-square w-full object-cover" /> : <div className="aspect-square w-full bg-secondary" />}
              <div className="p-3">
                <p className="truncate text-sm font-serif">{f.titulo || <span className="italic text-muted-foreground">sem título</span>}</p>
                {f.tags.length > 0 && <p className="mt-1 truncate text-[10px] text-muted-foreground">{f.tags.join(" · ")}</p>}
              </div>
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                <button onClick={() => setEditing(f)} className="border border-border bg-background/90 p-1.5 backdrop-blur hover:border-gold"><Pencil size={12} /></button>
                <button onClick={() => setConfirmId(f.id)} className="border border-border bg-background/90 p-1.5 text-destructive backdrop-blur hover:border-destructive"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
      </div>

      {editing && (
        <FotoEditor
          initial={editing === "new" ? EMPTY : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin-galeria"] });
            qc.invalidateQueries({ queryKey: ["galeria_fotos"] });
            setEditing(null);
          }}
        />
      )}

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Excluir foto?</AlertDialogTitle>
          <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (confirmId) del.mutate(confirmId); setConfirmId(null); }}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function FotoEditor({ initial, onClose, onSaved }: { initial: FotoInput | Foto; onClose: () => void; onSaved: () => void }) {
  const isEdit = "id" in initial;
  const [form, setForm] = useState<FotoInput>({
    titulo: initial.titulo, descricao: initial.descricao, alt_text: initial.alt_text ?? "", imagem_url: initial.imagem_url,
    tags: initial.tags, ordem: initial.ordem,
  });
  const [tagInput, setTagInput] = useState(form.tags.join(", "));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.imagem_url) { toast.error("Imagem obrigatória."); return; }
    if (!form.alt_text.trim()) { toast.error("Preencha o texto alternativo (acessibilidade)."); return; }
    setSaving(true);
    try {
      const payload = { ...form, tags: tagInput.split(",").map((t) => t.trim()).filter(Boolean) };
      if (isEdit) await updateFoto((initial as Foto).id, payload);
      else await createFoto(payload);
      toast.success("Salvo."); onSaved();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Erro"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur" onClick={onClose}>
      <div className="my-8 w-full max-w-xl border border-border bg-background p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h2 className="font-serif text-3xl">{isEdit ? "Editar foto" : "Nova foto"}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="mt-6 space-y-5">
          <ImageUpload value={form.imagem_url} onChange={(url) => setForm({ ...form, imagem_url: url })} folder="galeria" label="Imagem" aspectRatio={1} />
          <Field label="Título"><input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex.: Altar-mor da Igreja de São Francisco" className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" /></Field>
          <Field label="Legenda — explique a foto em uma frase simples">
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value.slice(0, 200) })}
              rows={3}
              maxLength={200}
              placeholder="Ex.: Altar barroco em ouro entalhado, construído em 1772 na Igreja de São Francisco, em Ouro Preto."
              className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">{form.descricao.length}/200 caracteres · use linguagem simples.</p>
          </Field>
          <Field label="Texto alternativo (acessibilidade) *">
            <input
              value={form.alt_text}
              onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
              required
              maxLength={140}
              placeholder="Descreva a imagem para quem não pode vê-la."
              className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none"
            />
          </Field>
          <Field label="Palavras-chave (separe por vírgula)">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Ex.: mesquita de cuiaba, grande templo, bom despacho"
              className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Use o nome do espaço para a foto aparecer na divisão correta da galeria pública.
            </p>
          </Field>
          <Field label="Ordem de exibição"><input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) || 0 })} className="w-32 border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" /></Field>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="border border-border px-5 py-3 text-xs uppercase tracking-widest hover:bg-secondary">Cancelar</button>
          <button onClick={save} disabled={saving} className="bg-gold px-5 py-3 text-xs uppercase tracking-widest text-ink hover:bg-gold-soft disabled:opacity-50">{saving ? "Salvando…" : "Salvar"}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label><div className="mt-2">{children}</div></div>;
}
