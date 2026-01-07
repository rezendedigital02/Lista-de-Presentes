"use client";

import { useState, useEffect, useCallback } from "react";
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

declare global {
  interface Window {
    MercadoPago: new (publicKey: string, options?: { locale: string }) => MercadoPagoInstance;
  }
}

interface MercadoPagoInstance {
  cardForm: (options: CardFormOptions) => CardFormInstance;
}

interface CardFormOptions {
  amount: string;
  iframe: boolean;
  form: {
    id: string;
    cardNumber: { id: string; placeholder: string };
    expirationDate: { id: string; placeholder: string };
    securityCode: { id: string; placeholder: string };
    cardholderName: { id: string; placeholder: string };
    issuer: { id: string; placeholder: string };
    installments: { id: string; placeholder: string };
    identificationType: { id: string; placeholder: string };
    identificationNumber: { id: string; placeholder: string };
    cardholderEmail: { id: string; placeholder: string };
  };
  callbacks: {
    onFormMounted: (error: Error | null) => void;
    onSubmit: (event: Event) => void;
    onFetching: (resource: string) => () => void;
  };
}

interface CardFormInstance {
  getCardFormData: () => {
    token: string;
    installments: number;
    paymentMethodId: string;
    issuerId: string;
  };
  unmount: () => void;
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
  const [cardFormMounted, setCardFormMounted] = useState(false);
  const [cardFormInstance, setCardFormInstance] = useState<CardFormInstance | null>(null);
  const [cpf, setCpf] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutData");
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    } else {
      router.push("/presentes");
    }
  }, [router]);

  // Load Mercado Pago SDK
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
    if (!publicKey) return;

    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Initialize card form when credit card is selected
  const initializeCardForm = useCallback(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
    if (!publicKey || !checkoutData || !window.MercadoPago) return;

    if (cardFormInstance) {
      cardFormInstance.unmount();
    }

    const mp = new window.MercadoPago(publicKey, { locale: "pt-BR" });

    const cardForm = mp.cardForm({
      amount: String(checkoutData.amount),
      iframe: true,
      form: {
        id: "card-form",
        cardNumber: { id: "card-number", placeholder: "Número do cartão" },
        expirationDate: { id: "expiration-date", placeholder: "MM/AA" },
        securityCode: { id: "security-code", placeholder: "CVV" },
        cardholderName: { id: "cardholder-name", placeholder: "Nome como no cartão" },
        issuer: { id: "issuer", placeholder: "Banco emissor" },
        installments: { id: "installments", placeholder: "Parcelas" },
        identificationType: { id: "identification-type", placeholder: "Tipo" },
        identificationNumber: { id: "identification-number", placeholder: "CPF" },
        cardholderEmail: { id: "cardholder-email", placeholder: "E-mail" },
      },
      callbacks: {
        onFormMounted: (err: Error | null) => {
          if (err) {
            console.error("Form mount error:", err);
            setError("Erro ao carregar formulário de cartão");
          } else {
            setCardFormMounted(true);
          }
        },
        onSubmit: async (event: Event) => {
          event.preventDefault();
          await handleCardPayment();
        },
        onFetching: (resource: string) => {
          console.log("Fetching:", resource);
          setIsProcessing(true);
          return () => setIsProcessing(false);
        },
      },
    });

    setCardFormInstance(cardForm);
  }, [checkoutData, cardFormInstance]);

  useEffect(() => {
    if (paymentMethod === "credit_card" && checkoutData && window.MercadoPago) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initializeCardForm();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [paymentMethod, checkoutData, initializeCardForm]);

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

  const handleCardPayment = async () => {
    if (!cardFormInstance || !checkoutData) return;

    setIsProcessing(true);
    setError(null);

    try {
      const cardFormData = cardFormInstance.getCardFormData();

      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: cardFormData.token,
          transaction_amount: checkoutData.amount,
          installments: cardFormData.installments,
          payment_method_id: cardFormData.paymentMethodId,
          issuer_id: cardFormData.issuerId,
          payer: {
            email: checkoutData.guest_email,
          },
          description: `Presente: ${checkoutData.gift_name}`,
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
        throw new Error("Pagamento não aprovado. Tente novamente.");
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
                Forma de Pagamento
              </h2>

              {/* Payment Method Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => {
                    setPaymentMethod("pix");
                    setPixData(null);
                    setError(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
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
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
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
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* PIX Payment */}
              {paymentMethod === "pix" && (
                <Card>
                  <CardContent>
                    {!pixData ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <QrCode className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold">Pagamento via PIX</p>
                            <p className="text-sm text-text-muted">
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
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                          <p className="font-semibold text-lg mb-2">
                            Escaneie o QR Code
                          </p>
                          <p className="text-sm text-text-muted mb-4">
                            Abra o app do seu banco e escaneie o código abaixo
                          </p>

                          {/* QR Code */}
                          <div className="flex justify-center mb-4">
                            <div className="bg-white p-4 rounded-xl shadow-lg">
                              <img
                                src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                alt="QR Code PIX"
                                className="w-48 h-48"
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
                                className="flex-1 text-xs bg-white px-3 py-2 rounded border truncate"
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
                  <CardContent>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Cartão de Crédito</p>
                        <p className="text-sm text-text-muted">
                          Parcele em até 12x
                        </p>
                      </div>
                    </div>

                    {!cardFormMounted && (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="ml-2 text-text-muted">Carregando formulário...</span>
                      </div>
                    )}

                    <form id="card-form" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Número do cartão
                        </label>
                        <div id="card-number" className="h-12 rounded-lg border border-gray-300"></div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Validade
                          </label>
                          <div id="expiration-date" className="h-12 rounded-lg border border-gray-300"></div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            CVV
                          </label>
                          <div id="security-code" className="h-12 rounded-lg border border-gray-300"></div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nome no cartão
                        </label>
                        <div id="cardholder-name" className="h-12 rounded-lg border border-gray-300"></div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          E-mail
                        </label>
                        <div id="cardholder-email" className="h-12 rounded-lg border border-gray-300"></div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Tipo Doc.
                          </label>
                          <div id="identification-type" className="h-12 rounded-lg border border-gray-300"></div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Documento
                          </label>
                          <div id="identification-number" className="h-12 rounded-lg border border-gray-300"></div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Banco emissor
                        </label>
                        <div id="issuer" className="h-12 rounded-lg border border-gray-300"></div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Parcelas
                        </label>
                        <div id="installments" className="h-12 rounded-lg border border-gray-300"></div>
                      </div>

                      <Button
                        type="submit"
                        isLoading={isProcessing}
                        size="lg"
                        className="w-full"
                        disabled={!cardFormMounted}
                      >
                        {isProcessing ? "Processando..." : `Pagar ${formatCurrency(checkoutData.amount)}`}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              <p className="mt-4 text-sm text-text-muted text-center">
                Seus dados estão protegidos pelo Mercado Pago
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
