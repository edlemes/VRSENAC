import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useState } from "react";
import { Check, ShieldCheck, Coins, Megaphone, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  createSolicitacao,
  uploadSolicitacaoMidia,
  type SolicitacaoInput,
} from "@/lib/solicitacoes";

export const Route = createFileRoute("/parceria")({
  head: () => ({
    meta: [
      { title: "Para Igrejas e Paróquias — Sagrado Digital" },
      {
        name: "description",
        content:
          "Cadastre sua igreja e envie fotos e vídeos para entrar no acervo de tours virtuais 360° do Senac MT.",
      },
      { property: "og:title", content: "Eternize sua paróquia — Sagrado Digital" },
      {
        property: "og:description",
        content:
          "Solicite a participação da sua igreja no programa de tours virtuais 360°. Envio de ficha e mídias em um único formulário.",
      },
    ],
  }),
  component: Parceria,
});

type Form = {
  responsavel_nome: string;
  responsavel_papel: string;
  email: string;
  telefone: string;
  igreja_nome: string;
  cidade: string;
  estado: string;
  ano: string;
  estilo: string;
  descricao: string;
  mensagem: string;
};

const EMPTY: Form = {
  responsavel_nome: "",
  responsavel_papel: "",
  email: "",
  telefone: "",
  igreja_nome: "",
  cidade: "",
  estado: "",
  ano: "",
  estilo: "",
  descricao: "",
  mensagem: "",
};

