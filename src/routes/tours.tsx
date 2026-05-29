import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { listIgrejas, type Igreja } from "@/lib/igrejas";
import { Compass, MapPin, ArrowLeft } from "lucide-react";
import { trackTourEvent } from "@/lib/tracking";

export const Route = createFileRoute("/tours")({
  head: () => ({
    meta: [
      { title: "Explorar Tours 360° — Sagrado Digital" },
      {
        name: "description",
        content:
          "Percorra por dentro das igrejas e santuários do acervo em tours 3D Matterport imersivos.",
      },
      { property: "og:title", content: "Explorar Tours 360°" },
    ],
  }),
  component: ToursPage,
});

type TourItem = {
  id: string;
  igreja: Igreja;
  url: string;
  index: number;
  totalNaIgreja: number;
};

function expandirTours(igrejas: Igreja[]): TourItem[] {
  const out: TourItem[] = [];
  for (const i of igrejas) {
    const tours = i.tours_externos ?? [];
    tours.forEach((url, idx) => {
      out.push({
        id: `${i.slug}-${idx}`,
        igreja: i,
        url,
        index: idx,
        totalNaIgreja: tours.length,
      });
    });
  }
  return out;
}

function ToursPage() {
  const { data: igrejas = [], isLoading } = useQuery({
    queryKey: ["igrejas"],
    queryFn: listIgrejas,
  });

  const tours = expandirTours(igrejas);

  // Rolar até a âncora ao carregar (?#tour-slug-idx)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.replace("#", "");
    if (!hash || tours.length === 0) return;
    const el = document.getElementById(hash);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }
  }, [tours.length]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="border-b border-border bg-ink text-background">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-background/70 hover:text-gold"
          >
            <ArrowLeft size={12} /> Início
          </Link>
          <p className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold">
            <Compass size={12} /> Imersão Matterport
          </p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl">Explorar Tours 360°</h1>
          <p className="mt-4 max-w-2xl text-base text-background/80">
            Navegue por dentro dos santuários do acervo. Cada tour é um gêmeo digital
            tridimensional captado in loco — explore detalhes, altares e vitrais como
            se estivesse lá.
          </p>
          {tours.length > 0 && (
            <p className="mt-4 text-xs uppercase tracking-widest text-background/60">
              {tours.length} {tours.length === 1 ? "tour disponível" : "tours disponíveis"}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">
        {isLoading && (
          <p className="py-20 text-center text-sm text-muted-foreground">Carregando tours…</p>
        )}

        {!isLoading && tours.length === 0 && (
          <div className="border border-dashed border-border p-16 text-center">
            <Compass size={36} className="mx-auto text-muted-foreground" strokeWidth={1.2} />
            <p className="mt-6 font-serif text-2xl">Nenhum tour disponível ainda</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Os tours 360° serão publicados em breve. Volte logo!
            </p>
            <Link
              to="/igrejas"
              className="mt-8 inline-flex items-center gap-2 border border-foreground px-6 py-3 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background"
            >
              Ver acervo de igrejas
            </Link>
          </div>
        )}

        {tours.length > 0 && (
          <div className="space-y-20">
            {tours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

function TourCard({ tour }: { tour: TourItem }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <article
      id={tour.id}
      className="scroll-mt-24 border border-border bg-card shadow-sm"
    >
      <header className="grid gap-6 border-b border-border p-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold">
            <MapPin size={12} /> {tour.igreja.cidade}, {tour.igreja.estado}
            {tour.totalNaIgreja > 1 && (
              <span className="text-muted-foreground">
                · Tour {tour.index + 1} de {tour.totalNaIgreja}
              </span>
            )}
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">{tour.igreja.nome}</h2>
          {tour.igreja.resumo && (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{tour.igreja.resumo}</p>
          )}
        </div>
        <Link
          to="/igrejas/$slug"
          params={{ slug: tour.igreja.slug }}
          className="inline-flex items-center gap-2 border border-foreground px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-foreground hover:text-background"
        >
          Página da igreja
        </Link>
      </header>

      <div className="aspect-video w-full bg-black">
        <iframe
          ref={iframeRef}
          src={tour.url}
          className="h-full w-full"
          allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
          allowFullScreen
          loading="lazy"
          title={`Tour Matterport — ${tour.igreja.nome}`}
          onLoad={() =>
            trackTourEvent({
              type: "tour_open",
              igrejaId: tour.igreja.id,
              igrejaSlug: tour.igreja.slug,
            })
          }
        />
      </div>
    </article>
  );
}
