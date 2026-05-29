import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteSolicitacao,
  listSolicitacoes,
  updateSolicitacao,
  type Solicitacao,
  type SolicitacaoStatus,
} from "@/lib/solicitacoes";
import { Mail, Phone, MapPin, Calendar, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/solicitacoes")({
  component: SolicitacoesPage,
});

const STATUSES: { value: SolicitacaoStatus; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "em_analise", label: "Em análise" },
  { value: "aprovado", label: "Aprovado" },
  { value: "recusado", label: "Recusado" },
];

const STATUS_STYLE: Record<SolicitacaoStatus, string> = {
  novo: "bg-gold/20 text-gold",
  em_analise: "bg-accent/20 text-accent",
  aprovado: "bg-emerald-500/20 text-emerald-600",
  recusado: "bg-destructive/20 text-destructive",
};

function SolicitacoesPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["solicitacoes"],
    queryFn: listSolicitacoes,
  });

  const mStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SolicitacaoStatus }) =>
      updateSolicitacao(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["solicitacoes"] }),
  });

  const mNotes = useMutation({
    mutationFn: ({ id, observacoes_admin }: { id: string; observacoes_admin: string }) =>
      updateSolicitacao(id, { observacoes_admin }),
    onSuccess: () => {
      toast.success("Observações salvas.");
      qc.invalidateQueries({ queryKey: ["solicitacoes"] });
    },
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => deleteSolicitacao(id),
    onSuccess: () => {
      toast.success("Solicitação excluída.");
      qc.invalidateQueries({ queryKey: ["solicitacoes"] });
    },
  });

  return (
    <div className="px-6 py-10 lg:px-10">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Captação</p>
      <h1 className="mt-2 font-serif text-4xl">Solicitações de participação</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Igrejas que se candidataram pelo formulário público de parceria.
      </p>

      {isLoading ? (
        <p className="mt-10 text-muted-foreground">Carregando…</p>
      ) : data.length === 0 ? (
        <div className="mt-12 border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          Nenhuma solicitação recebida ainda.
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {data.map((s) => (
            <Item
              key={s.id}
              s={s}
              onStatus={(status) => mStatus.mutate({ id: s.id, status })}
              onSaveNotes={(n) => mNotes.mutate({ id: s.id, observacoes_admin: n })}
              onDelete={() => {
                if (confirm(`Excluir solicitação de ${s.igreja_nome}?`)) mDelete.mutate(s.id);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function Item({
  s,
  onStatus,
  onSaveNotes,
  onDelete,
}: {
  s: Solicitacao;
  onStatus: (st: SolicitacaoStatus) => void;
  onSaveNotes: (n: string) => void;
  onDelete: () => void;
}) {
  return (
    <li className="border border-border bg-card">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {new Date(s.created_at).toLocaleString("pt-BR")}
          </p>
          <h2 className="mt-1 font-serif text-2xl">{s.igreja_nome}</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={12} /> {s.cidade}
            {s.estado && `, ${s.estado}`}
            {s.ano && <><Calendar size={12} className="ml-2" /> {s.ano}</>}
            {s.estilo && <span className="ml-2">· {s.estilo}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-sm px-2 py-1 text-[10px] uppercase tracking-widest ${STATUS_STYLE[s.status]}`}>
            {STATUSES.find((x) => x.value === s.status)?.label ?? s.status}
          </span>
          <select
            value={s.status}
            onChange={(e) => onStatus(e.target.value as SolicitacaoStatus)}
            className="border border-border bg-background px-2 py-1 text-xs"
          >
            {STATUSES.map((st) => (
              <option key={st.value} value={st.value}>{st.label}</option>
            ))}
          </select>
          <button
            onClick={onDelete}
            className="border border-border p-2 text-muted-foreground hover:border-destructive hover:text-destructive"
            aria-label="Excluir"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </header>

      <div className="grid gap-6 p-5 md:grid-cols-3">
        <div className="space-y-3 text-sm">
          <p className="font-medium">{s.responsavel_nome}</p>
          {s.responsavel_papel && <p className="text-xs text-muted-foreground">{s.responsavel_papel}</p>}
          <p className="flex items-center gap-2"><Mail size={12} /> <a href={`mailto:${s.email}`} className="hover:text-gold">{s.email}</a></p>
          {s.telefone && (
            <p className="flex items-center gap-2"><Phone size={12} /> {s.telefone}</p>
          )}
        </div>

        <div className="md:col-span-2 space-y-3 text-sm">
          {s.descricao && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Descrição</p>
              <p className="mt-1 whitespace-pre-wrap">{s.descricao}</p>
            </div>
          )}
          {s.mensagem && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Mensagem</p>
              <p className="mt-1 whitespace-pre-wrap">{s.mensagem}</p>
            </div>
          )}
        </div>
      </div>

      {s.midias.length > 0 && (
        <div className="border-t border-border p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Mídias enviadas ({s.midias.length})
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {s.midias.map((url, i) => {
              const isVideo = /\.(mp4|mov|webm|ogg)(\?|$)/i.test(url);
              return (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden border border-border bg-background"
                >
                  {isVideo ? (
                    <video src={url} className="h-full w-full object-cover" muted />
                  ) : (
                    <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  )}
                  <span className="absolute right-1 top-1 rounded bg-ink/70 p-1 text-background opacity-0 transition group-hover:opacity-100">
                    <ExternalLink size={10} />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-border p-5">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Observações internas
        </p>
        <NotesEditor initial={s.observacoes_admin} onSave={onSaveNotes} />
      </div>
    </li>
  );
}

import { useState, useEffect } from "react";
function NotesEditor({ initial, onSave }: { initial: string; onSave: (n: string) => void }) {
  const [val, setVal] = useState(initial);
  useEffect(() => setVal(initial), [initial]);
  return (
    <div className="mt-2 space-y-2">
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={2}
        className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none"
      />
      {val !== initial && (
        <button
          onClick={() => onSave(val)}
          className="border border-gold px-3 py-1 text-[10px] uppercase tracking-widest text-gold hover:bg-gold hover:text-ink"
        >
          Salvar
        </button>
      )}
    </div>
  );
}
