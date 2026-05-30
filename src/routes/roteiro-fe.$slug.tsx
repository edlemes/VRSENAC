import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeloMedalhao } from "@/components/SeloMedalhao";
import { getTemplo, getTemplos, getTemploLocalizado, type Badge, type Passo, type Templo } from "@/lib/templos";
import { useI18n } from "@/lib/i18n";
import {
  useProgresso,
  concluirPasso,
  reiniciarTrilha,
  contarConcluidos,
  percentual,
  trilhaCompleta,
} from "@/lib/trilha-progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Lightbulb,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";

export const Route = createFileRoute("/roteiro-fe/$slug")({
  head: ({ params }) => {
    const t = getTemplo(params.slug);
    return {
      meta: [
        {
          title: t
            ? `Trilha: ${t.nome} — ${t.trilha.foco}`
            : "Trilha de Aprendizagem — Roteiro da Fé",
        },
        {
          name: "description",
          content: t
            ? `Linha do tempo de aprendizagem sobre ${t.nome} (${t.ano}). Foco: ${t.trilha.foco}. Complete os módulos e conquiste o selo ${t.trilha.badge.sigla} — ${t.trilha.badge.titulo}.`
            : "Trilha de aprendizagem do Roteiro da Fé de Cuiabá.",
        },
      ],
    };
  },
  component: TrilhaDedicada,
});

function TrilhaDedicada() {
  const { slug } = Route.useParams();
  const { language } = useI18n();
  const progresso = useProgresso();
  const templos = getTemplos(language);
  const templo = getTemploLocalizado(language, slug);

  if (!templo) return <TrilhaNaoEncontrada />;

  // Fases sequenciais: bloqueia se a trilha anterior não estiver concluída.
  const indice = templos.findIndex((x) => x.slug === templo.slug);
  const anterior = indice > 0 ? templos[indice - 1] : null;
  if (anterior && !trilhaCompleta(progresso, anterior.slug)) {
    return <FaseTravada anterior={anterior} atual={templo} />;
  }

  return <TrilhaConteudo templo={templo} />;
}

