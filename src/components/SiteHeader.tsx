import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LogIn, Shield } from "lucide-react";
import senacLogo from "@/assets/senac-logo.png";
import { hasSupabaseConfig, supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/", label: "Início" },
  { to: "/noticias", label: "Notícias" },
  { to: "/galeria", label: "Galeria" },
];


export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig()) return;

    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setIsLoggedIn(!!data.session?.user);
      })
      .catch(() => {
        if (active) setIsLoggedIn(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const navLinkClass =
    "relative text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100";
  const ctaClass =
    "inline-flex h-10 min-w-40 items-center justify-center gap-1.5 rounded-sm bg-accent px-4 text-xs font-medium uppercase tracking-widest text-accent-foreground shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-lg";
  const mobileCtaClass =
    "mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-medium text-accent-foreground shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-md";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="group flex items-center gap-3 transition">
          <img src={senacLogo} alt="Senac MT" className="h-9 w-auto transition group-hover:opacity-80" loading="eager" />
          <span className="h-9 w-px bg-border transition-colors group-hover:bg-accent" />
          <span className="flex flex-col leading-tight">
            <span className="animate-fade-in bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text font-serif text-lg tracking-wide text-transparent">
              Futuro Simulado
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent transition-all duration-500 group-hover:tracking-[0.28em]">
              A Nova Era do Turismo
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={navLinkClass}
              activeProps={{ className: "text-foreground after:scale-x-100 after:origin-bottom-left" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to={isLoggedIn ? "/admin" : "/admin/login"}
            className={
              isLoggedIn
                ? ctaClass
                : "inline-flex items-center gap-1.5 border border-border/60 px-3 py-1.5 text-xs uppercase tracking-widest text-muted-foreground transition hover:border-accent hover:text-foreground"
            }
          >
            {isLoggedIn ? <><Shield size={12} /> Painel admin</> : <><LogIn size={12} /> Entrar</>}
          </Link>
          <Link
            to="/tours"
            className={ctaClass}
          >
            Explorar Tours
          </Link>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="animate-fade-in border-t border-border/60 md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-l-2 border-transparent py-2 pl-2 text-sm text-muted-foreground transition-all hover:border-accent hover:text-foreground"
                activeProps={{ className: "text-foreground border-accent" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to={isLoggedIn ? "/admin" : "/admin/login"}
              onClick={() => setOpen(false)}
              className={
                isLoggedIn
                  ? mobileCtaClass
                  : "mt-2 inline-flex items-center gap-2 border-l-2 border-transparent py-2 pl-2 text-sm text-muted-foreground hover:border-accent hover:text-foreground"
              }
            >
              {isLoggedIn ? <><Shield size={14} /> Painel admin</> : <><LogIn size={14} /> Entrar</>}
            </Link>
            <Link
              to="/tours"
              onClick={() => setOpen(false)}
              className={mobileCtaClass}
            >
              Explorar Tours
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
