"use client";

import { motion } from "framer-motion";
import { GiftGrid } from "@/components/sections";
import { initialGifts } from "@/lib/gifts-data";

export default function GiftsPage() {
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
            <h1>Lista de Presentes</h1>
            <p className="text-lg">
              Escolha um presente especial para nos ajudar a construir nosso lar.
              Você pode contribuir com o valor que desejar!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Gifts Grid */}
      <section className="section">
        <div className="container mx-auto px-4">
          <GiftGrid gifts={initialGifts} />
        </div>
      </section>
    </>
  );
}
