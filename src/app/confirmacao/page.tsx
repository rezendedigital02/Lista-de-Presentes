"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  XCircle,
  Gift,
  Heart,
  Home,
  Mail,
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { weddingData } from "@/types";

interface PaymentResult {
  status: string;
  method: string;
  gift_id: string;
  gift_name: string;
  amount: number;
  guest_name: string;
  guest_email: string;
  message?: string;
}

const statusConfig = {
  approved: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    title: "Pagamento Confirmado!",
    description:
      "Seu presente foi registrado com sucesso. Os noivos agradecem de coração!",
  },
  pending: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    title: "Pagamento Pendente",
    description:
      "Estamos aguardando a confirmação do seu pagamento. Você receberá um email assim que for aprovado.",
  },
  rejected: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    title: "Pagamento Não Aprovado",
    description:
      "Infelizmente seu pagamento não foi aprovado. Por favor, tente novamente com outro método de pagamento.",
  },
};

function ConfirmacaoContent() {
  const searchParams = useSearchParams();
  const status = (searchParams.get("status") || "approved") as keyof typeof statusConfig;
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("paymentResult");
    if (stored) {
      setPaymentResult(JSON.parse(stored));
      sessionStorage.removeItem("paymentResult");
      sessionStorage.removeItem("checkoutData");
    }
  }, []);

  const config = statusConfig[status] || statusConfig.approved;
  const Icon = config.icon;

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
            <h1>{status === "approved" ? "Obrigado!" : "Status do Pagamento"}</h1>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <section className="section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Status Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`w-24 h-24 mx-auto mb-6 rounded-full ${config.bgColor} flex items-center justify-center`}
            >
              <Icon className={`w-12 h-12 ${config.color}`} />
            </motion.div>

            <h2 className="font-serif text-3xl font-bold text-text mb-4">
              {config.title}
            </h2>
            <p className="text-text-muted text-lg mb-8">{config.description}</p>

            {/* Payment Details */}
            {paymentResult && status === "approved" && (
              <Card className="mb-8">
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Gift className="w-5 h-5" />
                    <span className="font-semibold">{paymentResult.gift_name}</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(paymentResult.amount)}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-text-muted text-sm">
                    <Mail className="w-4 h-4" />
                    <span>
                      Confirmação enviada para {paymentResult.guest_email}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Thank You Message */}
            {status === "approved" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-accent/30 rounded-2xl p-8 mb-8"
              >
                <Heart
                  className="w-10 h-10 mx-auto mb-4 text-primary"
                  fill="currentColor"
                />
                <p className="font-serif text-xl text-text italic">
                  &ldquo;Muito obrigado pelo carinho e por fazer parte desse
                  momento tão especial em nossas vidas. Sua generosidade nos
                  enche de alegria!&rdquo;
                </p>
                <p className="mt-4 text-text-muted">
                  Com amor, {weddingData.bride} & {weddingData.groom}
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/presentes">
                <Button
                  variant={status === "rejected" ? "primary" : "outline"}
                  leftIcon={<Gift className="w-4 h-4" />}
                >
                  {status === "rejected" ? "Tentar Novamente" : "Ver Outros Presentes"}
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" leftIcon={<Home className="w-4 h-4" />}>
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default function ConfirmacaoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-text-muted">Carregando...</div>
        </div>
      }
    >
      <ConfirmacaoContent />
    </Suspense>
  );
}
