"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AdPreferencesContextType {
  showAds: boolean;
  setShowAds: (show: boolean) => void;
  adsEnabled: boolean;
}

const AdPreferencesContext = createContext<AdPreferencesContextType | null>(
  null,
);

export function AdPreferencesProvider({ children }: { children: ReactNode }) {
  const [showAds, setShowAds] = useState(true);
  const [adsEnabled, setAdsEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("argent-show-ads");
    if (stored !== null) {
      const enabled = stored === "true";
      setShowAds(enabled);
      setAdsEnabled(enabled);
    }
  }, []);

  const handleSetShowAds = (show: boolean) => {
    setShowAds(show);
    localStorage.setItem("argent-show-ads", show.toString());
  };

  return (
    <AdPreferencesContext.Provider
      value={{ showAds, setShowAds: handleSetShowAds, adsEnabled }}
    >
      {children}
    </AdPreferencesContext.Provider>
  );
}

export function useAdPreferences() {
  const context = useContext(AdPreferencesContext);
  if (!context)
    throw new Error(
      "useAdPreferences must be used within AdPreferencesProvider",
    );
  return context;
}