function TrilhaConteudo({ templo: t }: { templo: Templo }) {
  const { t: tr } = useI18n();
  const progresso = useProgresso();
  const concluidos = progresso[t.slug] ?? [];
  const feitos = contarConcluidos(progresso, t.slug);
  const total = t.trilha.passos.length;
  const pct = percentual(progresso, t.slug);
  const completa = trilhaCompleta(progresso, t.slug);

  const [mostrarSelo, setMostrarSelo] = useState(false);
  const eraCompleta = useRef(completa);

  // Índice do primeiro módulo ainda não compreendido (para destacar o ativo).
  const indiceAtivo = useMemo(
    () => t.trilha.passos.findIndex((p) => !concluidos.includes(p.id)),
    [t.trilha.passos, concluidos],
  );

  // Dispara a revelação do selo na transição para 100%.
  useEffect(() => {
    if (completa && !eraCompleta.current) setMostrarSelo(true);
    eraCompleta.current = completa;
  }, [completa]);

  return (
    <div className="min-h-screen bg-ink text-background">
      <SiteHeader />

      {/* Cabeçalho da trilha */}
      <section className="relative isolate overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${t.tema.gradiente} opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/60 to-ink" />
        <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-10 sm:px-6 sm:pt-14">
          <Link
            to="/roteiro-fe"
            className="inline-flex min-h-12 items-center gap-2 text-xs uppercase tracking-widest text-background/70 transition hover:text-background"
          >
            <ArrowLeft size={14} /> {tr("faith.allTrails")}
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 ${t.tema.realce}`}
            >
              <t.icon size={26} strokeWidth={1.4} />
            </span>
            <div className="min-w-0">
              <p className={`text-[11px] uppercase tracking-[0.25em] ${t.tema.realce}`}>
                {t.ano} · {t.tipo}
              </p>
              <h1 className="mt-1 font-serif text-3xl leading-tight text-white sm:text-4xl">
                {t.nome}
              </h1>
              <p className="mt-2 text-sm font-medium uppercase tracking-wide text-background/70">
                {tr("faith.timeline")} · {t.trilha.foco}
              </p>
            </div>
          </div>

          {/* Selo a conquistar */}
          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <SeloMedalhao slug={t.slug} ganho={completa} size={52} />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold-soft">
                {tr("faith.sealLabel")} {t.trilha.badge.sigla}
              </p>
              <p className="truncate text-sm text-background/80">
                {completa
                  ? `${tr("faith.sealEarned")} ${t.trilha.badge.titulo}`
                  : `${tr("faith.earnAndBecome")} ${t.trilha.badge.titulo}`}
              </p>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-background/70">
              <span>{pct}% {tr("faith.percentDone")}</span>
              <span>
                {feitos}/{total} {tr("faith.modules")}
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${t.tema.barra} transition-[width] duration-700 ease-out`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Linha do tempo de módulos */}
      <section className="relative">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
          <div className="relative">
            {/* Trilho vertical */}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-3 left-6 top-3 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/40 to-transparent"
            />

            <ol>
              {t.trilha.passos.map((passo, i) => {
                const feito = concluidos.includes(passo.id);
                const desbloqueado = i === 0 || concluidos.includes(t.trilha.passos[i - 1].id);
                const ativo = i === indiceAtivo;
                return (
                  <ModuloTimeline
                    key={passo.id}
                    passo={passo}
                    index={i}
                    total={total}
                    feito={feito}
                    desbloqueado={desbloqueado}
                    ativo={ativo}
                    tema={t.tema}
                    onConcluir={() => concluirPasso(t.slug, passo.id)}
                  />
                );
              })}
            </ol>
          </div>

          {/* Selo conquistado (persistente) */}
          {completa && (
            <div
              className={`relative mt-10 overflow-hidden rounded-2xl bg-gradient-to-br ${t.tema.gradiente} p-px`}
            >
              <div className="rounded-2xl bg-ink/50 p-8 text-center backdrop-blur-xl">
                <div className="mx-auto w-fit">
                  <SeloMedalhao slug={t.slug} ganho size={104} />
                </div>
                <p className="mt-5 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.25em] text-gold-soft">
                  <Sparkles size={14} className="text-gold" /> {tr("faith.sealUnlocked")}
                </p>
                <h2 className="mt-2 font-serif text-2xl text-white">
                  {t.trilha.badge.titulo}
                </h2>
                <p className="mt-1 text-xs font-semibold tracking-[0.3em] text-gold">
                  {t.trilha.badge.sigla}
                </p>

                <div className="mt-6">
                  <AcronimoSenac badge={t.trilha.badge} />
                </div>

                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/roteiro-fe"
                    className="inline-flex min-h-12 items-center gap-2 bg-accent px-5 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition hover:opacity-90"
                  >
                    {tr("faith.nextTrail")} <ArrowRight size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => reiniciarTrilha(t.slug)}
                    className="inline-flex min-h-12 items-center gap-2 border border-white/20 px-5 text-xs font-semibold uppercase tracking-widest text-background/80 transition hover:border-white/50 hover:text-white"
                  >
                    <RotateCcw size={13} /> {tr("faith.redo")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navegação para o acervo */}
          <div className="pt-8 text-center">
            <Link
              to="/igrejas"
              className="group inline-flex min-h-12 items-center gap-3 text-xs uppercase tracking-widest text-background/70 transition hover:text-background"
            >
              {tr("faith.seeIn3d")}
              <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Overlay de celebração do selo */}
      {mostrarSelo && <SeloOverlay templo={t} onFechar={() => setMostrarSelo(false)} />}

      <SiteFooter />
    </div>
  );
}

