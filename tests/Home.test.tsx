import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, it, expect, vi } from "vitest";
import Home from "@/app/[locale]/page";
import messages from "../messages/en.json";

// Mock @/i18n/routing
vi.mock("@/i18n/routing", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace: vi.fn() }),
}));

describe("Home", () => {
  it("renders with internationalized title", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Home />
      </NextIntlClientProvider>
    );
    expect(screen.getByText(/to get started, edit the page.tsx file./i)).toBeDefined();
  });
});
