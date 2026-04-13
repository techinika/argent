"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const ADSENSE_ID = "ca-pub-1268572467254702";

interface AdSenseProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export function AdSense({
  adSlot,
  adFormat = "auto",
  className = "",
}: AdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        if (!window.adsbygoogle) {
          window.adsbygoogle = [];
        }
        window.adsbygoogle.push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block", minHeight: "90px" }}
      data-ad-client={`pub-${ADSENSE_ID}`}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}

export function AdBannerTop() {
  return (
    <div className="w-full flex justify-center py-2 bg-zinc-50 dark:bg-zinc-900">
      <AdSense adSlot="7256871740" adFormat="horizontal" className="mx-auto" />
    </div>
  );
}

export function AdBannerBottom() {
  return (
    <div className="w-full flex justify-center py-4 bg-zinc-50 dark:bg-zinc-900">
      <AdSense adSlot="3380961742" adFormat="horizontal" className="mx-auto" />
    </div>
  );
}

export function AdSidebar() {
  return (
    <div className="w-full py-4">
      <AdSense adSlot="3380961743" adFormat="rectangle" className="mx-auto" />
    </div>
  );
}

export function AdInContent() {
  return (
    <div className="w-full py-6">
      <AdSense adSlot="7256871741" adFormat="auto" className="mx-auto" />
    </div>
  );
}
