// Catálogo do RELIC — porta tipada de unidade-1/js/products.js
// As imagens vivem em /public/assets e são resolvidas com o base do Vite.

export type Categoria = "vinil" | "cartas" | "livros" | "jogos";

export interface Product {
  id: string;
  category: Categoria;
  title: string;
  creatorLabel: string;
  creator: string;
  price: number;
  image: string;
  summary: string;
  details: string;
  condition: string;
  authenticity: string;
  availability: string;
  badge: string;
}

/** Prefixa o caminho do asset com o base configurado no Vite (ex.: /Projeto-IHC/). */
export const asset = (file: string): string => `${import.meta.env.BASE_URL}${file}`;

export const PRODUCTS: Product[] = [
  {
    id: "vinil-ariana-grande",
    category: "vinil",
    title: "Vinil Ariana Grande",
    creatorLabel: "Artista",
    creator: "Ariana Grande",
    price: 120,
    image: asset("assets/arianavinil.png"),
    summary: "Edição especial em acabamento premium para colecionadores de pop.",
    details:
      "Álbum em vinil com visual marcante, bom estado de conservação e foco em coleção contemporânea.",
    condition: "Lacrado",
    authenticity: "Certificado pela loja",
    availability: "3 unidades",
    badge: "Edição especial",
  },
  {
    id: "vinil-taylor-swift",
    category: "vinil",
    title: "Vinil Taylor Swift",
    creatorLabel: "Artista",
    creator: "Taylor Swift",
    price: 145,
    image: asset("assets/vinil-taylor-swift.png"),
    summary: "Álbum para colecionadores de pop contemporâneo em edição elegante.",
    details:
      "Item procurado por quem gosta de discos recentes com boa apresentação visual e autenticidade verificada.",
    condition: "Excelente",
    authenticity: "Selo verificado",
    availability: "1 unidade",
    badge: "Raro",
  },
  {
    id: "vinil-elton-john",
    category: "vinil",
    title: "Vinil Elton John",
    creatorLabel: "Artista",
    creator: "Elton John",
    price: 132,
    image: asset("assets/disco-de-vinil-elton-john.png"),
    summary: "Clássico restaurado para compor uma prateleira musical vintage.",
    details:
      "Disco com apelo nostálgico, autenticidade certificada e foco em quem gosta de artistas atemporais.",
    condition: "Muito bom",
    authenticity: "Certificado pela curadoria",
    availability: "2 unidades",
    badge: "Clássico",
  },
  {
    id: "vinil-michael-jackson",
    category: "vinil",
    title: "Vinil Michael Jackson",
    creatorLabel: "Artista",
    creator: "Michael Jackson",
    price: 158,
    image: asset("assets/Vinil Michael Jackson.png"),
    summary: "Edição especial pensada para coleções retrô e música pop clássica.",
    details:
      "Uma opção forte para quem quer um item reconhecível, bem apresentado e com verificação da equipe.",
    condition: "Excelente",
    authenticity: "Verificado pela equipe",
    availability: "4 unidades",
    badge: "Seleção da semana",
  },
  {
    id: "carta-charizard-holo",
    category: "cartas",
    title: "Charizard Holo",
    creatorLabel: "Coleção",
    creator: "Pokémon",
    price: 2500,
    image: asset("assets/Charizard Holo-carta.png"),
    summary: "Carta rara clássica para colecionadores de alto valor afetivo.",
    details:
      "Item premium com laudo de avaliação e procura constante entre colecionadores de TCG.",
    condition: "Mint",
    authenticity: "Laudo de avaliação",
    availability: "1 unidade",
    badge: "Edição limitada",
  },
  {
    id: "carta-pikachu-illustrator",
    category: "cartas",
    title: "Pikachu Illustrator",
    creatorLabel: "Coleção",
    creator: "Pokémon",
    price: 10000,
    image: asset("assets/pikachu-ilustrator-carta.png"),
    summary: "Uma das cartas mais desejadas do mercado de coleção.",
    details:
      "Produto de altíssima raridade com autenticidade reforçada por laudo internacional.",
    condition: "Mint",
    authenticity: "Laudo internacional",
    availability: "2 unidades",
    badge: "Raridade máxima",
  },
  {
    id: "carta-mewtwo-gx",
    category: "cartas",
    title: "Mewtwo GX",
    creatorLabel: "Coleção",
    creator: "Pokémon",
    price: 900,
    image: asset("assets/Mewtwo GX-carta.png"),
    summary: "Peça poderosa e muito procurada entre colecionadores.",
    details:
      "Carta com boa demanda, autenticidade verificada e perfil ideal para coleções modernas.",
    condition: "Excelente",
    authenticity: "Verificado pela loja",
    availability: "5 unidades",
    badge: "Clássico",
  },
  {
    id: "carta-rayquaza-ex",
    category: "cartas",
    title: "Rayquaza EX",
    creatorLabel: "Coleção",
    creator: "Pokémon",
    price: 1200,
    image: asset("assets/Rayquaza EX-carta.png"),
    summary: "Item lendário para ampliar uma coleção premium.",
    details:
      "Carta com visual forte, boa conservação e perfil de raridade atrativo para colecionadores.",
    condition: "Muito bom",
    authenticity: "Verificado pela curadoria",
    availability: "1 unidade",
    badge: "Raro",
  },
  {
    id: "livro-dom-casmurro",
    category: "livros",
    title: "Dom Casmurro",
    creatorLabel: "Autor",
    creator: "Machado de Assis",
    price: 80,
    image: asset("assets/Dom Casmurro-livro.png"),
    summary: "Clássico brasileiro em edição de colecionador.",
    details:
      "Livro com forte valor literário e visual tradicional, ideal para uma biblioteca clássica e organizada.",
    condition: "Novo",
    authenticity: "Edição original",
    availability: "6 unidades",
    badge: "Primeira edição",
  },
  {
    id: "livro-o-hobbit",
    category: "livros",
    title: "O Hobbit",
    creatorLabel: "Autor",
    creator: "J. R. R. Tolkien",
    price: 95,
    image: asset("assets/O Hobbit-livro.png"),
    summary: "Aventura fantástica em uma edição para fã de fantasia.",
    details:
      "Obra muito buscada por leitores de fantasia, com boa apresentação e curadoria verificada.",
    condition: "Excelente",
    authenticity: "Curadoria verificada",
    availability: "1 unidade",
    badge: "Raro",
  },
  {
    id: "livro-harry-potter",
    category: "livros",
    title: "Harry Potter",
    creatorLabel: "Autora",
    creator: "J. K. Rowling",
    price: 70,
    image: asset("assets/Harry Potter-livro.png"),
    summary: "Coleção querida para leitores de várias idades.",
    details:
      "Livro com apelo nostálgico e boa procura, indicado para quem quer montar uma estante pop e clássica.",
    condition: "Muito bom",
    authenticity: "Curadoria verificada",
    availability: "4 unidades",
    badge: "Coleção",
  },
  {
    id: "livro-1984",
    category: "livros",
    title: "1984",
    creatorLabel: "Autor",
    creator: "George Orwell",
    price: 60,
    image: asset("assets/1984-livro.png"),
    summary: "Distopia indispensável em uma prateleira de clássicos.",
    details:
      "Livro de leitura direta e impacto duradouro, ideal para quem procura uma obra reconhecida e fácil de apresentar no marketplace.",
    condition: "Excelente",
    authenticity: "Edição original",
    availability: "3 unidades",
    badge: "Primeira edição",
  },
  {
    id: "jogo-game-boy-advance",
    category: "jogos",
    title: "Game Boy Advance",
    creatorLabel: "Marca",
    creator: "Nintendo",
    price: 400,
    image: asset("assets/gameBoyadvance-removebg.png"),
    summary: "Console portátil clássico da Nintendo.",
    details:
      "Produto retrô com apelo forte para colecionadores e jogadores que valorizam portáteis clássicos.",
    condition: "Muito bom",
    authenticity: "Verificado pela loja",
    availability: "2 unidades",
    badge: "Clássico",
  },
  {
    id: "jogo-super-nintendo",
    category: "jogos",
    title: "Super Nintendo",
    creatorLabel: "Marca",
    creator: "Nintendo",
    price: 400,
    image: asset("assets/super nintendo-console.png"),
    summary: "Console clássico para quem coleciona grandes gerações dos games.",
    details:
      "Uma peça muito reconhecida do universo retrô, com apelo nostálgico e boa leitura visual na vitrine.",
    condition: "Muito bom",
    authenticity: "Verificado pela loja",
    availability: "3 unidades",
    badge: "Clássico",
  },
  {
    id: "jogo-atari-2600",
    category: "jogos",
    title: "Atari 2600",
    creatorLabel: "Marca",
    creator: "Atari",
    price: 550,
    image: asset("assets/atari.png"),
    summary: "Um dos consoles mais simbólicos da história dos games.",
    details:
      "Peça importante para qualquer coleção retrô, com visual reconhecível e alta carga nostálgica.",
    condition: "Muito bom",
    authenticity: "Curadoria verificada",
    availability: "2 unidades",
    badge: "Retrô",
  },
  {
    id: "jogo-nintendinho",
    category: "jogos",
    title: "Nintendinho",
    creatorLabel: "Marca",
    creator: "Nintendo",
    price: 1499,
    image: asset("assets/nintendinho.png"),
    summary: "Console 8 bits que revolucionou os games.",
    details:
      "Produto de alto interesse para colecionadores que buscam marcos importantes da história dos videogames.",
    condition: "Excelente",
    authenticity: "Verificado pela equipe",
    availability: "1 unidade",
    badge: "Raro",
  },
  {
    id: "jogo-game-boy-color",
    category: "jogos",
    title: "Game Boy Color",
    creatorLabel: "Marca",
    creator: "Nintendo",
    price: 1000,
    image: asset("assets/gameboycolor.png"),
    summary: "Versão colorida do clássico portátil.",
    details:
      "Item retrô que combina nostalgia, portabilidade e valor de coleção em um mesmo produto.",
    condition: "Excelente",
    authenticity: "Verificado pela loja",
    availability: "2 unidades",
    badge: "Edição especial",
  },
];

