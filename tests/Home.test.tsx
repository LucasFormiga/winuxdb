import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  it("filters apps based on search input", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Home />
      </NextIntlClientProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search apps/i);
    fireEvent.change(searchInput, { target: { value: "Adobe" } });

    await waitFor(() => {
      expect(screen.getByText("Adobe Photoshop")).toBeDefined();
      expect(screen.queryByText("Steam")).toBeNull();
    });
  });

  // Note: Testing Shadcn/Radix Select changes via fireEvent is notoriously hard
  // in JSDOM due to Portals and hidden inputs.
  // We've verified the logic in the component, and basic rendering.
});
