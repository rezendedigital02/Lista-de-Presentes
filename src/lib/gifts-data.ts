import type { Gift, Category } from "@/types";

// Dados iniciais de presentes
export const initialGifts: Gift[] = [
  // =====================
  // EXPERIÊNCIAS (valores altos primeiro)
  // =====================
  {
    id: "1",
    name: "Lua de Mel dos Sonhos",
    description:
      "Contribua para a nossa lua de mel! Qualquer valor ajuda a realizar nosso sonho de viajar juntos.",
    price: 10000,
    image_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=500&fit=crop",
    category: "experiencias" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Pacote Viagem Romântica",
    description:
      "Uma semana em destino paradisíaco para celebrar nosso amor. Resort all-inclusive.",
    price: 8000,
    image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=500&fit=crop",
    category: "experiencias" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },

  // =====================
  // ELETRODOMÉSTICOS
  // =====================
  {
    id: "3",
    name: "Smart TV 65 Polegadas 4K",
    description:
      "Smart TV LED 65 polegadas com resolução 4K UHD, sistema operacional inteligente e som premium.",
    price: 5500,
    image_url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Geladeira Frost Free 400L",
    description:
      "Geladeira duplex frost free com dispenser de água, design moderno e economia de energia.",
    price: 4500,
    image_url: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=500&fit=crop",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Ar Condicionado Split 12000 BTUs",
    description:
      "Ar condicionado split inverter com controle remoto, silencioso e econômico.",
    price: 3800,
    image_url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Lavadora de Roupas 12kg",
    description:
      "Máquina de lavar 12kg com lavagem automática, centrifugação potente e economia de água.",
    price: 3200,
    image_url: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=500&fit=crop",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Secadora de Roupas 10kg",
    description:
      "Secadora de roupas com sensor de umidade e múltiplos programas de secagem.",
    price: 2800,
    image_url: "https://images.unsplash.com/photo-1610557892470-55d9e80c0eb2?w=500&h=500&fit=crop",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Aspirador Robô Inteligente",
    description:
      "Robô aspirador com mapeamento inteligente, conectividade WiFi e controle por app.",
    price: 2200,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "9",
    name: "Forno Elétrico de Embutir",
    description:
      "Forno elétrico de embutir 80L com funções de grill, convecção e timer digital.",
    price: 2000,
    image_url: "https://images.unsplash.com/photo-1585351650024-3a6d61c73f38?w=500&h=500&fit=crop",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "10",
    name: "Cooktop por Indução 4 Bocas",
    description:
      "Cooktop de indução moderno com 4 bocas, trava de segurança e fácil limpeza.",
    price: 1800,
    image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "11",
    name: "Lava-Louças 14 Serviços",
    description:
      "Lava-louças automática com capacidade para 14 serviços e programas especiais.",
    price: 1600,
    image_url: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&h=500&fit=crop",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },

  // =====================
  // COZINHA
  // =====================
  {
    id: "12",
    name: "Jogo de Panelas Tramontina 10 Peças",
    description:
      "Jogo completo de panelas antiaderentes Tramontina em alumínio com tampa de vidro.",
    price: 1200,
    image_url: "https://images.unsplash.com/photo-1584990347449-a7e5d6e0c6a2?w=500&h=500&fit=crop",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "13",
    name: "Aparelho de Jantar 42 Peças",
    description:
      "Aparelho de jantar completo em porcelana branca com detalhes em dourado.",
    price: 900,
    image_url: "https://images.unsplash.com/photo-1595908129746-57ca1a63dd4d?w=500&h=500&fit=crop",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "14",
    name: "Cafeteira Expresso Automática",
    description:
      "Máquina de café expresso com moedor integrado, espumador de leite e painel digital.",
    price: 850,
    image_url: "https://images.unsplash.com/photo-1517467139951-f5a925c9f9de?w=500&h=500&fit=crop",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "15",
    name: "Microondas 32 Litros",
    description:
      "Microondas 32 litros com funções grill, descongelar e receitas pré-programadas.",
    price: 750,
    image_url: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=500&fit=crop",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "16",
    name: "Processador de Alimentos",
    description:
      "Processador multifuncional com lâminas em aço inox, diversas funções e jarra grande.",
    price: 700,
    image_url: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&h=500&fit=crop",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "17",
    name: "Air Fryer 5.5 Litros",
    description:
      "Fritadeira elétrica Air Fryer 5.5L, perfeita para refeições saudáveis e crocantes.",
    price: 650,
    image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=500&fit=crop",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "18",
    name: "Jogo de Talheres 42 Peças",
    description:
      "Faqueiro completo em aço inox com 42 peças, design elegante e durável.",
    price: 550,
    image_url: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=500&h=500&fit=crop",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "19",
    name: "Batedeira Planetária",
    description:
      "Batedeira planetária com 3 batedores, tigela em inox e múltiplas velocidades.",
    price: 500,
    image_url: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=500&h=500&fit=crop",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "20",
    name: "Jogo de Pratos Cerâmica 20 Peças",
    description:
      "Aparelho de jantar em cerâmica artesanal com 20 peças, design moderno.",
    price: 450,
    image_url: "https://images.unsplash.com/photo-1603199506016-5938fcb9e0d2?w=500&h=500&fit=crop",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "21",
    name: "Liquidificador Oster 12 Velocidades",
    description:
      "Liquidificador potente com 12 velocidades, jarra de vidro e lâminas em aço.",
    price: 350,
    image_url: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=500&fit=crop",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "22",
    name: "Mixer de Mão com Acessórios",
    description:
      "Mixer de mão potente com acessórios para sopas, molhos e vitaminas.",
    price: 280,
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "23",
    name: "Conjunto de Potes Herméticos",
    description:
      "Kit com 15 potes herméticos em vidro para organização de alimentos.",
    price: 250,
    image_url: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&h=500&fit=crop",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },

  // =====================
  // SALA
  // =====================
  {
    id: "24",
    name: "Sofá Retrátil 3 Lugares",
    description:
      "Sofá retrátil e reclinável em tecido suede, confortável e elegante.",
    price: 3500,
    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
    category: "sala" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "25",
    name: "Mesa de Jantar 6 Lugares",
    description:
      "Mesa de jantar em madeira maciça com acabamento premium para 6 pessoas.",
    price: 2800,
    image_url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&h=500&fit=crop",
    category: "sala" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "26",
    name: "Rack para TV 180cm",
    description:
      "Rack moderno para TV até 75 polegadas com gavetas e nichos organizadores.",
    price: 1500,
    image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&h=500&fit=crop",
    category: "sala" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "27",
    name: "Aparador de Entrada",
    description:
      "Aparador elegante em madeira com espelho, ideal para hall de entrada.",
    price: 1200,
    image_url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop",
    category: "sala" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "28",
    name: "Luminária de Piso Design",
    description:
      "Luminária de piso moderna com luz ajustável, perfeita para leitura.",
    price: 650,
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
    category: "sala" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "29",
    name: "Tapete Shaggy 200x150cm",
    description:
      "Tapete felpudo em tons neutros, macio e aconchegante para sala.",
    price: 480,
    image_url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=500&h=500&fit=crop",
    category: "sala" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "30",
    name: "Jogo de Taças de Cristal",
    description:
      "Conjunto de 12 taças de cristal para vinho e champagne, elegância à mesa.",
    price: 380,
    image_url: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=500&h=500&fit=crop",
    category: "sala" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "31",
    name: "Quadro Decorativo 80x60cm",
    description:
      "Quadro decorativo em canvas com arte abstrata moderna e moldura.",
    price: 350,
    image_url: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=500&h=500&fit=crop",
    category: "sala" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "32",
    name: "Kit Almofadas Decorativas",
    description:
      "Conjunto de 4 almofadas decorativas em veludo, cores neutras elegantes.",
    price: 180,
    image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    category: "sala" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },

  // =====================
  // QUARTO
  // =====================
  {
    id: "33",
    name: "Colchão King Size Molas Ensacadas",
    description:
      "Colchão king size com molas ensacadas, pillow top e tratamento antiácaro.",
    price: 4000,
    image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "34",
    name: "Cama Box King Size",
    description:
      "Base box king size com estrutura reforçada e tecido premium.",
    price: 2500,
    image_url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&h=500&fit=crop",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "35",
    name: "Guarda-Roupa 6 Portas",
    description:
      "Guarda-roupa espaçoso com 6 portas, gavetas e cabideiros organizados.",
    price: 2200,
    image_url: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=500&h=500&fit=crop",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "36",
    name: "Cômoda com Espelho",
    description:
      "Cômoda elegante em madeira com 5 gavetas e espelho grande.",
    price: 1400,
    image_url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=500&h=500&fit=crop",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "37",
    name: "Par de Criados-Mudos",
    description:
      "Par de criados-mudos em madeira com gaveta, design contemporâneo.",
    price: 800,
    image_url: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=500&h=500&fit=crop",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "38",
    name: "Jogo de Cama King 400 Fios",
    description:
      "Jogo de cama king size em algodão egípcio 400 fios, conforto e elegância.",
    price: 600,
    image_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "39",
    name: "Edredom King Plumas",
    description:
      "Edredom king size com enchimento de plumas sintéticas, quente e macio.",
    price: 450,
    image_url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500&h=500&fit=crop",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "40",
    name: "Luminária de Mesa Articulada",
    description:
      "Luminária de mesa com braço articulado, luz ajustável e design moderno.",
    price: 320,
    image_url: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500&h=500&fit=crop",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "41",
    name: "Par de Travesseiros Viscoelástico",
    description:
      "Travesseiros com tecnologia NASA, viscoelástico que se adapta ao corpo.",
    price: 250,
    image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&h=500&fit=crop",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },

  // =====================
  // BANHEIRO
  // =====================
  {
    id: "42",
    name: "Gabinete de Banheiro Completo",
    description:
      "Gabinete de banheiro com cuba, espelho e armário, design moderno.",
    price: 1800,
    image_url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop",
    category: "banheiro" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "43",
    name: "Aquecedor de Água a Gás",
    description:
      "Aquecedor de água a gás digital, 20 litros, para banhos confortáveis.",
    price: 1500,
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=500&fit=crop",
    category: "banheiro" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "44",
    name: "Espelho com LED",
    description:
      "Espelho de banheiro com iluminação LED integrada e função antiembaçante.",
    price: 800,
    image_url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop",
    category: "banheiro" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "45",
    name: "Jogo de Toalhas Egípcias 8 Peças",
    description:
      "Conjunto de 8 toalhas em algodão egípcio 500g/m², macias e absorventes.",
    price: 320,
    image_url: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=500&h=500&fit=crop",
    category: "banheiro" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "46",
    name: "Par de Roupões de Banho",
    description:
      "Roupões de banho felpudos tamanho G/GG, conforto após o banho.",
    price: 220,
    image_url: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&h=500&fit=crop",
    category: "banheiro" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "47",
    name: "Kit Acessórios de Banheiro",
    description:
      "Kit completo com saboneteira, porta-escova, dispenser e lixeira em inox.",
    price: 180,
    image_url: "https://images.unsplash.com/photo-1585412459212-d8b544cd8e4d?w=500&h=500&fit=crop",
    category: "banheiro" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "48",
    name: "Kit Organizadores de Banheiro",
    description:
      "Conjunto de organizadores em bamboo para banheiro, prático e elegante.",
    price: 150,
    image_url: "https://images.unsplash.com/photo-1564540579594-0930dc72f7eb?w=500&h=500&fit=crop",
    category: "banheiro" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },

  // =====================
  // MAIS EXPERIÊNCIAS
  // =====================
  {
    id: "49",
    name: "Ensaio Fotográfico Profissional",
    description:
      "Sessão de fotos profissional em estúdio ou externo com álbum digital.",
    price: 1200,
    image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&h=500&fit=crop",
    category: "experiencias" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "50",
    name: "Spa Day para o Casal",
    description:
      "Dia de spa completo com massagem relaxante, sauna e tratamentos especiais.",
    price: 700,
    image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&h=500&fit=crop",
    category: "experiencias" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "51",
    name: "Jantar Romântico",
    description:
      "Experiência gastronômica em restaurante premiado para celebrar nosso amor.",
    price: 500,
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=500&fit=crop",
    category: "experiencias" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "52",
    name: "Curso de Culinária para Casal",
    description:
      "Aula de culinária especial para casais, aprenda a cozinhar juntos.",
    price: 400,
    image_url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&h=500&fit=crop",
    category: "experiencias" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
];
