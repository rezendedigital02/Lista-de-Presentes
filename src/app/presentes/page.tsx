"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { GiftGrid } from "@/components/sections";
import { initialGifts } from "@/lib/gifts-data";
import type { Gift } from "@/types";

export default function GiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGifts() {
      try {
        const response = await fetch("/api/presentes");
        const data = await response.json();

        if (data.success && data.data) {
          setGifts(data.data);
        } else {
          // Fallback to initial gifts if API fails
          setGifts(initialGifts);
        }
      } catch (error) {
        console.error("Error fetching gifts:", error);
        // Fallback to initial gifts
        setGifts(initialGifts);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGifts();
  }, []);

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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <GiftGrid gifts={gifts} />
          )}
        </div>
      </section>
    </>
  );
}
