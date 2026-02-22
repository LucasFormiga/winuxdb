"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import LanguageSelector from "@/components/molecules/LanguageSelector";
import AppCard from "@/components/molecules/AppCard";
import SearchInput from "@/components/molecules/SearchInput";
import FilterSort, { SortOption } from "@/components/molecules/FilterSort";
import { APPS } from "@/lib/data/apps";
import type { Rating } from "@/lib/types";
import Image from "next/image";

const RATING_ORDER: Record<Rating, number> = {
  NATIVE: 5,
  PLATINUM: 4,
  GOLD: 3,
  SILVER: 2,
  BRONZE: 1,
  BORKED: 0,
};

export default function Home() {
  const t = useTranslations("Index");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Rating | "ALL">("ALL");
  const [sort, setSort] = useState<SortOption>("popularity");

  const filteredApps = useMemo(() => {
    return APPS.filter((app) => {
      const matchesSearch = app.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter = filter === "ALL" || app.rating === filter;
      return matchesSearch && matchesFilter;
    }).sort((a, b) => {
      if (sort === "popularity") {
        return b.popularity - a.popularity;
      }
      if (sort === "releaseDate") {
        return (
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
      }
      if (sort === "rating") {
        return RATING_ORDER[b.rating] - RATING_ORDER[a.rating];
      }
      return 0;
    });
  }, [search, filter, sort]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <header className="flex w-full max-w-7xl justify-between items-center py-6 px-6 lg:px-8">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <LanguageSelector />
      </header>

      <main className="flex w-full max-w-7xl flex-col gap-12 py-12 px-6 lg:px-8">
        <section className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-6xl">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            WinuxDB is your ultimate database for Windows application compatibility on Linux. Find ratings, licenses, and more.
          </p>
        </section>

        <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SearchInput onChange={setSearch} />
          <FilterSort
            activeFilter={filter}
            activeSort={sort}
            onFilterChange={setFilter}
            onSortChange={setSort}
          />
        </section>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
          {filteredApps.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No apps found matching your criteria.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
