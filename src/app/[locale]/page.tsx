import { useTranslations } from "next-intl";
import LanguageSelector from "@/components/molecules/LanguageSelector";
import AppCard from "@/components/molecules/AppCard";
import { APPS } from "@/lib/data/apps";
import Image from "next/image";

export default function Home() {
  const t = useTranslations("Index");

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

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {APPS.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </section>
      </main>
    </div>
  );
}
