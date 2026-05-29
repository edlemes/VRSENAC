## Objetivo

Os 3 tours Matterport (que serão cadastrados nas igrejas via `tours_externos`) precisam estar acessíveis pelo menu **"Explorar Tours"** da home, com uma seção dedicada na home e uma página própria.

## Mudanças

### 1. Página dedicada `/tours` (nova)
`src/routes/tours.tsx` — lista todos os tours Matterport cadastrados em todas as igrejas.
- Query: `listIgrejas()` → percorre cada igreja e expande seus `tours_externos` em "cards de tour" (nome da igreja, cidade/UF, imagem da igreja como capa, índice do tour quando houver mais de 1).
- Cada card tem um botão "Abrir tour" que rola até o iframe embutido inline (ou abre um modal/lightbox em tela cheia).
- Embed responsivo aspect-video, com `allow="autoplay; fullscreen; web-share; xr-spatial-tracking"`.
- Tracking de `tour_open` ao abrir/embed carregar (reusa `trackTourEvent`).
- Empty state amigável quando nenhuma igreja tem tour cadastrado.
- SEO: head() com title/description próprios.

### 2. Seção "Explorar Tours" na home (`src/routes/index.tsx`)
Nova seção com `id="explorar-tours"` exibindo até 3 tours em destaque (primeiros 3 encontrados em `tours_externos` entre as igrejas, ordem por destaque/nome).
- Grid de 3 cards: capa da igreja + nome + tag "Matterport" + botão "Visitar tour".
- Card clica → navega para `/tours#tour-{slug}-{idx}` (âncora pra rolar até o iframe na página dedicada) OU abre direto em nova aba.
- Link "Ver todos os tours →" no final → `/tours`.
- Estado vazio quando ainda não há tours.

### 3. Header (`src/components/SiteHeader.tsx`)
- Alterar o botão **"Explorar Tours"** (atualmente vai para `/igrejas`) para apontar para `/tours`.
- Adicionar item `{ to: "/tours", label: "Tours" }` no array `links` (desktop + mobile).

## Fora do escopo
- Tabela separada para tours; continua usando `igrejas.tours_externos`.
- Mudanças no admin (já fica gerenciado pelo cadastro da igreja).
- Hotspots dentro dos tours Matterport (não é editável externamente).
