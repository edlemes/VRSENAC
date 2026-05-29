import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getIgrejaById, updateIgreja, type IgrejaInput } from "@/lib/igrejas";
import { IgrejaForm } from "@/components/admin/IgrejaForm";
import { TourManager } from "@/components/admin/TourManager";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/igrejas/$id")({
  component: EditarIgreja,
});

function EditarIgreja() {
  const { id } = useParams({ from: "/_admin/admin/igrejas/$id" });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: igreja, isLoading } = useQuery({
    queryKey: ["igreja-id", id],
    queryFn: () => getIgrejaById(id),
  });
  const m = useMutation({
    mutationFn: (input: IgrejaInput) => updateIgreja(id, input),
    onSuccess: () => {
      toast.success("Alterações salvas.");
      qc.invalidateQueries({ queryKey: ["igrejas"] });
      qc.invalidateQueries({ queryKey: ["igreja-id", id] });
      navigate({ to: "/admin" });
    },
    onError: (e) => {
      const msg = e instanceof Error ? e.message : "Erro ao salvar";
      toast.error(msg.includes("duplicate") ? "Já existe uma igreja com este slug." : msg);
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={12} /> Voltar ao painel
      </Link>
      <h1 className="mt-4 font-serif text-4xl">Editar igreja</h1>
      <div className="mt-10 space-y-12">
        {isLoading || !igreja ? (
          <p className="text-muted-foreground">Carregando…</p>
        ) : (
          <>
            <IgrejaForm
              initial={igreja}
              saving={m.isPending}
              submitLabel="Salvar alterações"
              onSubmit={(input) => m.mutateAsync(input)}
            />
            <TourManager
              igrejaId={igreja.id}
              igrejaSlug={igreja.slug}
              cenaInicialId={igreja.cena_inicial_id}
            />
          </>
        )}
      </div>
    </div>
  );
}
