import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { listNoticias, createNoticia, updateNoticia, deleteNoticia, type Noticia, type NoticiaInput } from "@/lib/noticias";
import { slugify } from "@/lib/igrejas";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_admin/admin/noticias")({
  component: AdminNoticias,
});

const EMPTY: NoticiaInput = {
  slug: "", titulo: "", resumo: "", conteudo: "", imagem_url: "",
  publicado: false, publicado_em: null,
};

function AdminNoticias() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-noticias"], queryFn: () => listNoticias() });
  const [editing, setEditing] = useState<Noticia | "new" | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const del = useMutation({
    mutationFn: (id: string) => deleteNoticia(id),
    onSuccess: () => { toast.success("Notícia excluída."); qc.invalidateQueries({ queryKey: ["admin-noticias"] }); qc.invalidateQueries({ queryKey: ["noticias-pub"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  return (
    <div className="px-6 py-10 lg:px-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Conteúdo</p>
          <h1 className="mt-2 font-serif text-4xl">Notícias</h1>
          <p className="mt-2 text-sm text-muted-foreground">Cards exibidos na home e na página /noticias.</p>
        </div>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-xs uppercase tracking-widest text-ink hover:bg-gold-soft">
          <Plus size={14} /> Nova notícia
        </button>
      </div>

      <div className="mt-10 border border-border bg-card">
        {isLoading ? <p className="p-8 text-center text-muted-foreground">Carregando…</p>
          : items.length === 0 ? <p className="p-12 text-center text-muted-foreground">Nenhuma notícia cadastrada.</p>
          : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/30 text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="p-4">Capa</th><th className="p-4">Título</th>
                  <th className="p-4">Status</th><th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((n) => (
                  <tr key={n.id} className="border-b border-border last:border-0">
                    <td className="p-4">{n.imagem_url ? <img src={n.imagem_url} alt="" className="h-14 w-20 object-cover" /> : <div className="h-14 w-20 bg-secondary" />}</td>
                    <td className="p-4"><div className="font-serif">{n.titulo}</div><div className="text-xs text-muted-foreground">/{n.slug}</div></td>
                    <td className="p-4"><span className={`px-2 py-1 text-xs ${n.publicado ? "bg-gold/20 text-gold" : "bg-secondary text-muted-foreground"}`}>{n.publicado ? "Publicado" : "Rascunho"}</span></td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing(n)} className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs uppercase tracking-widest hover:border-gold hover:text-gold"><Pencil size={12} /> Editar</button>
                        <button onClick={() => setConfirmId(n.id)} className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs uppercase tracking-widest text-destructive hover:border-destructive"><Trash2 size={12} /> Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      {editing && (
        <NoticiaEditor
          initial={editing === "new" ? EMPTY : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { qc.invalidateQueries({ queryKey: ["admin-noticias"] }); qc.invalidateQueries({ queryKey: ["noticias-pub"] }); setEditing(null); }}
        />
      )}

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir notícia?</AlertDialogTitle>
            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (confirmId) del.mutate(confirmId); setConfirmId(null); }}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function NoticiaEditor({ initial, onClose, onSaved }: { initial: NoticiaInput | Noticia; onClose: () => void; onSaved: () => void }) {
  const isEdit = "id" in initial;
  const [form, setForm] = useState<NoticiaInput>({
    slug: initial.slug, titulo: initial.titulo, resumo: initial.resumo, conteudo: initial.conteudo,
    imagem_url: initial.imagem_url, publicado: initial.publicado, publicado_em: initial.publicado_em,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.titulo.trim()) { toast.error("Título obrigatório."); return; }
    const slug = form.slug.trim() || slugify(form.titulo);
    setSaving(true);
    try {
      const payload: NoticiaInput = {
        ...form,
        slug,
        publicado_em: form.publicado ? (form.publicado_em || new Date().toISOString()) : null,
      };
      if (isEdit) await updateNoticia((initial as Noticia).id, payload);
      else await createNoticia(payload);
      toast.success("Salvo.");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur" onClick={onClose}>
      <div className="my-8 w-full max-w-3xl border border-border bg-background p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h2 className="font-serif text-3xl">{isEdit ? "Editar notícia" : "Nova notícia"}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="mt-6 space-y-5">
          <Field label="Título"><input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" /></Field>
          <Field label="Slug (URL)"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={slugify(form.titulo)} className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" /></Field>
          <Field label="Resumo"><textarea value={form.resumo} onChange={(e) => setForm({ ...form, resumo: e.target.value })} rows={2} className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" /></Field>
          <Field label="Conteúdo (markdown / texto)"><textarea value={form.conteudo} onChange={(e) => setForm({ ...form, conteudo: e.target.value })} rows={10} className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" /></Field>
          <ImageUpload value={form.imagem_url} onChange={(url) => setForm({ ...form, imagem_url: url })} folder="noticias" label="Imagem de capa" aspectRatio={16 / 9} />
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={form.publicado} onChange={(e) => setForm({ ...form, publicado: e.target.checked })} />
            Publicado
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
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
