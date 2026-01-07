"use client";

import Link from "next/link";
import { Heart, Gift, Mail, Calendar } from "lucide-react";
import { weddingData } from "@/types";
import { formatDate } from "@/lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white/90">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna 1 - Logo e descrição */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" fill="currentColor" />
              <span className="font-serif text-2xl font-semibold">
                {weddingData.bride} & {weddingData.groom}
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Estamos muito felizes em compartilhar esse momento especial com
              vocês. Sua presença é o maior presente que podemos receber!
            </p>
          </div>

          {/* Coluna 2 - Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold">Navegação</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <span>Início</span>
              </Link>
              <Link
                href="/presentes"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <Gift className="w-4 h-4" />
                <span>Lista de Presentes</span>
              </Link>
              <Link
                href="/historia"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <span>Nossa História</span>
              </Link>
            </nav>
          </div>

          {/* Coluna 3 - Informações */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold">Informações</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-white/70">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formatDate(weddingData.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Mail className="w-4 h-4 text-primary" />
                <span>contato@priscilaemanuel.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>
              &copy; {currentYear} {weddingData.bride} & {weddingData.groom}.
              Todos os direitos reservados.
            </p>
            <p className="flex items-center gap-1">
              Feito com <Heart className="w-4 h-4 text-primary" fill="currentColor" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
