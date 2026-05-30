import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "pt" | "en" | "es";

type Dictionary = Record<string, unknown>;

const STORAGE_KEY = "sagrado-digital-language";

export const languages: Record<Language, { label: string; shortLabel: string; nativeLabel: string }> = {
  pt: { label: "Português", shortLabel: "PT", nativeLabel: "Português" },
  en: { label: "English", shortLabel: "EN", nativeLabel: "English" },
  es: { label: "Español", shortLabel: "ES", nativeLabel: "Español" },
};

const resources: Record<Language, Dictionary> = {
  pt: {
    common: {
      brandTitle: "Futuro Simulado",
      brandSubtitle: "A Nova Era do Turismo",
      adminPanel: "Painel admin",
      enter: "Entrar",
      exploreTours: "Explorar Tours",
      language: "Idioma",
      openMenu: "Menu",
      goHome: "Início",
      notFoundTitle: "Página não encontrada",
      notFoundDescription: "A página que você procura não existe ou foi movida.",
      tryAgain: "Tentar novamente",
      pageErrorTitle: "Esta página não carregou",
      pageErrorDescription: "Algo saiu errado. Tente atualizar ou volte para a página inicial.",
    },
    nav: {
      home: "Início",
      faithRoute: "Roteiro da Fé",
      news: "Notícias",
      gallery: "Galeria",
    },
    footer: {
      description:
        "Iniciativa Senac MT conectando história, fé e tecnologia por meio de experiências digitais, acervos visuais e tours imersivos.",
      navigate: "Navegar",
      contact: "Contato",
      social: "Redes sociais",
      where: "Onde estamos",
      regional: "Administração Regional Senac MT",
      open: "Abrir",
      mapTitle: "Mapa do Senac Mato Grosso",
      copyright: "Patrimônio eternizado em pixels.",
      officialSite: "Site oficial Senac MT",
    },
    home: {
      heroEyebrow: "Patrimônio · Fé · Tecnologia",
      heroTitlePrefix: "O sagrado, agora",
      heroTitleEmphasis: "eternizado",
      heroTitleSuffix: "em pixels.",
      heroText:
        "Caminhe por dentro das catedrais, basílicas e santuários do Brasil em tours 3D imersivos. Acenda uma vela. Faça uma oração. Preserve a história para as próximas gerações.",
      exploreCollection: "Explorar acervo",
      churchProject: "Sua igreja no projeto",
      manifestoEyebrow: "Manifesto",
      manifesto: "Um incêndio pode consumir séculos de história em uma noite. Nosso compromisso é que nenhuma oração, nenhum altar, nenhuma pintura sacra do Brasil se perca para o esquecimento.",
      pillarsEyebrow: "Três pilares",
      pillarsTitle: "Por que existimos",
      pillarsIntro:
        "Uma plataforma na intersecção entre turismo experiencial, espiritualidade digital e preservação patrimonial.",
      pillars: [
        {
          title: "Preservar",
          text:
            "Escaneamento LIDAR + fotogrametria de altíssima precisão. Um backup digital permanente do patrimônio para futuras gerações e eventuais restauros.",
        },
        {
          title: "Conectar",
          text:
            "Devotos no exterior, idosos, peregrinos e pessoas com mobilidade reduzida agora podem visitar o santuário de sua devoção sem barreiras.",
        },
        {
          title: "Eternizar",
          text:
            "Cada altar, vitral e talha dourada documentado em 3D imersivo, com acervo de áudio-guias, história e iconografia narrada por especialistas.",
        },
      ],
      featured: "Em destaque",
      enterVirtualTour: "Entrar no tour virtual",
      devotionEyebrow: "Devoção",
      devotionTitle: "Acenda uma vela. Onde quer que você esteja.",
      devotionText:
        "Dentro de cada tour, ofereça uma vela virtual com sua intenção. O valor é repartido com a paróquia local, sustentando o templo físico e o digital.",
      instantPix: "Pix instantâneo",
      parishShare: "70% para a paróquia",
      customIntention: "Intenção personalizada",
      audienceEyebrow: "Para quem",
      audienceTitle: "Uma plataforma para todos que reverenciam o sagrado.",
      audiences: [
        ["Devotos remotos", "Brasileiros no exterior e fiéis distantes do santuário de sua devoção."],
        ["Turistas religiosos", "Conheça o destino antes da romaria. Planeje sua peregrinação."],
        ["Idosos e PcD", "Acesso pleno a locais com escadarias, distâncias e restrições físicas."],
        ["Pesquisadores", "Documentação de alta resolução para historiadores e restauradores."],
        ["Educadores", "Material didático imersivo de arte sacra, história e arquitetura."],
        ["Paróquias e dioceses", "Ferramenta de captação turística e preservação patrimonial."],
      ],
      journeyEyebrow: "Comece sua jornada",
      journeyTitle: "Cruze a nave. Aproxime-se do altar. Ore.",
      fullCollection: "Ver acervo completo",
      matterport: "Imersão Matterport",
      toursTitle: "Explorar Tours",
      toursText: "Caminhe por dentro dos santuários do acervo em tours 3D imersivos.",
      allTours: "Ver todos os tours",
      visitTour: "Visitar tour",
      heroSlides: [
        ["Fachada da Mesquita de Cuiabá", "Futuro Simulado · Turismo imersivo"],
        ["Entrada com vitrais da Mesquita de Cuiabá", "Nova era do turismo · Acervo visual"],
        ["Sala de oração registrada para visita virtual", "Experiência digital · Patrimônio preservado"],
      ],
    },
    gallery: {
      pageTitle: "Galeria",
      eyebrow: "Acervo visual",
      intro: "Fotografias organizadas pelos três espaços religiosos registrados pelo projeto Sagrado Digital.",
      loading: "Carregando galeria...",
      error: "Não foi possível carregar a galeria agora. Tente novamente em instantes.",
      selected: "Selecionado",
      exploreSection: "Explorar seção",
      selectedGallery: "Galeria selecionada",
      visitRecommendations: "Recomendações de visita",
      visitInfo: "Informações de visita",
      address: "Endereço",
      phone: "Telefone",
      whatsapp: "WhatsApp",
      email: "E-mail",
      meetings: "Encontros",
      imagesInDivision: "imagens nesta divisão",
      noPhotos: "Ainda não há fotos publicadas para esta divisão.",
      photos: "fotos",
      close: "Fechar",
    },
    admin: {
      loginTitle: "Entrar no painel",
      createTitle: "Criar conta admin",
      panel: "Painel administrativo",
      restricted: "Acesso restrito ao administrador da plataforma.",
      email: "E-mail",
      password: "Senha",
      wait: "Aguarde...",
      createAccount: "Criar conta",
      firstTime: "Primeira vez? Criar conta admin",
      alreadyHave: "Já tenho conta · Entrar",
      backToSite: "Voltar ao site",
      verifying: "Verificando acesso...",
      restrictedToast: "Acesso restrito ao administrador.",
      sessionClosed: "Sessão encerrada.",
      myPassword: "Minha senha",
      viewSite: "Ver site",
      logout: "Sair",
      sidebarTitle: "Painel",
      dashboard: "Dashboard",
      churchesTours: "Igrejas & Tours",
      requests: "Solicitações",
      news: "Notícias",
      carousel: "Carrossel",
      gallery: "Galeria",
      pages: "Páginas",
      users: "Usuários",
    },
  },
  en: {
    common: {
      brandTitle: "Simulated Future",
      brandSubtitle: "The New Era of Tourism",
      adminPanel: "Admin panel",
      enter: "Sign in",
      exploreTours: "Explore Tours",
      language: "Language",
      openMenu: "Menu",
      goHome: "Home",
      notFoundTitle: "Page not found",
      notFoundDescription: "The page you are looking for does not exist or has been moved.",
      tryAgain: "Try again",
      pageErrorTitle: "This page did not load",
      pageErrorDescription: "Something went wrong. Try refreshing or go back home.",
    },
    nav: {
      home: "Home",
      faithRoute: "Faith Route",
      news: "News",
      gallery: "Gallery",
    },
    footer: {
      description:
        "A Senac MT initiative connecting history, faith and technology through digital experiences, visual collections and immersive tours.",
      navigate: "Navigate",
      contact: "Contact",
      social: "Social media",
      where: "Where we are",
      regional: "Senac MT Regional Administration",
      open: "Open",
      mapTitle: "Senac Mato Grosso map",
      copyright: "Heritage preserved in pixels.",
      officialSite: "Official Senac MT website",
    },
    home: {
      heroEyebrow: "Heritage · Faith · Technology",
      heroTitlePrefix: "The sacred, now",
      heroTitleEmphasis: "preserved",
      heroTitleSuffix: "in pixels.",
      heroText:
        "Walk inside Brazil's cathedrals, basilicas and sanctuaries through immersive 3D tours. Light a candle. Say a prayer. Preserve history for future generations.",
      exploreCollection: "Explore collection",
      churchProject: "Your church in the project",
      manifestoEyebrow: "Manifesto",
      manifesto: "A fire can consume centuries of history in one night. Our commitment is that no prayer, no altar and no sacred painting in Brazil is lost to oblivion.",
      pillarsEyebrow: "Three pillars",
      pillarsTitle: "Why we exist",
      pillarsIntro:
        "A platform at the intersection of experiential tourism, digital spirituality and heritage preservation.",
      pillars: [
        {
          title: "Preserve",
          text:
            "High-precision LIDAR scanning and photogrammetry. A permanent digital backup of heritage for future generations and possible restorations.",
        },
        {
          title: "Connect",
          text:
            "Devotees abroad, older adults, pilgrims and people with reduced mobility can visit their sanctuary of devotion without barriers.",
        },
        {
          title: "Eternalize",
          text:
            "Every altar, stained glass window and gilded carving documented in immersive 3D, with audio guides, history and iconography narrated by specialists.",
        },
      ],
      featured: "Featured",
      enterVirtualTour: "Enter virtual tour",
      devotionEyebrow: "Devotion",
      devotionTitle: "Light a candle. Wherever you are.",
      devotionText:
        "Inside each tour, offer a virtual candle with your intention. The value is shared with the local parish, supporting both the physical and digital temple.",
      instantPix: "Instant Pix",
      parishShare: "70% to the parish",
      customIntention: "Personal intention",
      audienceEyebrow: "Who it is for",
      audienceTitle: "A platform for everyone who honors the sacred.",
      audiences: [
        ["Remote devotees", "Brazilians abroad and faithful people far from their sanctuary of devotion."],
        ["Religious tourists", "Discover the destination before the pilgrimage. Plan your journey."],
        ["Older adults and PwD", "Full access to places with stairs, distances and physical restrictions."],
        ["Researchers", "High-resolution documentation for historians and restorers."],
        ["Educators", "Immersive educational material about sacred art, history and architecture."],
        ["Parishes and dioceses", "A tool for tourism engagement and heritage preservation."],
      ],
      journeyEyebrow: "Begin your journey",
      journeyTitle: "Cross the nave. Approach the altar. Pray.",
      fullCollection: "See full collection",
      matterport: "Matterport immersion",
      toursTitle: "Explore Tours",
      toursText: "Walk inside the sanctuaries in the collection through immersive 3D tours.",
      allTours: "See all tours",
      visitTour: "Visit tour",
      heroSlides: [
        ["Facade of the Cuiabá Mosque", "Simulated Future · Immersive tourism"],
        ["Entrance with stained glass at the Cuiabá Mosque", "New era of tourism · Visual collection"],
        ["Prayer room recorded for virtual visitation", "Digital experience · Preserved heritage"],
      ],
    },
    gallery: {
      pageTitle: "Gallery",
      eyebrow: "Visual collection",
      intro: "Photographs organized by the three religious spaces registered by the Sagrado Digital project.",
      loading: "Loading gallery...",
      error: "The gallery could not be loaded right now. Please try again shortly.",
      selected: "Selected",
      exploreSection: "Explore section",
      selectedGallery: "Selected gallery",
      visitRecommendations: "Visit recommendations",
      visitInfo: "Visit information",
      address: "Address",
      phone: "Phone",
      whatsapp: "WhatsApp",
      email: "Email",
      meetings: "Meetings",
      imagesInDivision: "images in this division",
      noPhotos: "There are no published photos for this division yet.",
      photos: "photos",
      close: "Close",
    },
    admin: {
      loginTitle: "Enter the panel",
      createTitle: "Create admin account",
      panel: "Administrative panel",
      restricted: "Access restricted to the platform administrator.",
      email: "Email",
      password: "Password",
      wait: "Please wait...",
      createAccount: "Create account",
      firstTime: "First time? Create admin account",
      alreadyHave: "I already have an account · Sign in",
      backToSite: "Back to site",
      verifying: "Checking access...",
      restrictedToast: "Access restricted to the administrator.",
      sessionClosed: "Session closed.",
      myPassword: "My password",
      viewSite: "View site",
      logout: "Log out",
      sidebarTitle: "Panel",
      dashboard: "Dashboard",
      churchesTours: "Churches & Tours",
      requests: "Requests",
      news: "News",
      carousel: "Carousel",
      gallery: "Gallery",
      pages: "Pages",
      users: "Users",
    },
  },
  es: {
    common: {
      brandTitle: "Futuro Simulado",
      brandSubtitle: "La Nueva Era del Turismo",
      adminPanel: "Panel admin",
      enter: "Entrar",
      exploreTours: "Explorar Tours",
      language: "Idioma",
      openMenu: "Menú",
      goHome: "Inicio",
      notFoundTitle: "Página no encontrada",
      notFoundDescription: "La página que buscas no existe o fue movida.",
      tryAgain: "Intentar de nuevo",
      pageErrorTitle: "Esta página no cargó",
      pageErrorDescription: "Algo salió mal. Intenta actualizar o vuelve al inicio.",
    },
    nav: {
      home: "Inicio",
      faithRoute: "Ruta de la Fe",
      news: "Noticias",
      gallery: "Galería",
    },
    footer: {
      description:
        "Iniciativa de Senac MT que conecta historia, fe y tecnología por medio de experiencias digitales, acervos visuales y tours inmersivos.",
      navigate: "Navegar",
      contact: "Contacto",
      social: "Redes sociales",
      where: "Dónde estamos",
      regional: "Administración Regional Senac MT",
      open: "Abrir",
      mapTitle: "Mapa de Senac Mato Grosso",
      copyright: "Patrimonio eternizado en píxeles.",
      officialSite: "Sitio oficial Senac MT",
    },
    home: {
      heroEyebrow: "Patrimonio · Fe · Tecnología",
      heroTitlePrefix: "Lo sagrado, ahora",
      heroTitleEmphasis: "eternizado",
      heroTitleSuffix: "en píxeles.",
      heroText:
        "Camina por dentro de catedrales, basílicas y santuarios de Brasil en tours 3D inmersivos. Enciende una vela. Haz una oración. Preserva la historia para las próximas generaciones.",
      exploreCollection: "Explorar acervo",
      churchProject: "Tu iglesia en el proyecto",
      manifestoEyebrow: "Manifiesto",
      manifesto: "Un incendio puede consumir siglos de historia en una noche. Nuestro compromiso es que ninguna oración, ningún altar y ninguna pintura sacra de Brasil se pierda en el olvido.",
      pillarsEyebrow: "Tres pilares",
      pillarsTitle: "Por qué existimos",
      pillarsIntro:
        "Una plataforma en la intersección entre turismo experiencial, espiritualidad digital y preservación patrimonial.",
      pillars: [
        {
          title: "Preservar",
          text:
            "Escaneo LIDAR y fotogrametría de altísima precisión. Una copia digital permanente del patrimonio para futuras generaciones y posibles restauraciones.",
        },
        {
          title: "Conectar",
          text:
            "Devotos en el exterior, adultos mayores, peregrinos y personas con movilidad reducida pueden visitar su santuario de devoción sin barreras.",
        },
        {
          title: "Eternizar",
          text:
            "Cada altar, vitral y talla dorada documentados en 3D inmersivo, con audioguías, historia e iconografía narrada por especialistas.",
        },
      ],
      featured: "Destacado",
      enterVirtualTour: "Entrar al tour virtual",
      devotionEyebrow: "Devoción",
      devotionTitle: "Enciende una vela. Dondequiera que estés.",
      devotionText:
        "Dentro de cada tour, ofrece una vela virtual con tu intención. El valor se comparte con la parroquia local, sosteniendo el templo físico y digital.",
      instantPix: "Pix instantáneo",
      parishShare: "70% para la parroquia",
      customIntention: "Intención personalizada",
      audienceEyebrow: "Para quién",
      audienceTitle: "Una plataforma para todos los que reverencian lo sagrado.",
      audiences: [
        ["Devotos remotos", "Brasileños en el exterior y fieles lejos de su santuario de devoción."],
        ["Turistas religiosos", "Conoce el destino antes de la romería. Planifica tu peregrinación."],
        ["Adultos mayores y PcD", "Acceso pleno a lugares con escaleras, distancias y restricciones físicas."],
        ["Investigadores", "Documentación de alta resolución para historiadores y restauradores."],
        ["Educadores", "Material didáctico inmersivo sobre arte sacro, historia y arquitectura."],
        ["Parroquias y diócesis", "Herramienta de captación turística y preservación patrimonial."],
      ],
      journeyEyebrow: "Comienza tu jornada",
      journeyTitle: "Cruza la nave. Acércate al altar. Ora.",
      fullCollection: "Ver acervo completo",
      matterport: "Inmersión Matterport",
      toursTitle: "Explorar Tours",
      toursText: "Camina por dentro de los santuarios del acervo en tours 3D inmersivos.",
      allTours: "Ver todos los tours",
      visitTour: "Visitar tour",
      heroSlides: [
        ["Fachada de la Mezquita de Cuiabá", "Futuro Simulado · Turismo inmersivo"],
        ["Entrada con vitrales de la Mezquita de Cuiabá", "Nueva era del turismo · Acervo visual"],
        ["Sala de oración registrada para visita virtual", "Experiencia digital · Patrimonio preservado"],
      ],
    },
    gallery: {
      pageTitle: "Galería",
      eyebrow: "Acervo visual",
      intro: "Fotografías organizadas por los tres espacios religiosos registrados por el proyecto Sagrado Digital.",
      loading: "Cargando galería...",
      error: "No fue posible cargar la galería ahora. Inténtalo de nuevo en unos instantes.",
      selected: "Seleccionado",
      exploreSection: "Explorar sección",
      selectedGallery: "Galería seleccionada",
      visitRecommendations: "Recomendaciones de visita",
      visitInfo: "Información de visita",
      address: "Dirección",
      phone: "Teléfono",
      whatsapp: "WhatsApp",
      email: "E-mail",
      meetings: "Encuentros",
      imagesInDivision: "imágenes en esta división",
      noPhotos: "Todavía no hay fotos publicadas para esta división.",
      photos: "fotos",
      close: "Cerrar",
    },
    admin: {
      loginTitle: "Entrar al panel",
      createTitle: "Crear cuenta admin",
      panel: "Panel administrativo",
      restricted: "Acceso restringido al administrador de la plataforma.",
      email: "E-mail",
      password: "Contraseña",
      wait: "Espera...",
      createAccount: "Crear cuenta",
      firstTime: "¿Primera vez? Crear cuenta admin",
      alreadyHave: "Ya tengo cuenta · Entrar",
      backToSite: "Volver al sitio",
      verifying: "Verificando acceso...",
      restrictedToast: "Acceso restringido al administrador.",
      sessionClosed: "Sesión finalizada.",
      myPassword: "Mi contraseña",
      viewSite: "Ver sitio",
      logout: "Salir",
      sidebarTitle: "Panel",
      dashboard: "Dashboard",
      churchesTours: "Iglesias & Tours",
      requests: "Solicitudes",
      news: "Noticias",
      carousel: "Carrusel",
      gallery: "Galería",
      pages: "Páginas",
      users: "Usuarios",
    },
  },
};

