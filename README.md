# Lista de Presentes - Casamento Priscila & Emanuel

Site elegante e moderno de lista de presentes para o casamento de Priscila e Emanuel, com integração de pagamento via Mercado Pago.

## Tecnologias

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Animações:** Framer Motion
- **Banco de Dados:** Supabase (PostgreSQL)
- **Pagamentos:** Mercado Pago SDK
- **Validação:** Zod
- **Notificações:** React Hot Toast
- **Ícones:** Lucide React

## Funcionalidades

### Para Convidados
- Visualizar lista de presentes com fotos, descrição e preço
- Filtrar por categoria, preço e disponibilidade
- Buscar presentes específicos
- Contribuir com valor parcial ou total
- Checkout seguro via Mercado Pago (PIX, cartão, boleto)
- Deixar mensagem para os noivos
- Design responsivo (mobile-first)

### Para os Noivos (Admin)
- Dashboard com total arrecadado
- Lista de presentes dados e pendentes
- Visualizar mensagens dos convidados
- Adicionar/editar/remover presentes
- Relatório de contribuições

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` baseado no `.env.example`:

```bash
cp .env.example .env.local
```

Preencha as variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=seu_access_token
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=sua_public_key

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Configurar banco de dados

Execute o script SQL no Supabase SQL Editor:

```bash
# O arquivo está em supabase-schema.sql
```

### 4. Executar em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Home
│   ├── presentes/
│   │   ├── page.tsx          # Lista de presentes
│   │   └── [id]/page.tsx     # Detalhes do presente
│   ├── checkout/page.tsx     # Checkout
│   ├── confirmacao/page.tsx  # Confirmação
│   ├── historia/page.tsx     # Nossa História
│   ├── admin/
│   │   ├── page.tsx          # Dashboard
│   │   └── presentes/page.tsx# Gerenciar presentes
│   └── api/
│       ├── checkout/route.ts
│       ├── presentes/route.ts
│       └── webhooks/mercadopago/route.ts
├── components/
│   ├── ui/                   # Componentes base
│   ├── sections/             # Seções de página
│   └── layout/               # Header, Footer
├── lib/
│   ├── supabase.ts           # Cliente Supabase
│   ├── mercadopago.ts        # Integração MP
│   └── utils.ts              # Utilitários
└── types/
    └── index.ts              # Tipos TypeScript
```

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com hero, contador e fotos |
| `/presentes` | Lista de presentes com filtros |
| `/presentes/[id]` | Detalhes do presente e formulário |
| `/checkout` | Pagamento via Mercado Pago |
| `/confirmacao` | Confirmação pós-pagamento |
| `/historia` | Timeline do casal |
| `/admin` | Dashboard administrativo |
| `/admin/presentes` | Gerenciar presentes |

## Webhook do Mercado Pago

Configure o webhook no painel do Mercado Pago para:

```
https://seu-dominio.com/api/webhooks/mercadopago
```

Eventos: `payment`

## Deploy

### Vercel (Recomendado)

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

```bash
npm run build
```

## Personalização

Edite o arquivo `src/types/index.ts` para personalizar:

```typescript
export const weddingData = {
  bride: "Priscila",
  groom: "Emanuel",
  date: new Date("2026-03-07T16:00:00"),
  pixKey: "53455423000162",
  photos: [/* URLs das fotos */],
};
```

Cores em `tailwind.config.ts`:

```typescript
colors: {
  primary: "#D4A574",    // Dourado/champagne
  secondary: "#2C3E50",  // Azul escuro
  accent: "#E8D5B7",     // Bege claro
}
```

## Licença

Este projeto foi criado para o casamento de Priscila & Emanuel.

---

Feito com amor para Priscila & Emanuel