export const CATEGORIAS: { slug: Categoria; nome: string }[] = [
  { slug: "vinil", nome: "Vinil" },
  { slug: "cartas", nome: "Cartas" },
  { slug: "livros", nome: "Livros" },
  { slug: "jogos", nome: "Jogos" },
];

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  vinil: "Vinil",
  cartas: "Cartas",
  livros: "Livros",
  jogos: "Jogos",
};

export function formatarPreco(preco: number): string {
  return Number(preco).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function normalizarTexto(valor: string | undefined | null): string {
  return (valor || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function buscarProdutoPorId(id: string | null | undefined): Product | null {
  if (!id) return null;
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export function buscarProdutoPorNome(nome: string): Product | null {
  return PRODUCTS.find((p) => normalizarTexto(p.title) === normalizarTexto(nome)) ?? null;
}

/** Extrai o número de unidades de `availability` (ex.: "3 unidades" -> 3). */
export function obterEstoque(produto: Product | null): number {
  if (!produto) return 0;
  const match = String(produto.availability || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function obterRelacionados(produto: Product, limite = 3): Product[] {
  return PRODUCTS.filter(
    (item) => item.category === produto.category && item.id !== produto.id
  ).slice(0, limite);
}

export function obterBadge(produto: Product | null): string {
  if (!produto) return "Destaque";
  if (produto.badge) return produto.badge;
  if (normalizarTexto(produto.availability).includes("1 unidade")) return "Raro";
  if (normalizarTexto(produto.authenticity).includes("original")) return "Primeira edição";
  if (normalizarTexto(produto.condition).includes("lacrado")) return "Lacrado";
  if (produto.category === "jogos") return "Clássico";
  if (produto.category === "cartas") return "Edição limitada";
  if (produto.category === "livros") return "Coleção";
  return "Curadoria";
}

export function obterDestaquesDaSemana(): Product[] {
  return [
    buscarProdutoPorId("vinil-michael-jackson"),
    buscarProdutoPorId("carta-charizard-holo"),
    buscarProdutoPorId("livro-1984"),
  ].filter((p): p is Product => Boolean(p));
}

/** Filtra produtos por termo de busca em título, criador e categoria. */
export function filtrarPorTermo(termo: string): Product[] {
  const t = normalizarTexto(termo);
  if (!t) return PRODUCTS;
  return PRODUCTS.filter((p) =>
    normalizarTexto(`${p.title} ${p.creator} ${p.category}`).includes(t)
  );
}
