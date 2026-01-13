"use client";

import { motion } from "framer-motion";
import { Heart, Calendar, MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { weddingData } from "@/types";

const timelineEvents = [
  {
    date: "04 de Dezembro de 2022",
    title: "O Começo de Tudo",
    description:
      "Uma data que marcou nossas vidas para sempre. Uma única frase foi suficiente para que acolhêssemos um ao outro. Ali nascia uma amizade e, sem sabermos, um futuro já cuidadosamente preparado por Deus.",
    icon: Heart,
  },
  {
    date: "05 de Fevereiro de 2023",
    title: "Pedido de Namoro",
    description:
      "Sentados no sofá, ouvimos a frase que mudaria tudo: “Agora é para casar.” E não estava errado. Desde o início, sabíamos que, se era para estarmos juntos, era por um propósito maior.",
    icon: Star,
  },
  {
    date: "2023 · 2024 · 2025",
    title: "Anos de Namoro",
    description:
      "Foram anos de aventuras, aprendizados e conquistas. Crescemos em sabedoria, erramos e acertamos. Entre risos e lágrimas, fomos construindo, dia após dia, um belo capítulo da nossa história.",
    icon: MapPin,
  },
  {
    date: "20 de Dezembro de 2025",
    title: "O Pedido de Casamento",
    description:
      "O pedido de casamento veio. Delicado, cheio de amor, sonhos e planos. E o “sim” veio com o coração transbordando de certeza.",
    icon: Heart,
  },
  {
    date: "07 de março de 2026",
    title: "Nosso Para Sempre",
    description:
      "Não sabemos todos os caminhos que Deus tem para nós, mas seguimos confiantes, construindo nossa vida a partir da direção que Ele nos dá. Nosso maior desejo é formar uma família alicerçada nos valores que aprendemos e vivemos juntamente com o que aprendemos na nossa familia. Seremos nós, talvez com um, três ou cinco filhos, mas sempre com amor, fé e união.",
    icon: Calendar,
  },
];

export default function HistoriaPage() {
  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Nossa História</h1>
            <p className="text-lg">
              Uma jornada de amor, cumplicidade e muitas memórias especiais
            </p>
          </motion.div>
        </div>
      </div>

      {/* Photo Section */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {weddingData.photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={photo}
                    alt={`${weddingData.bride} e ${weddingData.groom}`}
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Heart
              className="w-12 h-12 mx-auto mb-6 text-primary"
              fill="currentColor"
            />
            <blockquote className="font-serif text-2xl md:text-3xl text-text italic leading-relaxed">
              &ldquo;Portanto deixará o homem a seu pai e a sua mãe, e unir-se-á a sua mulher, e serão uma só carne. Gênesis 2:24.&rdquo;
            </blockquote>
            <p className="mt-6 text-text-muted">
              - {weddingData.bride} & {weddingData.groom}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Nossa Linha do Tempo</h2>
            <p className="section-subtitle">
              Os momentos mais especiais da nossa jornada juntos
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 -translate-x-1/2" />

              {/* Timeline events */}
              {timelineEvents.map((event, index) => {
                const Icon = event.icon;
                const isLeft = index % 2 === 0;

                return (
                  <motion.div
                    key={event.title}
                    initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative flex items-center mb-8 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Icon */}
                    <div className="absolute left-8 md:left-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center -translate-x-1/2 z-10 shadow-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div
                      className={`ml-20 md:ml-0 md:w-5/12 ${
                        isLeft ? "md:pr-12 md:text-right" : "md:pl-12"
                      }`}
                    >
                      <Card>
                        <CardContent>
                          <span className="text-sm text-primary font-semibold">
                            {event.date}
                          </span>
                          <h3 className="font-serif text-xl font-bold text-text mt-1 mb-2">
                            {event.title}
                          </h3>
                          <p className="text-text-muted">{event.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-serif text-3xl font-bold mb-4">
              Faça Parte da Nossa História
            </h2>
            <p className="text-white/80 mb-6">
              Sua presença no nosso grande dia será a continuação mais linda
              dessa história de amor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/presentes"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Ver Lista de Presentes
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
