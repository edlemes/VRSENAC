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
import { gallerySectionTranslations, type GallerySectionTranslation, type Language, useI18n } from "@/lib/i18n";

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
    description: "Patrimônio neogótico, fé, história e vista privilegiada no coração de Cuiabá.",
    summary:
      "Um dos principais ícones do turismo religioso e cultural de Cuiabá, o Santuário Eucarístico Nossa Senhora do Bom Despacho reúne arquitetura neogótica, memória histórica, devoção popular e uma das vistas urbanas mais tradicionais da capital mato-grossense.",
    details: [
      "Localizado no alto do Morro do Seminário, o santuário integra um importante eixo de visitação urbana, próximo ao Museu de Arte Sacra de Mato Grosso e ao antigo Seminário Nossa Senhora da Conceição.",
      "A construção atual foi iniciada em 1918, com concepção ligada ao frei francês Ambrósio Daydé e projeto do arquiteto francês Léon Joseph Louis Mousnier. O conjunto foi tombado como Patrimônio Histórico do Estado de Mato Grosso em 1977.",
      "A arquitetura neogótica, inspirada em catedrais francesas, destaca-se pelas linhas verticais, torres marcantes e presença visual na paisagem de Cuiabá.",
      "Os vitrais, associados à tradição europeia de arte sacra, filtram a luz natural e criam uma atmosfera de contemplação, valorizando a experiência de visita, fotografia e interpretação patrimonial.",
      "Para roteiros turísticos, o espaço combina fé, história, arquitetura, arte sacra e panorama urbano, sendo uma parada estratégica em city tours de Cuiabá.",
    ],
    recommendations: [
      "Incluir a visita em roteiros de turismo religioso, histórico e cultural pelo centro de Cuiabá.",
      "Combinar o santuário com o Museu de Arte Sacra de Mato Grosso para uma experiência completa no Morro do Seminário.",
      "Priorizar visitas fora dos horários de celebração para contemplação arquitetônica e registros fotográficos.",
      "Confirmar previamente a programação religiosa, especialmente em datas festivas e durante a Festa de Nossa Senhora do Bom Despacho.",
    ],
    address: "Praça do Seminário, s/n - Dom Aquino, Cuiabá - MT, 78015-325",
    locationShort: "Dom Aquino, Cuiabá - MT",
    phone: "(65) 99946-1183",
    whatsapp: "(65) 99946-1183",
    email: "santuarioeucaristico@cuiabaarquidiocese.net",
    meetings: "Missas: segunda a sexta, 7h e 18h; sábado, 7h; domingo, 7h, 9h, 17h e 19h.",
    visitNote: "Visitação religiosa, turismo cultural e contemplação arquitetônica conforme programação do santuário.",
    reference: "Informações organizadas para apresentação turística, com base em dados públicos, registros históricos e canais oficiais de visitação.",
    icon: Church,
    keywords: ["bom despacho", "nossa senhora do bom despacho", "santuário eucarístico", "santuario eucaristico"],
  },
  {
    id: "grande-templo",
    title: "Grande Templo",
    description: "Marco evangélico monumental, referência em turismo religioso e grandes eventos.",
    summary:
      "Sede estadual da Igreja Evangélica Assembleia de Deus em Mato Grosso, o Grande Templo é um dos marcos religiosos mais imponentes de Cuiabá. Sua escala, localização estratégica e vocação para grandes encontros fazem do espaço um atrativo relevante para o turismo religioso, o turismo de eventos e os roteiros urbanos da capital.",
    details: [
      "Localizado na Avenida Historiador Rubens de Mendonça, conhecida como Avenida do CPA, o templo está em uma das principais vias de Cuiabá, próximo ao Centro Político Administrativo, shoppings, hotéis e corredores de mobilidade urbana.",
      "A construção teve início em 1985 e foi inaugurada em 7 de julho de 1996, consolidando-se como sede da Assembleia de Deus em Mato Grosso e como um dos maiores espaços religiosos do país.",
      "Idealizado sob a liderança do pastor Sebastião Rodrigues de Souza e projetado pelo arquiteto Walter Peixoto, o edifício chama atenção pela forma monumental e pela capacidade de receber grandes públicos.",
      "O complexo é frequentemente comparado a uma arena coberta pela sua escala, com nave central preparada para receber dezenas de milhares de pessoas em cultos, congressos, convenções e encontros religiosos.",
      "Além do auditório principal, a estrutura abriga salas de apoio, espaços administrativos, ambientes de ensino, comunicação, alimentação, alojamento e áreas destinadas ao atendimento de caravanas e grandes grupos.",
    ],
    recommendations: [
      "Apresentar o Grande Templo como atrativo de turismo religioso evangélico e como polo de grandes eventos em Cuiabá.",
      "Incluir o espaço em roteiros urbanos que valorizem arquitetura monumental, fé, cultura e mobilização social.",
      "Para caravanas e grupos, confirmar previamente a programação, horários de cultos, eventos e condições de visitação.",
      "Explorar a localização na Avenida do CPA como vantagem logística para hospedagem, transporte, alimentação e acesso a outros pontos turísticos da capital.",
    ],
    address: "Av. Historiador Rubens de Mendonça, 3500 - Bosque da Saúde, Cuiabá - MT, 78050-000",
    locationShort: "Bosque da Saúde, Cuiabá - MT",
    phone: "(65) 3644-2233",
    whatsapp: "Não informado em fonte pública consultada",
    email: "Não informado em fonte oficial pública consultada",
    meetings: "Cultos, vigílias, congressos, convenções e eventos religiosos. A programação deve ser confirmada nos canais oficiais do templo.",
    visitNote: "Visitação, cultos e grandes eventos mediante programação oficial.",
    reference: "Informações organizadas para apresentação turística, com base em dados públicos, registros históricos e canais oficiais de visitação.",
    icon: Landmark,
    keywords: ["grande templo", "assembleia de deus", "igreja evangélica", "igreja evangelica"],
  },
  {
    id: "mesquita-cuiaba",
    title: "Mesquita de Cuiabá",
    description: "Patrimônio de diversidade cultural, imigração árabe e turismo religioso em Cuiabá.",
    summary:
      "A Mesquita de Cuiabá é um dos atrativos mais singulares do turismo religioso e cultural de Mato Grosso. O espaço preserva a memória da imigração árabe, apresenta a tradição islâmica ao público visitante e amplia a leitura de Cuiabá como cidade plural, formada por diferentes povos, crenças e expressões culturais.",
    details: [
      "A presença sírio-libanesa em Cuiabá remonta ao fim do século XIX, com registros de chegada por volta de 1890. Essa comunidade teve forte participação na vida comercial, social e cultural da capital mato-grossense.",
      "A Sociedade Beneficente Muçulmana de Cuiabá foi organizada na década de 1970, e o templo foi inaugurado em 1978, tornando-se referência para a comunidade islâmica local e para visitantes interessados em história, religião e intercâmbio cultural.",
      "O minarete, elemento arquitetônico mais marcante do edifício, destaca-se na paisagem do bairro Bandeirantes e representa a identidade visual do templo.",
      "No interior, a experiência de visita apresenta tapetes de oração, vitrais, caligrafias e desenhos feitos à mão com referências sagradas do Alcorão, compondo um ambiente de espiritualidade, arte e aprendizado.",
      "A mesquita se consolidou como espaço de acolhimento e educação cultural, recebendo grupos, estudantes, turistas e visitantes interessados em conhecer a fé islâmica de forma respeitosa e guiada.",
    ],
    recommendations: [
      "Incluir a mesquita em roteiros de diversidade cultural, imigração, turismo religioso e educação patrimonial.",
      "Agendar previamente visitas guiadas para grupos, escolas, operadores turísticos e pesquisadores.",
      "Retirar os calçados antes de acessar a área de oração, utilizando o espaço indicado na entrada.",
      "Usar vestimenta discreta, com ombros e joelhos cobertos, respeitando o caráter sagrado do local.",
      "Mulheres devem cobrir cabelos e ombros; quando disponível, o próprio templo fornece véu ou lenço para visitantes.",
    ],
    address: "Rua Baltazar Navarros, 09 - Morro da Luz, Bandeirantes, Cuiabá - MT, 78010-020",
    locationShort: "Bandeirantes, Cuiabá - MT",
    phone: "(65) 98416-7406",
    whatsapp: "(65) 98416-7406",
    email: "www.facebook.com/IslamCuiaba",
    meetings: "Orações diárias e visitas guiadas mediante agendamento. O local costuma abrir cinco vezes ao dia para a prática do Salat.",
    visitNote: "Visitas guiadas, educação cultural e turismo religioso mediante agendamento.",
    reference: "Informações organizadas para apresentação turística, com base em dados públicos, registros históricos e canais oficiais de visitação.",
    imageUrl: mesquitaFachadaMinarete,
    imageAlt: "Fachada da Mesquita de Cuiabá com minarete",
    icon: MoonStar,
    keywords: ["mesquita", "mesquita de cuiabá", "mesquita de cuiaba"],
  },
];

