"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Gift,
  Heart,
  Check,
  Minus,
  Plus,
  ShoppingCart,
  Loader2,
  PartyPopper,
} from "lucide-react";
import { Button, Input, Textarea, Badge, ProgressBar, Card, CardContent } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { categoryLabels } from "@/types";
import { initialGifts } from "@/lib/gifts-data";
import type { Gift as GiftType } from "@/types";

export default function GiftDetailPage() {
  const params = useParams();
  const router = useRouter();
  const giftId = params.id as string;

  const [gift, setGift] = useState<GiftType | null>(null);
  const [isLoadingGift, setIsLoadingGift] = useState(true);
  const [amount, setAmount] = useState(100);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch gift from API
  useEffect(() => {
    async function fetchGift() {
      try {
        const response = await fetch(`/api/presentes/${giftId}`);
        const data = await response.json();

        if (data.success && data.data) {
          setGift(data.data);
          // Produtos de zoeira: valor fixo (preço cheio)
          if (data.data.is_joke) {
            setAmount(data.data.price);
          } else {
            const remaining = Math.max(data.data.price - data.data.amount_received, 0);
            setAmount(Math.min(remaining, 100));
          }
        } else {
          // Fallback to initial gifts
          const fallbackGift = initialGifts.find((g) => g.id === giftId);
          if (fallbackGift) {
            setGift(fallbackGift);
            // Produtos de zoeira: valor fixo (preço cheio)
            if (fallbackGift.is_joke) {
              setAmount(fallbackGift.price);
            } else {
              const remaining = Math.max(fallbackGift.price - fallbackGift.amount_received, 0);
              setAmount(Math.min(remaining, 100));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching gift:", error);
        // Fallback to initial gifts
        const fallbackGift = initialGifts.find((g) => g.id === giftId);
        if (fallbackGift) {
          setGift(fallbackGift);
          // Produtos de zoeira: valor fixo (preço cheio)
          if (fallbackGift.is_joke) {
            setAmount(fallbackGift.price);
          } else {
            const remaining = Math.max(fallbackGift.price - fallbackGift.amount_received, 0);
            setAmount(Math.min(remaining, 100));
          }
        }
      } finally {
        setIsLoadingGift(false);
      }
    }

    fetchGift();
  }, [giftId]);

  if (isLoadingGift) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Presente não encontrado</h1>
          <Link href="/presentes">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Voltar para lista
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Produtos de zoeira nunca ficam completos
  const isJoke = gift.is_joke === true;
  const isFullyFunded = !isJoke && gift.amount_received >= gift.price;
  const remaining = Math.max(gift.price - gift.amount_received, 0);
  const maxAmount = isJoke ? gift.price : remaining;

  const suggestedAmounts = isJoke ? [] : [50, 100, 200, 500].filter((a) => a <= maxAmount);

  const handleAmountChange = (value: number) => {
    setAmount(Math.min(Math.max(value, 10), maxAmount));
    setIsCustomAmount(false);
  };

  const handleCustomAmount = (value: string) => {
    const numValue = parseInt(value) || 0;
    setAmount(Math.min(Math.max(numValue, 0), maxAmount));
    setIsCustomAmount(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestName.trim()) {
      toast.error("Por favor, informe seu nome");
      return;
    }

    if (!guestEmail.trim() || !guestEmail.includes("@")) {
      toast.error("Por favor, informe um email válido");
      return;
    }

    if (amount < 10) {
      toast.error("O valor mínimo é R$ 10,00");
      return;
    }

    setIsLoading(true);

    try {
      // Store checkout data in sessionStorage for the checkout page
      const checkoutData = {
        gift_id: gift.id,
        gift_name: gift.name,
        gift_image: gift.image_url,
        amount,
        guest_name: guestName,
        guest_email: guestEmail,
        message,
      };

      sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      router.push("/checkout");
    } catch {
      toast.error("Ocorreu um erro. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container mx-auto px-4">
          <Link
            href="/presentes"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para lista
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {gift.name}
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={gift.image_url}
                  alt={gift.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={isJoke ? "bg-purple-500 text-white" : "bg-white/90 backdrop-blur-sm"}>
                    {isJoke ? "🎉 Zoeira" : categoryLabels[gift.category]}
                  </Badge>
                </div>
                {isFullyFunded && !isJoke && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-green-500 text-white px-6 py-3 rounded-full flex items-center gap-2">
                      <Check className="w-6 h-6" />
                      <span className="text-lg font-semibold">Presenteado!</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Details & Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Description */}
              <div>
                <p className="text-text-light text-lg leading-relaxed">
                  {gift.description}
                </p>
              </div>

              {/* Price and Progress */}
              <Card>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">{isJoke ? "Valor:" : "Valor total:"}</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(gift.price)}
                    </span>
                  </div>

                  {/* Mensagem especial para produtos de zoeira */}
                  {isJoke && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                      <PartyPopper className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-purple-700">
                        Este é um presente de <strong>zoeira</strong>! Valor fixo, sem cota mínima.
                      </p>
                    </div>
                  )}

                  {/* Progresso - Não mostra para produtos de zoeira */}
                  {!isJoke && gift.amount_received > 0 && (
                    <>
                      <ProgressBar
                        value={gift.amount_received}
                        max={gift.price}
                        size="lg"
                        variant={isFullyFunded ? "success" : "primary"}
                      />
                      <div className="flex justify-between text-sm text-text-muted">
                        <span>
                          Arrecadado: {formatCurrency(gift.amount_received)}
                        </span>
                        {!isFullyFunded && (
                          <span>Faltam: {formatCurrency(remaining)}</span>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Contribution Form */}
              {!isFullyFunded && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount Selection - Só mostra para produtos normais (não zoeira) */}
                  {!isJoke && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-text">
                        Valor da contribuição
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {suggestedAmounts.map((suggested) => (
                          <Button
                            key={suggested}
                            type="button"
                            variant={amount === suggested && !isCustomAmount ? "primary" : "outline"}
                            size="sm"
                            onClick={() => handleAmountChange(suggested)}
                          >
                            {formatCurrency(suggested)}
                          </Button>
                        ))}
                        <Button
                          type="button"
                          variant={amount === maxAmount && !isCustomAmount ? "primary" : "outline"}
                          size="sm"
                          onClick={() => handleAmountChange(maxAmount)}
                        >
                          Valor restante ({formatCurrency(maxAmount)})
                        </Button>
                      </div>

                      {/* Custom Amount */}
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted">ou</span>
                        <div className="flex-1 flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAmountChange(amount - 10)}
                            disabled={amount <= 10}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <div className="flex-1">
                            <Input
                              type="number"
                              value={amount}
                              onChange={(e) => handleCustomAmount(e.target.value)}
                              className="text-center font-semibold"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAmountChange(amount + 10)}
                            disabled={amount >= maxAmount}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Guest Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Seu nome"
                      placeholder="Digite seu nome completo"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                    />
                    <Input
                      label="Seu email"
                      type="email"
                      placeholder="seu@email.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Message */}
                  <Textarea
                    label={isJoke ? "Deixe uma mensagem engraçada (opcional)" : "Mensagem para os noivos (opcional)"}
                    placeholder={isJoke ? "Manda aquela zoeira..." : "Deixe uma mensagem carinhosa para os noivos..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className={`w-full ${isJoke ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                    isLoading={isLoading}
                    leftIcon={isJoke ? <PartyPopper className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                  >
                    {isJoke ? `Participar da Zoeira ${formatCurrency(amount)}` : `Contribuir ${formatCurrency(amount)}`}
                  </Button>

                  <p className="text-sm text-text-muted text-center flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 text-primary" />
                    Pagamento seguro via Mercado Pago
                  </p>
                </form>
              )}

              {isFullyFunded && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    Este presente já foi totalmente arrecadado!
                  </h3>
                  <p className="text-text-muted mb-4">
                    Muito obrigado a todos que contribuíram.
                  </p>
                  <Link href="/presentes">
                    <Button variant="outline" leftIcon={<Gift className="w-4 h-4" />}>
                      Ver outros presentes
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
