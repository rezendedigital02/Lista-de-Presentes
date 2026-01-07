"use client";

import { motion } from "framer-motion";
import { Heart, Calendar, MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { weddingData } from "@/types";

const timelineEvents = [
  {
    date: "Setembro 2018",
    title: "O Primeiro Encontro",
    description:
      "Nossos caminhos se cruzaram pela primeira vez. Foi amor à primeira vista, mesmo que ainda não soubéssemos disso.",
    icon: Heart,
  },
  {
    date: "Dezembro 2018",
    title: "Primeiro Beijo",
    description:
      "Embaixo das estrelas, em uma noite mágica, selamos nosso amor com um beijo inesquecível.",
    icon: Star,
  },
  {
    date: "Janeiro 2020",
    title: "Morando Juntos",
    description:
      "Decidimos dar o próximo passo e construir nosso lar juntos. Cada dia ao seu lado é uma nova aventura.",
    icon: MapPin,
  },
  {
    date: "Dezembro 2024",
    title: "O Pedido de Casamento",
    description:
      "Com o coração cheio de amor, veio o pedido mais especial de nossas vidas. E ela disse SIM!",
    icon: Heart,
  },
  {
    date: "Março 2026",
    title: "O Grande Dia",
    description:
      "O dia em que celebraremos nosso amor perante todos que amamos. O começo de uma nova jornada juntos.",
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
              &ldquo;O amor não se define por grandes gestos, mas pelos pequenos
              momentos compartilhados todos os dias. Cada sorriso seu me lembra
              porque escolhi você para sempre.&rdquo;
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
