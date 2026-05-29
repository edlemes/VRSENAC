import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Landmark, Newspaper, Images, GalleryHorizontal, FileText, Users, Inbox } from "lucide-react";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/igrejas", label: "Igrejas & Tours", icon: Landmark },
  { to: "/admin/solicitacoes", label: "Solicitações", icon: Inbox },
  { to: "/admin/noticias", label: "Notícias", icon: Newspaper },
  { to: "/admin/carrossel", label: "Carrossel", icon: GalleryHorizontal },
  { to: "/admin/galeria", label: "Galeria", icon: Images },
  { to: "/admin/paginas", label: "Páginas", icon: FileText },
  { to: "/admin/usuarios", label: "Usuários", icon: Users },
];

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:block">
      <nav className="sticky top-[73px] flex flex-col gap-1 p-4">
        <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Painel</p>
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname === it.to || pathname.startsWith(it.to + "/");
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 rounded-sm border-l-2 px-3 py-2 text-sm transition ${
                active
                  ? "border-gold bg-secondary/60 text-foreground"
                  : "border-transparent text-muted-foreground hover:border-accent hover:text-foreground"
              }`}
            >
              <it.icon size={14} />
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
