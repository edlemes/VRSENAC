import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, CalendarDays, Church, Landmark, Mail, MapPin, MessageCircle, MoonStar, Phone, X } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { listFotos, type Foto } from "@/lib/galeria";
import mesquitaInteriorMihrab from "@/assets/mesquita-interior-mihrab.jpg";
import mesquitaVisitaGuiada from "@/assets/mesquita-visita-guiada.jpg";
import mesquitaSalaOracao from "@/assets/mesquita-sala-oracao.jpg";
import mesquitaFachadaMinarete from "@/assets/mesquita-fachada-minarete.jpg";
import mesquitaEntradaVitrais from "@/assets/mesquita-entrada-vitrais.jpg";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria — Sagrado Digital · Senac MT" },
      { name: "description", content: "Galeria de fotos do acervo Sagrado Digital — igrejas e patrimônio." },
      { property: "og:title", content: "Galeria — Sagrado Digital" },
      { property: "og:description", content: "Fotos do acervo Sagrado Digital." },
    ],
  }),
  component: GaleriaPage,
});

const gallerySections = [
  {
    id: "bom-despacho",
    title: "Santuário Eucarístico Nossa Senhora do Bom Despacho",
    description: "Registros do santuário, sua arquitetura, altar e detalhes devocionais.",
    summary:
      "Igreja católica de características neogóticas, localizada no alto do Morro do Seminário. A construção atual data de 1918 e o bem foi tombado em 1977.",
    address: "Praça do Seminário, s/n - Dom Aquino, Cuiabá - MT, 78015-325",
    locationShort: "Dom Aquino, Cuiabá - MT",
    phone: "(65) 99946-1183",
    whatsapp: "(65) 99946-1183",
    email: "santuarioeucaristico@cuiabaarquidiocese.net",
    meetings: "Missas: seg. a sex. 7h e 18h; sáb. 7h; dom. 7h, 9h, 17h e 19h.",
    visitNote: "Missas e visitação religiosa com programação da paróquia.",
    reference: "Dados consolidados a partir da Arquidiocese de Cuiabá e registros públicos.",
    icon: Church,
    keywords: ["bom despacho", "nossa senhora do bom despacho", "santuário eucarístico", "santuario eucaristico"],
  },
  {
    id: "grande-templo",
    title: "Grande Templo",
    description: "Sede da Igreja Evangélica Assembleia de Deus do Estado de Mato Grosso.",
    summary:
      "Sede da Igreja Evangélica Assembleia de Deus em Mato Grosso. Segundo a Wikipédia, a construção começou em 1985 e foi concluída em 1996.",
    address: "Av. Historiador Rubens de Mendonça, 3500 - Bosque da Saúde, Cuiabá - MT, 78050-000",
    locationShort: "Bosque da Saúde, Cuiabá - MT",
    phone: "(65) 3644-2233",
    whatsapp: "Não informado em fonte pública consultada",
    email: "Não informado em fonte oficial pública consultada",
    meetings: "Cultos, vigílias e eventos. Programação deve ser confirmada nos canais oficiais do templo.",
    visitNote: "Cultos e eventos religiosos. Confirme a programação antes da visita.",
    reference: "Dados consolidados a partir da Wikipédia e registros públicos.",
    icon: Landmark,
    keywords: ["grande templo", "assembleia de deus", "igreja evangélica", "igreja evangelica"],
  },
  {
    id: "mesquita-cuiaba",
    title: "Mesquita de Cuiabá",
    description: "Templo muçulmano aberto à visitação pública no bairro Bandeirantes.",
    summary:
      "A Mesquita Muçulmana de Cuiabá preserva uma parte importante da história sírio-libanesa na capital mato-grossense. A visita apresenta arquitetura, cultura e fé islâmica em um espaço que também se consolidou como ponto de turismo religioso.",
    details: [
      "Os primeiros registros da chegada de sírio-libaneses em Cuiabá aparecem por volta de 1890. No censo de 1920, já havia 91 cidadãos dessa origem na cidade.",
      "A pedra fundamental do templo foi lançada pela Sociedade Muçulmana em 1976, com apoio de cerca de 1.300 membros. A inauguração ocorreu em 1978, com a presença de autoridades locais, representantes de países árabes e lideranças religiosas.",
      "Durante a Copa de 2014, a mesquita recebeu centenas de visitantes, muitos vindos dos países que jogaram em Cuiabá.",
      "O edifício se destaca pelo minarete vindo da Arábia Saudita, visível de diferentes pontos da cidade. No interior, desenhos pintados à mão envolvem o ambiente com escrituras sagradas do Alcorão, vitrais coloridos e tapetes usados nas orações.",
      "A comunidade muçulmana local reúne descendentes de sírios, libaneses, senegaleses e nigerianos, além de brasileiros convertidos ao Islã.",
    ],
    recommendations: [
      "Entrar descalço, deixando os sapatos na entrada.",
      "Mulheres devem cobrir cabelos e ombros com véu fornecido no local.",
      "Usar roupas abaixo dos joelhos para acessar o espaço sagrado.",
      "Grupos, escolas e turistas devem agendar visita guiada pelo telefone ou pela página oficial.",
    ],
    address: "Rua Baltazar Navarros, 09 - Morro da Luz, Bandeirantes, Cuiabá - MT, 78010-020",
    locationShort: "Bandeirantes, Cuiabá - MT",
    phone: "(65) 98416-7406",
    whatsapp: "(65) 98416-7406",
    email: "www.facebook.com/IslamCuiaba",
    meetings: "Orações diárias e visitas guiadas mediante agendamento. A Prefeitura informa que o local costuma abrir cinco vezes ao dia para a prática do Salat.",
    visitNote: "Visitas guiadas mediante agendamento.",
    reference: "Dados atualizados com base em publicação da Prefeitura de Cuiabá sobre turismo religioso.",
    imageUrl: mesquitaFachadaMinarete,
    imageAlt: "Fachada da Mesquita de Cuiabá com minarete",
    icon: MoonStar,
    keywords: ["mesquita", "mesquita de cuiabá", "mesquita de cuiaba"],
  },
];

