import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeloMedalhao } from "@/components/SeloMedalhao";
import { TEMPLOS, type Templo } from "@/lib/templos";
import {
  useProgresso,
  percentual,
  contarConcluidos,
  trilhaCompleta,
} from "@/lib/trilha-progress";
import { ArrowRight, Compass, Clock, Trophy, Lock, CheckCircle2, PlayCircle, Sparkles } from "lucide-react";

const VISTOS_KEY = "selos-vistos-v1";

export const Route = createFileRoute("/roteiro-fe/")({
  head: () => ({
    meta: [
      { title: "Trilhas de Aprendizagem — Roteiro da Fé de Cuiabá" },
      {
        name: "description",
        content:
          "Três trilhas de aprendizagem interativas sobre os templos icônicos de Cuiabá: o Santuário neogótico (1918), a Mesquita sírio-libanesa (1978) e o monumental Grande Templo (1996). Aprenda, conquiste selos e explore.",
      },
      { property: "og:title", content: "Trilhas de Aprendizagem · Roteiro da Fé de Cuiabá" },
      {
        property: "og:description",
        content: "Escolha uma trilha, complete os módulos e conquiste seu selo de explorador.",
      },
    ],
  }),
  component: TrilhasHub,
});

/** Uma trilha está liberada se for a primeira ou se a anterior estiver 100%. */
function liberada(progresso: Record<string, string[]>, index: number) {
  return index === 0 || trilhaCompleta(progresso, TEMPLOS[index - 1].slug);
}

