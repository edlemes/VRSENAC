import { languages, type Language, useI18n } from "@/lib/i18n";

function FlagIcon({ language }: { language: Language }) {
  if (language === "pt") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5 rounded-full shadow-sm">
        <circle cx="16" cy="16" r="16" fill="#159447" />
        <path d="M16 6 28 16 16 26 4 16Z" fill="#f6d14a" />
        <circle cx="16" cy="16" r="6" fill="#1f4f9a" />
      </svg>
    );
  }

  if (language === "en") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5 rounded-full shadow-sm">
        <clipPath id="flag-us-circle">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
        <g clipPath="url(#flag-us-circle)">
          <path fill="#fff" d="M0 0h32v32H0z" />
          {[0, 5, 10, 15, 20, 25, 30].map((y) => (
            <path key={y} fill="#b22234" d={`M0 ${y}h32v2.5H0z`} />
          ))}
          <path fill="#3c3b6e" d="M0 0h15.5v17H0z" />
          <path fill="#fff" d="M3 3h2v2H3zm5 0h2v2H8zm-5 5h2v2H3zm5 0h2v2H8zm-5 5h2v2H3zm5 0h2v2H8z" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5 rounded-full shadow-sm">
      <clipPath id="flag-es-circle">
        <circle cx="16" cy="16" r="16" />
      </clipPath>
      <g clipPath="url(#flag-es-circle)">
        <path fill="#aa151b" d="M0 0h32v32H0z" />
        <path fill="#f1bf00" d="M0 8h32v16H0z" />
        <rect x="8" y="13" width="4" height="6" rx="1" fill="#aa151b" opacity=".85" />
      </g>
    </svg>
  );
}

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className={`group relative inline-flex items-center ${compact ? "min-h-12 w-full" : "min-h-10"}`}>
      <span className="sr-only">{t("common.language")}</span>
      <span className="pointer-events-none absolute left-2.5 z-10">
        <FlagIcon language={language} />
      </span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        aria-label={t("common.language")}
        className={`appearance-none rounded-full border border-border/50 bg-transparent py-0 pl-9 pr-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition hover:border-accent/60 hover:text-foreground focus:border-accent focus:text-foreground focus:outline-none ${
          compact ? "h-12 w-full" : "h-10 w-[4.75rem]"
        }`}
      >
        {(Object.keys(languages) as Language[]).map((code) => (
          <option key={code} value={code}>
            {compact ? `${languages[code].shortLabel} - ${languages[code].nativeLabel}` : languages[code].shortLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
