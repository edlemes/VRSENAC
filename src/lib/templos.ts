import type { LucideIcon } from "lucide-react";
import { Church, Moon, Building2 } from "lucide-react";
import mesquitaFachadaMinarete from "@/assets/mesquita-fachada-minarete.jpg";
import type { Language } from "@/lib/i18n";

/**
 * Dados dos três templos religiosos icônicos de Cuiabá e suas
 * Trilhas de Aprendizagem gamificadas (em formato de linha do tempo).
 *
 * Fonte única consumida por:
 *  - os cards de impacto da Home,
 *  - o hub de trilhas (/roteiro-fe),
 *  - a trilha dedicada de cada templo (/roteiro-fe/$slug).
 */

export type Passo = {
  /** Identificador estável usado para persistir o progresso. */
  id: string;
  /** Marco da linha do tempo (ano ou fase). */
  marco: string;
  titulo: string;
  /** Mini-card explicativo, curto e marcante. */
  texto: string;
  /** Tópicos com informações extras da etapa. */
  destaques: string[];
  /** Dado de impacto destacado no card. */
  dado: { valor: string; rotulo: string };
  /** Curiosidade rápida / mini-desafio que o usuário marca como "Compreendido". */
  curiosidade: string;
};

/**
 * Selo de conquista no formato S.E.N.A.C: cada letra da sigla vira uma
 * palavra temática, criando um nome criativo e de impacto.
 */
export type Badge = {
  emoji: string;
  /** Título do explorador, ex.: "Guardião da Arte Sacra". */
  titulo: string;
  /** Sigla pontuada exibida na UI. */
  sigla: string;
  /** Desdobramento da sigla: uma palavra por letra de SENAC. */
  acronimo: { letra: string; palavra: string }[];
};

export type Trilha = {
  /** Foco temático da trilha, ex.: "Arte, Luz e Fé". */
  foco: string;
  badge: Badge;
  passos: Passo[];
};

export type Templo = {
  slug: string;
  ano: number;
  nome: string;
  tipo: string;
  frase: string;
  historia: string;
  destaques: string;
  gancho: string;
  icon: LucideIcon;
  imagem?: string;
  /** Classes de tema usadas nos gradientes e detalhes de cada card. */
  tema: {
    /** Gradiente de fundo do card (Tailwind). */
    gradiente: string;
    /** Cor de realce textual e bordas. */
    realce: string;
    /** Cor do brilho/halo no hover. */
    halo: string;
    /** Cor da barra de progresso preenchida. */
    barra: string;
    /** Rótulo curto da paleta, exibido na UI. */
    paleta: string;
  };
  trilha: Trilha;
};

