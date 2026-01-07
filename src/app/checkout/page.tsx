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
  CheckCircle,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { Button, Card, CardContent, Input } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { weddingData } from "@/types";

interface CheckoutData {
  gift_id: string;
  gift_name: string;
  gift_image: string;
  amount: number;
  guest_name: string;
  guest_email: string;
  message?: string;
}

type PaymentMethod = "pix" | "credit_card" | "boleto";

const paymentMethods = [
  {
    id: "pix" as PaymentMethod,
    name: "PIX",
    icon: QrCode,
    description: "Aprovação instantânea",
    recommended: true,
  },
  {
    id: "credit_card" as PaymentMethod,
    name: "Cartão de Crédito",
    icon: CreditCard,
    description: "Parcelamento em até 12x",
    recommended: false,
  },
  {
    id: "boleto" as PaymentMethod,
    name: "Boleto Bancário",
    icon: Banknote,
    description: "Vencimento em 3 dias",
    recommended: false,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPixCode, setShowPixCode] = useState(false);

  useEffect(() => {
    // Get checkout data from sessionStorage
    const stored = sessionStorage.getItem("checkoutData");
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    } else {
      // Redirect to gifts page if no checkout data
      router.push("/presentes");
    }
  }, [router]);

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(weddingData.pixKey);
    toast.success("Chave PIX copiada!");
  };

  const handleProcessPayment = async () => {
    if (!checkoutData) return;

    setIsProcessing(true);

    try {
      // Call API to create payment preference
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...checkoutData,
          payment_method: selectedMethod,
        }),
      });

      const data = await response.json();

      if (data.success && data.init_point) {
        // Redirect to Mercado Pago checkout
        window.location.href = data.init_point;
      } else if (selectedMethod === "pix") {
        // For demo: show PIX code
        setShowPixCode(true);
        toast.success("QR Code PIX gerado com sucesso!");
      } else {
        // For demo: redirect to confirmation
        sessionStorage.setItem(
          "paymentResult",
          JSON.stringify({
            status: "pending",
            method: selectedMethod,
            ...checkoutData,
          })
        );
        router.push("/confirmacao?status=pending");
      }
    } catch (error) {
      console.error("Payment error:", error);
      // For demo: show PIX fallback
      if (selectedMethod === "pix") {
        setShowPixCode(true);
        toast.success("Use a chave PIX abaixo para realizar o pagamento");
      } else {
        toast.error(
          "Erro ao processar pagamento. Por favor, use o PIX como alternativa."
        );
        setSelectedMethod("pix");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPixPayment = () => {
    sessionStorage.setItem(
      "paymentResult",
      JSON.stringify({
        status: "approved",
        method: "pix",
        ...checkoutData,
      })
    );
    router.push("/confirmacao?status=approved");
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Carregando...</div>
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

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {!showPixCode ? (
                <>
                  <h2 className="font-serif text-2xl font-bold mb-6">
                    Forma de Pagamento
                  </h2>

                  <div className="space-y-3 mb-6">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const isSelected = selectedMethod === method.id;

                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-accent hover:border-primary/50"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isSelected ? "bg-primary" : "bg-accent"
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 ${
                                isSelected ? "text-white" : "text-text"
                              }`}
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{method.name}</span>
                              {method.recommended && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  Recomendado
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-text-muted">
                              {method.description}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-accent"
                            }`}
                          >
                            {isSelected && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    onClick={handleProcessPayment}
                    isLoading={isProcessing}
                    size="lg"
                    className="w-full"
                  >
                    Pagar {formatCurrency(checkoutData.amount)}
                  </Button>
                </>
              ) : (
                /* PIX Payment View */
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold mb-2">
                      Pague via PIX
                    </h2>
                    <p className="text-text-muted">
                      Use sua chave PIX ou escaneie o QR Code
                    </p>
                  </div>

                  <Card className="bg-accent/30">
                    <CardContent className="text-center space-y-4">
                      {/* QR Code Placeholder */}
                      <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-accent">
                        <QrCode className="w-24 h-24 text-text-muted" />
                      </div>

                      <div className="text-sm text-text-muted">
                        ou copie a chave PIX abaixo
                      </div>

                      {/* PIX Key */}
                      <div className="flex items-center gap-2 bg-white rounded-lg p-3">
                        <Input
                          value={weddingData.pixKey}
                          readOnly
                          className="text-center font-mono"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyPixKey}
                          leftIcon={<Copy className="w-4 h-4" />}
                        >
                          Copiar
                        </Button>
                      </div>

                      <div className="text-lg font-bold text-primary">
                        Valor: {formatCurrency(checkoutData.amount)}
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleConfirmPixPayment}
                    size="lg"
                    className="w-full"
                    leftIcon={<CheckCircle className="w-5 h-5" />}
                  >
                    Já fiz o pagamento
                  </Button>

                  <p className="text-sm text-text-muted text-center">
                    Após o pagamento, você receberá uma confirmação por email
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
