"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  Banknote,
  Shield,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button, Card, CardContent } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

interface CheckoutData {
  gift_id: string;
  gift_name: string;
  gift_image: string;
  amount: number;
  guest_name: string;
  guest_email: string;
  message?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutData");
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    } else {
      router.push("/presentes");
    }
  }, [router]);

  const handleProcessPayment = async () => {
    if (!checkoutData) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      console.log("Checkout response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar pagamento");
      }

      if (data.success && data.init_point) {
        // Redirect to Mercado Pago Checkout Pro
        toast.success("Redirecionando para o Mercado Pago...");
        window.location.href = data.init_point;
      } else if (data.demo) {
        // Demo mode - show message
        toast.error("Mercado Pago não configurado. Configure as credenciais.");
        setError("O Mercado Pago não está configurado. Adicione as variáveis de ambiente MERCADOPAGO_ACCESS_TOKEN e NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY.");
      } else {
        throw new Error("Não foi possível gerar o link de pagamento");
      }
    } catch (err) {
      console.error("Payment error:", err);
      const message = err instanceof Error ? err.message : "Erro ao processar pagamento";
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container mx-auto px-4">
          <Link
            href={`/presentes/${checkoutData.gift_id}`}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Finalizar Pagamento
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-2xl font-bold mb-6">
                Resumo do Pedido
              </h2>
              <Card>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={checkoutData.gift_image}
                      alt={checkoutData.gift_name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-text">
                        {checkoutData.gift_name}
                      </h3>
                      <p className="text-text-muted text-sm">
                        Contribuição de {checkoutData.guest_name}
                      </p>
                      <p className="text-text-muted text-sm">
                        {checkoutData.guest_email}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-accent pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-text-muted">Contribuição</span>
                      <span className="font-semibold">
                        {formatCurrency(checkoutData.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(checkoutData.amount)}
                      </span>
                    </div>
                  </div>

                  {checkoutData.message && (
                    <div className="border-t border-accent pt-4">
                      <p className="text-sm text-text-muted mb-1">
                        Sua mensagem:
                      </p>
                      <p className="text-text italic">
                        &ldquo;{checkoutData.message}&rdquo;
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Badge */}
              <div className="mt-6 flex items-center gap-3 text-text-muted">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm">
                  Pagamento 100% seguro via Mercado Pago
                </span>
              </div>
            </motion.div>

            {/* Payment Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-serif text-2xl font-bold mb-6">
                Formas de Pagamento
              </h2>

              {/* Payment Methods Info */}
              <Card className="mb-6">
                <CardContent>
                  <p className="text-text-muted text-sm mb-4">
                    Ao clicar em &quot;Pagar&quot;, você será redirecionado para o Mercado Pago onde poderá escolher:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <QrCode className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">PIX</p>
                        <p className="text-sm text-text-muted">Aprovação instantânea</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Cartão de Crédito</p>
                        <p className="text-sm text-text-muted">Parcelamento em até 12x</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Boleto Bancário</p>
                        <p className="text-sm text-text-muted">Vencimento em 3 dias úteis</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Pay Button */}
              <Button
                onClick={handleProcessPayment}
                isLoading={isProcessing}
                size="lg"
                className="w-full"
                rightIcon={!isProcessing ? <ExternalLink className="w-5 h-5" /> : undefined}
              >
                {isProcessing ? "Processando..." : `Pagar ${formatCurrency(checkoutData.amount)}`}
              </Button>

              <p className="mt-4 text-sm text-text-muted text-center">
                Você será redirecionado para o ambiente seguro do Mercado Pago
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
