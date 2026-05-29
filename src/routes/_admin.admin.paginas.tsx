import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listPaginas, updatePagina, type Pagina } from "@/lib/paginas";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/_admin/admin/paginas")({
  component: AdminPaginas,
});

function AdminPaginas() {
  const qc = useQueryClient();
  const { data: paginas = [], isLoading } = useQuery({ queryKey: ["admin-paginas"], queryFn: listPaginas });
  const [active, setActive] = useState<"sobre" | "parceria">("sobre");
  const pagina = paginas.find((p) => p.chave === active);

  return (
    <div className="px-6 py-10 lg:px-10">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Conteúdo institucional</p>
        <h1 className="mt-2 font-serif text-4xl">Páginas</h1>
        <p className="mt-2 text-sm text-muted-foreground">Edite os textos das páginas Sobre e Parceria.</p>
      </div>

      <div className="mt-8 flex gap-1 border border-border w-fit">
        {(["sobre", "parceria"] as const).map((k) => (
          <button key={k} onClick={() => setActive(k)} className={`px-5 py-2 text-xs uppercase tracking-widest ${active === k ? "bg-gold text-ink" : "text-muted-foreground hover:text-foreground"}`}>
            {k === "sobre" ? "Sobre" : "Parceria"}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {isLoading ? <p className="text-muted-foreground">Carregando…</p>
          : pagina ? <PaginaEditor key={pagina.id} pagina={pagina} onSaved={() => qc.invalidateQueries({ queryKey: ["admin-paginas"] })} />
          : <p className="text-muted-foreground">Página não encontrada.</p>}
      </div>
    </div>
  );
}

function PaginaEditor({ pagina, onSaved }: { pagina: Pagina; onSaved: () => void }) {
  const [form, setForm] = useState({
    titulo: pagina.titulo, subtitulo: pagina.subtitulo,
    conteudo: pagina.conteudo, hero_imagem_url: pagina.hero_imagem_url,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      titulo: pagina.titulo, subtitulo: pagina.subtitulo,
      conteudo: pagina.conteudo, hero_imagem_url: pagina.hero_imagem_url,
    });
  }, [pagina.id]);

  const save = async () => {
    setSaving(true);
    try {
      await updatePagina(pagina.id, form);
      toast.success("Salvo.");
      onSaved();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Erro"); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-3xl space-y-5 border border-border bg-card p-8">
      <Field label="Subtítulo / Eyebrow"><input value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" /></Field>
      <Field label="Título principal"><input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" /></Field>
      <Field label="Conteúdo (texto livre)"><textarea value={form.conteudo} onChange={(e) => setForm({ ...form, conteudo: e.target.value })} rows={12} className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" /></Field>
      <ImageUpload value={form.hero_imagem_url} onChange={(url) => setForm({ ...form, hero_imagem_url: url })} folder="paginas" label="Imagem hero (opcional)" />
      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="bg-gold px-6 py-3 text-xs uppercase tracking-widest text-ink hover:bg-gold-soft disabled:opacity-50">{saving ? "Salvando…" : "Salvar alterações"}</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label><div className="mt-2">{children}</div></div>;
}
