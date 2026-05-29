import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { listIgrejas } from "@/lib/igrejas";
import { hasSupabaseConfig, supabase } from "@/integrations/supabase/client";
import { ArrowRight, MapPin, Compass } from "lucide-react";

export const Route = createFileRoute("/igrejas/")({
  head: () => ({
    meta: [
      { title: "Acervo de Igrejas — Sagrado Digital" },
      {
        name: "description",
        content:
          "Explore o acervo de tours virtuais 3D de catedrais, basílicas e santuários históricos do Brasil.",
      },
      { property: "og:title", content: "Acervo de Igrejas Históricas" },
      {
        property: "og:description",
        content: "Catedrais, basílicas e santuários do Brasil em 3D imersivo.",
      },
    ],
  }),
  component: Acervo,
});

async function listIgrejasWithTour(): Promise<Set<string>> {
  if (!hasSupabaseConfig()) return new Set();

  const { data, error } = await supabase.from("tour_scenes").select("igreja_id");
  if (error) throw error;
  return new Set((data ?? []).map((r) => r.igreja_id as string));
}

function Acervo() {
  const { data: igrejas = [], isLoading } = useQuery({
    queryKey: ["igrejas"],
    queryFn: listIgrejas,
  });
  const { data: tourSet = new Set<string>() } = useQuery({
    queryKey: ["igrejas-with-tour"],
    queryFn: listIgrejasWithTour,
  });

  const [estado, setEstado] = useState<string>("");
  const [estilo, setEstilo] = useState<string>("");

  const estados = useMemo(
    () => Array.from(new Set(igrejas.map((i) => i.estado).filter(Boolean))).sort(),
    [igrejas],
  );
  const estilos = useMemo(
    () => Array.from(new Set(igrejas.map((i) => i.estilo).filter(Boolean))).sort(),
    [igrejas],
  );

  const filtered = useMemo(
    () =>
      igrejas.filter(
        (i) => (!estado || i.estado === estado) && (!estilo || i.estilo === estilo),
      ),
    [igrejas, estado, estilo],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Acervo</p>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl md:text-7xl">
            O patrimônio religioso brasileiro, ao alcance de um clique.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
            {isLoading
              ? "Carregando acervo…"
              : `${filtered.length} ${filtered.length === 1 ? "santuário" : "santuários"} · Tours 360° imersivos.`}
          </p>

          {/* Filtros */}
          {igrejas.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="border border-border bg-background px-4 py-2 text-sm focus:border-gold focus:outline-none"
              >
                <option value="">Todos os estados</option>
                {estados.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
              <select
                value={estilo}
                onChange={(e) => setEstilo(e.target.value)}
                className="border border-border bg-background px-4 py-2 text-sm focus:border-gold focus:outline-none"
              >
                <option value="">Todos os estilos</option>
                {estilos.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
              {(estado || estilo) && (
                <button
                  onClick={() => { setEstado(""); setEstilo(""); }}
                  className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16">
          {!isLoading && filtered.length === 0 ? (
            <div className="border border-dashed border-border p-16 text-center">
              <p className="font-serif text-2xl">Nenhum santuário encontrado.</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Ajuste os filtros ou volte em breve para novos templos.
              </p>
            </div>
          ) : (
            <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((i) => {
                const hasTour = tourSet.has(i.id);
                return (
                  <article
                    key={i.slug}
                    className="group flex flex-col bg-background transition hover:bg-card"
                  >
                    <Link
                      to="/igrejas/$slug"
                      params={{ slug: i.slug }}
                      className="relative block overflow-hidden"
                    >
                      {i.imagem_url ? (
                        <img
                          src={i.imagem_url}
                          alt={i.nome}
                          width={1280}
                          height={960}
                          loading="lazy"
                          className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="aspect-[4/3] w-full bg-secondary" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-xs uppercase tracking-widest text-background">
                        {i.estilo}
                      </div>
                      {hasTour && (
                        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-gold/95 px-3 py-1 text-[10px] uppercase tracking-widest text-ink shadow">
                          <Compass size={11} /> Tour 3D
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin size={12} /> {i.cidade}, {i.estado} · {i.ano}
                      </div>
                      <Link to="/igrejas/$slug" params={{ slug: i.slug }}>
                        <h2 className="mt-3 font-serif text-2xl leading-tight hover:text-gold">{i.nome}</h2>
                      </Link>
                      <p className="mt-3 text-sm text-muted-foreground">{i.resumo}</p>
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                          to="/igrejas/$slug"
                          params={{ slug: i.slug }}
                          hash="tour"
                          className="inline-flex items-center gap-2 bg-gold px-4 py-2 text-[10px] uppercase tracking-widest text-ink transition hover:bg-gold-soft"
                        >
                          <Compass size={12} /> Abrir tour 360°
                        </Link>
                        <Link
                          to="/igrejas/$slug"
                          params={{ slug: i.slug }}
                          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
                        >
                          Detalhes <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
