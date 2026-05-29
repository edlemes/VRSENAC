import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listIgrejas, deleteIgreja } from "@/lib/igrejas";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_admin/admin/igrejas/")({
  component: AdminIgrejasList,
});

function AdminIgrejasList() {
  const qc = useQueryClient();
  const { data: igrejas = [], isLoading } = useQuery({
    queryKey: ["igrejas"],
    queryFn: listIgrejas,
  });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const del = useMutation({
    mutationFn: (id: string) => deleteIgreja(id),
    onSuccess: () => {
      toast.success("Igreja excluída.");
      qc.invalidateQueries({ queryKey: ["igrejas"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao excluir"),
  });

  return (
    <div className="px-6 py-10 lg:px-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Acervo</p>
          <h1 className="mt-2 font-serif text-4xl">Gestão de igrejas</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cadastre, edite e remova os santuários exibidos na vitrine pública.
          </p>
        </div>
        <Link
          to="/admin/igrejas/novo"
          className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-xs uppercase tracking-widest text-ink transition hover:bg-gold-soft"
        >
          <Plus size={14} /> Nova igreja
        </Link>
      </div>

      <div className="mt-10 border border-border bg-card">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Carregando…</div>
        ) : igrejas.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-serif text-2xl">Nenhuma igreja cadastrada</p>
            <Link
              to="/admin/igrejas/novo"
              className="mt-6 inline-flex items-center gap-2 bg-gold px-5 py-3 text-xs uppercase tracking-widest text-ink transition hover:bg-gold-soft"
            >
              <Plus size={14} /> Cadastrar primeira igreja
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/30 text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="p-4">Capa</th>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Cidade / UF</th>
                  <th className="p-4">Estilo</th>
                  <th className="p-4">Destaque</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {igrejas.map((i) => (
                  <tr key={i.id} className="border-b border-border last:border-0">
                    <td className="p-4">
                      {i.imagem_url ? (
                        <img src={i.imagem_url} alt={i.nome} className="h-14 w-20 object-cover" />
                      ) : (
                        <div className="h-14 w-20 bg-secondary" />
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-serif text-base">{i.nome}</div>
                      <div className="text-xs text-muted-foreground">/{i.slug}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">{i.cidade}, {i.estado}</td>
                    <td className="p-4 text-muted-foreground">{i.estilo || "—"}</td>
                    <td className="p-4">
                      {i.destaque && (
                        <span className="inline-flex items-center gap-1 bg-gold/20 px-2 py-1 text-xs text-gold">
                          <Star size={12} /> Em destaque
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to="/admin/igrejas/$id"
                          params={{ id: i.id }}
                          className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs uppercase tracking-widest hover:border-gold hover:text-gold"
                        >
                          <Pencil size={12} /> Editar
                        </Link>
                        <button
                          onClick={() => setConfirmId(i.id)}
                          className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs uppercase tracking-widest text-destructive hover:border-destructive"
                        >
                          <Trash2 size={12} /> Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir igreja?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. A igreja deixará de aparecer na vitrine pública.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmId) del.mutate(confirmId);
                setConfirmId(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
