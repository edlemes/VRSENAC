import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { listIgrejas } from "@/lib/igrejas";
import candles from "@/assets/candles.jpg";
import mesquitaEntradaVitrais from "@/assets/mesquita-entrada-vitrais.jpg";
import mesquitaFachadaMinarete from "@/assets/mesquita-fachada-minarete.jpg";
import mesquitaSalaOracao from "@/assets/mesquita-sala-oracao.jpg";
import { ArrowRight, Scan, Heart, Landmark, Flame, Users, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Futuro Simulado A Nova Era do Turismo" },
      {
        name: "description",
        content:
          "Visite por dentro as catedrais, basílicas e santuários históricos do Brasil em 3D imersivo. Acenda uma vela, faça uma oração, eternize o patrimônio.",
      },
      { property: "og:title", content: "Futuro Simulado A Nova Era do Turismo" },
      {
        property: "og:description",
        content:
          "Gêmeos digitais de igrejas históricas brasileiras. Onde história, fé e tecnologia se encontram.",
      },
    ],
  }),
  component: Home,
});

type HeroSlide = { src: string; alt: string; legenda?: string };

const fallbackHeroSlides: HeroSlide[] = [
  {
    src: mesquitaFachadaMinarete,
    alt: "Fachada da Mesquita de Cuiabá",
    legenda: "Futuro Simulado · Turismo imersivo",
  },
  {
    src: mesquitaEntradaVitrais,
    alt: "Entrada com vitrais da Mesquita de Cuiabá",
    legenda: "Nova era do turismo · Acervo visual",
  },
  {
    src: mesquitaSalaOracao,
    alt: "Sala de oração registrada para visita virtual",
    legenda: "Experiência digital · Patrimônio preservado",
  },
];

function hasPublicSlideContent(slide: { imagem_url?: string; titulo?: string; subtitulo?: string }) {
  // Título/subtítulo são opcionais: basta a imagem para o slide ser exibido.
  return Boolean(slide.imagem_url?.trim());
}

