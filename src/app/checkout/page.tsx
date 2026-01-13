"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  Shield,
  Loader2,
  Copy,
  Check,
  AlertCircle,
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

type PaymentMethod = "pix" | "credit_card";

interface PixData {
  qr_code: string;
  qr_code_base64: string;
  payment_id: number;
}

interface CardData {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
  installments: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [cpf, setCpf] = useState("");

  // Card form state
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: "",
    cardholderName: "",
    expirationMonth: "",
    expirationYear: "",
    securityCode: "",
    identificationType: "CPF",
    identificationNumber: "",
    installments: "1",
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutData");
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    } else {
      router.push("/presentes");
    }
  }, [router]);

  // Poll payment status for PIX
  useEffect(() => {
    if (!pixData?.payment_id) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment-status/${pixData.payment_id}`);
        const data = await response.json();

        if (data.status === "approved") {
          setPaymentStatus("approved");
          clearInterval(interval);
          toast.success("Pagamento aprovado!");
          sessionStorage.removeItem("checkoutData");
          router.push("/confirmacao?status=approved");
        }
      } catch (err) {
        console.error("Status check error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pixData, router]);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{4})(?=\d)/g, "$1 ").trim().substring(0, 19);
  };

  const handlePixPayment = async () => {
    if (!checkoutData || !cpf) {
      if (!cpf) {
        toast.error("Por favor, informe seu CPF");
        return;
      }
      return;
    }

    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      toast.error("CPF inválido");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const nameParts = checkoutData.guest_name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || firstName;

      const response = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_amount: checkoutData.amount,
          description: `Presente: ${checkoutData.gift_name}`,
          payer: {
            email: checkoutData.guest_email,
            first_name: firstName,
            last_name: lastName,
            identification: {
              type: "CPF",
              number: cleanCpf,
            },
          },
          external_reference: JSON.stringify({
            gift_id: checkoutData.gift_id,
            guest_name: checkoutData.guest_name,
            guest_email: checkoutData.guest_email,
            message: checkoutData.message || "",
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar PIX");
      }

      if (data.success && data.qr_code) {
        setPixData({
          qr_code: data.qr_code,
          qr_code_base64: data.qr_code_base64,
          payment_id: data.id,
        });
        toast.success("PIX gerado! Escaneie o QR Code ou copie o código.");
      } else {
        throw new Error("Não foi possível gerar o PIX");
      }
    } catch (err) {
      console.error("PIX error:", err);
      const message = err instanceof Error ? err.message : "Erro ao gerar PIX";
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkoutData) return;

    // Validate form
    const cleanCardNumber = cardData.cardNumber.replace(/\s/g, "");
    if (cleanCardNumber.length < 13) {
      toast.error("Número do cartão inválido");
      return;
    }
    if (!cardData.cardholderName) {
      toast.error("Informe o nome no cartão");
      return;
    }
    if (!cardData.expirationMonth || !cardData.expirationYear) {
      toast.error("Informe a validade do cartão");
      return;
    }
    if (cardData.securityCode.length < 3) {
      toast.error("CVV inválido");
      return;
    }
    const cleanCpf = cardData.identificationNumber.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      toast.error("CPF inválido");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Send card data directly to our API which will create token server-side
      const response = await fetch("/api/process-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          card_number: cleanCardNumber,
          cardholder_name: cardData.cardholderName,
          expiration_month: cardData.expirationMonth,
          expiration_year: `20${cardData.expirationYear}`,
          security_code: cardData.securityCode,
          identification_type: cardData.identificationType,
          identification_number: cleanCpf,
          installments: parseInt(cardData.installments),
          transaction_amount: checkoutData.amount,
          description: `Presente: ${checkoutData.gift_name}`,
          payer_email: checkoutData.guest_email,
          external_reference: JSON.stringify({
            gift_id: checkoutData.gift_id,
            guest_name: checkoutData.guest_name,
            guest_email: checkoutData.guest_email,
            message: checkoutData.message || "",
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar pagamento");
      }

      if (data.status === "approved") {
        toast.success("Pagamento aprovado!");
        sessionStorage.removeItem("checkoutData");
        router.push("/confirmacao?status=approved");
      } else if (data.status === "in_process" || data.status === "pending") {
        toast.success("Pagamento em análise");
        router.push("/confirmacao?status=pending");
      } else {
        throw new Error(data.status_detail || "Pagamento não aprovado. Tente novamente.");
      }
    } catch (err) {
      console.error("Card payment error:", err);
      const message = err instanceof Error ? err.message : "Erro ao processar pagamento";
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyPixCode = async () => {
    if (!pixData?.qr_code) return;

    try {
      await navigator.clipboard.writeText(pixData.qr_code);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Erro ao copiar código");
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
            className="text-2xl md:text-3xl lg:text-4xl font-serif"
          >
            Finalizar Pagamento
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <section className="section py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-xl md:text-2xl font-bold mb-4 md:mb-6">
                Resumo do Pedido
              </h2>
              <Card>
                <CardContent className="space-y-4 p-4 md:p-6">
                  <div className="flex gap-4">
                    <img
                      src={checkoutData.gift_image}
                      alt={checkoutData.gift_name}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text text-sm md:text-base truncate">
                        {checkoutData.gift_name}
                      </h3>
                      <p className="text-text-muted text-xs md:text-sm truncate">
                        {checkoutData.guest_name}
                      </p>
                      <p className="text-text-muted text-xs md:text-sm truncate">
                        {checkoutData.guest_email}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-accent pt-4">
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
                      <p className="text-text italic text-sm">
                        &ldquo;{checkoutData.message}&rdquo;
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Badge */}
              <div className="mt-4 md:mt-6 flex items-center gap-3 text-text-muted">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
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
              <h2 className="font-serif text-xl md:text-2xl font-bold mb-4 md:mb-6">
                Forma de Pagamento
              </h2>

              {/* Payment Method Tabs */}
              <div className="flex gap-2 mb-4 md:mb-6">
                <button
                  onClick={() => {
                    setPaymentMethod("pix");
                    setPixData(null);
                    setError(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 md:px-4 rounded-lg border-2 transition-all text-sm md:text-base ${
                    paymentMethod === "pix"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="font-medium">PIX</span>
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod("credit_card");
                    setPixData(null);
                    setError(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 md:px-4 rounded-lg border-2 transition-all text-sm md:text-base ${
                    paymentMethod === "credit_card"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Cartão</span>
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* PIX Payment */}
              {paymentMethod === "pix" && (
                <Card>
                  <CardContent className="p-4 md:p-6">
                    {!pixData ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <QrCode className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm md:text-base">Pagamento via PIX</p>
                            <p className="text-xs md:text-sm text-text-muted">
                              Aprovação instantânea
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            CPF <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(formatCPF(e.target.value))}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm md:text-base"
                          />
                        </div>

                        <Button
                          onClick={handlePixPayment}
                          isLoading={isProcessing}
                          size="lg"
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {isProcessing ? "Gerando PIX..." : "Gerar QR Code PIX"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="font-semibold text-base md:text-lg mb-2">
                            Escaneie o QR Code
                          </p>
                          <p className="text-xs md:text-sm text-text-muted mb-4">
                            Abra o app do seu banco e escaneie o código
                          </p>

                          {/* QR Code */}
                          <div className="flex justify-center mb-4">
                            <div className="bg-white p-3 md:p-4 rounded-xl shadow-lg">
                              <img
                                src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                alt="QR Code PIX"
                                className="w-40 h-40 md:w-48 md:h-48"
                              />
                            </div>
                          </div>

                          {/* Payment Status */}
                          {paymentStatus === "approved" ? (
                            <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                              <Check className="w-5 h-5" />
                              <span className="font-medium">Pagamento aprovado!</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 text-amber-600 mb-4">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Aguardando pagamento...</span>
                            </div>
                          )}

                          {/* PIX Code */}
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-text-muted mb-2">
                              Ou copie o código PIX:
                            </p>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                readOnly
                                value={pixData.qr_code}
                                className="flex-1 text-xs bg-white px-2 md:px-3 py-2 rounded border truncate"
                              />
                              <Button
                                onClick={copyPixCode}
                                variant="outline"
                                size="sm"
                                className="flex-shrink-0"
                              >
                                {copied ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => setPixData(null)}
                          variant="ghost"
                          className="w-full"
                        >
                          Gerar novo código
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Credit Card Payment */}
              {paymentMethod === "credit_card" && (
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm md:text-base">Cartão de Crédito</p>
                        <p className="text-xs md:text-sm text-text-muted">
                          Parcele em até 12x
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleCardPayment} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Número do cartão <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cardData.cardNumber}
                          onChange={(e) => setCardData({ ...cardData, cardNumber: formatCardNumber(e.target.value) })}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm md:text-base"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nome no cartão <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cardData.cardholderName}
                          onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value.toUpperCase() })}
                          placeholder="NOME COMO NO CARTÃO"
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm md:text-base uppercase"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3 md:gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Mês <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={cardData.expirationMonth}
                            onChange={(e) => setCardData({ ...cardData, expirationMonth: e.target.value })}
                            className="w-full px-2 md:px-3 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm md:text-base bg-white"
                          >
                            <option value="">MM</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                              <option key={m} value={m.toString().padStart(2, "0")}>
                                {m.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Ano <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={cardData.expirationYear}
                            onChange={(e) => setCardData({ ...cardData, expirationYear: e.target.value })}
                            className="w-full px-2 md:px-3 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm md:text-base bg-white"
                          >
                            <option value="">AA</option>
                            {Array.from({ length: 15 }, (_, i) => 24 + i).map((y) => (
                              <option key={y} value={y.toString()}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            CVV <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={cardData.securityCode}
                            onChange={(e) => setCardData({ ...cardData, securityCode: e.target.value.replace(/\D/g, "").substring(0, 4) })}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-2 md:px-3 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm md:text-base"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          CPF do titular <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cardData.identificationNumber}
                          onChange={(e) => setCardData({ ...cardData, identificationNumber: formatCPF(e.target.value) })}
                          placeholder="000.000.000-00"
                          maxLength={14}
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm md:text-base"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Parcelas
                        </label>
                        <select
                          value={cardData.installments}
                          onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm md:text-base bg-white"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n}x de {formatCurrency(checkoutData.amount / n)}
                              {n === 1 ? " (à vista)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Button
                        type="submit"
                        isLoading={isProcessing}
                        size="lg"
                        className="w-full"
                      >
                        {isProcessing ? "Processando..." : `Pagar ${formatCurrency(checkoutData.amount)}`}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              <p className="mt-4 text-xs md:text-sm text-text-muted text-center">
                Seus dados estão protegidos pelo Mercado Pago
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
