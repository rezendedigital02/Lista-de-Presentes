import type { Gift, Category } from "@/types";

// Dados iniciais de presentes para demo
export const initialGifts: Gift[] = [
  // Cozinha
  {
    id: "1",
    name: "Jogo de Panelas Tramontina",
    description:
      "Jogo completo de panelas antiaderentes Tramontina com 10 peças, ideal para o dia a dia.",
    price: 1200,
    image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 350,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Air Fryer Philips Walita",
    description:
      "Fritadeira elétrica Air Fryer 4.1L, perfeita para preparar refeições saudáveis e crocantes.",
    price: 650,
    image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Liquidificador Oster",
    description:
      "Liquidificador Oster com 12 velocidades e jarra de vidro resistente.",
    price: 350,
    image_url: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Jogo de Talheres Tramontina",
    description:
      "Faqueiro completo em aço inox com 42 peças, design elegante e durável.",
    price: 550,
    image_url: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=500",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 550,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Cafeteira Nespresso",
    description:
      "Máquina de café expresso Nespresso com sistema de cápsulas, para um café perfeito.",
    price: 800,
    image_url: "https://images.unsplash.com/photo-1517467139951-f5a925c9f9de?w=500",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 200,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Mixer Philips Walita",
    description:
      "Mixer de mão com acessórios, ideal para sopas, molhos e vitaminas.",
    price: 280,
    image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Jogo de Pratos Porto Brasil",
    description:
      "Aparelho de jantar em cerâmica com 20 peças, design moderno e atemporal.",
    price: 450,
    image_url: "https://images.unsplash.com/photo-1603199506016-5938fcb9e0d2?w=500",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },

  // Quarto
  {
    id: "8",
    name: "Jogo de Cama King 400 Fios",
    description:
      "Jogo de cama king size em algodão egípcio 400 fios, conforto e elegância.",
    price: 600,
    image_url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "9",
    name: "Edredom King Toque de Pluma",
    description:
      "Edredom king size com enchimento de fibra siliconada, quente e macio.",
    price: 450,
    image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 150,
    created_at: new Date().toISOString(),
  },
  {
    id: "10",
    name: "Par de Travesseiros NASA",
    description:
      "Travesseiros com tecnologia NASA, viscoelástico que se adapta ao corpo.",
    price: 250,
    image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "11",
    name: "Luminária de Mesa Design",
    description:
      "Luminária de mesa com design moderno, luz ajustável e base elegante.",
    price: 320,
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },

  // Sala
  {
    id: "12",
    name: "Aparelho de Jantar 42 Peças",
    description:
      "Aparelho de jantar completo em porcelana com detalhes em dourado.",
    price: 900,
    image_url: "https://images.unsplash.com/photo-1595908129746-57ca1a63dd4d?w=500",
    category: "sala" as Category,
    is_available: true,
    amount_received: 400,
    created_at: new Date().toISOString(),
  },
  {
    id: "13",
    name: "Jogo de Taças de Cristal",
    description:
      "Conjunto de 12 taças de cristal para vinho e champagne, elegância à mesa.",
    price: 380,
    image_url: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=500",
    category: "sala" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "14",
    name: "Kit Almofadas Decorativas",
    description:
      "Conjunto de 4 almofadas decorativas em veludo, cores neutras e elegantes.",
    price: 180,
    image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    category: "sala" as Category,
    is_available: true,
    amount_received: 180,
    created_at: new Date().toISOString(),
  },
  {
    id: "15",
    name: "Quadro Decorativo Grande",
    description:
      "Quadro decorativo em canvas 80x60cm, arte abstrata moderna.",
    price: 350,
    image_url: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=500",
    category: "sala" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },

  // Banheiro
  {
    id: "16",
    name: "Jogo de Toalhas Egípcias",
    description:
      "Conjunto de 8 toalhas em algodão egípcio 500g/m², macias e absorventes.",
    price: 320,
    image_url: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=500",
    category: "banheiro" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "17",
    name: "Par de Roupões de Banho",
    description:
      "Roupões de banho felpudos tamanho G/GG, conforto após o banho.",
    price: 220,
    image_url: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500",
    category: "banheiro" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "18",
    name: "Kit Organizadores de Banheiro",
    description:
      "Conjunto de organizadores em bamboo para banheiro, prático e elegante.",
    price: 150,
    image_url: "https://images.unsplash.com/photo-1585412459212-d8b544cd8e4d?w=500",
    category: "banheiro" as Category,
    is_available: true,
    amount_received: 150,
    created_at: new Date().toISOString(),
  },

  // Eletrodomésticos
  {
    id: "19",
    name: "Aspirador Robô Xiaomi",
    description:
      "Robô aspirador com mapeamento inteligente, conectividade WiFi e app.",
    price: 2200,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 500,
    created_at: new Date().toISOString(),
  },
  {
    id: "20",
    name: "Microondas Brastemp 32L",
    description:
      "Microondas 32 litros com funções grill e receitas pré-programadas.",
    price: 750,
    image_url: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "21",
    name: "Lavadora de Roupas 12kg",
    description:
      "Máquina de lavar 12kg com lavagem automática e centrifugação potente.",
    price: 3200,
    image_url: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 1000,
    created_at: new Date().toISOString(),
  },
  {
    id: "22",
    name: "Geladeira Frost Free 400L",
    description:
      "Geladeira duplex frost free, design moderno e economia de energia.",
    price: 4500,
    image_url: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 1200,
    created_at: new Date().toISOString(),
  },

  // Experiências
  {
    id: "23",
    name: "Lua de Mel dos Sonhos",
    description:
      "Contribua para a nossa lua de mel! Qualquer valor ajuda a realizar nosso sonho.",
    price: 10000,
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500",
    category: "experiencias" as Category,
    is_available: true,
    amount_received: 2500,
    created_at: new Date().toISOString(),
  },
  {
    id: "24",
    name: "Jantar Romântico",
    description:
      "Experiência gastronômica em restaurante premiado para celebrar nosso amor.",
    price: 500,
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
    category: "experiencias" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "25",
    name: "Spa Day para o Casal",
    description:
      "Dia de spa completo com massagem relaxante, sauna e tratamentos especiais.",
    price: 700,
    image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500",
    category: "experiencias" as Category,
    is_available: true,
    amount_received: 200,
    created_at: new Date().toISOString(),
  },
];
