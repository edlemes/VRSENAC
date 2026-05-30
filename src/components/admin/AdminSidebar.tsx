import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Landmark, Newspaper, Images, GalleryHorizontal, FileText, Users, Inbox } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const items = [
  { to: "/admin", labelKey: "admin.dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/igrejas", labelKey: "admin.churchesTours", icon: Landmark },
  { to: "/admin/solicitacoes", labelKey: "admin.requests", icon: Inbox },
  { to: "/admin/noticias", labelKey: "admin.news", icon: Newspaper },
  { to: "/admin/carrossel", labelKey: "admin.carousel", icon: GalleryHorizontal },
  { to: "/admin/galeria", labelKey: "admin.gallery", icon: Images },
  { to: "/admin/paginas", labelKey: "admin.pages", icon: FileText },
  { to: "/admin/usuarios", labelKey: "admin.users", icon: Users },
];

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useI18n();
  return (
    <>
      <nav className="safe-x sticky top-[calc(73px+env(safe-area-inset-top))] z-30 flex gap-2 overflow-x-auto border-b border-border bg-card px-4 py-2 md:hidden">
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname === it.to || pathname.startsWith(it.to + "/");
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-sm border px-3 text-xs transition ${
                active
                  ? "border-gold bg-secondary/70 text-foreground"
                  : "border-border text-muted-foreground hover:border-accent hover:text-foreground"
              }`}
            >
              <it.icon size={14} />
              {t(it.labelKey)}
            </Link>
          );
        })}
      </nav>
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:block">
        <nav className="sticky top-[calc(73px+env(safe-area-inset-top))] flex flex-col gap-1 p-4">
          <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("admin.sidebarTitle")}</p>
          {items.map((it) => {
            const active = it.exact ? pathname === it.to : pathname === it.to || pathname.startsWith(it.to + "/");
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex min-h-12 items-center gap-3 rounded-sm border-l-2 px-3 text-sm transition ${
                  active
                    ? "border-gold bg-secondary/60 text-foreground"
                    : "border-transparent text-muted-foreground hover:border-accent hover:text-foreground"
                }`}
              >
                <it.icon size={14} />
                {t(it.labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
