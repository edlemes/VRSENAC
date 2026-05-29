import { useEffect, useState } from "react";

const STORAGE_KEY = "senac:splash-seen";
const TOTAL_MS = 4200;

export function SplashIntro() {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setShow(true);
    sessionStorage.setItem(STORAGE_KEY, "1");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = reduce ? 500 : TOTAL_MS;
    const fadeT = setTimeout(() => setFadeOut(true), total - 300);
    const hideT = setTimeout(() => setShow(false), total);
    return () => {
      clearTimeout(fadeT);
      clearTimeout(hideT);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-label="Senac 80 anos — carregando"
      aria-hidden={fadeOut}
      className="splash-root fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      data-fadeout={fadeOut ? "1" : "0"}
    >
      {/* Glow de fundo sutil */}
      <div
        aria-hidden
        className="splash-glow pointer-events-none absolute inset-0"
      />

      <div className="relative flex flex-col items-center gap-8 px-6">
        <div className="flex items-end gap-6 md:gap-10">
          {/* Wordmark "senac" */}
          <svg
            viewBox="0 0 420 130"
            width="min(58vw, 380px)"
            height="auto"
            fill="none"
            stroke="currentColor"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="splash-wordmark text-primary"
            aria-hidden="true"
          >
            {/* s */}
            <path d="M85 38 C 60 38, 42 46, 42 64 C 42 82, 85 82, 85 100 C 85 118, 65 122, 42 118" />
            {/* e */}
            <path d="M118 92 C 118 68, 140 56, 156 62 C 172 68, 175 84, 172 94 L 118 94 C 118 110, 135 120, 158 114" />
            {/* n */}
            <path d="M205 118 L 205 60 M 205 76 C 216 60, 244 56, 254 66 C 260 72, 260 82, 260 92 L 260 118" />
            {/* a */}
            <path d="M290 75 C 302 56, 336 56, 340 76 L 340 118 M 340 90 C 328 88, 300 88, 295 100 C 290 113, 312 122, 336 115" />
            {/* c */}
            <path d="M408 68 C 392 56, 360 58, 354 86 C 348 114, 388 122, 408 108" />
          </svg>

          {/* Selo 80 anos */}
          <svg
            viewBox="0 0 200 130"
            width="min(28vw, 170px)"
            height="auto"
            className="splash-seal"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="senac80-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
            <text
              x="0"
              y="100"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight={900}
              fontSize="120"
              letterSpacing="-6"
              fill="url(#senac80-grad)"
            >
              80
            </text>
            <text
              x="135"
              y="58"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight={700}
              fontSize="16"
              letterSpacing="3"
              fill="currentColor"
              className="text-primary"
            >
              ANOS
            </text>
            <line x1="135" y1="68" x2="195" y2="68" stroke="currentColor" strokeWidth="2" className="text-accent" />
          </svg>
        </div>

        {/* Tagline */}
        <p className="splash-tagline text-center text-[11px] uppercase tracking-[0.4em] text-muted-foreground md:text-xs">
          1946 — 2026 · a gente se vê amanhã
        </p>
      </div>

      <style>{`
        .splash-root {
          transition: opacity 300ms ease-out;
          opacity: 1;
        }
        .splash-root[data-fadeout="1"] {
          opacity: 0;
          pointer-events: none;
        }

        .splash-glow {
          background:
            radial-gradient(circle at 30% 40%, color-mix(in oklab, var(--primary) 10%, transparent), transparent 55%),
            radial-gradient(circle at 70% 60%, color-mix(in oklab, var(--accent) 10%, transparent), transparent 55%);
          opacity: 0;
          animation: senac-glow 1200ms ease-out forwards;
        }

        .splash-wordmark path {
          stroke-dasharray: 320;
          stroke-dashoffset: 320;
          fill: currentColor;
          fill-opacity: 0;
          animation:
            senac-draw 1600ms ease-out forwards,
            senac-fill 700ms ease-out forwards;
        }
        .splash-wordmark path:nth-child(1) { animation-delay: 0ms,   1400ms; }
        .splash-wordmark path:nth-child(2) { animation-delay: 220ms, 1620ms; }
        .splash-wordmark path:nth-child(3) { animation-delay: 440ms, 1840ms; }
        .splash-wordmark path:nth-child(4) { animation-delay: 660ms, 2060ms; }
        .splash-wordmark path:nth-child(5) { animation-delay: 880ms, 2280ms; }

        .splash-seal {
          opacity: 0;
          transform: scale(0.85);
          transform-origin: left bottom;
          animation: senac-seal 1000ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          animation-delay: 2200ms;
        }

        .splash-tagline {
          opacity: 0;
          transform: translateY(6px);
          animation: senac-tagline 900ms ease-out forwards;
          animation-delay: 2900ms;
        }

        @keyframes senac-draw { to { stroke-dashoffset: 0; } }
        @keyframes senac-fill { to { fill-opacity: 1; } }
        @keyframes senac-glow { to { opacity: 1; } }
        @keyframes senac-seal {
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes senac-tagline {
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-wordmark path,
          .splash-seal,
          .splash-tagline,
          .splash-glow {
            animation: none;
            opacity: 1;
            transform: none;
            stroke-dashoffset: 0;
            fill-opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