function CinematicHeroBackdrop({ slides }: { slides: HeroSlide[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setIdx((i) => (i + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 overflow-hidden"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        rootRef.current?.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
        rootRef.current?.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
        rootRef.current?.style.setProperty("--spot-opacity", "1");
      }}
      onPointerLeave={() => {
        rootRef.current?.style.setProperty("--spot-opacity", "0");
      }}
    >
      {slides.map((slide, index) => (
        <img
          key={slide.src + index}
          src={slide.src}
          alt={slide.alt}
          width={1920}
          height={1280}
          loading={index === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
            index === idx ? "opacity-100 animate-ken-burns" : "opacity-0"
          }`}
        />
      ))}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--spot-opacity, 0)",
          background:
            "radial-gradient(circle 22rem at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255, 255, 255, 0.2), rgba(255, 130, 0, 0.08) 28%, transparent 62%)",
          mixBlendMode: "screen",
        }}
      />
      {slides.length > 1 && (
        <>
          <div className="safe-x absolute bottom-20 left-0 z-10 max-w-md px-4 text-[10px] uppercase tracking-[0.18em] text-background/80 transition-opacity duration-700 sm:bottom-6 sm:left-6 sm:px-0 sm:text-xs sm:tracking-[0.25em]">
            {slides[idx]?.legenda}
          </div>
          <div className="safe-x absolute bottom-6 right-0 z-10 flex gap-2 px-4 sm:right-6 sm:px-0">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={`min-h-12 w-10 transition-all ${
                  i === idx ? "bg-accent h-[2px]" : "bg-background/40 hover:bg-background/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Home() {
  const { t, tr } = useI18n();
  const { data: igrejas = [] } = useQuery({
    queryKey: ["igrejas"],
    queryFn: listIgrejas,
  });
  const { data: heroSlides = [] } = useQuery({
    queryKey: ["home_carrossel", "ativos", "public-v2"],
    queryFn: () => import("@/lib/carrossel").then((m) => m.listSlides({ onlyAtivos: true })),
    staleTime: 0,
  });
  const heroSlideTexts = tr<[string, string][]>("home.heroSlides", []);

  let slides: HeroSlide[] = heroSlides
    .filter(hasPublicSlideContent)
    .map((s) => ({
      src: s.imagem_url,
      alt: s.titulo || "Slide",
      legenda: [s.titulo?.trim(), s.subtitulo?.trim()].filter(Boolean).join(" · ") || undefined,
    }));

  if (slides.length === 0) {
    slides = igrejas
      .filter((i) => i.imagem_url)
      .slice(0, 6)
      .map((i) => ({
        src: i.imagem_url,
        alt: i.nome,
        legenda: `${i.nome} · ${i.cidade}/${i.estado}`,
      }));
  }
  if (slides.length === 0) {
    slides = fallbackHeroSlides;
    slides = slides.map((slide, index) => ({
      ...slide,
      alt: heroSlideTexts[index]?.[0] ?? slide.alt,
      legenda: heroSlideTexts[index]?.[1] ?? slide.legenda,
    }));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate overflow-hidden">
        <CinematicHeroBackdrop slides={slides} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/90" />
        <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col justify-end px-4 pb-24 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
          <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-gold-soft sm:mb-6 sm:text-xs sm:tracking-[0.3em]">
            <span className="h-px w-10 bg-accent" /> {t("home.heroEyebrow")}
          </p>
          <h1 className="max-w-4xl font-serif text-4xl leading-[1.05] text-background min-[360px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            {t("home.heroTitlePrefix")} <em className="text-accent not-italic">{t("home.heroTitleEmphasis")}</em> {t("home.heroTitleSuffix")}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-background/80 sm:mt-8 sm:text-lg">
            {t("home.heroText")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/igrejas"
              className="group inline-flex min-h-12 items-center gap-3 bg-accent px-5 text-sm font-medium uppercase tracking-widest text-accent-foreground transition hover:opacity-90 sm:px-7"
            >
              {t("home.exploreCollection")}
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/parceria"
              className="inline-flex min-h-12 items-center gap-3 border border-background/30 px-5 text-sm font-medium uppercase tracking-widest text-background transition hover:bg-background/10 sm:px-7"
            >
              {t("home.churchProject")}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-border bg-background">
        <img
          src={candles}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute left-1/2 top-0 h-px w-[min(72rem,calc(100%-3rem))] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-28">
          <div className="max-w-5xl">
            <p className="divider-ornament mb-8 max-w-xs text-xs uppercase tracking-[0.3em] text-gold">
              {t("home.manifestoEyebrow")}
            </p>
            <div className="relative">
              <span className="pointer-events-none absolute -left-4 top-0 hidden h-24 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent md:block" />
              <span className="pointer-events-none absolute -right-4 bottom-0 hidden h-24 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent md:block" />
              <p className="font-serif text-3xl leading-snug text-foreground sm:text-4xl md:text-5xl">
                {t("home.manifesto")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-border bg-secondary/30">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-14 grid gap-8 md:grid-cols-[1fr_0.72fr] md:items-end">
            <div>
              <div className="mb-5 flex items-center gap-4">
                <span className="h-px w-12 bg-gold/70" />
                <p className="text-xs uppercase tracking-[0.35em] text-gold">{t("home.pillarsEyebrow")}</p>
              </div>
              <h2 className="max-w-xl font-serif text-4xl leading-tight md:text-5xl">
                {t("home.pillarsTitle")}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted-foreground md:justify-self-end">
              {t("home.pillarsIntro")}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {tr<{ title: string; text: string }[]>("home.pillars", []).map((pillar, index) => {
              const icons = [Landmark, Heart, Scan];
              const Icon = icons[index] ?? Landmark;
              const numero = String(index + 1).padStart(2, "0");

              return (
              <div
                key={pillar.title}
                className="group relative overflow-hidden border border-border/80 bg-background/80 p-8 shadow-[0_18px_55px_rgba(15,23,42,0.04)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-background hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-9"
              >
                <span className="absolute right-6 top-5 font-serif text-5xl leading-none text-gold/10 transition group-hover:text-gold/20">
                  {numero}
                </span>
                <div className="flex h-12 w-12 items-center justify-center border border-gold/25 bg-gold/10 text-gold">
                  <Icon size={22} strokeWidth={1.35} />
                </div>
                <div className="mt-8 h-px w-12 bg-gold/35 transition group-hover:w-20" />
                <h3 className="mt-6 font-serif text-2xl text-foreground">{pillar.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{pillar.text}</p>
                <div
                  className={`pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent transition ${
                    index === 1 ? "opacity-80" : "opacity-30"
                  }`}
                />
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink text-background">
        <img
          src={candles}
          alt="Velas acesas em capela"
          width={1280}
          height={800}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-28 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">{t("home.devotionEyebrow")}</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">
              {t("home.devotionTitle")}
            </h2>
            <p className="mt-6 max-w-xl text-background/80">
              {t("home.devotionText")}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-background/70">
                <Flame size={18} className="text-gold" /> {t("home.instantPix")}
              </span>
              <span className="flex items-center gap-2 text-background/70">
                <Heart size={18} className="text-gold" /> {t("home.parishShare")}
              </span>
              <span className="flex items-center gap-2 text-background/70">
                <Sparkles size={18} className="text-gold" /> {t("home.customIntention")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-16 max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">{t("home.audienceEyebrow")}</p>
            <h2 className="font-serif text-4xl md:text-5xl">
              {t("home.audienceTitle")}
            </h2>
          </div>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {tr<[string, string][]>("home.audiences", []).map(([title, description]) => (
              <div key={title} className="border-t border-border pt-6">
                <Users size={18} className="text-gold" strokeWidth={1.4} />
                <h3 className="mt-4 font-serif text-xl">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{t("home.journeyEyebrow")}</p>
          <h2 className="mt-6 max-w-3xl font-serif text-4xl md:text-6xl">
            {t("home.journeyTitle")}
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/igrejas"
              className="inline-flex items-center gap-3 bg-ink px-7 py-4 text-sm uppercase tracking-widest text-background transition hover:bg-foreground"
            >
              {t("home.fullCollection")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
