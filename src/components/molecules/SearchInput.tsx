"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
  onChange: (value: string) => void;
  debounceMs?: number;
}

export default function SearchInput({
  onChange,
  debounceMs = 300,
}: SearchInputProps) {
  const t = useTranslations("Search");
  const [value, setValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(value);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [value, onChange, debounceMs]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={t("placeholder")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9"
        aria-label={t("label")}
      />
    </div>
  );
}