function ModuloTimeline({
  passo,
  index,
  total,
  feito,
  desbloqueado,
  ativo,
  tema,
  onConcluir,
}: {
  passo: Passo;
  index: number;
  total: number;
  feito: boolean;
  desbloqueado: boolean;
  ativo: boolean;
  tema: Templo["tema"];
  onConcluir: () => void;
}) {
  const { t: tr } = useI18n();
  return (
    <li className="relative pb-8 pl-16 last:pb-0 sm:pl-20">
      {/* Nó no trilho */}
      <span
        aria-hidden
        className={`absolute left-6 top-1 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-ink text-sm font-semibold transition-all duration-500 ${
          feito
            ? "border-gold text-gold"
            : ativo
              ? "border-accent text-accent scale-110"
              : desbloqueado
                ? "border-white/30 text-white/70"
                : "border-white/10 text-white/30"
        }`}
      >
        {feito ? (
          <CheckCircle2 size={16} />
        ) : !desbloqueado ? (
          <Lock size={13} />
        ) : (
          index + 1
        )}
      </span>

      {/* Marco da linha do tempo */}
      <p
        className={`mb-2 font-serif text-2xl leading-none transition-colors duration-500 sm:text-3xl ${
          desbloqueado ? "text-gold/70" : "text-white/20"
        }`}
      >
        {passo.marco}
      </p>

      <article
        className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
          feito
            ? "border-gold/40 bg-white/[0.04]"
            : ativo
              ? "border-accent/50 bg-white/[0.05] shadow-[0_0_40px_-18px_var(--accent)]"
              : desbloqueado
                ? "border-white/15 bg-white/[0.04]"
                : "border-white/5 bg-white/[0.02]"
        }`}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6">
          <div className="min-w-0">
            <span className="block text-[10px] uppercase tracking-[0.25em] text-background/50">
              {tr("faith.module")} {index + 1} {tr("faith.of")} {total}
            </span>
            <h2 className="mt-1 font-serif text-xl text-white sm:text-2xl">{passo.titulo}</h2>
          </div>
          {/* Dado de impacto */}
          {desbloqueado && (
            <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-right">
              <p className={`font-serif text-lg leading-none ${tema.realce}`}>{passo.dado.valor}</p>
              <p className="mt-1 text-[9px] uppercase tracking-wide text-background/50">
                {passo.dado.rotulo}
              </p>
            </div>
          )}
        </div>

        {/* Conteúdo: revelado ao desbloquear (transição animada) */}
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            desbloqueado ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-5 pb-6 pt-4 sm:px-6">
              <p className="text-sm leading-7 text-background/85">{passo.texto}</p>

              {/* Destaques em tópicos */}
              <ul className="mt-4 space-y-2">
                {passo.destaques.map((d) => (
                  <li key={d} className="flex gap-2.5 text-sm leading-6 text-background/80">
                    <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current ${tema.realce}`} />
                    {d}
                  </li>
                ))}
              </ul>

              {/* Mini-desafio / curiosidade rápida */}
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] ${tema.realce}`}>
                  <Lightbulb size={13} /> {tr("faith.quickFact")}
                </p>
                <p className="mt-2 text-sm leading-7 text-background/80">{passo.curiosidade}</p>
              </div>

              {/* Marcar como compreendido */}
              {feito ? (
                <p className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
                  <CheckCircle2 size={15} /> {tr("faith.understood")}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={onConcluir}
                  className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-5 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  <CheckCircle2 size={15} /> {tr("faith.markUnderstood")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Aviso de bloqueio */}
        {!desbloqueado && (
          <p className="flex items-center gap-2 px-5 pb-5 text-xs text-background/45 sm:px-6">
            <Lock size={12} /> {tr("faith.unlockPrevious")}
          </p>
        )}
      </article>
    </li>
  );
}

/** Exibe a sigla S.E.N.A.C desdobrada — uma palavra temática por letra. */
function AcronimoSenac({ badge }: { badge: Badge }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {badge.acronimo.map((a) => (
        <div key={a.letra} className="flex w-14 flex-col items-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/40 bg-gold/10 font-serif text-lg font-semibold text-gold">
            {a.letra}
          </span>
          <span className="mt-1.5 text-[9px] uppercase leading-tight tracking-wide text-background/70">
            {a.palavra}
          </span>
        </div>
      ))}
    </div>
  );
}

function SeloOverlay({ templo: t, onFechar }: { templo: Templo; onFechar: () => void }) {
  const { t: tr } = useI18n();
  // Fecha com ESC e bloqueia rolagem de fundo enquanto aberto.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onFechar]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Selo conquistado: ${t.trilha.badge.titulo}`}
      className="animate-fade-in fixed inset-0 z-[60] flex items-center justify-center p-5"
      onClick={onFechar}
    >
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />

      {/* Faíscas decorativas */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            className="animate-sparkle-float absolute text-gold"
            style={{ left: s.left, top: s.top, animationDelay: s.delay, fontSize: s.size }}
          >
            ✦
          </span>
        ))}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br ${t.tema.gradiente} p-px`}
      >
        <div className="relative rounded-3xl bg-ink/70 p-8 text-center backdrop-blur-xl">
          <button
            type="button"
            onClick={onFechar}
            aria-label={tr("faith.close")}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-background/60 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>

          <p className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold-soft">
            <Sparkles size={14} className="text-gold" /> {tr("faith.trailComplete")}
          </p>

          <div className="mx-auto mt-6 w-fit">
            <SeloMedalhao slug={t.slug} ganho size={128} animar />
          </div>

          <h2 className="mt-6 font-serif text-2xl text-white">{t.trilha.badge.titulo}</h2>
          <p className="mt-1 text-xs font-semibold tracking-[0.3em] text-gold">
            {t.trilha.badge.sigla}
          </p>

          <div className="mt-6">
            <AcronimoSenac badge={t.trilha.badge} />
          </div>

          <p className="mt-6 text-sm text-background/80">
            {tr("faith.congratsPrefix")} “{t.trilha.foco}” {tr("faith.congratsConnector")} {t.nome}.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              to="/roteiro-fe"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-accent text-xs font-semibold uppercase tracking-widest text-accent-foreground transition hover:opacity-90"
            >
              {tr("faith.earnAnother")} <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              onClick={onFechar}
              className="inline-flex min-h-12 items-center justify-center text-xs font-semibold uppercase tracking-widest text-background/70 transition hover:text-white"
            >
              {tr("faith.continueHere")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const SPARKLES = [
  { left: "12%", top: "22%", delay: "0s", size: "14px" },
  { left: "82%", top: "18%", delay: "0.3s", size: "20px" },
  { left: "24%", top: "70%", delay: "0.6s", size: "12px" },
  { left: "72%", top: "66%", delay: "0.15s", size: "18px" },
  { left: "50%", top: "12%", delay: "0.45s", size: "16px" },
  { left: "90%", top: "48%", delay: "0.75s", size: "13px" },
  { left: "6%", top: "52%", delay: "0.55s", size: "15px" },
];

function FaseTravada({ anterior, atual }: { anterior: Templo; atual: Templo }) {
  const { t: tr } = useI18n();
  return (
    <div className="min-h-screen bg-ink text-background">
      <SiteHeader />
      <section className="mx-auto flex max-w-xl flex-col items-center px-6 py-28 text-center sm:py-36">
        <span className="grid h-20 w-20 place-items-center rounded-full border-2 border-white/15 bg-white/[0.04] text-white/40">
          <Lock size={30} />
        </span>
        <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-gold-soft">{tr("faith.lockedTitle")}</p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">
          {atual.nome}
        </h1>
        <p className="mt-5 max-w-md text-background/75">
          {tr("faith.lockedDesc1")}{" "}
          <span className="font-semibold text-gold">{anterior.nome}</span> {tr("faith.lockedDesc2")}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/roteiro-fe/$slug"
            params={{ slug: anterior.slug }}
            className="group inline-flex min-h-12 items-center gap-2 bg-accent px-6 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition hover:opacity-90"
          >
            {tr("faith.goPrevious")}
            <ArrowRight size={14} className="transition group-hover:translate-x-1" />
          </Link>
          <Link
            to="/roteiro-fe"
            className="inline-flex min-h-12 items-center gap-2 border border-white/20 px-6 text-xs font-semibold uppercase tracking-widest text-background/80 transition hover:border-white/50 hover:text-white"
          >
            <ArrowLeft size={14} /> {tr("faith.allPhases")}
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function TrilhaNaoEncontrada() {
  const { t: tr } = useI18n();
  return (
    <div className="min-h-screen bg-ink text-background">
      <SiteHeader />
      <section className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
        <h1 className="font-serif text-4xl text-white">{tr("faith.notFoundTitle")}</h1>
        <p className="mt-4 text-background/70">{tr("faith.notFoundDesc")}</p>
        <Link
          to="/roteiro-fe"
          className="mt-8 inline-flex min-h-12 items-center gap-2 bg-accent px-6 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition hover:opacity-90"
        >
          <ArrowLeft size={14} /> {tr("faith.seeAllTrails")}
        </Link>
      </section>
      <SiteFooter />
    </div>
  );
}
