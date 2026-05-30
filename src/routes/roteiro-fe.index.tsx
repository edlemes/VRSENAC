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

function GrandeTemploVectorIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 104 104"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    >
      <path d="M18 76H86" />
      <path d="M24 67H79" />
      <path d="M25 66V53C25 41 37 32 53 32C69 32 81 41 81 53V66" />
      <path d="M30 53C36 45 44 41 53 41C62 41 70 45 76 53" />
      <path d="M29 66V56H76V66" />
      <path d="M36 66V57" />
      <path d="M45 66V57" />
      <path d="M54 66V57" />
      <path d="M63 66V57" />
      <path d="M72 66V57" />
      <path d="M58 76V28" />
      <path d="M55 28H61" />
      <path d="M56 23H60" />
      <path d="M38 76V68" />
      <path d="M50 76V68" />
      <path d="M62 76V68" />
      <path d="M74 76V68" />
    </svg>
  );
}

type TempleWatermarkKind = "catolico" | "islamico" | "evangelico";

function TempleArchitectureWatermark({
  kind,
  className = "",
}: {
  kind: TempleWatermarkKind;
  className?: string;
}) {
  const paths = {
    catolico: (
      <>
        <path d="M76 430V166L240 42L404 166V430" />
        <path d="M128 430V212C128 164 176 126 240 126C304 126 352 164 352 212V430" />
        <path d="M42 430V194L98 142L154 194V430" />
        <path d="M326 430V194L382 142L438 194V430" />
        <path d="M240 42V8M218 24H262" />
        <path d="M98 142V64M82 84H114" />
        <path d="M382 142V64M366 84H398" />
        <path d="M188 430V272C188 244 210 220 240 220C270 220 292 244 292 272V430" />
        <path d="M76 166H404M128 212H352M42 194H154M326 194H438" />
        <path d="M240 126V430" strokeDasharray="10 18" />
        <path d="M178 102C214 72 266 72 302 102" />
      </>
    ),
    islamico: (
      <>
        <path d="M70 430H410" />
        <path d="M112 430V244H330V430" />
        <path d="M112 244C124 148 172 92 222 92C272 92 318 148 330 244" />
        <path d="M154 244V430M288 244V430M154 318H288" />
        <path d="M358 430V78" />
        <path d="M330 78H386M344 46H372" />
        <path d="M382 92C426 112 424 178 382 198" />
        <path d="M126 244H346" />
        <path d="M188 78C202 54 214 38 222 10C230 38 242 54 256 78" />
      </>
    ),
    evangelico: (
      <>
        <path d="M42 430H438" />
        <path d="M74 392H408" />
        <path d="M82 388V244C82 138 150 76 242 76C334 76 404 138 404 244V388" />
        <path d="M110 246C142 174 184 142 242 142C300 142 342 174 374 246" />
        <path d="M104 388V276H380V388" />
        <path d="M142 388V284M184 388V284M226 388V284M268 388V284M310 388V284M352 388V284" />
        <path d="M242 430V54" />
        <path d="M222 54H262M230 30H254" />
        <path d="M126 430V396M184 430V396M242 430V396M300 430V396M358 430V396" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 480 460"
      className={`architectural-watermark architectural-watermark-${kind} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="8"
    >
      {paths[kind]}
    </svg>
  );
}

function TempleSealWatermark({
  kind,
  className = "",
}: {
  kind: TempleWatermarkKind;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={`temple-seal-watermark temple-seal-watermark-${kind} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="60" cy="60" r="55" strokeWidth="3" />
      <circle cx="60" cy="60" r="49" strokeWidth="2" strokeDasharray="1.5 4.2" />
      <circle cx="60" cy="60" r="43" strokeWidth="1.3" />
      <path d="M16 87C24 106 41 116 60 116C79 116 96 106 104 87" stroke="#ff7e00" strokeWidth="3" />

      <g strokeWidth="2.3">
        {kind === "catolico" && (
          <>
            <path d="M44 84V56Q44 38 60 31Q76 38 76 56V84" />
            <path d="M60 31V22M55 25H65" />
            <circle cx="60" cy="60" r="9" strokeWidth="1.8" />
            <path d="M60 51V69M51 60H69" strokeWidth="1.6" />
          </>
        )}

        {kind === "islamico" && (
          <>
            <path d="M44 86V54Q44 38 60 32Q76 38 76 54V86" />
            <path d="M60 32Q54 24 62 17Q59 25 67 27Q61 29 60 32" strokeWidth="1.7" />
            <path d="M36 86V57M32 57H40" />
            <path d="M84 86V57M80 57H88" />
          </>
        )}

        {kind === "evangelico" && (
          <>
            <path d="M24 86H96" />
            <path d="M31 77H87" />
            <path d="M32 76V61C32 47 44 38 61 38C78 38 90 47 90 61V76" />
            <path d="M37 61C43 52 52 48 61 48C70 48 78 52 84 61" />
            <path d="M36 76V64H84V76" />
            <path d="M43 76V65M52 76V65M61 76V65M70 76V65M79 76V65" />
            <path d="M66 86V31M63 31H69M64 25H68" />
          </>
        )}
      </g>
    </svg>
  );
}

function watermarkKind(slug: string): TempleWatermarkKind {
  if (slug === "mesquita-cuiaba") return "islamico";
  if (slug === "grande-templo") return "evangelico";
  return "catolico";
}

function FaithRouteBackdrop() {
  return (
    <div className="faith-route-backdrop absolute inset-0 z-0" aria-hidden>
      <TempleArchitectureWatermark kind="catolico" className="faith-route-backdrop-shape faith-route-backdrop-shape-left" />
      <TempleArchitectureWatermark kind="islamico" className="faith-route-backdrop-shape faith-route-backdrop-shape-center" />
      <TempleArchitectureWatermark kind="evangelico" className="faith-route-backdrop-shape faith-route-backdrop-shape-right" />
    </div>
  );
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
    <div className="faith-route-page relative isolate min-h-screen text-background">
      <SiteHeader />
      <FaithRouteBackdrop />

      {/* Hero */}
      <section className="relative z-10 isolate overflow-hidden">
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
      <section className="relative z-10 overflow-hidden pb-28">
        <div className="faith-route-grid mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-3">
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
    <div className="faith-route-card-body relative p-7 sm:p-8">
      <TempleSealWatermark kind={watermarkKind(t.slug)} className="faith-card-watermark" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 ${
              destravada ? t.tema.realce : "text-white/30"
            }`}
          >
            {t.slug === "grande-templo" ? (
              <GrandeTemploVectorIcon size={27} />
            ) : (
              <t.icon size={22} strokeWidth={1.4} />
            )}
          </span>
          {completa ? (
            <SeloMedalhao slug={t.slug} ganho size={44} />
          ) : (
            <span className="font-serif text-4xl leading-none text-white/20">{t.ano}</span>
          )}
        </div>

        <p className="mt-6 flex min-h-8 items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/60">
          <Clock size={12} className="text-gold" /> Fase {index + 1} · {t.tipo}
        </p>
        <h2 className="faith-route-title mt-2 font-serif text-2xl leading-tight text-white">{t.nome}</h2>
        <p className={`faith-route-focus mt-2 text-sm font-medium uppercase tracking-wide ${t.tema.realce}`}>
          Foco: {t.trilha.foco}
        </p>
      </div>

      {destravada ? (
        <div className="relative z-10">
          {/* Barra de progresso */}
          <div className="mt-8">
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

          <span className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-xs font-semibold uppercase tracking-widest text-white transition group-hover:bg-white/15">
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
        </div>
      ) : (
        <div className="relative z-10 mt-8">
          <div className="flex min-h-16 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white/60">
            <Lock size={14} className="text-white/40" />
            <span className="faith-route-lock-text">Conclua a fase “{anterior?.nome}” para desbloquear.</span>
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
        className="faith-route-card relative h-full overflow-hidden p-px opacity-70 grayscale"
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
      className={`faith-route-card group glass-card relative block h-full overflow-hidden p-px hover:-translate-y-1.5 focus-visible:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
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
