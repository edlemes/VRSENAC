import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getIgrejaBySlug, listIgrejas } from "@/lib/igrejas";
import { listScenes, listHotspotsByIgreja } from "@/lib/tours";
import { listFotosByTag, type Foto } from "@/lib/galeria";
import { TourViewer } from "@/components/TourViewer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, Compass, Flame, MapPin, Image as ImageIcon, BookOpen, Route as RouteIcon } from "lucide-react";

export const Route = createFileRoute("/igrejas/$slug")({
  head: () => ({
    meta: [{ title: "Tour Virtual · Sagrado Digital" }],
  }),
  component: TourPage,
});

function TourPage() {
  const { slug } = useParams({ from: "/igrejas/$slug" });
  const [candleOpen, setCandleOpen] = useState(false);
  const [controlledSceneId, setControlledSceneId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Foto | null>(null);
  const tourRef = useRef<HTMLDivElement>(null);

  const { data: igreja, isLoading } = useQuery({
    queryKey: ["igreja", slug],
    queryFn: () => getIgrejaBySlug(slug),
  });
  const { data: outras = [] } = useQuery({
    queryKey: ["igrejas"],
    queryFn: listIgrejas,
  });
  const { data: scenes = [] } = useQuery({
    queryKey: ["tour-scenes", igreja?.id],
    queryFn: () => listScenes(igreja!.id),
    enabled: !!igreja?.id,
  });
  const { data: hotspots = [] } = useQuery({
    queryKey: ["tour-hotspots", igreja?.id],
    queryFn: () => listHotspotsByIgreja(igreja!.id),
    enabled: !!igreja?.id,
  });
  const { data: fotos = [] } = useQuery({
    queryKey: ["galeria-igreja", slug],
    queryFn: () => listFotosByTag(slug),
  });

  function scrollToTour() {
    tourRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function abrirCena(sceneId: string) {
    setControlledSceneId(sceneId);
    scrollToTour();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-6 py-32 text-center text-muted-foreground">
          Carregando santuário…
        </div>
      </div>
    );
  }

  if (!igreja) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex min-h-[60vh] items-center justify-center text-center">
          <div>
            <p className="font-serif text-3xl">Igreja não encontrada</p>
            <Link to="/igrejas" className="mt-4 inline-block text-gold underline">
              Ver acervo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* HERO */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        {igreja.imagem_url ? (
          <img
            src={igreja.imagem_url}
            alt={igreja.nome}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16">
          <Link
            to="/igrejas"
            className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-widest text-background/80 hover:text-gold"
          >
            <ArrowLeft size={14} /> Acervo
          </Link>
          <p className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold">
            <MapPin size={12} /> {igreja.cidade}, {igreja.estado} · {igreja.ano}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl text-background md:text-7xl">
            {igreja.nome}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-background/80">{igreja.resumo}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={scrollToTour}
              className="inline-flex items-center gap-2 bg-gold px-6 py-3 text-xs uppercase tracking-widest text-ink transition hover:bg-gold-soft"
            >
              <Compass size={14} /> Iniciar tour 360°
            </button>
            <button
              onClick={() => setCandleOpen(true)}
              className="inline-flex items-center gap-2 border border-background/40 px-6 py-3 text-xs uppercase tracking-widest text-background transition hover:bg-background/10"
            >
              <Flame size={14} /> Acender vela
            </button>
          </div>
        </div>
      </section>

      {/* NAV STICKY */}
      <nav className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-6 py-3 text-[11px] uppercase tracking-widest">
          <a href="#historia" className="flex items-center gap-2 text-muted-foreground hover:text-gold"><BookOpen size={12} /> História</a>
          {fotos.length > 0 && (
            <a href="#fotos" className="flex items-center gap-2 text-muted-foreground hover:text-gold"><ImageIcon size={12} /> Fotos</a>
          )}
          {scenes.length > 0 && (
            <a href="#roteiro" className="flex items-center gap-2 text-muted-foreground hover:text-gold"><RouteIcon size={12} /> Roteiro</a>
          )}
          {(igreja?.tours_externos?.length ?? 0) > 0 && (
            <a href="#matterport" className="flex items-center gap-2 text-muted-foreground hover:text-gold"><Compass size={12} /> Matterport</a>
          )}
          <a href="#tour" className="flex items-center gap-2 text-muted-foreground hover:text-gold"><Compass size={12} /> Tour 360°</a>
        </div>

      </nav>

      {/* HISTÓRIA */}
      <section id="historia" className="border-b border-border bg-background scroll-mt-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">História</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Memória viva</h2>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
              {(igreja.descricao || "").split(/\n\n+/).filter(Boolean).map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
              {!igreja.descricao && (
                <p className="italic">A história deste santuário está em compilação.</p>
              )}
            </div>
          </div>
          <aside className="border-l border-border lg:pl-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Linha do tempo</p>
            <ul className="mt-4 space-y-6 border-l border-gold/40 pl-6">
              <li>
                <div className="-ml-[27px] mb-1 h-2 w-2 rounded-full bg-gold" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Construção</p>
                <p className="font-serif text-xl">{igreja.ano || "—"}</p>
              </li>
              <li>
                <div className="-ml-[27px] mb-1 h-2 w-2 rounded-full bg-gold" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Estilo</p>
                <p className="font-serif text-xl">{igreja.estilo || "—"}</p>
              </li>
              {igreja.pontos_de_fe.length > 0 && (
                <li>
                  <div className="-ml-[27px] mb-1 h-2 w-2 rounded-full bg-gold" />
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Pontos de fé</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {igreja.pontos_de_fe.map((p) => (
                      <li key={p}><span className="text-gold">✣</span> {p}</li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </aside>
        </div>
      </section>

      {/* FOTOS */}
      {fotos.length > 0 && (
        <section id="fotos" className="border-b border-border bg-secondary/30 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Galeria</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Fotos do santuário</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fotos.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setLightbox(f);
                    import("@/lib/tracking").then((m) =>
                      m.trackTourEvent({
                        type: "gallery_open",
                        igrejaId: igreja.id,
                        igrejaSlug: igreja.slug,
                      }),
                    );
                  }}
                  className="group relative overflow-hidden"
                >
                  <img
                    src={f.imagem_url}
                    alt={f.titulo}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  {f.titulo && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 text-left text-sm text-background">
                      {f.titulo}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ROTEIRO DE VISITA */}
      {scenes.length > 0 && (
        <section id="roteiro" className="border-b border-border bg-background scroll-mt-20">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Roteiro</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Sua visita em {scenes.length} {scenes.length === 1 ? "parada" : "paradas"}</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Percorra cada ambiente na ordem sugerida, ou pule diretamente para o ponto que mais te interessa.
            </p>
            <ol className="mt-12 space-y-px bg-border">
              {scenes.map((s, idx) => (
                <li key={s.id} className="grid items-center gap-6 bg-background p-6 md:grid-cols-[80px_180px_1fr_auto]">
                  <div className="font-serif text-4xl text-gold">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="relative h-24 w-full overflow-hidden md:w-44">
                    {s.panorama_url ? (
                      <img src={s.panorama_url} alt={s.nome} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="h-full w-full bg-secondary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl">{s.nome}</h3>
                    <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                      Parada {idx + 1} de {scenes.length}
                    </p>
                  </div>
                  <button
                    onClick={() => abrirCena(s.id)}
                    className="inline-flex items-center gap-2 border border-gold px-4 py-2 text-[10px] uppercase tracking-widest text-gold transition hover:bg-gold hover:text-ink"
                  >
                    <Compass size={12} /> Visitar
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* TOURS MATTERPORT */}
      {igreja.tours_externos && igreja.tours_externos.length > 0 && (
        <MatterportSection
          tours={igreja.tours_externos}
          igrejaId={igreja.id}
          igrejaSlug={igreja.slug}
        />
      )}

      {/* TOUR 360° */}
      <section id="tour" ref={tourRef} className="scroll-mt-20 bg-ink">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Imersão</p>
          <h2 className="mt-4 font-serif text-4xl text-background md:text-5xl">Tour 360°</h2>
        </div>
        <div className="relative">
          {scenes.length > 0 ? (
            <TourViewer
              scenes={scenes}
              hotspots={hotspots}
              initialSceneId={igreja.cena_inicial_id}
              controlledSceneId={controlledSceneId}
              igrejaId={igreja.id}
              igrejaSlug={igreja.slug}
            />
          ) : (
            <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
              {igreja.imagem_url ? (
                <img src={igreja.imagem_url} alt={igreja.nome} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-secondary" />
              )}
              <div className="absolute inset-0 vignette" />
              <div className="absolute left-6 top-6 rounded-sm bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur">
                Tour 360° em produção
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
            <button
              onClick={() => setCandleOpen(true)}
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs uppercase tracking-widest text-ink shadow-lg hover:bg-gold-soft"
            >
              <Flame size={14} /> Acender vela
            </button>
          </div>
        </div>
      </section>

      {/* OUTRAS IGREJAS */}
      {outras.filter((i) => i.slug !== igreja.slug).length > 0 && (
        <section className="bg-secondary/40">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Continue sua peregrinação</p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl">Outros santuários do acervo</h2>
            <div className="mt-10 grid gap-px bg-border md:grid-cols-3">
              {outras.filter((i) => i.slug !== igreja.slug).slice(0, 6).map((i) => (
                <Link
                  key={i.slug}
                  to="/igrejas/$slug"
                  params={{ slug: i.slug }}
                  className="group bg-background p-6 transition hover:bg-card"
                >
                  {i.imagem_url ? (
                    <img
                      src={i.imagem_url}
                      alt={i.nome}
                      width={1280}
                      height={960}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[4/3] w-full bg-background" />
                  )}
                  <h3 className="mt-4 font-serif text-xl">{i.nome}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{i.cidade}, {i.estado}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />

      {/* LIGHTBOX FOTOS */}
      <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-4xl border-border bg-background p-2">
          {lightbox && (
            <>
              <img src={lightbox.imagem_url} alt={lightbox.titulo} className="w-full" />
              {(lightbox.titulo || lightbox.descricao) && (
                <div className="px-4 py-3 text-center">
                  {lightbox.titulo && <p className="font-serif text-lg">{lightbox.titulo}</p>}
                  {lightbox.descricao && <p className="mt-1 text-sm text-muted-foreground">{lightbox.descricao}</p>}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL VELA VIRTUAL */}
      {candleOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 p-4 backdrop-blur"
          onClick={() => setCandleOpen(false)}
        >
          <div
            className="w-full max-w-lg border border-gold/40 bg-background p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <Flame size={36} className="mx-auto text-gold" strokeWidth={1.2} />
              <h3 className="mt-4 font-serif text-3xl">Acenda uma vela</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Sua intenção será exibida no nicho virtual de {igreja.nome}.
              </p>
            </div>
            <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setCandleOpen(false); }}>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Sua intenção</label>
                <textarea
                  className="mt-2 w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none"
                  rows={3}
                  placeholder="Por minha família, pela paz, em agradecimento…"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Oferta (R$)</label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[5, 10, 20, 50].map((v) => (
                    <button
                      type="button"
                      key={v}
                      className="border border-border py-2 text-sm transition hover:border-gold hover:text-gold"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 bg-gold py-3 text-sm uppercase tracking-widest text-ink hover:bg-gold-soft"
              >
                <Flame size={14} /> Acender via Pix
              </button>
              <p className="text-center text-[10px] text-muted-foreground">
                70% repassado à paróquia · 30% sustenta a plataforma
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MatterportSection({
  tours,
  igrejaId,
  igrejaSlug,
}: {
  tours: string[];
  igrejaId: string;
  igrejaSlug: string;
}) {
  const [active, setActive] = useState(0);
  const current = tours[active];

  function open(idx: number) {
    setActive(idx);
    import("@/lib/tracking").then((m) =>
      m.trackTourEvent({ type: "tour_open", igrejaId, igrejaSlug }),
    );
  }

  return (
    <section id="matterport" className="scroll-mt-20 border-b border-border bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Imersão Matterport</p>
        <h2 className="mt-4 font-serif text-4xl text-background md:text-5xl">
          Tour virtual {tours.length > 1 ? `(${tours.length})` : ""}
        </h2>
        {tours.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tours.map((_, i) => (
              <button
                key={i}
                onClick={() => open(i)}
                className={`border px-4 py-2 text-[10px] uppercase tracking-widest transition ${
                  i === active
                    ? "border-gold bg-gold text-ink"
                    : "border-background/30 text-background/80 hover:border-gold hover:text-gold"
                }`}
              >
                Tour {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-12">
        <div className="aspect-video w-full overflow-hidden border border-background/10 bg-black">
          <iframe
            key={current}
            src={current}
            className="h-full w-full"
            allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
            allowFullScreen
            title={`Tour Matterport ${active + 1}`}
            onLoad={() =>
              import("@/lib/tracking").then((m) =>
                m.trackTourEvent({ type: "tour_open", igrejaId, igrejaSlug }),
              )
            }
          />
        </div>
      </div>
    </section>
  );
}