function Parceria() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function update<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next: File[] = [];
    for (const f of Array.from(list)) {
      if (f.size > 25 * 1024 * 1024) {
        toast.error(`${f.name}: arquivo maior que 25MB.`);
        continue;
      }
      next.push(f);
    }
    setFiles((cur) => [...cur, ...next].slice(0, 10));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.responsavel_nome.trim() || !form.email.trim() || !form.igreja_nome.trim() || !form.cidade.trim()) {
      toast.error("Preencha pelo menos nome, e-mail, igreja e cidade.");
      return;
    }
    setUploading(true);
    try {
      const midias: string[] = [];
      for (const f of files) {
        const url = await uploadSolicitacaoMidia(f);
        midias.push(url);
      }
      const payload: SolicitacaoInput = { ...form, midias };
      await createSolicitacao(payload);
      setEnviado(true);
      setForm(EMPTY);
      setFiles([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar solicitação.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Para Paróquias</p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">
              Sua igreja, eternizada em pixels.
            </h1>
            <p className="mt-8 text-lg text-muted-foreground">
              Cadastre a ficha do seu santuário e envie fotos e vídeos para que nossa equipe avalie
              a inclusão no acervo de tours virtuais 360°. O escaneamento, a produção do tour e a
              hospedagem do gêmeo digital são oferecidos sem custo no programa piloto.
            </p>
            <ul className="mt-10 space-y-3 text-sm">
              {[
                "Escaneamento profissional LIDAR + fotogrametria",
                "Hospedagem e domínio permanente",
                "Painel de gestão das ofertas via Pix",
                "Curadoria histórica com seu pároco",
                'Selo "Patrimônio Eternizado"',
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-gold" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border bg-card p-8 lg:p-10">
            {enviado ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <ShieldCheck size={48} className="text-gold" strokeWidth={1.2} />
                <h2 className="mt-6 font-serif text-3xl">Recebido com fé.</h2>
                <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                  Sua solicitação chegou ao painel da equipe. Entraremos em contato em até 48h
                  para conhecer sua paróquia e agendar a visita técnica.
                </p>
                <button
                  onClick={() => setEnviado(false)}
                  className="mt-8 border border-border px-4 py-2 text-[11px] uppercase tracking-widest text-muted-foreground hover:border-gold hover:text-foreground"
                >
                  Enviar outra solicitação
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <p className="text-xs uppercase tracking-widest text-gold">Solicitação de participação</p>
                <h2 className="font-serif text-3xl">Quero eternizar minha paróquia</h2>

                <Field label="Nome do responsável *" value={form.responsavel_nome} onChange={(v) => update("responsavel_nome", v)} placeholder="Pe. João..." />
                <Field label="Função / papel" value={form.responsavel_papel} onChange={(v) => update("responsavel_papel", v)} placeholder="Pároco, secretária, leigo..." />
                <Field label="E-mail de contato *" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="paroquia@..." />
                <Field label="Telefone / WhatsApp" type="tel" value={form.telefone} onChange={(v) => update("telefone", v)} placeholder="(00) 00000-0000" />

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Nome da igreja *" value={form.igreja_nome} onChange={(v) => update("igreja_nome", v)} placeholder="Paróquia de..." />
                  <Field label="Ano de construção" value={form.ano} onChange={(v) => update("ano", v)} placeholder="Ex.: 1873" />
                </div>

                <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
                  <Field label="Cidade *" value={form.cidade} onChange={(v) => update("cidade", v)} placeholder="São João del-Rei" />
                  <Field label="Estado" value={form.estado} onChange={(v) => update("estado", v)} placeholder="MG" />
                </div>

                <Field label="Estilo arquitetônico" value={form.estilo} onChange={(v) => update("estilo", v)} placeholder="Barroco, neogótico, colonial..." />

                <TextArea label="Descrição do templo" value={form.descricao} onChange={(v) => update("descricao", v)} placeholder="Padroeiro, particularidades, relíquias, festas..." rows={3} />
                <TextArea label="Mensagem para a equipe" value={form.mensagem} onChange={(v) => update("mensagem", v)} placeholder="Como podemos te ajudar?" rows={2} />

                {/* MÍDIAS */}
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Fotos e vídeos do santuário
                  </label>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Até 10 arquivos, 25MB cada. JPG, PNG, MP4, MOV.
                  </p>
                  <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 border border-dashed border-border px-4 py-6 text-xs uppercase tracking-widest text-muted-foreground transition hover:border-gold hover:text-foreground">
                    <Upload size={14} />
                    Selecionar arquivos
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => addFiles(e.target.files)}
                    />
                  </label>
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center justify-between gap-2 border border-border bg-background px-3 py-2 text-xs">
                          <span className="truncate">{f.name} <span className="text-muted-foreground">· {(f.size / 1024 / 1024).toFixed(1)}MB</span></span>
                          <button
                            type="button"
                            onClick={() => setFiles((cur) => cur.filter((_, idx) => idx !== i))}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Remover"
                          >
                            <X size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="mt-4 flex w-full items-center justify-center gap-2 bg-ink py-4 text-sm uppercase tracking-widest text-background transition hover:bg-foreground disabled:opacity-60"
                >
                  {uploading ? <><Loader2 size={14} className="animate-spin" /> Enviando…</> : "Enviar solicitação"}
                </button>
                <p className="text-center text-[10px] text-muted-foreground">
                  Ao enviar, você autoriza o Senac MT a contatar a paróquia para fins do programa.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Sustentabilidade</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl">
            Um projeto que sustenta a si mesmo — e ao templo físico.
          </h2>
          <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
            {[
              { icon: Coins, t: "Parcerias institucionais", d: "Prefeituras, dioceses, secretarias de turismo, IPHAN. Lei Rouanet, Aldir Blanc, PRONAC." },
              { icon: ShieldCheck, t: "Devoção digital", d: "Velas virtuais, doações via Pix e missas de intenção — 70% para a paróquia parceira." },
              { icon: Megaphone, t: "Comércio local", d: "Marketplace de artesanato sacro, hospedagens e guias próximos a cada santuário." },
            ].map((m) => (
              <div key={m.t} className="bg-background p-8">
                <m.icon size={28} className="text-gold" strokeWidth={1.4} />
                <h3 className="mt-6 font-serif text-2xl">{m.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={250}
        className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={2000}
        className="mt-2 w-full border border-border bg-transparent p-3 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}
