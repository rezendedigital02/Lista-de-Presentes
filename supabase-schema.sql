-- Schema do banco de dados para Lista de Presentes de Casamento
-- Execute este SQL no Supabase SQL Editor

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Presentes
CREATE TABLE IF NOT EXISTS gifts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  image_url TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('cozinha', 'quarto', 'sala', 'banheiro', 'eletrodomesticos', 'experiencias')),
  is_available BOOLEAN DEFAULT TRUE,
  amount_received DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Contribuições/Pagamentos
CREATE TABLE IF NOT EXISTS contributions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  gift_id UUID REFERENCES gifts(id) ON DELETE SET NULL,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  message TEXT,
  payment_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'rejected', 'cancelled')),
  payment_method VARCHAR(50) CHECK (payment_method IN ('pix', 'credit_card', 'debit_card', 'boleto')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_gifts_category ON gifts(category);
CREATE INDEX IF NOT EXISTS idx_gifts_is_available ON gifts(is_available);
CREATE INDEX IF NOT EXISTS idx_contributions_gift_id ON contributions(gift_id);
CREATE INDEX IF NOT EXISTS idx_contributions_payment_status ON contributions(payment_status);
CREATE INDEX IF NOT EXISTS idx_contributions_payment_id ON contributions(payment_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gifts_updated_at
    BEFORE UPDATE ON gifts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contributions_updated_at
    BEFORE UPDATE ON contributions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública para presentes
CREATE POLICY "Presentes são públicos para leitura" ON gifts
    FOR SELECT USING (true);

-- Políticas de escrita apenas para usuários autenticados (admin)
CREATE POLICY "Apenas admins podem inserir presentes" ON gifts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Apenas admins podem atualizar presentes" ON gifts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas admins podem deletar presentes" ON gifts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Contribuições podem ser inseridas por qualquer um (via webhook)
CREATE POLICY "Qualquer um pode criar contribuições" ON contributions
    FOR INSERT WITH CHECK (true);

-- Leitura de contribuições apenas para admin
CREATE POLICY "Apenas admins podem ver contribuições" ON contributions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Atualização de contribuições (via webhook do Mercado Pago)
CREATE POLICY "Service role pode atualizar contribuições" ON contributions
    FOR UPDATE USING (true);

-- Inserir dados iniciais de presentes (opcional)
-- Descomente e execute se quiser popular com dados de exemplo

/*
INSERT INTO gifts (name, description, price, image_url, category) VALUES
('Jogo de Panelas Tramontina', 'Jogo completo de panelas antiaderentes Tramontina com 10 peças, ideal para o dia a dia.', 1200.00, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 'cozinha'),
('Air Fryer Philips Walita', 'Fritadeira elétrica Air Fryer 4.1L, perfeita para preparar refeições saudáveis e crocantes.', 650.00, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500', 'cozinha'),
('Liquidificador Oster', 'Liquidificador Oster com 12 velocidades e jarra de vidro resistente.', 350.00, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500', 'cozinha'),
('Cafeteira Nespresso', 'Máquina de café expresso Nespresso com sistema de cápsulas, para um café perfeito.', 800.00, 'https://images.unsplash.com/photo-1517467139951-f5a925c9f9de?w=500', 'cozinha'),
('Jogo de Cama King 400 Fios', 'Jogo de cama king size em algodão egípcio 400 fios, conforto e elegância.', 600.00, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500', 'quarto'),
('Edredom King Toque de Pluma', 'Edredom king size com enchimento de fibra siliconada, quente e macio.', 450.00, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500', 'quarto'),
('Aspirador Robô Xiaomi', 'Robô aspirador com mapeamento inteligente, conectividade WiFi e app.', 2200.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 'eletrodomesticos'),
('Lua de Mel dos Sonhos', 'Contribua para a nossa lua de mel! Qualquer valor ajuda a realizar nosso sonho.', 10000.00, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500', 'experiencias');
*/
