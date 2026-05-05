import type { Metadata, Viewport } from "next";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Sora, Space_Mono } from "next/font/google";

import { AppConvexProvider } from "@/components/providers/convex-provider";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EGA BUDGET HOUSE",
    template: "%s | EGA BUDGET HOUSE",
  },
  description:
    "Personal monthly budget tracker for fast transactions, safe balance protection, and monthly spending review.",
  applicationName: "EGA BUDGET HOUSE",
  appleWebApp: {
    capable: true,
    title: "Budget House",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#15803d",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${spaceMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ConvexAuthNextjsServerProvider>
          <AppConvexProvider>{children}</AppConvexProvider>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
