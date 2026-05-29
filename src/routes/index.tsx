import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { listIgrejas } from "@/lib/igrejas";
import heroCathedral from "@/assets/hero-cathedral.jpg";
import candles from "@/assets/candles.jpg";
import { ArrowRight, Scan, Heart, Landmark, Flame, Users, Sparkles, Compass, MapPin } from "lucide-react";
import type { Igreja } from "@/lib/igrejas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sagrado Digital — Tours virtuais 3D de igrejas e santuários do Brasil" },
      {
        name: "description",
        content:
          "Visite por dentro as catedrais, basílicas e santuários históricos do Brasil em 3D imersivo. Acenda uma vela, faça uma oração, eternize o patrimônio.",
      },
      { property: "og:title", content: "Sagrado Digital — Patrimônio religioso em 3D" },
      {
        property: "og:description",
        content:
          "Gêmeos digitais de igrejas históricas brasileiras. Onde história, fé e tecnologia se encontram.",
      },
    ],
  }),
  component: Home,
});

type HeroSlide = { src: string; alt: string; legenda?: string };

function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (slides.length <= 1) return;
    const tick = () => {
      if (!document.hidden) setIdx((i) => (i + 1) % slides.length);
    };
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <>
      {slides.map((s, i) => (
        <img
          key={s.src + i}
          src={s.src}
          alt={s.alt}
          width={1920}
          height={1280}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {slides.length > 1 && (
        <>
          <div className="absolute bottom-6 left-6 z-10 max-w-md text-xs uppercase tracking-[0.25em] text-background/80 transition-opacity duration-700">
            {slides[idx]?.legenda}
          </div>
          <div className="absolute bottom-6 right-6 z-10 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-px w-8 transition-all ${
                  i === idx ? "bg-accent h-[2px] w-10" : "bg-background/40 hover:bg-background/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function CinemaImage({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length > 0 ? images : [""];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (list.length <= 1) return;
    const id = setInterval(() => {
      if (!document.hidden) setIdx((i) => (i + 1) % list.length);
    }, 6000);
    return () => clearInterval(id);
  }, [list.length]);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden">
      {list.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={alt}
          width={1280}
          height={1600}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out ${
            i === idx ? "opacity-100 animate-ken-burns" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

function Home() {
  const { data: igrejas = [] } = useQuery({
    queryKey: ["igrejas"],
    queryFn: listIgrejas,
  });
  const { data: heroSlides = [] } = useQuery({
    queryKey: ["home_carrossel", "ativos"],
    queryFn: () => import("@/lib/carrossel").then((m) => m.listSlides({ onlyAtivos: true })),
  });
  const destaque = igrejas.find((i) => i.destaque) ?? igrejas[0];

  let slides: HeroSlide[] = heroSlides
    .filter((s) => s.imagem_url)
    .map((s) => ({
      src: s.imagem_url,
      alt: s.titulo || "Slide",
      legenda: s.titulo ? (s.subtitulo ? `${s.titulo} · ${s.subtitulo}` : s.titulo) : undefined,
    }));

  if (slides.length === 0) {
    slides = igrejas
      .filter((i) => i.imagem_url)
      .slice(0, 6)
      .map((i) => ({
        src: i.imagem_url,
        alt: i.nome,
        legenda: `${i.nome} · ${i.cidade}/${i.estado}`,
      }));
  }
  if (slides.length === 0) {
    slides.push({ src: heroCathedral, alt: "Interior de catedral barroca" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate overflow-hidden">
        <HeroCarousel slides={slides} />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/90" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32">
          <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold-soft">
            <span className="h-px w-10 bg-accent" /> Patrimônio · Fé · Tecnologia
          </p>
          <h1 className="max-w-4xl font-serif text-5xl leading-[1.05] text-background sm:text-6xl md:text-7xl lg:text-8xl">
            O sagrado, agora <em className="text-accent not-italic">eternizado</em> em pixels.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-background/80">
            Caminhe por dentro das catedrais, basílicas e santuários do Brasil em tours 3D imersivos.
            Acenda uma vela. Faça uma oração. Preserve a história para as próximas gerações.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/igrejas"
              className="group inline-flex items-center gap-3 bg-accent px-7 py-4 text-sm font-medium uppercase tracking-widest text-accent-foreground transition hover:opacity-90"
            >
              Explorar acervo
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/parceria"
              className="inline-flex items-center gap-3 border border-background/30 px-7 py-4 text-sm font-medium uppercase tracking-widest text-background transition hover:bg-background/10"
            >
              Sua igreja no projeto
            </Link>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-border bg-background">
        <img
          src={candles}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute left-1/2 top-0 h-px w-[min(72rem,calc(100%-3rem))] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-28">
          <div className="max-w-5xl">
            <p className="divider-ornament mb-8 max-w-xs text-xs uppercase tracking-[0.3em] text-gold">
              Manifesto
            </p>
            <div className="relative">
              <span className="pointer-events-none absolute -left-4 top-0 hidden h-24 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent md:block" />
              <span className="pointer-events-none absolute -right-4 bottom-0 hidden h-24 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent md:block" />
              <p className="font-serif text-3xl leading-snug text-foreground sm:text-4xl md:text-5xl">
                Um incêndio pode consumir{" "}
                <span className="relative inline-block text-accent">
                  séculos de história
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left animate-pulse bg-accent/50" />
                </span>{" "}
                em uma noite.
                <span className="text-muted-foreground"> Nosso compromisso é que </span>
                <span className="text-foreground">nenhuma oração</span>,{" "}
                <span className="text-foreground">nenhum altar</span>,{" "}
                <span className="text-foreground">nenhuma pintura sacra</span>{" "}
                <span className="text-muted-foreground">do Brasil se perca para o </span>
                <span className="relative inline-block text-accent">
                  esquecimento
                  <span className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-gold/15" />
                </span>
                <span className="text-muted-foreground">.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Três pilares</p>
              <h2 className="font-serif text-4xl md:text-5xl">Por que existimos</h2>
            </div>
            <p className="max-w-md text-muted-foreground">
              Uma plataforma na intersecção entre turismo experiencial, espiritualidade digital e
              preservação patrimonial.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
            {[
              {
                icon: Landmark,
                titulo: "Preservar",
                texto:
                  "Escaneamento LIDAR + fotogrametria de altíssima precisão. Um backup digital permanente do patrimônio para futuras gerações e eventuais restauros.",
              },
              {
                icon: Heart,
                titulo: "Conectar",
                texto:
                  "Devotos no exterior, idosos, peregrinos e pessoas com mobilidade reduzida agora podem visitar o santuário de sua devoção sem barreiras.",
              },
              {
                icon: Scan,
                titulo: "Eternizar",
                texto:
                  "Cada altar, vitral e talha dourada documentado em 3D imersivo, com acervo de áudio-guias, história e iconografia narrada por especialistas.",
              },
            ].map((p) => (
              <div key={p.titulo} className="group bg-background p-10 transition hover:bg-card">
                <p.icon size={28} className="text-gold" strokeWidth={1.4} />
                <h3 className="mt-6 font-serif text-2xl">{p.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {destaque && (
        <section className="bg-background">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="relative overflow-hidden bg-secondary">
                <CinemaImage
                  images={[
                    destaque.imagem_url,
                    ...igrejas
                      .filter((i) => i.slug !== destaque.slug && i.imagem_url)
                      .map((i) => i.imagem_url),
                  ].filter(Boolean)}
                  alt={destaque.nome}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                <div className="absolute left-6 top-6 z-10 bg-gold px-3 py-1 text-xs uppercase tracking-widest text-ink">
                  Em destaque
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs uppercase tracking-[0.3em] text-gold">
                  {destaque.cidade}, {destaque.estado} · {destaque.estilo}
                </p>
                <h2 className="mt-4 font-serif text-4xl md:text-5xl">{destaque.nome}</h2>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  {destaque.descricao}
                </p>
                {destaque.pontos_de_fe.length > 0 && (
                  <div className="mt-10 grid grid-cols-2 gap-px bg-border">
                    {destaque.pontos_de_fe.map((p) => (
                      <div key={p} className="bg-background p-4 text-sm">
                        <span className="text-gold">✣ </span>
                        {p}
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  to="/igrejas/$slug"
                  params={{ slug: destaque.slug }}
                  className="group mt-10 inline-flex w-fit items-center gap-3 border-b border-foreground pb-1 text-sm uppercase tracking-widest"
                >
                  Entrar no tour virtual
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <ExplorarToursSection igrejas={igrejas} />

      <section className="relative overflow-hidden bg-ink text-background">
        <img
          src={candles}
          alt="Velas acesas em capela"
          width={1280}
          height={800}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-28 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Devoção</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">
              Acenda uma vela.<br />
              Onde quer que você esteja.
            </h2>
            <p className="mt-6 max-w-xl text-background/80">
              Dentro de cada tour, ofereça uma vela virtual com sua intenção. O valor é repartido
              com a paróquia local — sustentando o templo físico e o digital.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-background/70">
                <Flame size={18} className="text-gold" /> Pix instantâneo
              </span>
              <span className="flex items-center gap-2 text-background/70">
                <Heart size={18} className="text-gold" /> 70% para a paróquia
              </span>
              <span className="flex items-center gap-2 text-background/70">
                <Sparkles size={18} className="text-gold" /> Intenção personalizada
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-16 max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Para quem</p>
            <h2 className="font-serif text-4xl md:text-5xl">
              Uma plataforma para todos que reverenciam o sagrado.
            </h2>
          </div>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Devotos remotos", "Brasileiros no exterior e fiéis distantes do santuário de sua devoção."],
              ["Turistas religiosos", "Conheça o destino antes da romaria. Planeje sua peregrinação."],
              ["Idosos e PcD", "Acesso pleno a locais com escadarias, distâncias e restrições físicas."],
              ["Pesquisadores", "Documentação de alta resolução para historiadores e restauradores."],
              ["Educadores", "Material didático imersivo de arte sacra, história e arquitetura."],
              ["Paróquias e dioceses", "Ferramenta de captação turística e preservação patrimonial."],
            ].map(([t, d]) => (
              <div key={t} className="border-t border-border pt-6">
                <Users size={18} className="text-gold" strokeWidth={1.4} />
                <h3 className="mt-4 font-serif text-xl">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Comece sua jornada</p>
          <h2 className="mt-6 max-w-3xl font-serif text-4xl md:text-6xl">
            Cruze a nave. Aproxime-se do altar. <em className="text-gold not-italic">Ore.</em>
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/igrejas"
              className="inline-flex items-center gap-3 bg-ink px-7 py-4 text-sm uppercase tracking-widest text-background transition hover:bg-foreground"
            >
              Ver acervo completo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function ExplorarToursSection({ igrejas }: { igrejas: Igreja[] }) {
  const destaques = igrejas
    .flatMap((i) =>
      (i.tours_externos ?? []).map((url, idx) => ({
        id: `${i.slug}-${idx}`,
        url,
        idx,
        total: i.tours_externos.length,
        igreja: i,
      })),
    )
    .slice(0, 3);

  if (destaques.length === 0) return null;

  return (
    <section id="explorar-tours" className="border-y border-border bg-secondary/30 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold">
              <Compass size={12} /> Imersão Matterport
            </p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Explorar Tours</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Caminhe por dentro dos santuários do acervo em tours 3D imersivos.
            </p>
          </div>
          <Link
            to="/tours"
            className="group inline-flex items-center gap-2 border-b border-foreground pb-1 text-xs uppercase tracking-widest"
          >
            Ver todos os tours
            <ArrowRight size={14} className="transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
          {destaques.map((t) => (
            <Link
              key={t.id}
              to="/tours"
              hash={t.id}
              className="group relative block overflow-hidden bg-background"
            >
              {t.igreja.imagem_url ? (
                <img
                  src={t.igreja.imagem_url}
                  alt={t.igreja.nome}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="aspect-[4/3] w-full bg-secondary" />
              )}
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 bg-ink/80 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur">
                <Compass size={10} /> Matterport
                {t.total > 1 && <span className="text-background/70">· {t.idx + 1}/{t.total}</span>}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent p-5 text-background">
                <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-background/80">
                  <MapPin size={10} /> {t.igreja.cidade}, {t.igreja.estado}
                </p>
                <h3 className="mt-2 font-serif text-2xl">{t.igreja.nome}</h3>
                <span className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-gold">
                  Visitar tour <ArrowRight size={12} className="transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
