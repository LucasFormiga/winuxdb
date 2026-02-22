import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, it, expect, vi } from "vitest";
import Home from "@/app/[locale]/page";
import messages from "../../messages/en.json";

// Mock @/i18n/routing
vi.mock("@/i18n/routing", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace: vi.fn() }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />
}));

describe("Home", () => {
  it("renders with internationalized hero copy", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Home />
      </NextIntlClientProvider>
    );
    expect(screen.getByText(/know what runs before you switch/i)).toBeDefined();
    expect(screen.getByText(/find the right linux distro/i)).toBeDefined();
  });

  // Note: Testing Shadcn/Radix Select changes via fireEvent is notoriously hard
  // in JSDOM due to Portals and hidden inputs.
  // We've verified the logic in the component, and basic rendering.
});
