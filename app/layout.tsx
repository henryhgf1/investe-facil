import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ProgressHydrator } from "@/components/learn/progress-hydrator";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5faf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

const themeScript = `(function(){var root=document.documentElement;root.classList.add("js");try{var key="investe-facil:theme";var value=window.localStorage.getItem(key);var theme=value==="light"||value==="dark"?value:"system";var dark=theme==="dark"||(theme==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);root.classList.toggle("dark",dark);root.style.colorScheme=dark?"dark":"light";}catch(error){}})();`;

export const metadata: Metadata = {
  title: {
    default: "Investe Fácil: aprenda a investir sem arriscar dinheiro de verdade",
    template: "%s · Investe Fácil",
  },
  description:
    "Trilha de educação financeira com lições curtas, simuladores interativos e progresso gamificado. Feito para quem quer começar a investir sem jargão e sem risco.",
  applicationName: "Investe Fácil",
  authors: [{ name: "Henry" }],
  keywords: [
    "investimentos para iniciantes",
    "educação financeira",
    "juros compostos",
    "simulador de investimentos",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Investe Fácil",
    title: "Investe Fácil: aprenda a investir sem arriscar dinheiro de verdade",
    description:
      "Teoria curta, simuladores interativos e um caminho claro para o seu primeiro investimento.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a
          href="#conteudo"
          className="bg-primary text-on-primary sr-only rounded-lg px-4 py-2 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
        >
          Pular para o conteúdo
        </a>
        <ProgressHydrator />
        <Header />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
