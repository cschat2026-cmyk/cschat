import Script from "next/script";

import { adsenseConfig, adsenseEnabled } from "@/lib/ad-config";

export function AdSenseScript() {
  if (!adsenseEnabled) {
    return null;
  }

  return (
    <Script
      id="adsense-script"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseConfig.publisherId}`}
      crossOrigin="anonymous"
    />
  );
}
