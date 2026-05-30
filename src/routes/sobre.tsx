import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getPagina, splitParagrafos } from "@/lib/paginas";
import { Camera, Glasses, Mic, Globe, Layers, ScanLine } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o Projeto — Sagrado Digital" },
      {
        name: "description",
        content:
          "Conheça a missão do Sagrado Digital: preservar o patrimônio religioso brasileiro através de gêmeos digitais imersivos.",
      },
      { property: "og:title", content: "Sobre o Sagrado Digital" },
      {
        property: "og:description",
        content:
          "Patrimônio, fé e tecnologia. Conheça a missão e o roadmap do projeto.",
      },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  // Conteúdo editável pelo Painel Admin (Páginas → Sobre); cai no texto padrão se vazio.
  const { data: pagina } = useQuery({
    queryKey: ["pagina", "sobre"],
    queryFn: () => getPagina("sobre"),
  });
  const eyebrow = pagina?.subtitulo?.trim();
  const titulo = pagina?.titulo?.trim();
  const conteudo = pagina?.conteudo?.trim();
  const heroImg = pagina?.hero_imagem_url?.trim();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow || "Manifesto"}</p>
          <h1 className="mt-6 font-serif text-5xl leading-[1.1] md:text-7xl">
            {titulo ? (
              titulo
            ) : (
              <>
                Preservar é também um <em className="text-gold not-italic">ato de fé</em>.
              </>
            )}
          </h1>
          {conteudo ? (
            <div className="mt-10 max-w-3xl space-y-5 whitespace-pre-line text-xl leading-relaxed text-muted-foreground">
              {splitParagrafos(conteudo).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : (
            <p className="mt-10 max-w-3xl text-xl leading-relaxed text-muted-foreground">
              O Brasil abriga o maior conjunto barroco do mundo e a maior população católica do
              planeta. Mesmo assim, dezenas de igrejas históricas se deterioram a cada ano — e
              algumas, como vimos em Notre-Dame e no Museu Nacional, podem desaparecer em uma única
              noite. O <strong className="text-foreground">Sagrado Digital</strong> nasce para que
              isso nunca aconteça em silêncio.
            </p>
          )}
          {heroImg && (
            <img
              src={heroImg}
              alt=""
              loading="lazy"
              className="mt-12 aspect-[16/9] w-full rounded-md border border-border object-cover"
            />
          )}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Como funciona</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl">
            Do escâner ao altar virtual. Em quatro etapas.
          </h2>
          <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ScanLine, n: "01", t: "Escaneamento", d: "LIDAR + fotogrametria com precisão milimétrica de cada nave, altar e iconografia." },
              { icon: Layers, n: "02", t: "Gêmeo Digital", d: "Reconstrução 3D fotorrealista com texturas reais e iluminação preservada." },
              { icon: Mic, n: "03", t: "Curadoria", d: "Historiadores, párocos e restauradores narram a história de cada ponto de fé." },
              { icon: Globe, n: "04", t: "Publicação", d: "O templo entra no acervo. Acessível em qualquer dispositivo, do celular ao VR." },
            ].map((s) => (
              <div key={s.n} className="border-t border-gold pt-6">
                <p className="text-xs text-gold">{s.n}</p>
                <s.icon size={28} className="mt-4 text-foreground" strokeWidth={1.4} />
                <h3 className="mt-4 font-serif text-2xl">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Roadmap</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">O futuro do sagrado.</h2>
          <div className="mt-16 space-y-px bg-border">
            {[
              {
                ano: "2026",
                t: "Áudio-guias com IA e assistente conversacional",
                d: "Vozes naturais em português, espanhol, inglês e italiano. Pergunte qualquer coisa sobre a igreja e receba respostas com fontes.",
                icon: Mic,
              },
              {
                ano: "2027",
                t: "Realidade Aumentada in loco",
                d: "Aponte o celular para um altar restaurado e veja sobreposta a pintura original em camadas históricas.",
                icon: Camera,
              },
              {
                ano: "2028",
                t: "Realidade Virtual imersiva (Quest / Vision Pro)",
                d: "Experiência 6DoF para escolas, asilos e retiros espirituais. Caminhe pela nave em escala real.",
                icon: Glasses,
              },
              {
                ano: "2029",
                t: "Mapa global da fé",
                d: "Federação com santuários de Portugal, Itália, Terra Santa, Caminho de Santiago e Guadalupe.",
                icon: Globe,
              },
            ].map((r) => (
              <div key={r.ano} className="grid gap-6 bg-background p-8 md:grid-cols-[120px_60px_1fr]">
                <p className="font-serif text-3xl text-gold">{r.ano}</p>
                <r.icon size={24} className="text-foreground" strokeWidth={1.4} />
                <div>
                  <h3 className="font-serif text-2xl">{r.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-background">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="font-serif text-4xl md:text-5xl">
            Sua paróquia merece estar aqui.
          </h2>
          <p className="mt-6 text-background/70">
            Eternizamos sua igreja sem custo no programa piloto.
          </p>
          <Link
            to="/parceria"
            className="mt-10 inline-flex items-center bg-gold px-8 py-4 text-sm uppercase tracking-widest text-ink hover:bg-gold-soft"
          >
            Quero ser parceiro
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
