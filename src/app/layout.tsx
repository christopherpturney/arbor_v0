import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
});

const lora = Lora({ 
  subsets: ["latin"],
  variable: '--font-lora',
});

export const metadata: Metadata = {
  title: "Arbor Design Advice",
  description: "Expert interior design consultation services",
  icons: {
    icon: '/arbor_design_logo.png',
    apple: '/arbor_design_logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" className={`${playfair.variable} ${lora.variable}`}>
      <body className="font-serif">{children}</body>
    </html>
  );
}
