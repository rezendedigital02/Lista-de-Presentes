"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Search,
  Image as ImageIcon,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Input,
  Textarea,
  Select,
  Modal,
  Badge,
  ProgressBar,
} from "@/components/ui";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import { categoryLabels, type Gift, type Category } from "@/types";
import { initialGifts } from "@/lib/gifts-data";

const categoryOptions = Object.entries(categoryLabels).map(([value, label]) => ({
  value,
  label,
}));

export default function AdminGiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "cozinha" as Category,
  });

  // Filter gifts
  const filteredGifts = gifts.filter((gift) => {
    const matchesSearch =
      gift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || gift.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openCreateModal = () => {
    setEditingGift(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category: "cozinha",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (gift: Gift) => {
    setEditingGift(gift);
    setFormData({
      name: gift.name,
      description: gift.description,
      price: gift.price.toString(),
      image_url: gift.image_url,
      category: gift.category,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (editingGift) {
        // Update existing gift
        setGifts(
          gifts.map((g) =>
            g.id === editingGift.id
              ? {
                  ...g,
                  ...formData,
                  price: parseFloat(formData.price),
                }
              : g
          )
        );
        toast.success("Presente atualizado com sucesso!");
      } else {
        // Create new gift
        const newGift: Gift = {
          id: `new-${Date.now()}`,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image_url:
            formData.image_url ||
            "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500",
          category: formData.category,
          is_available: true,
          amount_received: 0,
          created_at: new Date().toISOString(),
        };
        setGifts([newGift, ...gifts]);
        toast.success("Presente adicionado com sucesso!");
      }

      setIsModalOpen(false);
    } catch {
      toast.error("Erro ao salvar presente");
    }
  };

  const handleDelete = (giftId: string) => {
    if (confirm("Tem certeza que deseja excluir este presente?")) {
      setGifts(gifts.filter((g) => g.id !== giftId));
      toast.success("Presente excluído com sucesso!");
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container mx-auto px-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao painel
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <h1>Gerenciar Presentes</h1>
            <Button
              onClick={openCreateModal}
              className="bg-primary hover:bg-primary-dark"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Adicionar Presente
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <section className="section">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar presentes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <Select
              options={[{ value: "all", label: "Todas as categorias" }, ...categoryOptions]}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category | "all")}
            />
          </div>

          {/* Stats */}
          <div className="flex gap-4 mb-6 text-sm text-text-muted">
            <span>{filteredGifts.length} presentes encontrados</span>
            <span>|</span>
            <span>
              Total: {formatCurrency(filteredGifts.reduce((sum, g) => sum + g.price, 0))}
            </span>
          </div>

          {/* Gifts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGifts.map((gift) => {
                const progress = calculateProgress(gift.amount_received, gift.price);
                const isFullyFunded = gift.amount_received >= gift.price;

                return (
                  <motion.div
                    key={gift.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full">
                      <div className="relative aspect-video overflow-hidden rounded-t-xl">
                        <img
                          src={gift.image_url}
                          alt={gift.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Badge
                            variant={isFullyFunded ? "success" : "default"}
                            className="bg-white/90"
                          >
                            {categoryLabels[gift.category]}
                          </Badge>
                        </div>
                      </div>
                      <CardContent>
                        <h3 className="font-semibold text-text mb-1 line-clamp-1">
                          {gift.name}
                        </h3>
                        <p className="text-sm text-text-muted mb-3 line-clamp-2">
                          {gift.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-primary">
                              {formatCurrency(gift.price)}
                            </span>
                            <span className="text-sm text-text-muted">
                              {progress.toFixed(0)}% arrecadado
                            </span>
                          </div>
                          <ProgressBar
                            value={progress}
                            size="sm"
                            variant={isFullyFunded ? "success" : "primary"}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => openEditModal(gift)}
                            leftIcon={<Edit className="w-4 h-4" />}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(gift.id)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredGifts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted">Nenhum presente encontrado</p>
            </div>
          )}
        </div>
      </section>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGift ? "Editar Presente" : "Adicionar Presente"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome do Presente *"
            placeholder="Ex: Jogo de Panelas"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Textarea
            label="Descrição *"
            placeholder="Descreva o presente..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preço (R$) *"
              type="number"
              placeholder="500"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />

            <Select
              label="Categoria"
              options={categoryOptions}
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as Category })
              }
            />
          </div>

          <Input
            label="URL da Imagem"
            placeholder="https://exemplo.com/imagem.jpg"
            value={formData.image_url}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
            leftIcon={<ImageIcon className="w-4 h-4" />}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {editingGift ? "Salvar Alterações" : "Adicionar Presente"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
