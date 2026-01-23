"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gift as GiftIcon, Check, PartyPopper } from "lucide-react";
import { Card, Badge, ProgressBar, Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { categoryLabels, type Gift } from "@/types";

interface GiftCardProps {
  gift: Gift;
  index?: number;
}

export function GiftCard({ gift, index = 0 }: GiftCardProps) {
  // Produtos de zoeira nunca ficam completos
  const isJoke = gift.is_joke === true;
  const isFullyFunded = !isJoke && gift.amount_received >= gift.price;
  const remaining = Math.max(gift.price - gift.amount_received, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card hover className="h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={gift.image_url || "/placeholder-gift.jpg"}
            alt={gift.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="default"
              className={isJoke ? "bg-purple-500 text-white" : "bg-white/90 backdrop-blur-sm"}
            >
              {isJoke ? "🎉 Zoeira" : categoryLabels[gift.category]}
            </Badge>
          </div>

          {/* Fully Funded Badge - Nunca mostra para produtos de zoeira */}
          {isFullyFunded && !isJoke && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span className="font-medium">Presenteado!</span>
              </motion.div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <h3 className="font-serif text-base sm:text-lg font-semibold text-text mb-1 line-clamp-2">
            {gift.name}
          </h3>
          <p className="text-xs sm:text-sm text-text-muted mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
            {gift.description}
          </p>

          {/* Price and Progress */}
          <div className="mt-auto space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-lg sm:text-xl font-bold text-primary">
                {formatCurrency(gift.price)}
              </span>
              {/* Não mostra "Faltam X" para produtos de zoeira */}
              {!isJoke && gift.amount_received > 0 && !isFullyFunded && (
                <span className="text-xs sm:text-sm text-text-muted">
                  Faltam {formatCurrency(remaining)}
                </span>
              )}
            </div>

            {/* Progress Bar - Não mostra para produtos de zoeira */}
            {!isJoke && gift.amount_received > 0 && (
              <ProgressBar
                value={gift.amount_received}
                max={gift.price}
                showLabel
                variant={isFullyFunded ? "success" : "primary"}
              />
            )}

            {/* Action Button */}
            <Link href={`/presentes/${gift.id}`} className="block">
              <Button
                variant={isFullyFunded ? "ghost" : isJoke ? "primary" : "primary"}
                className={`w-full text-sm sm:text-base ${isJoke ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                disabled={isFullyFunded}
                leftIcon={isJoke ? <PartyPopper className="w-4 h-4" /> : <GiftIcon className="w-4 h-4" />}
              >
                {isFullyFunded ? "Já Presenteado" : isJoke ? "Participar da Zoeira" : "Presentear"}
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