export type GallerySectionTranslation = {
  id: string;
  title: string;
  description: string;
  summary: string;
  details: string[];
  recommendations: string[];
  address: string;
  locationShort: string;
  phone: string;
  whatsapp: string;
  email: string;
  meetings: string;
  visitNote: string;
  reference: string;
  imageAlt?: string;
  keywords: string[];
};

export const gallerySectionTranslations: Record<Language, GallerySectionTranslation[]> = {
  pt: [
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
      imageAlt: "Fachada da Mesquita de Cuiabá com minarete",
      keywords: ["mesquita", "mesquita de cuiabá", "mesquita de cuiaba"],
    },
  ],
  en: [
    {
      id: "bom-despacho",
      title: "Eucharistic Sanctuary of Our Lady of Bom Despacho",
      description: "Neo-Gothic heritage, faith, history and a privileged view in the heart of Cuiabá.",
      summary:
        "One of Cuiabá's leading icons of religious and cultural tourism, the Eucharistic Sanctuary of Our Lady of Bom Despacho brings together Neo-Gothic architecture, historical memory, popular devotion and one of the most traditional urban views of Mato Grosso's capital.",
      details: [
        "Located at the top of Morro do Seminário, the sanctuary is part of an important urban visitation route, near the Mato Grosso Museum of Sacred Art and the former Our Lady of Conception Seminary.",
        "The current building began in 1918, connected to French friar Ambrósio Daydé and architect Léon Joseph Louis Mousnier. The site was listed as Historical Heritage of Mato Grosso in 1977.",
        "Its Neo-Gothic architecture, inspired by French cathedrals, stands out through vertical lines, striking towers and a strong visual presence in Cuiabá's landscape.",
        "The stained glass windows filter natural light and create a contemplative atmosphere, enriching photography, heritage interpretation and the visitor experience.",
        "For tourism routes, the site combines faith, history, architecture, sacred art and urban panorama, making it a strategic stop on Cuiabá city tours.",
      ],
      recommendations: [
        "Include the visit in religious, historical and cultural tourism routes through central Cuiabá.",
        "Combine the sanctuary with the Mato Grosso Museum of Sacred Art for a complete Morro do Seminário experience.",
        "Prioritize visits outside celebration times for architectural contemplation and photography.",
        "Confirm the religious schedule in advance, especially on festive dates and during the Our Lady of Bom Despacho celebration.",
      ],
      address: "Praça do Seminário, s/n - Dom Aquino, Cuiabá - MT, 78015-325",
      locationShort: "Dom Aquino, Cuiabá - MT",
      phone: "(65) 99946-1183",
      whatsapp: "(65) 99946-1183",
      email: "santuarioeucaristico@cuiabaarquidiocese.net",
      meetings: "Masses: Monday to Friday, 7 AM and 6 PM; Saturday, 7 AM; Sunday, 7 AM, 9 AM, 5 PM and 7 PM.",
      visitNote: "Religious visitation, cultural tourism and architectural contemplation according to the sanctuary schedule.",
      reference: "Information organized for tourism presentation based on public data, historical records and official visitation channels.",
      keywords: ["bom despacho", "our lady of bom despacho", "eucharistic sanctuary", "santuário eucarístico"],
    },
    {
      id: "grande-templo",
      title: "Great Temple",
      description: "A monumental evangelical landmark and reference for religious tourism and major events.",
      summary:
        "The state headquarters of the Evangelical Assembly of God Church in Mato Grosso, the Great Temple is one of Cuiabá's most imposing religious landmarks. Its scale, strategic location and vocation for large gatherings make it relevant for religious tourism, event tourism and urban routes in the capital.",
      details: [
        "Located on Avenida Historiador Rubens de Mendonça, known as Avenida do CPA, the temple sits on one of Cuiabá's main avenues, near government, shopping, hotel and mobility corridors.",
        "Construction began in 1985 and the temple was inaugurated on July 7, 1996, becoming the headquarters of the Assembly of God in Mato Grosso and one of the country's largest religious spaces.",
        "Conceived under Pastor Sebastião Rodrigues de Souza and designed by architect Walter Peixoto, the building draws attention for its monumental form and capacity to receive large audiences.",
        "The complex is often compared to a covered arena due to its scale, with a central nave prepared for tens of thousands of people at services, congresses, conventions and religious meetings.",
        "Beyond the main auditorium, the structure includes support rooms, administrative spaces, education, communication, food service, lodging and areas for caravans and large groups.",
      ],
      recommendations: [
        "Present the Great Temple as an evangelical religious tourism attraction and as a major event hub in Cuiabá.",
        "Include the site in urban routes focused on monumental architecture, faith, culture and social mobilization.",
        "For caravans and groups, confirm schedules, service times, events and visitation conditions in advance.",
        "Use its Avenida do CPA location as a logistical advantage for lodging, transport, food and access to other tourist spots.",
      ],
      address: "Av. Historiador Rubens de Mendonça, 3500 - Bosque da Saúde, Cuiabá - MT, 78050-000",
      locationShort: "Bosque da Saúde, Cuiabá - MT",
      phone: "(65) 3644-2233",
      whatsapp: "Not available in consulted public sources",
      email: "Not available in consulted official public sources",
      meetings: "Services, vigils, congresses, conventions and religious events. Schedules should be confirmed through official temple channels.",
      visitNote: "Visits, services and large events according to the official schedule.",
      reference: "Information organized for tourism presentation based on public data, historical records and official visitation channels.",
      keywords: ["great temple", "grande templo", "assembly of god", "evangelical church"],
    },
    {
      id: "mesquita-cuiaba",
      title: "Cuiabá Mosque",
      description: "Heritage of cultural diversity, Arab immigration and religious tourism in Cuiabá.",
      summary:
        "The Cuiabá Mosque is one of the most singular religious and cultural tourism attractions in Mato Grosso. It preserves the memory of Arab immigration, introduces Islamic tradition to visitors and expands the understanding of Cuiabá as a plural city shaped by different peoples, beliefs and cultural expressions.",
      details: [
        "The Syrian-Lebanese presence in Cuiabá dates back to the late 19th century, with records around 1890. This community strongly influenced commercial, social and cultural life in the capital.",
        "The Muslim Beneficent Society of Cuiabá was organized in the 1970s, and the temple was inaugurated in 1978, becoming a reference for the local Islamic community and visitors interested in history, religion and cultural exchange.",
        "The minaret, the building's most striking architectural element, stands out in the Bandeirantes neighborhood and represents the temple's visual identity.",
        "Inside, visitors encounter prayer rugs, stained glass, calligraphy and handmade drawings with sacred references from the Quran, creating an atmosphere of spirituality, art and learning.",
        "The mosque has become a place of welcome and cultural education, receiving groups, students, tourists and visitors interested in respectfully learning about Islamic faith.",
      ],
      recommendations: [
        "Include the mosque in routes about cultural diversity, immigration, religious tourism and heritage education.",
        "Schedule guided visits in advance for groups, schools, tour operators and researchers.",
        "Remove shoes before entering the prayer area, using the indicated space at the entrance.",
        "Wear modest clothing covering shoulders and knees, respecting the sacred character of the site.",
        "Women should cover hair and shoulders; when available, the temple provides a veil or scarf for visitors.",
      ],
      address: "Rua Baltazar Navarros, 09 - Morro da Luz, Bandeirantes, Cuiabá - MT, 78010-020",
      locationShort: "Bandeirantes, Cuiabá - MT",
      phone: "(65) 98416-7406",
      whatsapp: "(65) 98416-7406",
      email: "www.facebook.com/IslamCuiaba",
      meetings: "Daily prayers and guided visits by appointment. The site usually opens five times a day for Salat.",
      visitNote: "Guided visits, cultural education and religious tourism by appointment.",
      reference: "Information organized for tourism presentation based on public data, historical records and official visitation channels.",
      imageAlt: "Facade of the Cuiabá Mosque with minaret",
      keywords: ["mosque", "cuiaba mosque", "mesquita", "mesquita de cuiabá"],
    },
  ],
  es: [
    {
      id: "bom-despacho",
      title: "Santuario Eucarístico Nuestra Señora del Bom Despacho",
      description: "Patrimonio neogótico, fe, historia y vista privilegiada en el corazón de Cuiabá.",
      summary:
        "Uno de los principales íconos del turismo religioso y cultural de Cuiabá, el Santuario Eucarístico Nuestra Señora del Bom Despacho reúne arquitectura neogótica, memoria histórica, devoción popular y una de las vistas urbanas más tradicionales de la capital mato-grossense.",
      details: [
        "Ubicado en lo alto del Morro do Seminário, el santuario integra un importante eje de visita urbana, cerca del Museo de Arte Sacro de Mato Grosso y del antiguo Seminario Nuestra Señora de la Concepción.",
        "La construcción actual comenzó en 1918, vinculada al fraile francés Ambrósio Daydé y al arquitecto francés Léon Joseph Louis Mousnier. El conjunto fue declarado Patrimonio Histórico de Mato Grosso en 1977.",
        "La arquitectura neogótica, inspirada en catedrales francesas, se destaca por sus líneas verticales, torres marcantes y presencia visual en el paisaje de Cuiabá.",
        "Los vitrales filtran la luz natural y crean una atmósfera de contemplación, valorizando la experiencia de visita, fotografía e interpretación patrimonial.",
        "Para rutas turísticas, el espacio combina fe, historia, arquitectura, arte sacro y panorama urbano, siendo una parada estratégica en city tours de Cuiabá.",
      ],
      recommendations: [
        "Incluir la visita en rutas de turismo religioso, histórico y cultural por el centro de Cuiabá.",
        "Combinar el santuario con el Museo de Arte Sacro de Mato Grosso para una experiencia completa en el Morro do Seminário.",
        "Priorizar visitas fuera de los horarios de celebración para contemplación arquitectónica y registros fotográficos.",
        "Confirmar previamente la programación religiosa, especialmente en fechas festivas y durante la Fiesta de Nuestra Señora del Bom Despacho.",
      ],
      address: "Praça do Seminário, s/n - Dom Aquino, Cuiabá - MT, 78015-325",
      locationShort: "Dom Aquino, Cuiabá - MT",
      phone: "(65) 99946-1183",
      whatsapp: "(65) 99946-1183",
      email: "santuarioeucaristico@cuiabaarquidiocese.net",
      meetings: "Misas: lunes a viernes, 7h y 18h; sábado, 7h; domingo, 7h, 9h, 17h y 19h.",
      visitNote: "Visita religiosa, turismo cultural y contemplación arquitectónica según la programación del santuario.",
      reference: "Información organizada para presentación turística, con base en datos públicos, registros históricos y canales oficiales de visita.",
      keywords: ["bom despacho", "nuestra señora del bom despacho", "santuario eucarístico", "santuário eucarístico"],
    },
    {
      id: "grande-templo",
      title: "Gran Templo",
      description: "Marco evangélico monumental, referencia en turismo religioso y grandes eventos.",
      summary:
        "Sede estatal de la Iglesia Evangélica Asamblea de Dios en Mato Grosso, el Gran Templo es uno de los marcos religiosos más imponentes de Cuiabá. Su escala, ubicación estratégica y vocación para grandes encuentros lo convierten en un atractivo relevante para el turismo religioso, el turismo de eventos y las rutas urbanas de la capital.",
      details: [
        "Ubicado en la Avenida Historiador Rubens de Mendonça, conocida como Avenida do CPA, el templo está en una de las principales vías de Cuiabá, cerca del Centro Político Administrativo, centros comerciales, hoteles y corredores de movilidad urbana.",
        "La construcción comenzó en 1985 y fue inaugurada el 7 de julio de 1996, consolidándose como sede de la Asamblea de Dios en Mato Grosso y como uno de los mayores espacios religiosos del país.",
        "Ideado bajo el liderazgo del pastor Sebastião Rodrigues de Souza y proyectado por el arquitecto Walter Peixoto, el edificio llama la atención por su forma monumental y su capacidad de recibir grandes públicos.",
        "El complejo se compara frecuentemente con una arena cubierta por su escala, con una nave central preparada para recibir decenas de miles de personas en cultos, congresos, convenciones y encuentros religiosos.",
        "Además del auditorio principal, la estructura alberga salas de apoyo, espacios administrativos, ambientes de enseñanza, comunicación, alimentación, alojamiento y áreas para caravanas y grandes grupos.",
      ],
      recommendations: [
        "Presentar el Gran Templo como atractivo de turismo religioso evangélico y como polo de grandes eventos en Cuiabá.",
        "Incluir el espacio en rutas urbanas que valoren arquitectura monumental, fe, cultura y movilización social.",
        "Para caravanas y grupos, confirmar previamente programación, horarios de cultos, eventos y condiciones de visita.",
        "Explorar la ubicación en la Avenida do CPA como ventaja logística para hospedaje, transporte, alimentación y acceso a otros puntos turísticos.",
      ],
      address: "Av. Historiador Rubens de Mendonça, 3500 - Bosque da Saúde, Cuiabá - MT, 78050-000",
      locationShort: "Bosque da Saúde, Cuiabá - MT",
      phone: "(65) 3644-2233",
      whatsapp: "No informado en fuente pública consultada",
      email: "No informado en fuente oficial pública consultada",
      meetings: "Cultos, vigilias, congresos, convenciones y eventos religiosos. La programación debe confirmarse en los canales oficiales del templo.",
      visitNote: "Visitas, cultos y grandes eventos según programación oficial.",
      reference: "Información organizada para presentación turística, con base en datos públicos, registros históricos y canales oficiales de visita.",
      keywords: ["gran templo", "grande templo", "asamblea de dios", "iglesia evangélica"],
    },
    {
      id: "mesquita-cuiaba",
      title: "Mezquita de Cuiabá",
      description: "Patrimonio de diversidad cultural, inmigración árabe y turismo religioso en Cuiabá.",
      summary:
        "La Mezquita de Cuiabá es uno de los atractivos más singulares del turismo religioso y cultural de Mato Grosso. El espacio preserva la memoria de la inmigración árabe, presenta la tradición islámica al público visitante y amplía la lectura de Cuiabá como ciudad plural, formada por diferentes pueblos, creencias y expresiones culturales.",
      details: [
        "La presencia sirio-libanesa en Cuiabá se remonta al final del siglo XIX, con registros alrededor de 1890. Esta comunidad participó fuertemente en la vida comercial, social y cultural de la capital.",
        "La Sociedad Beneficente Musulmana de Cuiabá fue organizada en la década de 1970, y el templo fue inaugurado en 1978, convirtiéndose en referencia para la comunidad islámica local y para visitantes interesados en historia, religión e intercambio cultural.",
        "El minarete, elemento arquitectónico más notable del edificio, se destaca en el paisaje del barrio Bandeirantes y representa la identidad visual del templo.",
        "En el interior, la visita presenta alfombras de oración, vitrales, caligrafías y dibujos hechos a mano con referencias sagradas del Corán, componiendo un ambiente de espiritualidad, arte y aprendizaje.",
        "La mezquita se consolidó como espacio de acogida y educación cultural, recibiendo grupos, estudiantes, turistas y visitantes interesados en conocer la fe islámica de forma respetuosa y guiada.",
      ],
      recommendations: [
        "Incluir la mezquita en rutas de diversidad cultural, inmigración, turismo religioso y educación patrimonial.",
        "Agendar previamente visitas guiadas para grupos, escuelas, operadores turísticos e investigadores.",
        "Retirar los zapatos antes de acceder al área de oración, utilizando el espacio indicado en la entrada.",
        "Usar vestimenta discreta, con hombros y rodillas cubiertos, respetando el carácter sagrado del lugar.",
        "Las mujeres deben cubrir cabello y hombros; cuando está disponible, el templo proporciona velo o pañuelo para visitantes.",
      ],
      address: "Rua Baltazar Navarros, 09 - Morro da Luz, Bandeirantes, Cuiabá - MT, 78010-020",
      locationShort: "Bandeirantes, Cuiabá - MT",
      phone: "(65) 98416-7406",
      whatsapp: "(65) 98416-7406",
      email: "www.facebook.com/IslamCuiaba",
      meetings: "Oraciones diarias y visitas guiadas mediante agendamiento. El lugar suele abrir cinco veces al día para la práctica del Salat.",
      visitNote: "Visitas guiadas, educación cultural y turismo religioso mediante agendamiento.",
      reference: "Información organizada para presentación turística, con base en datos públicos, registros históricos y canales oficiales de visita.",
      imageAlt: "Fachada de la Mezquita de Cuiabá con minarete",
      keywords: ["mezquita", "mezquita de cuiabá", "mesquita", "mesquita de cuiabá"],
    },
  ],
};

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "pt";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "pt" || saved === "en" || saved === "es") return saved;
  const browser = window.navigator.language.slice(0, 2).toLowerCase();
  if (browser === "en" || browser === "es") return browser;
  return "pt";
}

function readPath(source: Dictionary, path: string): unknown {
  return path.split(".").reduce<unknown>((current, part) => {
    if (current && typeof current === "object" && part in current) {
      return (current as Dictionary)[part];
    }
    return undefined;
  }, source);
}

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  tr: <T,>(key: string, fallback: T) => T;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt");

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : language;
  }, [language]);

  useEffect(() => {
    setLanguageState(getInitialLanguage());
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const dictionary = resources[language];
    const fallbackDictionary = resources.pt;

    return {
      language,
      setLanguage,
      t: (key) => {
        const value = readPath(dictionary, key) ?? readPath(fallbackDictionary, key);
        return typeof value === "string" ? value : key;
      },
      tr: (key, fallback) => {
        const value = readPath(dictionary, key) ?? readPath(fallbackDictionary, key);
        return (value ?? fallback) as typeof fallback;
      },
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
