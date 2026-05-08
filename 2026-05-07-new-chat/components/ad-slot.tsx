"use client";

import { useEffect } from "react";

import { adsenseConfig, adsenseEnabled } from "@/lib/ad-config";

type AdVariant = "hero" | "tool-grid" | "sidebar" | "result-inline";

type Props = {
  variant: AdVariant;
};

const slotMap: Record<AdVariant, string> = {
  hero: adsenseConfig.heroBannerSlot,
  "tool-grid": adsenseConfig.toolGridBannerSlot,
  sidebar: adsenseConfig.sidebarRectangleSlot,
  "result-inline": adsenseConfig.resultInlineBannerSlot,
};

const classMap: Record<AdVariant, string> = {
  hero: "ad-slot",
  "tool-grid": "ad-slot",
  sidebar: "ad-slot vertical",
  "result-inline": "ad-slot",
};

const labelMap: Record<AdVariant, { title: string; description: string }> = {
  hero: {
    title: "Responsive header banner",
    description: "Best used below the hero for a softer first monetization touch.",
  },
  "tool-grid": {
    title: "Responsive in-content banner",
    description: "A good fit after the core tool list on the homepage.",
  },
  sidebar: {
    title: "300 x 250 sidebar rectangle",
    description: "Best for desktop calculator pages and affiliate cards later.",
  },
  "result-inline": {
    title: "Responsive result-area banner",
    description: "Useful below calculator results once the user completes the task.",
  },
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({ variant }: Props) {
  useEffect(() => {
    if (!adsenseEnabled) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ignore AdSense push timing issues during local development.
    }
  }, []);

  if (!adsenseEnabled) {
    return (
      <div className={classMap[variant]}>
        <span>{labelMap[variant].title}</span>
        <small>{labelMap[variant].description}</small>
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={adsenseConfig.publisherId}
      data-ad-slot={slotMap[variant]}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
