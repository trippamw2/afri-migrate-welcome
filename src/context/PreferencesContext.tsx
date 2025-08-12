import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Country = { code: string; name: string; region?: string; is_schengen?: boolean };

// Minimal fallback sets (focus on Africa origins + key destinations)
const AFRICAN_ORIGINS: Country[] = [
  { code: "NG", name: "Nigeria", region: "Africa" },
  { code: "GH", name: "Ghana", region: "Africa" },
  { code: "KE", name: "Kenya", region: "Africa" },
  { code: "ZA", name: "South Africa", region: "Africa" },
  { code: "EG", name: "Egypt", region: "Africa" },
  { code: "MA", name: "Morocco", region: "Africa" },
  { code: "ET", name: "Ethiopia", region: "Africa" },
  { code: "UG", name: "Uganda", region: "Africa" },
  { code: "TZ", name: "Tanzania", region: "Africa" },
  { code: "RW", name: "Rwanda", region: "Africa" },
  { code: "SN", name: "Senegal", region: "Africa" },
  { code: "CM", name: "Cameroon", region: "Africa" },
];

const DESTINATIONS: Country[] = [
  { code: "UK", name: "United Kingdom", region: "Europe" },
  { code: "US", name: "United States", region: "North America" },
  { code: "CA", name: "Canada", region: "North America" },
  { code: "AU", name: "Australia", region: "Oceania" },
  { code: "NZ", name: "New Zealand", region: "Oceania" },
  { code: "DE", name: "Germany", region: "Europe", is_schengen: true },
  { code: "FR", name: "France", region: "Europe", is_schengen: true },
  { code: "NL", name: "Netherlands", region: "Europe", is_schengen: true },
  { code: "ES", name: "Spain", region: "Europe", is_schengen: true },
  { code: "IT", name: "Italy", region: "Europe", is_schengen: true },
  { code: "IE", name: "Ireland", region: "Europe" },
  { code: "SE", name: "Sweden", region: "Europe", is_schengen: true },
  { code: "DK", name: "Denmark", region: "Europe", is_schengen: true },
  { code: "FI", name: "Finland", region: "Europe", is_schengen: true },
  { code: "BE", name: "Belgium", region: "Europe", is_schengen: true },
  { code: "AT", name: "Austria", region: "Europe", is_schengen: true },
  { code: "PT", name: "Portugal", region: "Europe", is_schengen: true },
  { code: "CH", name: "Switzerland", region: "Europe", is_schengen: true },
  { code: "CZ", name: "Czechia", region: "Europe", is_schengen: true },
  { code: "PL", name: "Poland", region: "Europe", is_schengen: true },
  { code: "HU", name: "Hungary", region: "Europe", is_schengen: true },
  { code: "GR", name: "Greece", region: "Europe", is_schengen: true },
  { code: "MT", name: "Malta", region: "Europe", is_schengen: true },
  { code: "HR", name: "Croatia", region: "Europe", is_schengen: true },
  { code: "LU", name: "Luxembourg", region: "Europe", is_schengen: true },
  { code: "SI", name: "Slovenia", region: "Europe", is_schengen: true },
  { code: "EE", name: "Estonia", region: "Europe", is_schengen: true },
  { code: "LV", name: "Latvia", region: "Europe", is_schengen: true },
  { code: "LT", name: "Lithuania", region: "Europe", is_schengen: true },
  { code: "IS", name: "Iceland", region: "Europe", is_schengen: true },
  { code: "LI", name: "Liechtenstein", region: "Europe", is_schengen: true },
  { code: "NO", name: "Norway", region: "Europe", is_schengen: true },
];

// Very light i18n dictionary
const DICT = {
  en: {
    origin: "Origin",
    destination: "Destination",
    language: "Language",
  },
  fr: {
    origin: "Pays d'origine",
    destination: "Destination",
    language: "Langue",
  },
} as const;

export type Locale = keyof typeof DICT;

const STORAGE_KEY = "am_prefs";

type Preferences = {
  origin?: string; // country code
  destination?: string; // country code
  locale: Locale;
};

type Ctx = Preferences & {
  setOrigin: (code?: string) => void;
  setDestination: (code?: string) => void;
  setLocale: (loc: Locale) => void;
  t: (key: keyof typeof DICT["en"]) => string;
  africanOrigins: Country[];
  destinations: Country[];
};

const PreferencesContext = createContext<Ctx | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { locale: "en" };
  });

  const [userId, setUserId] = useState<string | null>(null);

  // Auth binding
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user?.id ?? null));
    return () => subscription.unsubscribe();
  }, []);

  // Load from DB if logged in
  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("origin_country_code, destination_country_code, locale")
        .eq("user_id", userId)
        .maybeSingle();
      if (!error && data) {
        setPrefs({
          origin: data.origin_country_code ?? undefined,
          destination: data.destination_country_code ?? undefined,
          locale: (data.locale as Locale) || "en",
        });
      }
    })();
  }, [userId]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  // Upsert to DB when logged in
  async function syncToDb(next: Preferences) {
    if (!userId) return;
    await supabase.from("user_preferences").upsert({
      user_id: userId,
      origin_country_code: next.origin ?? null,
      destination_country_code: next.destination ?? null,
      locale: next.locale,
    }, { onConflict: "user_id" });
  }

  const setOrigin = (code?: string) => {
    const next = { ...prefs, origin: code };
    setPrefs(next);
    void syncToDb(next);
  };
  const setDestination = (code?: string) => {
    const next = { ...prefs, destination: code };
    setPrefs(next);
    void syncToDb(next);
  };
  const setLocale = (loc: Locale) => {
    const next = { ...prefs, locale: loc };
    setPrefs(next);
    void syncToDb(next);
  };

  const t = (key: keyof typeof DICT["en"]) => DICT[prefs.locale ?? "en"][key];

  const value: Ctx = useMemo(() => ({
    origin: prefs.origin,
    destination: prefs.destination,
    locale: prefs.locale,
    setOrigin,
    setDestination,
    setLocale,
    t,
    africanOrigins: AFRICAN_ORIGINS,
    destinations: DESTINATIONS,
  }), [prefs]);

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}