export const TEMPLOS: Templo[] = [
  {
    slug: "santuario-bom-despacho",
    ano: 1918,
    nome: "Santuário Nossa Senhora do Bom Despacho",
    tipo: "Católico",
    frase: "A Notre-Dame no coração de Cuiabá.",
    historia:
      "Fundado em 1918 no alto do Morro do Seminário. Idealizado pelo frei francês Ambrósio Daydé e desenhado pelo arquiteto Léon Joseph Louis Mousnier. Tombado como Patrimônio Histórico em 1977.",
    destaques:
      "Arquitetura neogótica inspirada na Catedral de Notre-Dame de Lourdes (França). Possui belíssimos vitrais históricos importados diretamente da Bélgica, que criam um espetáculo de luz natural no interior do templo.",
    gancho:
      "Fica junto ao Museu de Arte Sacra de Mato Grosso. Excelente parada para city tours históricos.",
    icon: Church,
    tema: {
      gradiente: "from-blue-900/85 via-blue-800/70 to-amber-700/40",
      realce: "text-amber-300",
      halo: "bg-amber-400/30",
      barra: "bg-gradient-to-r from-blue-400 to-amber-300",
      paleta: "Azul & Ouro",
    },
    trilha: {
      foco: "Arte, Luz e Fé",
      badge: {
        emoji: "🪟",
        titulo: "Guardião da Arte Sacra",
        sigla: "S.E.N.A.C",
        acronimo: [
          { letra: "S", palavra: "Saber" },
          { letra: "E", palavra: "Estética" },
          { letra: "N", palavra: "Neogótico" },
          { letra: "A", palavra: "Arte" },
          { letra: "C", palavra: "Cultura" },
        ],
      },
      passos: [
        {
          id: "neogotico-tropicos",
          marco: "1918",
          titulo: "O Neogótico nos Trópicos",
          texto:
            "No alto do Morro do Seminário, o frei francês Ambrósio Daydé e o arquiteto Léon Joseph Louis Mousnier ergueram uma réplica em miniatura da Catedral de Notre-Dame de Lourdes. Trazer o gótico europeu para o calor de Cuiabá exigiu ousadia técnica — foi uma das primeiras obras da região a empregar concreto, material pioneiro no interior do Brasil à época.",
          destaques: [
            "Estilo neogótico francês: arcos ogivais, torres pontiagudas e verticalidade que conduz o olhar (e a oração) ao céu.",
            "Uso pioneiro do concreto na arquitetura religiosa de Mato Grosso.",
            "Inspiração direta na Notre-Dame de Lourdes, santuário mariano da França.",
          ],
          dado: { valor: "1918", rotulo: "Ano da fundação" },
          curiosidade:
            "Curiosidade rápida: as torres pontiagudas e os arcos não são só beleza — eram a tecnologia gótica para fazer o templo 'apontar' para o céu. Consegue imaginar Notre-Dame no meio de Cuiabá?",
        },
        {
          id: "segredo-vitrais",
          marco: "Bélgica",
          titulo: "O Segredo dos Vitrais",
          texto:
            "Os vitrais foram importados diretamente da Bélgica, terra de mestres vidreiros. Mais que decoração, são uma técnica medieval de catequese: contam passagens sagradas através do vidro colorido e da luz que atravessa o templo.",
          destaques: [
            "Vitrais históricos vindos da Bélgica, tradição europeia de vidraria sacra.",
            "Técnica medieval de narrar a fé pela cor e pela luz.",
            "A cada hora, o sol muda de ângulo e recria o espetáculo de cores no interior.",
          ],
          dado: { valor: "Bélgica", rotulo: "Origem dos vitrais" },
          curiosidade:
            "Mini-desafio do olhar: o templo nunca tem a mesma luz duas vezes. Visite em horários diferentes e veja como as cores no chão mudam ao longo do dia.",
        },
        {
          id: "coracao-morro",
          marco: "1977",
          titulo: "O Coração do Morro",
          texto:
            "O Morro do Seminário guarda a memória religiosa de Mato Grosso. Ao lado do santuário fica o Museu de Arte Sacra (MASMT), e o conjunto foi tombado como Patrimônio Histórico em 1977 — selando seu lugar na identidade cultural do estado.",
          destaques: [
            "Vizinho ao Museu de Arte Sacra de Mato Grosso (MASMT).",
            "Conjunto tombado como Patrimônio Histórico em 1977.",
            "Parada-chave de city tours históricos pela memória religiosa cuiabana.",
          ],
          dado: { valor: "1977", rotulo: "Tombamento histórico" },
          curiosidade:
            "Dica de roteiro: una a visita ao santuário e ao MASMT no mesmo passeio. É o coração preservado da fé cuiabana, feito sob medida para o turismo histórico.",
        },
      ],
    },
  },
  {
    slug: "mesquita-cuiaba",
    ano: 1978,
    nome: "Mesquita de Cuiabá",
    tipo: "Islâmico",
    frase: "A herança sírio-libanesa e o único templo muçulmano de Mato Grosso.",
    historia:
      "Inaugurada em 1978 pela Sociedade Beneficente Muçulmana de Cuiabá para celebrar a comunidade de imigrantes sírio-libaneses, que começou a chegar à cidade por volta de 1890.",
    destaques:
      "Seu imponente minarete (torre de oração) foi fabricado na Arábia Saudita e montado em Cuiabá. O interior conta com tapetes ornamentados artesanais e passagens do Alcorão pintadas à mão nas paredes.",
    gancho:
      "Turismo de imersão e diversidade cultural. Visitas guiadas com regras tradicionais (entrar descalço e uso de véu para mulheres).",
    icon: Moon,
    imagem: mesquitaFachadaMinarete,
    tema: {
      gradiente: "from-emerald-950/85 via-emerald-800/70 to-teal-700/40",
      realce: "text-emerald-300",
      halo: "bg-emerald-400/30",
      barra: "bg-gradient-to-r from-emerald-400 to-teal-300",
      paleta: "Verde Esmeralda",
    },
    trilha: {
      foco: "Imigração, Símbolos e Tradições",
      badge: {
        emoji: "🌍",
        titulo: "Embaixador das Culturas",
        sigla: "S.E.N.A.C",
        acronimo: [
          { letra: "S", palavra: "Saber" },
          { letra: "E", palavra: "Etnias" },
          { letra: "N", palavra: "Nações" },
          { letra: "A", palavra: "Ancestralidade" },
          { letra: "C", palavra: "Cultura" },
        ],
      },
      passos: [
        {
          id: "beirute-cuiaba",
          marco: "1890",
          titulo: "De Beirute a Cuiabá",
          texto:
            "A partir de 1890, famílias sírio-libanesas cruzaram o oceano e encontraram em Mato Grosso um novo lar — transformando o comércio e a culinária cuiabana. Em 1972 fundaram a Sociedade Beneficente Muçulmana e, em 1978, inauguraram o único templo islâmico do estado.",
          destaques: [
            "Imigração sírio-libanesa para Mato Grosso a partir de 1890.",
            "Sociedade Beneficente Muçulmana fundada em 1972.",
            "Templo inaugurado em 1978 — o único do estado.",
          ],
          dado: { valor: "1890", rotulo: "Início da imigração" },
          curiosidade:
            "Você sabia? Muito do que parece 'tipicamente cuiabano' no comércio e na mesa tem raízes árabes. A imigração reescreveu a cultura local.",
        },
        {
          id: "torre-arabe",
          marco: "Arábia Saudita",
          titulo: "A Torre Árabe",
          texto:
            "O imponente minarete — torre de onde tradicionalmente se chama para a oração — foi fabricado na Arábia Saudita e montado peça por peça em Cuiabá. No interior, tapetes ornamentados artesanais e passagens do Alcorão pintadas à mão cobrem as paredes, com o Mihrab indicando a direção de Meca.",
          destaques: [
            "Minarete fabricado na Arábia Saudita e montado em Cuiabá.",
            "Tapetes ornamentados artesanais cobrem o salão de orações.",
            "Caligrafia do Alcorão pintada à mão e o Mihrab apontando para Meca.",
          ],
          dado: { valor: "Arábia Saudita", rotulo: "Origem do minarete" },
          curiosidade:
            "Curiosidade rápida: o minarete atravessou continentes antes de apontar para o céu cuiabano. É arquitetura sagrada importada literalmente do berço do Islã.",
        },
        {
          id: "respeito-tradicao",
          marco: "1978",
          titulo: "Respeito e Tradição",
          texto:
            "Visitar a mesquita é um exercício de respeito: entra-se descalço, as mulheres usam véu e o espaço acompanha o ritmo das 5 orações diárias (Salat), precedidas pela ablução — o ritual de purificação com água.",
          destaques: [
            "Etiqueta de visita: entrar descalço; mulheres usam véu.",
            "Cinco orações diárias (Salat), precedidas pela ablução.",
            "Turismo de imersão e diversidade cultural com visitas guiadas.",
          ],
          dado: { valor: "5×/dia", rotulo: "Orações (Salat)" },
          curiosidade:
            "Mini-desafio cultural: cinco vezes por dia, o tempo para. Imagine pausar sua rotina cinco vezes para se reconectar com o sagrado — essa é a base do Salat.",
        },
      ],
    },
  },
  {
    slug: "grande-templo",
    ano: 1996,
    nome: "Grande Templo",
    tipo: "Evangélico · Assembleia de Deus",
    frase: "Uma estrutura monumental que desafia os limites do espaço.",
    historia:
      "Inaugurado em 1996 sob a liderança do Pastor Sebastião Rodrigues de Souza e projetado pelo arquiteto Walter Peixoto. Levou 11 anos para ser concluído.",
    destaques:
      "Um dos maiores templos da América Latina, com 100.500 m² de área construída. O auditório principal (nave) abriga confortavelmente entre 22.000 e 25.500 pessoas sentadas — maior que muitos estádios. O complexo possui faculdade própria, rádio, alojamentos e refeitórios.",
    gancho:
      "Turismo de eventos de grande porte e convenções religiosas que atraem caravanas do Brasil inteiro.",
    icon: Building2,
    tema: {
      gradiente: "from-amber-900/85 via-amber-700/65 to-yellow-600/40",
      realce: "text-amber-200",
      halo: "bg-amber-300/30",
      barra: "bg-gradient-to-r from-amber-400 to-yellow-300",
      paleta: "Ouro Âmbar",
    },
    trilha: {
      foco: "Monumentalidade e Impacto Social",
      badge: {
        emoji: "🏗️",
        titulo: "Mestre dos Megaprojetos",
        sigla: "S.E.N.A.C",
        acronimo: [
          { letra: "S", palavra: "Saber" },
          { letra: "E", palavra: "Engenharia" },
          { letra: "N", palavra: "Números" },
          { letra: "A", palavra: "Arquitetura" },
          { letra: "C", palavra: "Comunidade" },
        ],
      },
      passos: [
        {
          id: "escala-gigante",
          marco: "1996",
          titulo: "A Escala de Gigante",
          texto:
            "Inaugurado em 1996 após 11 anos de obras, o Grande Templo é um dos maiores da América Latina: 100.500 m² de área construída. Megaengenharia erguida sob a liderança do Pastor Sebastião Rodrigues de Souza, com projeto do arquiteto Walter Peixoto.",
          destaques: [
            "100.500 m² de área construída — um dos maiores templos da América Latina.",
            "11 anos de obras, concluídas em 1996.",
            "Liderança do Pastor Sebastião Rodrigues de Souza; projeto de Walter Peixoto.",
          ],
          dado: { valor: "100.500 m²", rotulo: "Área construída" },
          curiosidade:
            "Para comparar: 100 mil m² equivalem a cerca de 14 campos de futebol de área construída. É fé em escala monumental.",
        },
        {
          id: "voz-do-templo",
          marco: "Nave",
          titulo: "A Voz do Templo",
          texto:
            "A nave principal acomoda confortavelmente entre 22.000 e 25.500 pessoas sentadas — mais que muitos estádios. E a mensagem ultrapassa as paredes por meio de mídias próprias, como a Rádio Nazareno FM.",
          destaques: [
            "Nave principal para 22.000 a 25.500 pessoas sentadas.",
            "Capacidade maior que a de muitos estádios de futebol.",
            "Mídia própria, como a Rádio Nazareno FM.",
          ],
          dado: { valor: "25.500", rotulo: "Lugares sentados" },
          curiosidade:
            "Desafio de imaginação: um auditório que senta 25 mil pessoas. Muitos times de futebol jogam para plateias menores que isso.",
        },
        {
          id: "alem-da-fe",
          marco: "Hoje",
          titulo: "Muito Além da Fé",
          texto:
            "O complexo é uma estrutura social viva: abriga alojamentos de apoio, refeitórios e até uma faculdade própria, a FEICS. Fé e serviço social ocupando o mesmo endereço.",
          destaques: [
            "Faculdade própria (FEICS) dentro do complexo.",
            "Alojamentos de apoio e refeitórios para caravanas.",
            "Turismo de eventos e convenções religiosas de grande porte.",
          ],
          dado: { valor: "FEICS", rotulo: "Faculdade própria" },
          curiosidade:
            "Reflexão final: o templo não fecha as portas após o culto — ele forma, alimenta e acolhe. Turismo religioso encontra impacto social.",
        },
      ],
    },
  },
];

