import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casamento Priscila & Emanuel | Lista de Presentes",
  description:
    "Celebre conosco o casamento de Priscila e Emanuel. Confira nossa lista de presentes e contribua para nossa nova vida juntos.",
  keywords: [
    "casamento",
    "lista de presentes",
    "Priscila",
    "Emanuel",
    "presentes de casamento",
  ],
  authors: [{ name: "Priscila & Emanuel" }],
  openGraph: {
    title: "Casamento Priscila & Emanuel",
    description: "Celebre conosco! Confira nossa lista de presentes.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://sdk.mercadopago.com/js/v2" async></script>
      </head>
      <body className="font-sans bg-background text-text antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "10px",
            },
            success: {
              iconTheme: {
                primary: "#D4A574",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
