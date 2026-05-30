import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, ArrowUp, ArrowDown } from "lucide-react";
import { listSlides, createSlide, updateSlide, deleteSlide, type Slide, type SlideInput } from "@/lib/carrossel";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_admin/admin/carrossel")({
  component: AdminCarrossel,
});

const EMPTY: SlideInput = { titulo: "", subtitulo: "", imagem_url: "", link: "", ordem: 0, ativo: true };
const PUBLIC_CAROUSEL_QUERY_KEY = ["home_carrossel", "ativos", "public-v2"] as const;

function AdminCarrossel() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-carrossel"], queryFn: () => listSlides() });
  const [editing, setEditing] = useState<Slide | "new" | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const del = useMutation({
    mutationFn: (id: string) => deleteSlide(id),
    onSuccess: () => {
      toast.success("Slide excluído.");
      qc.invalidateQueries({ queryKey: ["admin-carrossel"] });
      qc.invalidateQueries({ queryKey: PUBLIC_CAROUSEL_QUERY_KEY });
    },
  });

  const reorder = async (slide: Slide, dir: -1 | 1) => {
    await updateSlide(slide.id, { ordem: slide.ordem + dir });
    qc.invalidateQueries({ queryKey: ["admin-carrossel"] });
    qc.invalidateQueries({ queryKey: PUBLIC_CAROUSEL_QUERY_KEY });
  };

  return (
    <div className="px-6 py-10 lg:px-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Home</p>
          <h1 className="mt-2 font-serif text-4xl">Carrossel principal</h1>
          <p className="mt-2 text-sm text-muted-foreground">Slides exibidos no hero da página inicial.</p>
        </div>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-xs uppercase tracking-widest text-ink hover:bg-gold-soft">
          <Plus size={14} /> Novo slide
        </button>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? <p className="col-span-full p-8 text-center text-muted-foreground">Carregando…</p>
          : items.length === 0 ? <p className="col-span-full p-12 text-center text-muted-foreground">Nenhum slide cadastrado.</p>
          : items.map((s) => (
            <div key={s.id} className="border border-border bg-card">
              {s.imagem_url ? <img src={s.imagem_url} alt={s.titulo} className="aspect-[16/9] w-full object-cover" /> : <div className="aspect-[16/9] w-full bg-secondary" />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-serif text-lg leading-tight">{s.titulo || <span className="italic text-muted-foreground">sem título</span>}</p>
                    <p className="text-xs text-muted-foreground">{s.subtitulo}</p>
                  </div>
                  <span className={`shrink-0 px-2 py-1 text-[10px] uppercase ${s.ativo ? "bg-gold/20 text-gold" : "bg-secondary text-muted-foreground"}`}>{s.ativo ? "Ativo" : "Inativo"}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-1">
                  <div className="flex gap-1">
                    <button onClick={() => reorder(s, -1)} className="border border-border p-1.5 hover:border-gold"><ArrowUp size={12} /></button>
                    <button onClick={() => reorder(s, 1)} className="border border-border p-1.5 hover:border-gold"><ArrowDown size={12} /></button>
                    <span className="ml-1 text-xs text-muted-foreground self-center">ordem {s.ordem}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(s)} className="border border-border p-1.5 hover:border-gold"><Pencil size={12} /></button>
                    <button onClick={() => setConfirmId(s.id)} className="border border-border p-1.5 text-destructive hover:border-destructive"><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {editing && (
        <SlideEditor
          initial={editing === "new" ? EMPTY : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin-carrossel"] });
            qc.invalidateQueries({ queryKey: PUBLIC_CAROUSEL_QUERY_KEY });
            setEditing(null);
          }}
        />
      )}

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Excluir slide?</AlertDialogTitle>
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

function SlideEditor({ initial, onClose, onSaved }: { initial: SlideInput | Slide; onClose: () => void; onSaved: () => void }) {
  const isEdit = "id" in initial;
  const [form, setForm] = useState<SlideInput>({
    titulo: initial.titulo, subtitulo: initial.subtitulo, imagem_url: initial.imagem_url,
    link: initial.link, ordem: initial.ordem, ativo: initial.ativo,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.imagem_url) { toast.error("Imagem é obrigatória."); return; }
    setSaving(true);
    try {
      if (isEdit) await updateSlide((initial as Slide).id, form);
      else await createSlide(form);
      toast.success("Salvo."); onSaved();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Erro"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur" onClick={onClose}>
      <div className="my-8 w-full max-w-2xl border border-border bg-background p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h2 className="font-serif text-3xl">{isEdit ? "Editar slide" : "Novo slide"}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="mt-6 space-y-5">
          <ImageUpload value={form.imagem_url} onChange={(url) => setForm({ ...form, imagem_url: url })} folder="carrossel" label="Imagem (1920×1080)" aspectRatio={16 / 9} />
          <Field label="Título (opcional)"><input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" /></Field>
          <Field label="Subtítulo / legenda"><input value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" /></Field>
          <Field label="Link (opcional)"><input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/igrejas/..." className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" /></Field>
          <Field label="Ordem"><input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) || 0 })} className="w-32 border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" /></Field>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} />
            Ativo (exibir na home)
          </label>
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
