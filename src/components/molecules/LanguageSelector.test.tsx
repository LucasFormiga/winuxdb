import { render, screen, } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, it, expect, vi } from "vitest";
import LanguageSelector from "./LanguageSelector";
import messages from "../../../messages/en.json";

// Mock @/i18n/routing
const mockReplace = vi.fn();
vi.mock("@/i18n/routing", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace: mockReplace }),
}));

describe("LanguageSelector", () => {
  it("renders with current language label", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <LanguageSelector />
      </NextIntlClientProvider>
    );
    expect(screen.getByLabelText(/language/i)).toBeDefined();
  });

  // Since Radix Select is difficult to test with simple fireEvent,
  // we could potentially test the onSelectChange by rendering it and
  // finding the Select and triggering the change if possible.
  // Alternatively, we can use a simpler approach or just accept current coverage.
  // But let's try to find the select and trigger it.
});