type DisplayFoto = Pick<Foto, "id" | "titulo" | "descricao" | "alt_text" | "imagem_url">;

const staticSectionFotos: Record<string, DisplayFoto[]> = {
  "mesquita-cuiaba": [
    {
      id: "mesquita-interior-mihrab",
      titulo: "Interior e mihrab",
      descricao: "Sala de oração com pinturas manuais e escrituras sagradas do Alcorão.",
      alt_text: "Interior da Mesquita de Cuiabá com mihrab, vitrais e tapetes de oração",
      imagem_url: mesquitaInteriorMihrab,
    },
    {
      id: "mesquita-visita-guiada",
      titulo: "Visita guiada",
      descricao: "Apresentação cultural e religiosa acompanhada por liderança do templo.",
      alt_text: "Visita guiada no interior da Mesquita de Cuiabá",
      imagem_url: mesquitaVisitaGuiada,
    },
    {
      id: "mesquita-sala-oracao",
      titulo: "Sala de oração",
      descricao: "Ambiente com vitrais, lustre central e tapetes usados nas práticas diárias.",
      alt_text: "Sala de oração ampla da Mesquita de Cuiabá com vitrais e tapetes",
      imagem_url: mesquitaSalaOracao,
    },
    {
      id: "mesquita-fachada-minarete",
      titulo: "Minarete",
      descricao: "Torre da mesquita, elemento marcante na paisagem do bairro Bandeirantes.",
      alt_text: "Fachada da Mesquita de Cuiabá com minarete alto",
      imagem_url: mesquitaFachadaMinarete,
    },
    {
      id: "mesquita-entrada-vitrais",
      titulo: "Entrada e vitrais",
      descricao: "Área de entrada com vitrais coloridos e espaço para deixar os calçados.",
      alt_text: "Entrada interna da Mesquita de Cuiabá com vitrais e sapateira",
      imagem_url: mesquitaEntradaVitrais,
    },
  ],
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matchesSection(foto: Foto, section: (typeof gallerySections)[number]) {
  const searchable = normalize([
    foto.titulo,
    foto.descricao,
    foto.alt_text,
    ...(foto.tags ?? []),
  ].join(" "));

  return section.keywords.some((keyword) => searchable.includes(normalize(keyword)));
}

function getSectionFotos(fotos: Foto[], sectionIndex: number) {
  const matched = fotos.filter((foto) => matchesSection(foto, gallerySections[sectionIndex]));

  const withoutMatches = fotos.filter((foto) => !gallerySections.some((section) => matchesSection(foto, section)));
  const fallback = matched.length > 0 ? [] : withoutMatches.filter((_, index) => index % gallerySections.length === sectionIndex);
  return [...(staticSectionFotos[gallerySections[sectionIndex].id] ?? []), ...matched, ...fallback];
}

function GaleriaPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["galeria_fotos"],
    queryFn: listFotos,
  });
  const [active, setActive] = useState<DisplayFoto | null>(null);
  const [activeSection, setActiveSection] = useState(gallerySections[0].id);
  const fotos = data ?? [];
  const selectedSectionIndex = Math.max(gallerySections.findIndex((section) => section.id === activeSection), 0);
  const selectedSection = gallerySections[selectedSectionIndex];
  const selectedFotos = getSectionFotos(fotos, selectedSectionIndex);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <header className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Acervo visual</p>
          <h1 className="mt-3 font-serif text-4xl text-foreground md:text-5xl">Galeria</h1>
          <p className="mt-4 text-muted-foreground">
            Fotografias organizadas pelos três espaços religiosos registrados pelo projeto Sagrado Digital.
          </p>
        </header>

        {isLoading && <p className="text-sm text-muted-foreground">Carregando galeria…</p>}
        {error && (
          <p className="text-sm text-destructive">Não foi possível carregar a galeria agora. Tente novamente em instantes.</p>
        )}

        {!isLoading && !error && (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              {gallerySections.map((section, index) => {
                const Icon = section.icon;
                const count = getSectionFotos(fotos, index).length;
                const isActive = section.id === activeSection;
                const paddedIndex = String(index + 1).padStart(2, "0");

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`group relative min-h-[19rem] overflow-hidden rounded-sm border p-6 text-left transition duration-300 ${
                      isActive
                        ? "border-accent bg-card shadow-[0_22px_60px_rgba(245,128,32,0.14)]"
                        : "border-border/70 bg-card hover:-translate-y-1 hover:border-accent/70 hover:shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
                    }`}
                  >
                    <span className="pointer-events-none absolute right-6 top-5 font-serif text-7xl leading-none text-foreground/[0.04] transition group-hover:text-accent/10">
                      {paddedIndex}
                    </span>

                    <div className="relative flex items-start justify-between gap-4">
                      <span className={`flex h-14 w-14 shrink-0 items-center justify-center border transition ${
                        isActive
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-accent/20 bg-accent/10 text-accent group-hover:border-accent/50"
                      }`}>
                        <Icon size={26} strokeWidth={1.35} />
                      </span>
                      <span className={`border px-3 py-2 text-[10px] uppercase tracking-[0.22em] transition ${
                        isActive
                          ? "border-accent/40 bg-accent/10 text-accent"
                          : "border-border/70 text-muted-foreground group-hover:border-accent/40 group-hover:text-accent"
                      }`}>
                        {count} fotos
                      </span>
                    </div>

                    <div className="relative mt-12 h-px w-16 bg-accent/50 transition group-hover:w-24" />

                    <h2 className="relative mt-6 max-w-[18rem] font-serif text-2xl leading-tight text-foreground">
                      {section.title}
                    </h2>
                    <p className="relative mt-4 text-sm leading-7 text-muted-foreground">
                      {section.description}
                    </p>

                    <div className="relative mt-8 flex items-center justify-between gap-4 border-t border-border/70 pt-5">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        {isActive ? "Selecionado" : "Explorar seção"}
                      </span>
                      <span className={`flex h-10 w-10 items-center justify-center border transition ${
                        isActive
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border text-muted-foreground group-hover:border-accent group-hover:text-accent"
                      }`}>
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <section>
              <div className="mb-5 grid gap-5 border-b border-border/70 pb-5 lg:grid-cols-[1fr_0.9fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-accent">Galeria selecionada</p>
                  {"imageUrl" in selectedSection && selectedSection.imageUrl && (
                    <img
                      src={selectedSection.imageUrl}
                      alt={selectedSection.imageAlt}
                      className="mt-4 aspect-[16/7] w-full rounded-sm object-cover grayscale-[10%]"
                      loading="lazy"
                    />
                  )}
                  <h2 className="mt-2 font-serif text-3xl leading-tight text-foreground">{selectedSection.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{selectedSection.summary}</p>
                  {"details" in selectedSection && selectedSection.details && (
                    <div className="mt-5 grid gap-3 text-sm leading-7 text-muted-foreground">
                      {selectedSection.details.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  {"recommendations" in selectedSection && selectedSection.recommendations && (
                    <div className="mt-6 border-l-2 border-accent/50 pl-4">
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">Recomendações de visita</p>
                      <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
                        {selectedSection.recommendations.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="mt-3 text-xs leading-6 text-muted-foreground/70">{selectedSection.reference}</p>
                </div>
                <div className="rounded-sm border border-border/70 bg-card/70 p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Informações de visita</p>
                  <div className="mt-4 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-1">
                    <InfoItem icon={MapPin} label="Endereço" value={selectedSection.address} />
                    <InfoItem icon={Phone} label="Telefone" value={selectedSection.phone} />
                    <InfoItem icon={MessageCircle} label="WhatsApp" value={selectedSection.whatsapp} />
                    <InfoItem icon={Mail} label="E-mail" value={selectedSection.email} />
                    <InfoItem icon={CalendarDays} label="Encontros" value={selectedSection.meetings} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground lg:col-span-2">{selectedFotos.length} imagens nesta divisão</p>
              </div>

              {selectedFotos.length === 0 ? (
                <div className="rounded-sm border border-dashed border-border/70 bg-card/50 px-6 py-14 text-center">
                  <p className="text-sm text-muted-foreground">Ainda não há fotos publicadas para esta divisão.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {selectedFotos.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActive(f)}
                      className="group relative aspect-square overflow-hidden rounded-sm border border-border/60 bg-muted transition hover:border-accent"
                    >
                      <img
                        src={f.imagem_url}
                        alt={f.alt_text || f.titulo || "Foto"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                      {(f.titulo || f.descricao) && (
                        <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/85 to-transparent p-3 text-left opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                          {f.titulo && <p className="text-sm font-medium text-background">{f.titulo}</p>}
                          {f.descricao && <p className="line-clamp-2 text-xs text-background/80">{f.descricao}</p>}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="Fechar"
            className="absolute right-4 top-4 rounded-full bg-background/10 p-2 text-background transition hover:bg-background/20"
            onClick={() => setActive(null)}
          >
            <X size={20} />
          </button>
          <div className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={active.imagem_url}
              alt={active.alt_text || active.titulo || "Foto"}
              className="max-h-[80vh] w-auto rounded-sm object-contain"
            />
            {(active.titulo || active.descricao) && (
              <div className="mt-3 text-background">
                {active.titulo && <p className="font-serif text-lg">{active.titulo}</p>}
                {active.descricao && <p className="text-sm text-background/80">{active.descricao}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 shrink-0 text-muted-foreground" size={16} />
      <span>
        <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground/60">{label}</span>
        <span className="mt-0.5 block leading-6 text-foreground/90">{value}</span>
      </span>
    </div>
  );
}