type DisplayFoto = Pick<Foto, "id" | "titulo" | "descricao" | "alt_text" | "imagem_url">;
type LocalizedGallerySection = GallerySectionTranslation & {
  icon: typeof Church;
  imageUrl?: string;
  imageAlt?: string;
};

const staticSectionFotos: Record<Language, Record<string, DisplayFoto[]>> = {
  pt: {
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
  },
  en: {
    "mesquita-cuiaba": [
      {
        id: "mesquita-interior-mihrab",
        titulo: "Interior and mihrab",
        descricao: "Prayer room with handmade paintings and sacred Quranic inscriptions.",
        alt_text: "Interior of the Cuiabá Mosque with mihrab, stained glass and prayer rugs",
        imagem_url: mesquitaInteriorMihrab,
      },
      {
        id: "mesquita-visita-guiada",
        titulo: "Guided visit",
        descricao: "Cultural and religious presentation guided by a temple representative.",
        alt_text: "Guided visit inside the Cuiabá Mosque",
        imagem_url: mesquitaVisitaGuiada,
      },
      {
        id: "mesquita-sala-oracao",
        titulo: "Prayer room",
        descricao: "Room with stained glass, central chandelier and rugs used in daily prayers.",
        alt_text: "Wide prayer room at the Cuiabá Mosque with stained glass and rugs",
        imagem_url: mesquitaSalaOracao,
      },
      {
        id: "mesquita-fachada-minarete",
        titulo: "Minaret",
        descricao: "The mosque tower, a landmark in the Bandeirantes neighborhood landscape.",
        alt_text: "Facade of the Cuiabá Mosque with tall minaret",
        imagem_url: mesquitaFachadaMinarete,
      },
      {
        id: "mesquita-entrada-vitrais",
        titulo: "Entrance and stained glass",
        descricao: "Entrance area with colorful stained glass and a place to leave shoes.",
        alt_text: "Inner entrance of the Cuiabá Mosque with stained glass and shoe rack",
        imagem_url: mesquitaEntradaVitrais,
      },
    ],
  },
  es: {
    "mesquita-cuiaba": [
      {
        id: "mesquita-interior-mihrab",
        titulo: "Interior y mihrab",
        descricao: "Sala de oración con pinturas manuales y escrituras sagradas del Corán.",
        alt_text: "Interior de la Mezquita de Cuiabá con mihrab, vitrales y alfombras de oración",
        imagem_url: mesquitaInteriorMihrab,
      },
      {
        id: "mesquita-visita-guiada",
        titulo: "Visita guiada",
        descricao: "Presentación cultural y religiosa acompañada por un representante del templo.",
        alt_text: "Visita guiada en el interior de la Mezquita de Cuiabá",
        imagem_url: mesquitaVisitaGuiada,
      },
      {
        id: "mesquita-sala-oracao",
        titulo: "Sala de oración",
        descricao: "Ambiente con vitrales, lámpara central y alfombras usadas en las prácticas diarias.",
        alt_text: "Sala de oración amplia de la Mezquita de Cuiabá con vitrales y alfombras",
        imagem_url: mesquitaSalaOracao,
      },
      {
        id: "mesquita-fachada-minarete",
        titulo: "Minarete",
        descricao: "Torre de la mezquita, elemento destacado en el paisaje del barrio Bandeirantes.",
        alt_text: "Fachada de la Mezquita de Cuiabá con minarete alto",
        imagem_url: mesquitaFachadaMinarete,
      },
      {
        id: "mesquita-entrada-vitrais",
        titulo: "Entrada y vitrales",
        descricao: "Área de entrada con vitrales coloridos y espacio para dejar los zapatos.",
        alt_text: "Entrada interna de la Mezquita de Cuiabá con vitrales y zapatero",
        imagem_url: mesquitaEntradaVitrais,
      },
    ],
  },
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matchesSection(foto: Foto, section: LocalizedGallerySection) {
  const searchable = normalize([
    foto.titulo,
    foto.descricao,
    foto.alt_text,
    ...(foto.tags ?? []),
  ].join(" "));

  return section.keywords.some((keyword) => searchable.includes(normalize(keyword)));
}

function getSectionFotos(fotos: Foto[], sectionIndex: number, sections: LocalizedGallerySection[], language: Language) {
  const matched = fotos.filter((foto) => matchesSection(foto, sections[sectionIndex]));

  const withoutMatches = fotos.filter((foto) => !sections.some((section) => matchesSection(foto, section)));
  const fallback = matched.length > 0 ? [] : withoutMatches.filter((_, index) => index % sections.length === sectionIndex);
  return [...(staticSectionFotos[language][sections[sectionIndex].id] ?? []), ...matched, ...fallback];
}

function GaleriaPage() {
  const { language, t } = useI18n();
  const { data, isLoading, error } = useQuery({
    queryKey: ["galeria_fotos"],
    queryFn: listFotos,
  });
  const [active, setActive] = useState<DisplayFoto | null>(null);
  const [activeSection, setActiveSection] = useState(gallerySections[0].id);
  const fotos = data ?? [];
  const translatedSections: LocalizedGallerySection[] = gallerySectionTranslations[language].map((section) => {
    const presentation = gallerySections.find((item) => item.id === section.id) ?? gallerySections[0];
    return {
      ...section,
      icon: presentation.icon,
      imageUrl: "imageUrl" in presentation ? presentation.imageUrl : undefined,
      imageAlt: section.imageAlt ?? ("imageAlt" in presentation ? presentation.imageAlt : undefined),
    };
  });
  const selectedSectionIndex = Math.max(translatedSections.findIndex((section) => section.id === activeSection), 0);
  const selectedSection = translatedSections[selectedSectionIndex];
  const selectedFotos = getSectionFotos(fotos, selectedSectionIndex, translatedSections, language);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <header className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">{t("gallery.eyebrow")}</p>
          <h1 className="mt-3 font-serif text-4xl text-foreground md:text-5xl">{t("gallery.pageTitle")}</h1>
          <p className="mt-4 text-muted-foreground">
            {t("gallery.intro")}
          </p>
        </header>

        {isLoading && <p className="text-sm text-muted-foreground">{t("gallery.loading")}</p>}
        {error && (
          <p className="text-sm text-destructive">{t("gallery.error")}</p>
        )}

        {!isLoading && !error && (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              {translatedSections.map((section, index) => {
                const Icon = section.icon;
                const count = getSectionFotos(fotos, index, translatedSections, language).length;
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
                        {count} {t("gallery.photos")}
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
                        {isActive ? t("gallery.selected") : t("gallery.exploreSection")}
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
                  <p className="text-xs uppercase tracking-[0.24em] text-accent">{t("gallery.selectedGallery")}</p>
                  {selectedSection.imageUrl && (
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
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">{t("gallery.visitRecommendations")}</p>
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
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">{t("gallery.visitInfo")}</p>
                  <div className="mt-4 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-1">
                    <InfoItem icon={MapPin} label={t("gallery.address")} value={selectedSection.address} />
                    <InfoItem icon={Phone} label={t("gallery.phone")} value={selectedSection.phone} />
                    <InfoItem icon={MessageCircle} label="WhatsApp" value={selectedSection.whatsapp} />
                    <InfoItem icon={Mail} label={t("gallery.email")} value={selectedSection.email} />
                    <InfoItem icon={CalendarDays} label={t("gallery.meetings")} value={selectedSection.meetings} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground lg:col-span-2">{selectedFotos.length} {t("gallery.imagesInDivision")}</p>
              </div>

              {selectedFotos.length === 0 ? (
                <div className="rounded-sm border border-dashed border-border/70 bg-card/50 px-6 py-14 text-center">
                  <p className="text-sm text-muted-foreground">{t("gallery.noPhotos")}</p>
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
                        alt={f.alt_text || f.titulo || t("gallery.photos")}
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
            aria-label={t("gallery.close")}
            className="absolute right-4 top-4 rounded-full bg-background/10 p-2 text-background transition hover:bg-background/20"
            onClick={() => setActive(null)}
          >
            <X size={20} />
          </button>
          <div className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={active.imagem_url}
              alt={active.alt_text || active.titulo || t("gallery.photos")}
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
