"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Gift, Heart, Calendar, MapPin } from "lucide-react";
import { Hero } from "@/components/sections";
import { Button, Card, CardContent } from "@/components/ui";
import { weddingData } from "@/types";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="section bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Como Funciona</h2>
            <p className="section-subtitle">
              Presentear o casal é simples e seguro. Escolha um presente,
              contribua com o valor que desejar e deixe sua mensagem especial.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Gift,
                title: "Escolha o Presente",
                description:
                  "Navegue pela nossa lista e escolha o presente que deseja dar. Você pode contribuir com qualquer valor!",
              },
              {
                icon: Heart,
                title: "Faça sua Contribuição",
                description:
                  "Realize o pagamento de forma segura via PIX, cartão de crédito ou boleto. Rápido e fácil!",
              },
              {
                icon: Calendar,
                title: "Deixe sua Mensagem",
                description:
                  "Escreva uma mensagem carinhosa para os noivos. Sua presença e carinho são muito especiais!",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-text mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-text-muted">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="section bg-accent/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Nosso Amor</h2>
            <p className="section-subtitle">
              Cada momento ao seu lado é uma página especial da nossa história.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {weddingData.photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="overflow-hidden rounded-2xl shadow-lg"
              >
                <img
                  src={photo}
                  alt={`${weddingData.bride} e ${weddingData.groom}`}
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Info Section */}
      <section className="section bg-secondary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Heart
              className="w-12 h-12 mx-auto mb-6 text-primary"
              fill="currentColor"
            />
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Salve a Data!
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" />
                <span className="text-xl">{formatDate(weddingData.date)}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-primary" />
                <span className="text-xl">Igreja Matriz de São José</span>
              </div>
            </div>
            <p className="text-white/80 mb-8 text-lg">
              Estamos muito felizes em poder compartilhar esse momento especial
              com vocês. Sua presença fará nosso dia ainda mais especial!
            </p>
            <Link href="/presentes">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-dark text-white"
                leftIcon={<Gift className="w-5 h-5" />}
              >
                Ver Lista de Presentes
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
