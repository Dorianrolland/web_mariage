import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notre Mariage | Château de Chaussy",
  description:
    "Nous avons l'immense joie de vous convier à célébrer notre union au Château de Chaussy. Rejoignez-nous pour une journée inoubliable.",
  keywords: ["mariage", "château", "Chaussy", "invitation", "wedding"],
  openGraph: {
    title: "Notre Mariage | Château de Chaussy",
    description:
      "Nous avons l'immense joie de vous convier à célébrer notre union au Château de Chaussy.",
    type: "website",
    locale: "fr_FR",
  },
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
