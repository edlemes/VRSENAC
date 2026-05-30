import type { LucideIcon } from "lucide-react";
import { Church, Moon, Building2 } from "lucide-react";
import mesquitaFachadaMinarete from "@/assets/mesquita-fachada-minarete.jpg";

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

export function getTemplo(slug: string): Templo | undefined {
  return TEMPLOS.find((t) => t.slug === slug);
}
