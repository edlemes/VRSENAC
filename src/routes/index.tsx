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
import { Scan, Heart, Landmark, Flame, Users, Sparkles, Accessibility, HandHeart, MapPinCheck, MousePointerClick, Cpu, ArrowRight } from "lucide-react";
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

function SacredSymbolStrip() {
  const symbols = [
    {
      label: "Manifestacao catolica",
      icon: (
        <>
          <path d="M30 76V38L52 20L74 38V76" />
          <path d="M40 76V48C40 40.9 45.4 35 52 35C58.6 35 64 40.9 64 48V76" />
          <path d="M52 17V8" />
          <path d="M45 14H59" />
          <circle cx="52" cy="54" r="10.5" />
          <path d="M52 43.5V64.5" />
          <path d="M43 54H61" />
        </>
      ),
    },
    {
      label: "Manifestacao islamica",
      icon: (
        <>
          <path d="M25 76H79" />
          <path d="M35 76V49C35 39.6 42.6 32 52 32C61.4 32 69 39.6 69 49V76" />
          <path d="M42 76V56H62V76" />
          <path d="M76 76V34" />
          <path d="M76 34C70 30 70 23 76 19C73 25 76 29 83 29" />
          <path d="M32 49H72" />
          <path d="M45 26C47.5 21.5 50 19 52 13C54 19 56.5 21.5 59 26" />
        </>
      ),
    },
    {
      label: "Manifestacao evangelica",
      icon: (
        <>
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
        </>
      ),
    },
  ];

  return (
    <section className="relative px-6 pb-4 pt-16 md:pb-6 md:pt-24">
      <style>{`
        .sacred-vector-line {
          stroke-dasharray: 260;
          stroke-dashoffset: 260;
          animation: sacred-vector-draw 5.8s ease-in-out infinite;
        }

        .sacred-vector-ring {
          stroke-dasharray: 18 8;
          animation: sacred-vector-spin 18s linear infinite;
          transform-origin: center;
        }

        .sacred-vector-mark {
          opacity: 0.75;
          transform: scale(0.88);
          transform-origin: center;
          animation: sacred-vector-pop 5.8s ease-in-out infinite;
        }

        @keyframes sacred-vector-draw {
          0% {
            opacity: 0.18;
            stroke-dashoffset: 260;
          }
          38% {
            opacity: 1;
            stroke-dashoffset: 0;
          }
          74% {
            opacity: 1;
            stroke-dashoffset: 0;
          }
          100% {
            opacity: 0.18;
            stroke-dashoffset: -260;
          }
        }

        @keyframes sacred-vector-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes sacred-vector-pop {
          0%, 24% {
            opacity: 0;
            transform: scale(0.72);
          }
          42%, 78% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.82);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sacred-vector-line,
          .sacred-vector-ring,
          .sacred-vector-mark {
            animation: none;
            opacity: 1;
            stroke-dashoffset: 0;
            transform: none;
          }
        }
      `}</style>
      <div className="mx-auto max-w-5xl">
        <div className="relative flex items-center justify-center gap-3 sm:gap-8 md:gap-12">
          <div className="pointer-events-none absolute inset-x-4 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#005ca8]/16 to-transparent md:block" />
          {symbols.map((symbol, index) => (
            <div key={symbol.label} className="relative z-10 flex items-center gap-3 sm:gap-8 md:gap-12">
              <div
                className="group relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-[#005ca8] transition duration-500 hover:-translate-y-1 hover:text-gold sm:h-32 sm:w-32"
                aria-label={symbol.label}
                role="img"
                style={{ ["--symbol-delay" as string]: `${index * 0.28}s` }}
              >
                <span className="absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(0,92,168,0.09),transparent_68%)] opacity-70 blur-sm transition group-hover:bg-[radial-gradient(circle,rgba(255,126,0,0.13),transparent_70%)]" />
                <svg viewBox="0 0 104 104" className="relative h-full w-full" fill="none">
                  <circle
                    className="sacred-vector-ring opacity-45"
                    cx="52"
                    cy="52"
                    r="45"
                    stroke={index === 0 ? "#ff7e00" : "#005ca8"}
                    strokeWidth="1.4"
                    style={{ animationDelay: `-${index * 4}s` }}
                  />
                  <circle
                    className="sacred-vector-line opacity-70"
                    cx="52"
                    cy="52"
                    r="38"
                    stroke={index === 0 ? "#ffb04f" : "#005ca8"}
                    strokeWidth="1.2"
                    style={{ animationDelay: `calc(var(--symbol-delay) + 0.1s)` }}
                  />
                  <g
                    className="sacred-vector-line"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.25"
                    style={{ animationDelay: `calc(var(--symbol-delay) + 0.25s)` }}
                  >
                    {symbol.icon}
                  </g>
                  <circle
                    className="sacred-vector-mark"
                    cx="52"
                    cy="52"
                    r="2.8"
                    fill={index === 0 ? "#ff7e00" : "#005ca8"}
                    style={{ animationDelay: `calc(var(--symbol-delay) + 1.8s)` }}
                  />
                </svg>
              </div>
              {index < symbols.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="hidden h-px w-10 bg-gradient-to-r from-[#005ca8]/20 via-gold/90 to-[#005ca8]/20 sm:block md:w-14"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
          <div className="mt-10">
            <Link
              to="/tours"
              className="group inline-flex min-h-12 items-center gap-3 bg-accent px-6 text-sm font-semibold uppercase tracking-widest text-accent-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-gold-soft sm:px-8"
            >
              {t("common.exploreTours")}
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <div className="relative isolate overflow-hidden border-b border-border bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.99)_0%,rgba(250,252,255,0.96)_52%,rgba(244,248,252,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,126,0,0.08),transparent_24%),radial-gradient(circle_at_82%_62%,rgba(255,185,92,0.13),transparent_28%)]" />
        <div className="absolute right-[10%] top-24 h-72 w-20 rounded-[50%_50%_44%_44%] bg-[radial-gradient(ellipse_at_center,rgba(255,185,92,0.22),rgba(255,126,0,0.10)_46%,transparent_72%)] blur-2xl" />
        <div className="absolute left-[8%] top-[42%] h-56 w-16 rounded-[50%_50%_44%_44%] bg-[radial-gradient(ellipse_at_center,rgba(255,220,150,0.18),rgba(255,126,0,0.08)_48%,transparent_76%)] blur-2xl" />
        <div className="absolute bottom-12 right-[30%] h-64 w-16 rounded-[50%_50%_44%_44%] bg-[radial-gradient(ellipse_at_center,rgba(255,185,92,0.16),rgba(255,126,0,0.07)_50%,transparent_78%)] blur-2xl" />
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 760"
          className="pointer-events-none absolute right-[-8rem] top-0 hidden h-[48rem] w-[72rem] text-[#005ca8] opacity-[0.16] lg:block"
          fill="none"
        >
          <path d="M196 612H984" stroke="currentColor" strokeWidth="1" />
          <path d="M286 612V330L590 156L894 330V612" stroke="currentColor" strokeWidth="1.2" />
          <path d="M340 612V366L590 222L840 366V612" stroke="currentColor" strokeWidth="1" />
          <path d="M236 612V292L306 244L376 292V612" stroke="currentColor" strokeWidth="1" />
          <path d="M804 612V292L874 244L944 292V612" stroke="currentColor" strokeWidth="1" />
          <path d="M306 244V118" stroke="currentColor" strokeWidth="1" />
          <path d="M874 244V118" stroke="currentColor" strokeWidth="1" />
          <path d="M590 222V86" stroke="currentColor" strokeWidth="1" />
          <path d="M548 612V452C548 424 566 398 590 386C614 398 632 424 632 452V612" stroke="currentColor" strokeWidth="1.2" />
          <path d="M428 612V442C428 416 445 391 468 380C491 391 508 416 508 442V612" stroke="currentColor" strokeWidth="1" />
          <path d="M672 612V442C672 416 689 391 712 380C735 391 752 416 752 442V612" stroke="currentColor" strokeWidth="1" />
          <path d="M590 156L590 612" stroke="currentColor" strokeDasharray="6 14" strokeWidth="1" />
          <path d="M286 330H894" stroke="currentColor" strokeDasharray="4 12" strokeWidth="1" />
          <path d="M340 366H840" stroke="currentColor" strokeDasharray="4 12" strokeWidth="1" />
          <circle cx="590" cy="156" r="7" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="306" cy="244" r="5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="874" cy="244" r="5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="468" cy="380" r="5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="712" cy="380" r="5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="590" cy="386" r="6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M188 250C312 178 430 144 590 144C750 144 876 178 998 250" stroke="currentColor" strokeDasharray="2 16" strokeWidth="1" />
          <path d="M168 526C322 466 454 438 590 438C726 438 868 466 1016 526" stroke="currentColor" strokeDasharray="2 18" strokeWidth="1" />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 760"
          className="pointer-events-none absolute left-[-16rem] top-[34rem] hidden h-[48rem] w-[72rem] text-[#0f8a78] opacity-[0.12] lg:block"
          fill="none"
        >
          <path d="M180 620H1040" stroke="currentColor" strokeWidth="1" />
          <path d="M360 620V444C360 360 428 292 512 292C596 292 664 360 664 444V620" stroke="currentColor" strokeWidth="1.2" />
          <path d="M404 620V456C404 396 452 348 512 348C572 348 620 396 620 456V620" stroke="currentColor" strokeWidth="1" />
          <path d="M318 452H706" stroke="currentColor" strokeDasharray="4 12" strokeWidth="1" />
          <path d="M292 620V388H732V620" stroke="currentColor" strokeWidth="1" />
          <path d="M804 620V176C804 134 838 100 880 100C922 100 956 134 956 176V620" stroke="currentColor" strokeWidth="1.2" />
          <path d="M840 620V196C840 174 858 156 880 156C902 156 920 174 920 196V620" stroke="currentColor" strokeWidth="1" />
          <path d="M790 236H970" stroke="currentColor" strokeWidth="1" />
          <path d="M804 176H956" stroke="currentColor" strokeWidth="1" />
          <path d="M880 100V54" stroke="currentColor" strokeWidth="1" />
          <path d="M880 54C908 62 924 84 924 110C900 101 886 84 880 54Z" stroke="currentColor" strokeWidth="1" />
          <path d="M452 620V500H572V620" stroke="currentColor" strokeWidth="1" />
          <path d="M486 500V620" stroke="currentColor" strokeDasharray="5 12" strokeWidth="1" />
          <path d="M538 500V620" stroke="currentColor" strokeDasharray="5 12" strokeWidth="1" />
          <circle cx="880" cy="282" r="7" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="880" cy="364" r="7" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="880" cy="446" r="7" stroke="currentColor" strokeWidth="1.2" />
          <path d="M238 396C352 246 510 190 684 250C780 283 846 340 1004 312" stroke="currentColor" strokeDasharray="2 18" strokeWidth="1" />
          <path d="M246 536C392 488 558 470 746 494C854 508 936 532 1030 508" stroke="currentColor" strokeDasharray="2 16" strokeWidth="1" />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 760"
          className="pointer-events-none absolute right-[-12rem] top-[62rem] hidden h-[48rem] w-[72rem] text-[#b46b21] opacity-[0.115] lg:block"
          fill="none"
        >
          <path d="M156 626H1044" stroke="currentColor" strokeWidth="1" />
          <path d="M244 626V448C244 292 398 166 588 166C778 166 932 292 932 448V626" stroke="currentColor" strokeWidth="1.2" />
          <path d="M302 626V462C302 338 430 238 588 238C746 238 874 338 874 462V626" stroke="currentColor" strokeWidth="1" />
          <path d="M344 450H832" stroke="currentColor" strokeWidth="1" />
          <path d="M344 520H832" stroke="currentColor" strokeDasharray="6 14" strokeWidth="1" />
          <path d="M384 626V472H792V626" stroke="currentColor" strokeWidth="1" />
          <path d="M444 626V472" stroke="currentColor" strokeWidth="1" />
          <path d="M504 626V472" stroke="currentColor" strokeWidth="1" />
          <path d="M564 626V472" stroke="currentColor" strokeWidth="1" />
          <path d="M624 626V472" stroke="currentColor" strokeWidth="1" />
          <path d="M684 626V472" stroke="currentColor" strokeWidth="1" />
          <path d="M744 626V472" stroke="currentColor" strokeWidth="1" />
          <path d="M588 238V96" stroke="currentColor" strokeWidth="1" />
          <path d="M552 116H624" stroke="currentColor" strokeWidth="1" />
          <path d="M564 88H612" stroke="currentColor" strokeWidth="1" />
          <path d="M588 68V48" stroke="currentColor" strokeWidth="1" />
          <circle cx="588" cy="334" r="96" stroke="currentColor" strokeWidth="1" />
          <path d="M492 334H684" stroke="currentColor" strokeWidth="1" />
          <path d="M588 238V430" stroke="currentColor" strokeDasharray="5 13" strokeWidth="1" />
          <path d="M206 452C312 336 448 278 588 278C728 278 864 336 970 452" stroke="currentColor" strokeDasharray="2 16" strokeWidth="1" />
          <path d="M210 574C342 534 468 516 588 516C708 516 834 534 970 574" stroke="currentColor" strokeDasharray="2 18" strokeWidth="1" />
          <circle cx="384" cy="450" r="5" stroke="currentColor" strokeWidth="1" />
          <circle cx="792" cy="450" r="5" stroke="currentColor" strokeWidth="1" />
          <circle cx="588" cy="238" r="6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <div className="pointer-events-none absolute right-[8%] top-28 hidden h-px w-72 rotate-[-18deg] bg-gradient-to-r from-transparent via-gold/35 to-transparent lg:block" />
        <div className="pointer-events-none absolute right-[20%] top-40 hidden h-2 w-2 animate-pulse rounded-full bg-gold/70 shadow-[0_0_24px_rgba(255,126,0,0.38)] lg:block" />
        <div className="pointer-events-none absolute right-[36%] top-[23rem] hidden h-2 w-2 animate-pulse rounded-full bg-[#005ca8]/50 shadow-[0_0_22px_rgba(0,80,160,0.30)] lg:block" />
        <div className="pointer-events-none absolute left-[18%] top-[43rem] hidden h-px w-64 rotate-[16deg] bg-gradient-to-r from-transparent via-[#0f8a78]/25 to-transparent lg:block" />
        <div className="pointer-events-none absolute right-[16%] top-[73rem] hidden h-px w-72 rotate-[-12deg] bg-gradient-to-r from-transparent via-gold/25 to-transparent lg:block" />

      <section className="relative overflow-hidden">
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

      <SacredSymbolStrip />

      <section className="relative isolate overflow-hidden">
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="divider-ornament mb-8 max-w-xs text-xs uppercase tracking-[0.3em] text-gold">
              {t("home.manifestoEyebrow")}
            </p>
            <h2 className="max-w-2xl font-serif text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
              {t("home.manifestoTitle")}
            </h2>
            <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground">
              {t("home.manifestoIntro")}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              {tr<[string, string][]>("home.manifestoStats", []).map(([value, label]) => (
                <span
                  key={value}
                  className="inline-flex min-h-10 items-center gap-2 border border-border bg-background/75 px-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground shadow-sm"
                >
                  <strong className="font-serif text-lg normal-case tracking-normal text-gold">{value}</strong>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative border-l border-gold/35 pl-6 md:pl-10">
            <div className="absolute -left-px top-0 h-24 w-px bg-gold" />
            <div className="space-y-6">
              {tr<string[]>("home.manifestoLines", []).map((line, index) => (
                <div key={line} className="group relative">
                  <p
                    className={`font-serif leading-snug ${
                      index === 0
                        ? "text-3xl text-foreground sm:text-4xl"
                        : "text-xl text-foreground/82 sm:text-2xl"
                    }`}
                  >
                    {line}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </div>

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
            <div className="mt-10 grid max-w-2xl gap-x-8 gap-y-5 text-sm sm:grid-cols-2">
              {tr<string[]>("home.devotionBenefits", [
                t("home.instantPix"),
                t("home.parishShare"),
                t("home.customIntention"),
              ]).map((benefit, index) => {
                const icons = [Accessibility, HandHeart, MapPinCheck, MousePointerClick, Cpu];
                const Icon = icons[index] ?? Sparkles;

                return (
                  <span key={benefit} className="flex min-h-12 items-center gap-3 text-background/85">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                      <Icon size={18} strokeWidth={1.6} />
                    </span>
                    <span className="leading-6">{benefit}</span>
                  </span>
                );
              })}
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

      <SiteFooter />
    </div>
  );
}
