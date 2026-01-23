// Categorias de presentes
export type Category =
  | "cozinha"
  | "quarto"
  | "sala"
  | "banheiro"
  | "eletrodomesticos"
  | "experiencias"
  | "zoeira";

export const categoryLabels: Record<Category, string> = {
  cozinha: "Cozinha",
  quarto: "Quarto",
  sala: "Sala",
  banheiro: "Banheiro",
  eletrodomesticos: "Eletrodomésticos",
  experiencias: "Experiências",
  zoeira: "Zoeira",
};

export const categoryIcons: Record<Category, string> = {
  cozinha: "🍳",
  quarto: "🛏️",
  sala: "🛋️",
  banheiro: "🛁",
  eletrodomesticos: "📺",
  experiencias: "✨",
  zoeira: "🎉",
};

// Presente
export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: Category;
  is_available: boolean;
  amount_received: number;
  created_at: string;
  updated_at?: string;
  is_joke?: boolean; // Produtos de zoeira - nunca ficam completos
}

// Status do pagamento
export type PaymentStatus = "pending" | "approved" | "rejected" | "cancelled";

// Método de pagamento
export type PaymentMethod = "pix" | "credit_card" | "debit_card" | "boleto";

// Contribuição/Pagamento
export interface Contribution {
  id: string;
  gift_id: string;
  guest_name: string;
  guest_email: string;
  amount: number;
  message?: string;
  payment_id: string;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at?: string;
  gift?: Gift;
}

// Dados do checkout
export interface CheckoutData {
  gift_id: string;
  gift_name: string;
  amount: number;
  guest_name: string;
  guest_email: string;
  message?: string;
}

// Preferência de pagamento do Mercado Pago
export interface PaymentPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

// Resposta da API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Filtros de presentes
export interface GiftFilters {
  category?: Category | "all";
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  search?: string;
}

// Estatísticas do admin
export interface AdminStats {
  totalGifts: number;
  totalContributions: number;
  totalAmount: number;
  pendingAmount: number;
  approvedAmount: number;
  giftsByCategory: Record<Category, number>;
}

// Dados do casamento
export const weddingData = {
  bride: "Priscila",
  groom: "Emanuel",
  date: new Date("2026-03-07T16:00:00"),
  pixKey: "53455423000162",
  photos: [
    "https://dthfhdsjkwlzgvxctyaq.supabase.co/storage/v1/object/sign/Casamento/WhatsApp%20Image%202026-01-06%20at%2022.11.13.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzcwY2NlMy05ZjQ5LTRlZDItYTNkOC1iMTZmZjYyM2NlMDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDYXNhbWVudG8vV2hhdHNBcHAgSW1hZ2UgMjAyNi0wMS0wNiBhdCAyMi4xMS4xMy5qcGVnIiwiaWF0IjoxNzY3Nzg1MTUxLCJleHAiOjE3OTkzMjExNTF9.XmLi9Dw4Rr8RlODHooTKnXQNI96paDq9HordX6OV0qU",
    "https://dthfhdsjkwlzgvxctyaq.supabase.co/storage/v1/object/sign/Casamento/WhatsApp%20Image%202026-01-06%20at%2022.10.00.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzcwY2NlMy05ZjQ5LTRlZDItYTNkOC1iMTZmZjYyM2NlMDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDYXNhbWVudG8vV2hhdHNBcHAgSW1hZ2UgMjAyNi0wMS0wNiBhdCAyMi4xMC4wMC5qcGVnIiwiaWF0IjoxNzY3NzQ4NTMxLCJleHAiOjE3OTkyODQ1MzF9.6xEQ3HavFXI0itE5RB3WDjlgZOUjl91rr5sNNZpx3eM",
  ],
};
