import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: {
    default: "ISH Workout",
    template: "%s — ISH Workout",
  },
  description:
    "Personal life-management app — track weight, daily todos, meal times, and water intake.",
  applicationName: "ISH Workout",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ISH Workout",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F1EC" },
    { media: "(prefers-color-scheme: dark)", color: "#111110" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh bg-bg-primary text-text-primary antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