function TrilhasHub() {
  const progresso = useProgresso();
  const ganhos = TEMPLOS.filter((t) => trilhaCompleta(progresso, t.slug)).map((t) => t.slug);
  const totalSelos = ganhos.length;

  // Detecta selos conquistados desde a última visita para tocar o efeito de estouro.
  const [recem, setRecem] = useState<string[]>([]);
  useEffect(() => {
    let vistos: string[] = [];
    try {
      vistos = JSON.parse(window.localStorage.getItem(VISTOS_KEY) || "[]");
    } catch {
      vistos = [];
    }
    const novos = ganhos.filter((s) => !vistos.includes(s));
    window.localStorage.setItem(VISTOS_KEY, JSON.stringify(ganhos));
    if (novos.length) {
      setRecem(novos);
      const id = window.setTimeout(() => setRecem([]), 1600);
      return () => window.clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ganhos.join(",")]);

  return (
    <div className="min-h-screen bg-ink text-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.45_0.14_255)_0%,transparent_60%)]" />
        <div className="absolute left-1/2 top-0 h-px w-[min(72rem,calc(100%-3rem))] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
          <p className="mb-6 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gold-soft sm:text-xs">
            <Compass size={14} /> Trilhas de Aprendizagem · Cuiabá
          </p>
          <h1 className="mx-auto max-w-3xl font-serif text-4xl leading-[1.08] sm:text-6xl md:text-7xl">
            Conquiste os <em className="text-accent not-italic">selos</em> da fé de Cuiabá.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-background/80 sm:text-lg">
            Três fases, três templos, três medalhas. Complete uma trilha para forjar seu selo e
            desbloquear a próxima fase da jornada.
          </p>

          {/* Passaporte de selos */}
          <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-background/15 bg-background/5 p-6 backdrop-blur sm:p-8">
            <p className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.25em] text-gold-soft">
              <Trophy size={14} className="text-gold" /> Passaporte S.E.N.A.C · {totalSelos}/3
            </p>

            <div className="mt-6 flex items-start justify-center">
              {TEMPLOS.map((t, i) => {
                const ganho = trilhaCompleta(progresso, t.slug);
                return (
                  <Fragment key={t.slug}>
                    <div className="flex w-[33%] max-w-[150px] flex-col items-center gap-3 text-center">
                      <SeloMedalhao
                        slug={t.slug}
                        ganho={ganho}
                        size={84}
                        animar={recem.includes(t.slug)}
                      />
                      <span className="flex flex-col gap-0.5">
                        <span
                          className={`text-[11px] font-semibold leading-tight transition-colors ${
                            ganho ? "text-gold" : "text-background/45"
                          }`}
                        >
                          {ganho ? t.trilha.badge.titulo : "A conquistar"}
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.18em] text-background/40">
                          {t.tipo}
                        </span>
                      </span>
                    </div>

                    {/* Trilho que liga os selos (acende ao concluir) */}
                    {i < TEMPLOS.length - 1 && (
                      <span
                        aria-hidden
                        className={`mt-10 h-[3px] w-6 shrink-0 rounded-full transition-colors duration-700 sm:w-10 ${
                          ganho ? "bg-gold" : "bg-background/15"
                        }`}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Portais das trilhas (fases sequenciais) */}
      <section className="relative pb-28">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-3">
          {TEMPLOS.map((t, i) => (
            <PortalTrilha
              key={t.slug}
              templo={t}
              index={i}
              progresso={progresso}
              destravada={liberada(progresso, i)}
            />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function PortalTrilha({
  templo: t,
  index,
  progresso,
  destravada,
}: {
  templo: Templo;
  index: number;
  progresso: Record<string, string[]>;
  destravada: boolean;
}) {
  const total = t.trilha.passos.length;
  const feitos = contarConcluidos(progresso, t.slug);
  const pct = percentual(progresso, t.slug);
  const completa = trilhaCompleta(progresso, t.slug);
  const iniciada = feitos > 0;
  const anterior = index > 0 ? TEMPLOS[index - 1] : null;

  const corpo = (
    <div className="relative flex h-full flex-col rounded-2xl bg-ink/40 p-7 backdrop-blur-xl sm:p-8">
      <div className="flex items-center justify-between">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 ${
            destravada ? t.tema.realce : "text-white/30"
          }`}
        >
          <t.icon size={22} strokeWidth={1.4} />
        </span>
        {completa ? (
          <SeloMedalhao slug={t.slug} ganho size={44} />
        ) : (
          <span className="font-serif text-4xl leading-none text-white/20">{t.ano}</span>
        )}
      </div>

      <p className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/60">
        <Clock size={12} className="text-gold" /> Fase {index + 1} · {t.tipo}
      </p>
      <h2 className="mt-2 font-serif text-2xl leading-tight text-white">{t.nome}</h2>
      <p className={`mt-2 text-sm font-medium uppercase tracking-wide ${t.tema.realce}`}>
        Foco: {t.trilha.foco}
      </p>

      {destravada ? (
        <>
          {/* Barra de progresso */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-white/70">
              <span>{pct}% concluído</span>
              <span>
                {feitos}/{total} módulos
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${t.tema.barra} transition-[width] duration-700 ease-out`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <span className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-xs font-semibold uppercase tracking-widest text-white transition group-hover:bg-white/15">
            {completa ? (
              <>
                <CheckCircle2 size={15} className="text-gold" /> Revisar fase
              </>
            ) : iniciada ? (
              <>
                <PlayCircle size={15} /> Continuar fase
              </>
            ) : (
              <>
                <Sparkles size={15} className="text-gold" /> Iniciar fase
              </>
            )}
            <ArrowRight size={14} className="transition group-hover:translate-x-1" />
          </span>
        </>
      ) : (
        <div className="mt-6 flex flex-1 flex-col justify-end">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white/60">
            <Lock size={14} className="text-white/40" />
            Conclua a fase “{anterior?.nome}” para desbloquear.
          </div>
        </div>
      )}
    </div>
  );

  // Travada: card estático (sem navegação)
  if (!destravada) {
    return (
      <div
        aria-label={`Fase bloqueada: ${t.nome}`}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-px opacity-70 grayscale"
      >
        {corpo}
      </div>
    );
  }

  // Liberada: portal clicável
  return (
    <Link
      to="/roteiro-fe/$slug"
      params={{ slug: t.slug }}
      aria-label={`Abrir fase: ${t.nome}`}
      className={`group glass-card relative block overflow-hidden rounded-2xl bg-gradient-to-br ${t.tema.gradiente} p-px transition-all duration-300 hover:-translate-y-1.5 focus-visible:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        !iniciada && index > 0 ? "animate-fase-liberada" : ""
      }`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute -inset-10 ${t.tema.halo} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
      />
      {corpo}
    </Link>
  );
}
