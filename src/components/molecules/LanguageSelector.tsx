"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

export default function LanguageSelector() {
  const t = useTranslations("LanguageSelector");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="language-select"
        className="text-xs font-medium text-muted-foreground"
      >
        {t("label")}
      </label>
      <Select value={locale} onValueChange={onSelectChange}>
        <SelectTrigger
          id="language-select"
          aria-label={t("label")}
          className="w-[140px]"
        >
          <Globe className="size-4 mr-2" />
          <SelectValue placeholder={t("label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t("en")}</SelectItem>
          <SelectItem value="pt">{t("pt")}</SelectItem>
          <SelectItem value="es">{t("es")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
