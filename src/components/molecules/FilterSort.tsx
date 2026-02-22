"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Rating } from "@/lib/types";

export type SortOption = "popularity" | "releaseDate" | "rating";

interface FilterSortProps {
  onFilterChange: (filter: Rating | "ALL") => void;
  onSortChange: (sort: SortOption) => void;
  activeFilter: Rating | "ALL";
  activeSort: SortOption;
}

export default function FilterSort({
  onFilterChange,
  onSortChange,
  activeFilter,
  activeSort,
}: FilterSortProps) {
  const t = useTranslations();

  const ratings: (Rating | "ALL")[] = [
    "ALL",
    "BORKED",
    "BRONZE",
    "SILVER",
    "GOLD",
    "PLATINUM",
    "NATIVE",
  ];

  const sortOptions: SortOption[] = ["popularity", "releaseDate", "rating"];

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          {t("Ratings.filterLabel")}
        </label>
        <Select value={activeFilter} onValueChange={onFilterChange as any}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ratings.map((rating) => (
              <SelectItem key={rating} value={rating}>
                {t(`Ratings.${rating}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          {t("Sort.label")}
        </label>
        <Select value={activeSort} onValueChange={onSortChange as any}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`Sort.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
