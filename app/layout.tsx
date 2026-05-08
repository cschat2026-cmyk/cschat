import type { Metadata } from "next";

import { AdSenseScript } from "@/components/adsense-script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteDescription, siteName } from "@/lib/site-data";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteName} | Seller Fee Calculators and Freelance Pricing Tools`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AdSenseScript />
        <div className="site-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
