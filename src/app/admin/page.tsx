"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Gift,
  DollarSign,
  Users,
  TrendingUp,
  Package,
  MessageSquare,
  Settings,
  Eye,
} from "lucide-react";
import { Card, CardContent, Button, Badge, ProgressBar } from "@/components/ui";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { categoryLabels, type Category } from "@/types";
import { initialGifts } from "@/lib/gifts-data";

// Mock contributions for demo
const mockContributions = [
  {
    id: "1",
    gift_id: "1",
    guest_name: "Maria Silva",
    guest_email: "maria@email.com",
    amount: 350,
    message: "Felicidades ao casal!",
    payment_status: "approved",
    created_at: "2025-01-05T10:30:00Z",
  },
  {
    id: "2",
    gift_id: "4",
    guest_name: "João Santos",
    guest_email: "joao@email.com",
    amount: 550,
    message: "Muito amor para vocês!",
    payment_status: "approved",
    created_at: "2025-01-04T15:00:00Z",
  },
  {
    id: "3",
    gift_id: "14",
    guest_name: "Ana Costa",
    guest_email: "ana@email.com",
    amount: 180,
    payment_status: "approved",
    created_at: "2025-01-03T09:00:00Z",
  },
  {
    id: "4",
    gift_id: "18",
    guest_name: "Pedro Lima",
    guest_email: "pedro@email.com",
    amount: 150,
    message: "Sejam muito felizes!",
    payment_status: "approved",
    created_at: "2025-01-02T14:30:00Z",
  },
  {
    id: "5",
    gift_id: "23",
    guest_name: "Carla Mendes",
    guest_email: "carla@email.com",
    amount: 500,
    message: "Aproveitem a lua de mel!",
    payment_status: "pending",
    created_at: "2025-01-06T11:00:00Z",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "contributions" | "messages">("overview");

  // Calculate stats
  const stats = useMemo(() => {
    const totalGifts = initialGifts.length;
    const totalReceived = initialGifts.reduce((sum, g) => sum + g.amount_received, 0);
    const totalValue = initialGifts.reduce((sum, g) => sum + g.price, 0);
    const fullyFunded = initialGifts.filter((g) => g.amount_received >= g.price).length;
    const totalContributors = mockContributions.filter(
      (c) => c.payment_status === "approved"
    ).length;

    const giftsByCategory = initialGifts.reduce((acc, gift) => {
      acc[gift.category] = (acc[gift.category] || 0) + 1;
      return acc;
    }, {} as Record<Category, number>);

    return {
      totalGifts,
      totalReceived,
      totalValue,
      fullyFunded,
      totalContributors,
      giftsByCategory,
      progress: (totalReceived / totalValue) * 100,
    };
  }, []);

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: TrendingUp },
    { id: "contributions", label: "Contribuições", icon: DollarSign },
    { id: "messages", label: "Mensagens", icon: MessageSquare },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1>Painel Administrativo</h1>
              <p className="text-lg">Gerencie sua lista de presentes</p>
            </div>
            <Link href="/admin/presentes">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-secondary"
                leftIcon={<Settings className="w-4 h-4" />}
              >
                Gerenciar Presentes
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <section className="section">
        <div className="container mx-auto px-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Total Arrecadado",
                value: formatCurrency(stats.totalReceived),
                icon: DollarSign,
                color: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                label: "Presentes na Lista",
                value: stats.totalGifts.toString(),
                icon: Gift,
                color: "text-primary",
                bgColor: "bg-primary/10",
              },
              {
                label: "Presentes Completos",
                value: stats.fullyFunded.toString(),
                icon: Package,
                color: "text-blue-600",
                bgColor: "bg-blue-100",
              },
              {
                label: "Contribuidores",
                value: stats.totalContributors.toString(),
                icon: Users,
                color: "text-purple-600",
                bgColor: "bg-purple-100",
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">{stat.label}</p>
                        <p className="text-2xl font-bold text-text">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Progress Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-semibold">
                    Progresso Geral
                  </h3>
                  <span className="text-2xl font-bold text-primary">
                    {stats.progress.toFixed(1)}%
                  </span>
                </div>
                <ProgressBar value={stats.progress} size="lg" />
                <div className="flex justify-between mt-2 text-sm text-text-muted">
                  <span>Arrecadado: {formatCurrency(stats.totalReceived)}</span>
                  <span>Meta: {formatCurrency(stats.totalValue)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "primary" : "ghost"}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  leftIcon={<Icon className="w-4 h-4" />}
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Gifts by Category */}
              <Card>
                <CardContent>
                  <h3 className="font-serif text-lg font-semibold mb-4">
                    Presentes por Categoria
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.giftsByCategory).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-text">{categoryLabels[category as Category]}</span>
                        <Badge>{count} presentes</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Contributions */}
              <Card>
                <CardContent>
                  <h3 className="font-serif text-lg font-semibold mb-4">
                    Contribuições Recentes
                  </h3>
                  <div className="space-y-3">
                    {mockContributions.slice(0, 5).map((contribution) => (
                      <div
                        key={contribution.id}
                        className="flex items-center justify-between py-2 border-b border-accent/50 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-text">
                            {contribution.guest_name}
                          </p>
                          <p className="text-sm text-text-muted">
                            {formatShortDate(contribution.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            {formatCurrency(contribution.amount)}
                          </p>
                          <Badge
                            variant={
                              contribution.payment_status === "approved"
                                ? "success"
                                : "warning"
                            }
                            size="sm"
                          >
                            {contribution.payment_status === "approved"
                              ? "Aprovado"
                              : "Pendente"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "contributions" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-accent">
                          <th className="text-left py-3 px-4 font-semibold text-text">
                            Contribuidor
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-text">
                            Presente
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-text">
                            Valor
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-text">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-text">
                            Data
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-text">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockContributions.map((contribution) => {
                          const gift = initialGifts.find(
                            (g) => g.id === contribution.gift_id
                          );
                          return (
                            <tr
                              key={contribution.id}
                              className="border-b border-accent/50 hover:bg-accent/20"
                            >
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium">{contribution.guest_name}</p>
                                  <p className="text-sm text-text-muted">
                                    {contribution.guest_email}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-text-muted">
                                {gift?.name || "Presente não encontrado"}
                              </td>
                              <td className="py-3 px-4 font-semibold text-primary">
                                {formatCurrency(contribution.amount)}
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant={
                                    contribution.payment_status === "approved"
                                      ? "success"
                                      : "warning"
                                  }
                                >
                                  {contribution.payment_status === "approved"
                                    ? "Aprovado"
                                    : "Pendente"}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-text-muted">
                                {formatShortDate(contribution.created_at)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "messages" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {mockContributions
                .filter((c) => c.message)
                .map((contribution) => (
                  <Card key={contribution.id}>
                    <CardContent>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-text">
                            {contribution.guest_name}
                          </p>
                          <p className="text-sm text-text-muted mb-2">
                            {formatShortDate(contribution.created_at)}
                          </p>
                          <p className="text-text italic">
                            &ldquo;{contribution.message}&rdquo;
                          </p>
                        </div>
                        <Badge variant="success">
                          {formatCurrency(contribution.amount)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
