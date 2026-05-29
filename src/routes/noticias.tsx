import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Newspaper } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { listNoticias, type Noticia } from "@/lib/noticias";

export const Route = createFileRoute("/noticias")({
  head: () => ({
    meta: [
      { title: "Notícias — Sagrado Digital · Senac MT" },
      { name: "description", content: "Notícias e novidades do projeto Sagrado Digital — Senac MT." },
      { property: "og:title", content: "Notícias — Sagrado Digital" },
      { property: "og:description", content: "Acompanhe as últimas notícias do Sagrado Digital." },
    ],
  }),
  component: NoticiasPage,
});

function formatDate(d: string | null) {
  if (!d) return "";
  try {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(d));
  } catch {
    return "";
  }
}

function NoticiasPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["noticias", "publicas"],
    queryFn: () => listNoticias({ onlyPublicadas: true }),
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <header className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Senac MT</p>
          <h1 className="mt-3 font-serif text-4xl text-foreground md:text-5xl">Notícias</h1>
          <p className="mt-4 text-muted-foreground">
            Atualizações, bastidores e novidades do projeto Sagrado Digital.
          </p>
        </header>

        {isLoading && <p className="text-sm text-muted-foreground">Carregando notícias…</p>}
        {error && (
          <p className="text-sm text-destructive">Não foi possível carregar as notícias agora. Tente novamente em instantes.</p>
        )}

        {!isLoading && !error && (data?.length ?? 0) === 0 && (
          <EmptyState />
        )}

        {!isLoading && !error && (data?.length ?? 0) > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data!.map((n) => (
              <NoticiaCard key={n.id} noticia={n} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function NoticiaCard({ noticia }: { noticia: Noticia }) {
  const date = formatDate(noticia.publicado_em ?? noticia.created_at);
  return (
    <article className="group flex flex-col overflow-hidden rounded-sm border border-border/60 bg-card transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md">
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {noticia.imagem_url ? (
          <img
            src={noticia.imagem_url}
            alt={noticia.titulo}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Newspaper size={32} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {date && <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{date}</p>}
        <h2 className="font-serif text-xl leading-snug text-foreground">{noticia.titulo}</h2>
        {noticia.resumo && <p className="line-clamp-3 text-sm text-muted-foreground">{noticia.resumo}</p>}
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border/70 bg-card/50 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-accent">
        <Newspaper size={26} />
      </div>
      <h2 className="mt-5 font-serif text-2xl text-foreground">Em breve, novidades</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Ainda não publicamos notícias por aqui. Volte em breve — ou explore o acervo de igrejas enquanto isso.
      </p>
      <Link
        to="/igrejas"
        className="mt-6 inline-flex items-center rounded-sm bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:-translate-y-0.5 hover:opacity-90"
      >
        Explorar acervo
      </Link>
    </div>
  );
}
