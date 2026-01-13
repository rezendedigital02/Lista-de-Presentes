import type { Gift, Category } from "@/types";

// Dados iniciais de presentes para demo
export const initialGifts: Gift[] = [
  // Cozinha
  {
    id: "1",
    name: "Jogo de Panelas Tramontina",
    description:
      "Jogo completo de panelas antiaderentes Tramontina com 10 peças, ideal para o dia a dia.",
    price: 599,
    image_url: "https://dthfhdsjkwlzgvxctyaq.supabase.co/storage/v1/object/sign/Casamento/WhatsApp%20Image%202026-01-12%20at%2021.53.02.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzcwY2NlMy05ZjQ5LTRlZDItYTNkOC1iMTZmZjYyM2NlMDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDYXNhbWVudG8vV2hhdHNBcHAgSW1hZ2UgMjAyNi0wMS0xMiBhdCAyMS41My4wMi5qcGVnIiwiaWF0IjoxNzY4MjY2NTU0LCJleHAiOjE3OTk4MDI1NTR9.kSSlPXlv6wqf0nq4S09Xp7Vj22AtoLvZBAusTn_GpkY",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Air Fryer Mondial",
    description:
      "Fritadeira elétrica Air Fryer 4.1L, perfeita para preparar refeições saudáveis e crocantes.",
    price: 399,
    image_url: "https://dthfhdsjkwlzgvxctyaq.supabase.co/storage/v1/object/sign/Casamento/WhatsApp%20Image%202026-01-12%20at%2021.56.14.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzcwY2NlMy05ZjQ5LTRlZDItYTNkOC1iMTZmZjYyM2NlMDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDYXNhbWVudG8vV2hhdHNBcHAgSW1hZ2UgMjAyNi0wMS0xMiBhdCAyMS41Ni4xNC5qcGVnIiwiaWF0IjoxNzY4MjY2NjI5LCJleHAiOjE3OTk4MDI2Mjl9.57SJS-YpghH4XibZAyjS6DdU-JXyG_m6NpucdSaoDRo",
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
    price: 199,
    image_url: "https://dthfhdsjkwlzgvxctyaq.supabase.co/storage/v1/object/sign/Casamento/WhatsApp%20Image%202026-01-12%20at%2022.01.36.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzcwY2NlMy05ZjQ5LTRlZDItYTNkOC1iMTZmZjYyM2NlMDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDYXNhbWVudG8vV2hhdHNBcHAgSW1hZ2UgMjAyNi0wMS0xMiBhdCAyMi4wMS4zNi5qcGVnIiwiaWF0IjoxNzY4MjY2NjkxLCJleHAiOjE3OTk4MDI2OTF9.MiVYKwtdL6fAmGxpLaWOi3my5dDrY70lFWq6ZJZcf8E",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Jogo de Talheres Tramontina",
    description:
      "Faqueiro completo em aço inox com 101 peças, design elegante e durável.",
    price: 1699,
    image_url: "https://dthfhdsjkwlzgvxctyaq.supabase.co/storage/v1/object/sign/Casamento/51HKSGUZXZL._AC_SX679_%20(1).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzcwY2NlMy05ZjQ5LTRlZDItYTNkOC1iMTZmZjYyM2NlMDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDYXNhbWVudG8vNTFIS1NHVVpYWkwuX0FDX1NYNjc5XyAoMSkuanBnIiwiaWF0IjoxNzY4MjY2ODcwLCJleHAiOjE3OTk4MDI4NzB9.DSZIWqgbjGY5rJX9M2lMY3c_Nn9pNcP7eYKCXKOuwD8",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Cafeteira Electrolux",
    description:
      "Cafeteira Elétrica Electrolux Inox, para um café perfeito.",
    price: 230,
    image_url: "https://dthfhdsjkwlzgvxctyaq.supabase.co/storage/v1/object/sign/Casamento/51OyvPACDML._AC_SX679_.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzcwY2NlMy05ZjQ5LTRlZDItYTNkOC1iMTZmZjYyM2NlMDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDYXNhbWVudG8vNTFPeXZQQUNETUwuX0FDX1NYNjc5Xy5qcGciLCJpYXQiOjE3NjgyNjcyNTAsImV4cCI6MTc5OTgwMzI1MH0.coSJMEb6Os_TZ2QETjViXvsIfCpmR9J4bRvw17ExrC8",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Mixer Philips Walita",
    description:
      "Mixer 4 em 1 com acessórios, ideal para sopas, molhos e vitaminas.",
    price: 238,
    image_url: "https://dthfhdsjkwlzgvxctyaq.supabase.co/storage/v1/object/sign/Casamento/71EHgz0zUIS._AC_SX679_.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzcwY2NlMy05ZjQ5LTRlZDItYTNkOC1iMTZmZjYyM2NlMDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDYXNhbWVudG8vNzFFSGd6MHpVSVMuX0FDX1NYNjc5Xy5qcGciLCJpYXQiOjE3NjgyNjczODMsImV4cCI6MTc5OTgwMzM4M30.pZDUD98c8U9KfUaFoX1JZ6V4PRkdXeRd9BwjFuVguoA",
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
    price: 499,
    image_url: "https://dthfhdsjkwlzgvxctyaq.supabase.co/storage/v1/object/sign/Casamento/WhatsApp%20Image%202026-01-12%20at%2021.59.07.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzcwY2NlMy05ZjQ5LTRlZDItYTNkOC1iMTZmZjYyM2NlMDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDYXNhbWVudG8vV2hhdHNBcHAgSW1hZ2UgMjAyNi0wMS0xMiBhdCAyMS41OS4wNy5qcGVnIiwiaWF0IjoxNzY4MjY3NDc1LCJleHAiOjE3OTk4MDM0NzV9.aUoevGl-b4nv8aBBLPTeIt_LqU_cYIoXxyzpfqfuXCM",
    category: "cozinha" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },

  // Quarto
  {
    id: "8",
    name: "Jogo de Cama King 700 Fios",
    description:
      "Jogo de cama king size em algodão egípcio 700 fios, conforto e elegância.",
    price: 649,
    image_url: "https://dthfhdsjkwlzgvxctyaq.supabase.co/storage/v1/object/sign/Casamento/artelasse_700_fios_bellagio_cinza_1.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzcwY2NlMy05ZjQ5LTRlZDItYTNkOC1iMTZmZjYyM2NlMDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDYXNhbWVudG8vYXJ0ZWxhc3NlXzcwMF9maW9zX2JlbGxhZ2lvX2NpbnphXzEud2VicCIsImlhdCI6MTc2ODI2NzY3MywiZXhwIjoxNzk5ODAzNjczfQ.O9j8vJUEtl7gd-wCN4kLMHYt3t1BeTQMy_amBXURUys",
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
    price: 296,
    image_url: "https://dthfhdsjkwlzgvxctyaq.supabase.co/storage/v1/object/sign/Casamento/D_NQ_NP_2X_724835-MLB52294263318_112022-F-edredom-dupla-face-queen-400-fios-extra-macio-full-promoco.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzcwY2NlMy05ZjQ5LTRlZDItYTNkOC1iMTZmZjYyM2NlMDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDYXNhbWVudG8vRF9OUV9OUF8yWF83MjQ4MzUtTUxCNTIyOTQyNjMzMThfMTEyMDIyLUYtZWRyZWRvbS1kdXBsYS1mYWNlLXF1ZWVuLTQwMC1maW9zLWV4dHJhLW1hY2lvLWZ1bGwtcHJvbW9jby53ZWJwIiwiaWF0IjoxNzY4MjY3NzU0LCJleHAiOjE3OTk4MDM3NTR9.aFy2qWkKGSf4jcDF2PlvLFU_xJOGiu47Hw1j_ddu2os",
    category: "quarto" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "10",
    name: "Par de Travesseiros NASA",
    description:
      "Travesseiros com tecnologia NASA, viscoelástico que se adapta ao corpo.",
    price: 150,
    image_url: "https://dthfhdsjkwlzgvxctyaq.supabase.co/storage/v1/object/sign/Casamento/71LUnQJUrbL._AC_UF894,1000_QL80_.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzcwY2NlMy05ZjQ5LTRlZDItYTNkOC1iMTZmZjYyM2NlMDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDYXNhbWVudG8vNzFMVW5RSlVyYkwuX0FDX1VGODk0LDEwMDBfUUw4MF8uanBnIiwiaWF0IjoxNzY4MjY3ODM4LCJleHAiOjE3OTk4MDM4Mzh9.Cvb4K3L-sVAyNq4V0v5g8LjEl89wywenmecRuANmHt8",
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
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1595908129746-57ca1a63dd4d?w=500&h=500&fit=crop",
    category: "sala" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "13",
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
    id: "14",
    name: "Kit Almofadas Decorativas",
    description:
      "Conjunto de 4 almofadas decorativas em veludo, cores neutras e elegantes.",
    price: 180,
    image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    category: "sala" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "15",
    name: "Quadro Decorativo Grande",
    description:
      "Quadro decorativo em canvas 80x60cm, arte abstrata moderna.",
    price: 350,
    image_url: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=500&h=500&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=500&h=500&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&h=500&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1585412459212-d8b544cd8e4d?w=500&h=500&fit=crop",
    category: "banheiro" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },

  // Eletrodomésticos
  {
    id: "19",
    name: "Aspirador Robô Xiaomi",
    description:
      "Robô aspirador com mapeamento inteligente, conectividade WiFi e app.",
    price: 2200,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "20",
    name: "Microondas Brastemp 32L",
    description:
      "Microondas 32 litros com funções grill e receitas pré-programadas.",
    price: 750,
    image_url: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=500&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=500&fit=crop",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "22",
    name: "Geladeira Frost Free 400L",
    description:
      "Geladeira duplex frost free, design moderno e economia de energia.",
    price: 4500,
    image_url: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=500&fit=crop",
    category: "eletrodomesticos" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },

  // Experiências
  {
    id: "23",
    name: "Lua de Mel dos Sonhos",
    description:
      "Contribua para a nossa lua de mel! Qualquer valor ajuda a realizar nosso sonho.",
    price: 10000,
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=500&fit=crop",
    category: "experiencias" as Category,
    is_available: true,
    amount_received: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "24",
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
    id: "25",
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
];
