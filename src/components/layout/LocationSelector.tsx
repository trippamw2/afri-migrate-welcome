import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePreferences } from "@/context/PreferencesContext";
import { useMemo } from "react";

export default function LocationSelector() {
  const { origin, destination, setOrigin, setDestination, locale, setLocale, t, africanOrigins, destinations } = usePreferences();

  // Simple sort by name
  const origins = useMemo(() => [...africanOrigins].sort((a,b)=>a.name.localeCompare(b.name)), [africanOrigins]);
  const dests = useMemo(() => [...destinations].sort((a,b)=>a.name.localeCompare(b.name)), [destinations]);

  return (
    <div className="hidden md:flex items-center gap-3">
      <div className="min-w-[160px]">
        <Select value={origin} onValueChange={(v) => setOrigin(v)}>
          <SelectTrigger aria-label={t("origin")} className="bg-background">
            <SelectValue placeholder={t("origin")} />
          </SelectTrigger>
          <SelectContent className="z-[60] bg-popover">
            {origins.map((c)=> (
              <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <Select value={destination} onValueChange={(v) => setDestination(v)}>
          <SelectTrigger aria-label={t("destination")} className="bg-background">
            <SelectValue placeholder={t("destination")} />
          </SelectTrigger>
          <SelectContent className="z-[60] bg-popover">
            {dests.map((c)=> (
              <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[120px]">
        <Select value={locale} onValueChange={(v) => setLocale(v as any)}>
          <SelectTrigger aria-label={t("language")} className="bg-background">
            <SelectValue placeholder={t("language")} />
          </SelectTrigger>
          <SelectContent className="z-[60] bg-popover">
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
