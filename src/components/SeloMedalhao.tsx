import { Lock } from "lucide-react";

/**
 * Medalhão de conquista (selo) das trilhas do Roteiro da Fé.
 * Desenho vetorial próprio por templo, com estados travado/conquistado
 * e efeito de estouro ao desbloquear.
 */

type Emblema = "santuario" | "mesquita" | "templo";

const EMBLEMA_POR_SLUG: Record<string, Emblema> = {
  "santuario-bom-despacho": "santuario",
  "mesquita-cuiaba": "mesquita",
  "grande-templo": "templo",
};

export function SeloMedalhao({
  slug,
  ganho,
  size = 88,
  animar = false,
}: {
  slug: string;
  ganho: boolean;
  size?: number;
  animar?: boolean;
}) {
  const emblema = EMBLEMA_POR_SLUG[slug] ?? "santuario";
  const gid = `medal-gold-${slug}`;

  return (
    <span
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
    >
      {/* Estouro ao desbloquear */}
      {animar && (
        <>
          <span
            aria-hidden
            className="animate-selo-burst pointer-events-none absolute inset-0 rounded-full border-2 border-gold"
          />
          <span
            aria-hidden
            className="animate-selo-burst pointer-events-none absolute inset-0 rounded-full bg-gold/30 blur-md"
            style={{ animationDelay: "80ms" }}
          />
        </>
      )}

      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className={`relative ${ganho ? "selo-glow" : ""} ${animar ? "animate-selo-reveal" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fde68a" />
            <stop offset="0.5" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Fundo do medalhão */}
        <circle
          cx="60"
          cy="60"
          r="56"
          className={ganho ? "fill-amber-500/10" : "fill-white/[0.03]"}
          stroke="none"
        />

        {/* Borda metálica externa */}
        <circle
          cx="60"
          cy="60"
          r="55"
          stroke={ganho ? `url(#${gid})` : "currentColor"}
          strokeWidth={ganho ? 3 : 1.5}
          className={ganho ? "" : "text-white/20"}
        />
        {/* Anel serrilhado (borda de moeda) */}
        <circle
          cx="60"
          cy="60"
          r="49"
          stroke={ganho ? `url(#${gid})` : "currentColor"}
          strokeWidth="2"
          strokeDasharray="1.5 4.2"
          className={ganho ? "opacity-80" : "text-white/15"}
        />
        {/* Anel interno */}
        <circle
          cx="60"
          cy="60"
          r="43"
          stroke="currentColor"
          strokeWidth="1"
          className={ganho ? "text-amber-300/60" : "text-white/10"}
        />

        {/* Emblema do templo */}
        <g
          strokeWidth="2"
          className={ganho ? "text-amber-200" : "text-white/25"}
        >
          {emblema === "santuario" && (
            <>
              {/* Arco gótico + cruz + rosácea */}
              <path d="M44 84 V56 Q44 38 60 31 Q76 38 76 56 V84" />
              <line x1="60" y1="31" x2="60" y2="22" />
              <line x1="55" y1="25" x2="65" y2="25" />
              <circle cx="60" cy="60" r="9" strokeWidth="1.6" />
              {Array.from({ length: 6 }).map((_, i) => {
                const a = (i * 60 * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1="60"
                    y1="60"
                    x2={60 + Math.cos(a) * 9}
                    y2={60 + Math.sin(a) * 9}
                    strokeWidth="1.2"
                  />
                );
              })}
            </>
          )}

          {emblema === "mesquita" && (
            <>
              {/* Cúpula + crescente + minaretes */}
              <path d="M46 86 V60 Q46 40 60 34 Q74 40 74 60 V86" />
              <path d="M60 34 q-5 -7 0 -12 q-3 6 4 6 q-4 2 -4 6" strokeWidth="1.6" />
              <line x1="38" y1="86" x2="38" y2="54" />
              <line x1="34" y1="54" x2="42" y2="54" />
              <line x1="82" y1="86" x2="82" y2="54" />
              <line x1="78" y1="54" x2="86" y2="54" />
            </>
          )}

          {emblema === "templo" && (
            <>
              {/* Grande Templo: volume arredondado, fachada modular e torre frontal */}
              <path d="M24 86H96" />
              <path d="M31 77H87" />
              <path d="M32 76V61C32 47 44 38 61 38C78 38 90 47 90 61V76" />
              <path d="M37 61C43 52 52 48 61 48C70 48 78 52 84 61" />
              <path d="M36 76V64H84V76" />
              <line x1="43" y1="76" x2="43" y2="65" />
              <line x1="52" y1="76" x2="52" y2="65" />
              <line x1="61" y1="76" x2="61" y2="65" />
              <line x1="70" y1="76" x2="70" y2="65" />
              <line x1="79" y1="76" x2="79" y2="65" />
              <path d="M66 86V31" />
              <path d="M63 31H69" />
              <path d="M64 25H68" />
              <line x1="45" y1="86" x2="45" y2="78" />
              <line x1="57" y1="86" x2="57" y2="78" />
              <line x1="69" y1="86" x2="69" y2="78" />
              <line x1="81" y1="86" x2="81" y2="78" />
            </>
          )}
        </g>
      </svg>

      {/* Cadeado nos não conquistados */}
      {!ganho && (
        <span
          aria-hidden
          className="absolute grid place-items-center rounded-full border border-white/15 bg-ink text-white/40"
          style={{ height: size * 0.34, width: size * 0.34 }}
        >
          <Lock size={Math.max(11, Math.round(size * 0.18))} />
        </span>
      )}
    </span>
  );
}