/** Texto traduzível de um passo (campos sobrescritos por idioma). */
type PassoTexto = {
  marco: string;
  titulo: string;
  texto: string;
  destaques: string[];
  curiosidade: string;
  dado: { valor: string; rotulo: string };
};

/** Texto traduzível de um templo. */
type TemploTexto = {
  nome: string;
  tipo: string;
  frase: string;
  foco: string;
  badgeTitulo: string;
  acronimo: { letra: string; palavra: string }[];
  passos: PassoTexto[];
};

/** Traduções EN/ES (PT é a base em TEMPLOS). */
const TEMPLO_TEXTS: Record<"en" | "es", Record<string, TemploTexto>> = {
  en: {
    "santuario-bom-despacho": {
      nome: "Sanctuary of Our Lady of Bom Despacho",
      tipo: "Catholic",
      frase: "Cuiabá's very own Notre-Dame.",
      foco: "Art, Light and Faith",
      badgeTitulo: "Guardian of Sacred Art",
      acronimo: [
        { letra: "S", palavra: "Study" },
        { letra: "E", palavra: "Elegance" },
        { letra: "N", palavra: "Neo-Gothic" },
        { letra: "A", palavra: "Art" },
        { letra: "C", palavra: "Culture" },
      ],
      passos: [
        {
          marco: "1918",
          titulo: "Neo-Gothic in the Tropics",
          texto:
            "At the top of Morro do Seminário, French friar Ambrósio Daydé and architect Léon Joseph Louis Mousnier built a miniature replica of the Cathedral of Notre-Dame de Lourdes. Bringing European Gothic to the heat of Cuiabá demanded technical daring — it was one of the region's pioneering works to use concrete.",
          destaques: [
            "French Neo-Gothic style: pointed arches, soaring towers and verticality that draws the eye (and prayer) to the sky.",
            "Pioneering use of concrete in the religious architecture of Mato Grosso.",
            "Direct inspiration from Notre-Dame de Lourdes, the Marian sanctuary in France.",
          ],
          curiosidade:
            "Quick fact: the pointed towers and arches weren't just beautiful — they were the Gothic technology to make the temple 'point' to heaven. Can you picture Notre-Dame in the middle of Cuiabá?",
          dado: { valor: "1918", rotulo: "Year founded" },
        },
        {
          marco: "Belgium",
          titulo: "The Secret of the Stained Glass",
          texto:
            "The stained glass was imported directly from Belgium, land of master glassmakers. More than decoration, it is a medieval technique: telling sacred stories through colored glass and the light that crosses the temple.",
          destaques: [
            "Historic stained glass from Belgium, Europe's sacred glasswork tradition.",
            "A medieval technique of narrating faith through color and light.",
            "Every hour, the sun shifts angle and recreates the spectacle of colors inside.",
          ],
          curiosidade:
            "Mini eye-challenge: the temple never has the same light twice. Visit at different times and watch the colors on the floor change through the day.",
          dado: { valor: "Belgium", rotulo: "Origin of the stained glass" },
        },
        {
          marco: "1977",
          titulo: "The Heart of the Hill",
          texto:
            "Morro do Seminário holds the religious memory of Mato Grosso. Next to the sanctuary stands the Museum of Sacred Art (MASMT), and the complex was listed as Historical Heritage in 1977.",
          destaques: [
            "Neighbor to the Mato Grosso Museum of Sacred Art (MASMT).",
            "Complex listed as Historical Heritage in 1977.",
            "A key stop on historical city tours through Cuiabá's religious memory.",
          ],
          curiosidade:
            "Route tip: combine the sanctuary and the MASMT in one visit. It is the preserved heart of Cuiabá's faith, tailor-made for historical tourism.",
          dado: { valor: "1977", rotulo: "Heritage listing" },
        },
      ],
    },
    "mesquita-cuiaba": {
      nome: "Cuiabá Mosque",
      tipo: "Islamic",
      frase: "The Syrian-Lebanese heritage and the only Muslim temple in Mato Grosso.",
      foco: "Immigration, Symbols and Traditions",
      badgeTitulo: "Ambassador of Cultures",
      acronimo: [
        { letra: "S", palavra: "Study" },
        { letra: "E", palavra: "Ethnicities" },
        { letra: "N", palavra: "Nations" },
        { letra: "A", palavra: "Ancestry" },
        { letra: "C", palavra: "Culture" },
      ],
      passos: [
        {
          marco: "1890",
          titulo: "From Beirut to Cuiabá",
          texto:
            "From 1890 onward, Syrian-Lebanese families crossed the ocean and found a new home in Mato Grosso — transforming Cuiabá's commerce and cuisine. In 1972 they founded the Muslim Beneficent Society and, in 1978, inaugurated the state's only Islamic temple.",
          destaques: [
            "Syrian-Lebanese immigration to Mato Grosso from 1890.",
            "Muslim Beneficent Society founded in 1972.",
            "Temple inaugurated in 1978 — the only one in the state.",
          ],
          curiosidade:
            "Did you know? Much of what looks 'typically cuiabano' in commerce and on the table has Arab roots. Immigration rewrote the local culture.",
          dado: { valor: "1890", rotulo: "Start of immigration" },
        },
        {
          marco: "Saudi Arabia",
          titulo: "The Arab Tower",
          texto:
            "The imposing minaret — the tower from which the call to prayer is traditionally made — was manufactured in Saudi Arabia and assembled piece by piece in Cuiabá. Inside, handcrafted ornate rugs and hand-painted passages from the Quran cover the walls, with the Mihrab pointing toward Mecca.",
          destaques: [
            "Minaret manufactured in Saudi Arabia and assembled in Cuiabá.",
            "Handcrafted ornate rugs cover the prayer hall.",
            "Hand-painted Quran calligraphy and the Mihrab pointing to Mecca.",
          ],
          curiosidade:
            "Quick fact: the minaret crossed continents before pointing to Cuiabá's sky. It is sacred architecture imported literally from the cradle of Islam.",
          dado: { valor: "Saudi Arabia", rotulo: "Origin of the minaret" },
        },
        {
          marco: "1978",
          titulo: "Respect and Tradition",
          texto:
            "Visiting the mosque is an exercise in respect: you enter barefoot, women wear a veil, and the space follows the rhythm of the five daily prayers (Salat), preceded by ablution — the purification ritual with water.",
          destaques: [
            "Visiting etiquette: enter barefoot; women wear a veil.",
            "Five daily prayers (Salat), preceded by ablution.",
            "Immersion and cultural-diversity tourism with guided visits.",
          ],
          curiosidade:
            "Cultural mini-challenge: five times a day, time stops. Imagine pausing your routine five times to reconnect with the sacred — that is the basis of Salat.",
          dado: { valor: "5×/day", rotulo: "Prayers (Salat)" },
        },
      ],
    },
    "grande-templo": {
      nome: "Great Temple",
      tipo: "Evangelical · Assembly of God",
      frase: "A monumental structure that defies the limits of space.",
      foco: "Monumentality and Social Impact",
      badgeTitulo: "Master of Megaprojects",
      acronimo: [
        { letra: "S", palavra: "Study" },
        { letra: "E", palavra: "Engineering" },
        { letra: "N", palavra: "Numbers" },
        { letra: "A", palavra: "Architecture" },
        { letra: "C", palavra: "Community" },
      ],
      passos: [
        {
          marco: "1996",
          titulo: "The Giant Scale",
          texto:
            "Inaugurated in 1996 after 11 years of works, the Great Temple is one of the largest in Latin America: 100,500 m² of built area. Pure mega-engineering, raised under the leadership of Pastor Sebastião Rodrigues de Souza, with a design by architect Walter Peixoto.",
          destaques: [
            "100,500 m² of built area — one of the largest temples in Latin America.",
            "11 years of works, completed in 1996.",
            "Led by Pastor Sebastião Rodrigues de Souza; designed by Walter Peixoto.",
          ],
          curiosidade:
            "For comparison: 100,000 m² is about 14 football pitches of built area. It is faith on a monumental scale.",
          dado: { valor: "100,500 m²", rotulo: "Built area" },
        },
        {
          marco: "Nave",
          titulo: "The Voice of the Temple",
          texto:
            "The main nave comfortably seats between 22,000 and 25,500 people — more than many stadiums. And the message goes beyond the walls through its own media, such as Rádio Nazareno FM.",
          destaques: [
            "Main nave for 22,000 to 25,500 seated people.",
            "Capacity greater than many football stadiums.",
            "Its own media, such as Rádio Nazareno FM.",
          ],
          curiosidade:
            "Imagination challenge: an auditorium that seats 25,000 people. Many football teams play for smaller crowds than that.",
          dado: { valor: "25,500", rotulo: "Seats" },
        },
        {
          marco: "Today",
          titulo: "Far Beyond Faith",
          texto:
            "The complex is a living social structure: it houses support lodging, dining halls and even its own college, FEICS. Faith and social service sharing the same address.",
          destaques: [
            "Its own college (FEICS) inside the complex.",
            "Support lodging and dining halls for caravans.",
            "Tourism for large events and religious conventions.",
          ],
          curiosidade:
            "Final reflection: the temple does not close its doors after worship — it educates, feeds and welcomes. Religious tourism meets social impact.",
          dado: { valor: "FEICS", rotulo: "Own college" },
        },
      ],
    },
  },
  es: {
    "santuario-bom-despacho": {
      nome: "Santuario Nuestra Señora del Bom Despacho",
      tipo: "Católico",
      frase: "La Notre-Dame en el corazón de Cuiabá.",
      foco: "Arte, Luz y Fe",
      badgeTitulo: "Guardián del Arte Sacro",
      acronimo: [
        { letra: "S", palavra: "Saber" },
        { letra: "E", palavra: "Estética" },
        { letra: "N", palavra: "Neogótico" },
        { letra: "A", palavra: "Arte" },
        { letra: "C", palavra: "Cultura" },
      ],
      passos: [
        {
          marco: "1918",
          titulo: "El Neogótico en los Trópicos",
          texto:
            "En lo alto del Morro do Seminário, el fraile francés Ambrósio Daydé y el arquitecto Léon Joseph Louis Mousnier erigieron una réplica en miniatura de la Catedral de Notre-Dame de Lourdes. Llevar el gótico europeo al calor de Cuiabá exigió audacia técnica: fue una de las obras pioneras de la región en usar concreto.",
          destaques: [
            "Estilo neogótico francés: arcos ojivales, torres elevadas y verticalidad que lleva la mirada (y la oración) al cielo.",
            "Uso pionero del concreto en la arquitectura religiosa de Mato Grosso.",
            "Inspiración directa en Notre-Dame de Lourdes, santuario mariano de Francia.",
          ],
          curiosidade:
            "Dato rápido: las torres y arcos puntiagudos no eran solo belleza, eran la tecnología gótica para hacer que el templo 'apuntara' al cielo. ¿Imaginas Notre-Dame en medio de Cuiabá?",
          dado: { valor: "1918", rotulo: "Año de fundación" },
        },
        {
          marco: "Bélgica",
          titulo: "El Secreto de los Vitrales",
          texto:
            "Los vitrales fueron importados directamente de Bélgica, tierra de maestros vidrieros. Más que decoración, son una técnica medieval: cuentan historias sagradas a través del vidrio de color y de la luz que atraviesa el templo.",
          destaques: [
            "Vitrales históricos venidos de Bélgica, tradición europea de arte sacro en vidrio.",
            "Técnica medieval de narrar la fe por el color y la luz.",
            "Cada hora, el sol cambia de ángulo y recrea el espectáculo de colores en el interior.",
          ],
          curiosidade:
            "Mini-desafío visual: el templo nunca tiene la misma luz dos veces. Visítalo a distintas horas y observa cómo cambian los colores en el suelo.",
          dado: { valor: "Bélgica", rotulo: "Origen de los vitrales" },
        },
        {
          marco: "1977",
          titulo: "El Corazón del Morro",
          texto:
            "El Morro do Seminário guarda la memoria religiosa de Mato Grosso. Junto al santuario está el Museo de Arte Sacro (MASMT), y el conjunto fue declarado Patrimonio Histórico en 1977.",
          destaques: [
            "Vecino al Museo de Arte Sacro de Mato Grosso (MASMT).",
            "Conjunto declarado Patrimonio Histórico en 1977.",
            "Parada clave en city tours históricos por la memoria religiosa de Cuiabá.",
          ],
          curiosidade:
            "Consejo de ruta: une la visita al santuario y al MASMT en un mismo paseo. Es el corazón preservado de la fe cuiabana, hecho a medida para el turismo histórico.",
          dado: { valor: "1977", rotulo: "Declaración patrimonial" },
        },
      ],
    },
    "mesquita-cuiaba": {
      nome: "Mezquita de Cuiabá",
      tipo: "Islámico",
      frase: "La herencia sirio-libanesa y el único templo musulmán de Mato Grosso.",
      foco: "Inmigración, Símbolos y Tradiciones",
      badgeTitulo: "Embajador de las Culturas",
      acronimo: [
        { letra: "S", palavra: "Saber" },
        { letra: "E", palavra: "Etnias" },
        { letra: "N", palavra: "Naciones" },
        { letra: "A", palavra: "Ancestralidad" },
        { letra: "C", palavra: "Cultura" },
      ],
      passos: [
        {
          marco: "1890",
          titulo: "De Beirut a Cuiabá",
          texto:
            "A partir de 1890, familias sirio-libanesas cruzaron el océano y encontraron un nuevo hogar en Mato Grosso, transformando el comercio y la cocina de Cuiabá. En 1972 fundaron la Sociedad Beneficente Musulmana y, en 1978, inauguraron el único templo islámico del estado.",
          destaques: [
            "Inmigración sirio-libanesa a Mato Grosso desde 1890.",
            "Sociedad Beneficente Musulmana fundada en 1972.",
            "Templo inaugurado en 1978 — el único del estado.",
          ],
          curiosidade:
            "¿Sabías? Mucho de lo que parece 'típicamente cuiabano' en el comercio y la mesa tiene raíces árabes. La inmigración reescribió la cultura local.",
          dado: { valor: "1890", rotulo: "Inicio de la inmigración" },
        },
        {
          marco: "Arabia Saudita",
          titulo: "La Torre Árabe",
          texto:
            "El imponente minarete —torre desde donde tradicionalmente se llama a la oración— fue fabricado en Arabia Saudita y montado pieza por pieza en Cuiabá. En el interior, alfombras ornamentadas artesanales y pasajes del Corán pintados a mano cubren las paredes, con el Mihrab apuntando hacia La Meca.",
          destaques: [
            "Minarete fabricado en Arabia Saudita y montado en Cuiabá.",
            "Alfombras ornamentadas artesanales cubren la sala de oración.",
            "Caligrafía del Corán pintada a mano y el Mihrab apuntando a La Meca.",
          ],
          curiosidade:
            "Dato rápido: el minarete cruzó continentes antes de apuntar al cielo cuiabano. Es arquitectura sagrada importada literalmente de la cuna del Islam.",
          dado: { valor: "Arabia Saudita", rotulo: "Origen del minarete" },
        },
        {
          marco: "1978",
          titulo: "Respeto y Tradición",
          texto:
            "Visitar la mezquita es un ejercicio de respeto: se entra descalzo, las mujeres usan velo y el espacio sigue el ritmo de las cinco oraciones diarias (Salat), precedidas por la ablución, el ritual de purificación con agua.",
          destaques: [
            "Etiqueta de visita: entrar descalzo; las mujeres usan velo.",
            "Cinco oraciones diarias (Salat), precedidas por la ablución.",
            "Turismo de inmersión y diversidad cultural con visitas guiadas.",
          ],
          curiosidade:
            "Mini-desafío cultural: cinco veces al día, el tiempo se detiene. Imagina pausar tu rutina cinco veces para reconectar con lo sagrado: esa es la base del Salat.",
          dado: { valor: "5×/día", rotulo: "Oraciones (Salat)" },
        },
      ],
    },
    "grande-templo": {
      nome: "Gran Templo",
      tipo: "Evangélico · Asamblea de Dios",
      frase: "Una estructura monumental que desafía los límites del espacio.",
      foco: "Monumentalidad e Impacto Social",
      badgeTitulo: "Maestro de los Megaproyectos",
      acronimo: [
        { letra: "S", palavra: "Saber" },
        { letra: "E", palavra: "Ingeniería" },
        { letra: "N", palavra: "Números" },
        { letra: "A", palavra: "Arquitectura" },
        { letra: "C", palavra: "Comunidad" },
      ],
      passos: [
        {
          marco: "1996",
          titulo: "La Escala de Gigante",
          texto:
            "Inaugurado en 1996 tras 11 años de obras, el Gran Templo es uno de los mayores de América Latina: 100.500 m² de área construida. Megaingeniería pura, levantada bajo el liderazgo del pastor Sebastião Rodrigues de Souza, con proyecto del arquitecto Walter Peixoto.",
          destaques: [
            "100.500 m² de área construida — uno de los mayores templos de América Latina.",
            "11 años de obras, concluidas en 1996.",
            "Liderazgo del pastor Sebastião Rodrigues de Souza; proyecto de Walter Peixoto.",
          ],
          curiosidade:
            "Para comparar: 100 mil m² equivalen a unos 14 campos de fútbol de área construida. Es fe a escala monumental.",
          dado: { valor: "100.500 m²", rotulo: "Área construida" },
        },
        {
          marco: "Nave",
          titulo: "La Voz del Templo",
          texto:
            "La nave principal acomoda cómodamente entre 22.000 y 25.500 personas sentadas — más que muchos estadios. Y el mensaje traspasa las paredes mediante medios propios, como Rádio Nazareno FM.",
          destaques: [
            "Nave principal para 22.000 a 25.500 personas sentadas.",
            "Capacidad mayor que la de muchos estadios de fútbol.",
            "Medios propios, como Rádio Nazareno FM.",
          ],
          curiosidade:
            "Desafío de imaginación: un auditorio que sienta a 25 mil personas. Muchos equipos de fútbol juegan para públicos menores que ese.",
          dado: { valor: "25.500", rotulo: "Lugares sentados" },
        },
        {
          marco: "Hoy",
          titulo: "Mucho Más que Fe",
          texto:
            "El complejo es una estructura social viva: alberga alojamientos de apoyo, comedores e incluso una facultad propia, la FEICS. Fe y servicio social ocupando la misma dirección.",
          destaques: [
            "Facultad propia (FEICS) dentro del complejo.",
            "Alojamientos de apoyo y comedores para caravanas.",
            "Turismo de eventos y convenciones religiosas de gran porte.",
          ],
          curiosidade:
            "Reflexión final: el templo no cierra sus puertas tras el culto — forma, alimenta y acoge. El turismo religioso se encuentra con el impacto social.",
          dado: { valor: "FEICS", rotulo: "Facultad propia" },
        },
      ],
    },
  },
};

function localizarTemplo(t: Templo, txt: TemploTexto | undefined): Templo {
  if (!txt) return t;
  return {
    ...t,
    nome: txt.nome,
    tipo: txt.tipo,
    frase: txt.frase,
    trilha: {
      ...t.trilha,
      foco: txt.foco,
      badge: { ...t.trilha.badge, titulo: txt.badgeTitulo, acronimo: txt.acronimo },
      passos: t.trilha.passos.map((p, i) => ({ ...p, ...txt.passos[i] })),
    },
  };
}

/** Templos com textos no idioma ativo (PT é a base; EN/ES sobrescrevem). */
export function getTemplos(language: Language): Templo[] {
  if (language === "pt") return TEMPLOS;
  const textos = TEMPLO_TEXTS[language];
  return TEMPLOS.map((t) => localizarTemplo(t, textos[t.slug]));
}

export function getTemploLocalizado(language: Language, slug: string): Templo | undefined {
  return getTemplos(language).find((t) => t.slug === slug);
}

export function getTemplo(slug: string): Templo | undefined {
  return TEMPLOS.find((t) => t.slug === slug);
}
