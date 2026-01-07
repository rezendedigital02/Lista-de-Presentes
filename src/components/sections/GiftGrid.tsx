"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input, Select, Button, Badge } from "@/components/ui";
import { GiftCard } from "./GiftCard";
import { categoryLabels, type Gift, type Category, type GiftFilters } from "@/types";

interface GiftGridProps {
  gifts: Gift[];
}

const priceRanges = [
  { value: "all", label: "Todos os preços" },
  { value: "0-200", label: "Até R$ 200" },
  { value: "200-500", label: "R$ 200 - R$ 500" },
  { value: "500-1000", label: "R$ 500 - R$ 1.000" },
  { value: "1000-3000", label: "R$ 1.000 - R$ 3.000" },
  { value: "3000+", label: "Acima de R$ 3.000" },
];

const categoryOptions = [
  { value: "all", label: "Todas as categorias" },
  ...Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
];

export function GiftGrid({ gifts }: GiftGridProps) {
  const [filters, setFilters] = useState<GiftFilters>({
    category: "all",
    search: "",
  });
  const [priceRange, setPriceRange] = useState("all");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) => {
      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          gift.name.toLowerCase().includes(searchLower) ||
          gift.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Filter by category
      if (filters.category && filters.category !== "all") {
        if (gift.category !== filters.category) return false;
      }

      // Filter by price range
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map((v) => {
          if (v === "3000+") return Infinity;
          return parseInt(v.replace("+", ""));
        });
        const actualMax = max || Infinity;
        if (gift.price < (min || 0) || gift.price > actualMax) return false;
      }

      // Filter by availability
      if (showOnlyAvailable) {
        if (gift.amount_received >= gift.price) return false;
      }

      return true;
    });
  }, [gifts, filters, priceRange, showOnlyAvailable]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category && filters.category !== "all") count++;
    if (priceRange !== "all") count++;
    if (showOnlyAvailable) count++;
    if (filters.search) count++;
    return count;
  }, [filters, priceRange, showOnlyAvailable]);

  const clearFilters = () => {
    setFilters({ category: "all", search: "" });
    setPriceRange("all");
    setShowOnlyAvailable(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar presentes..."
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            leftIcon={<Search className="w-5 h-5" />}
            rightIcon={
              filters.search ? (
                <button
                  onClick={() => setFilters({ ...filters, search: "" })}
                  className="hover:text-text"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : undefined
            }
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          rightIcon={
            activeFiltersCount > 0 ? (
              <Badge variant="info" size="sm">
                {activeFiltersCount}
              </Badge>
            ) : undefined
          }
        >
          Filtros
        </Button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-accent/30 rounded-xl p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Categoria"
                  options={categoryOptions}
                  value={filters.category || "all"}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      category: e.target.value as Category | "all",
                    })
                  }
                />
                <Select
                  label="Faixa de Preço"
                  options={priceRanges}
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                />
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer p-2.5">
                    <input
                      type="checkbox"
                      checked={showOnlyAvailable}
                      onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                      className="w-5 h-5 rounded border-accent text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-text">
                      Apenas disponíveis
                    </span>
                  </label>
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <p className="text-sm text-text-muted">
        {filteredGifts.length === 0
          ? "Nenhum presente encontrado"
          : filteredGifts.length === 1
          ? "1 presente encontrado"
          : `${filteredGifts.length} presentes encontrados`}
      </p>

      {/* Gift Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredGifts.map((gift, index) => (
            <GiftCard key={gift.id} gift={gift} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredGifts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
            <Search className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text mb-2">
            Nenhum presente encontrado
          </h3>
          <p className="text-text-muted mb-4">
            Tente ajustar os filtros ou buscar por outro termo
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Limpar filtros
          </Button>
        </motion.div>
      )}
    </div>
  );
}
