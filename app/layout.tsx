import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = { title: "Passos que Alimentam | MF Contabilidade", description: "Pré-inscrição para a corrida beneficente Passos que Alimentam.", icons: { icon: "/brand/mf-logo.png" } };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body className={`${sans.variable} ${display.variable}`}>{children}</body></html>}
