import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIgreja, type IgrejaInput } from "@/lib/igrejas";
import { IgrejaForm } from "@/components/admin/IgrejaForm";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/igrejas/novo")({
  component: NovaIgreja,
});

function NovaIgreja() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (input: IgrejaInput) => createIgreja(input),
    onSuccess: () => {
      toast.success("Igreja cadastrada.");
      qc.invalidateQueries({ queryKey: ["igrejas"] });
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
      <h1 className="mt-4 font-serif text-4xl">Nova igreja</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Preencha os dados do santuário para adicioná-lo ao acervo público.
      </p>
      <div className="mt-10">
        <IgrejaForm
          saving={m.isPending}
          submitLabel="Cadastrar igreja"
          onSubmit={(input) => m.mutateAsync(input)}
        />
      </div>
    </div>
  );
}
