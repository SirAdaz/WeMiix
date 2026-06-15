import type { Metadata, Viewport } from "next";
import { League_Spartan, Bree_Serif } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const breeSerif = Bree_Serif({
  variable: "--font-bree-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "WeMiix — L'app musicale festive",
  description:
    "Karaoké, blind test, playlists collaboratives et mini-jeux musicaux en temps réel avec vos amis.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WeMiix",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    title: "WeMiix — L'app musicale festive",
    description: "Karaoké, blind test, mini-jeux en temps réel avec tes amis.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff2969",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${leagueSpartan.variable} ${breeSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
