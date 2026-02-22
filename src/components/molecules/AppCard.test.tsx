import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, it, expect } from "vitest";
import AppCard from "./AppCard";
import messages from "../../../messages/en.json";
import { App } from "@/lib/types";

const mockApp: App = {
  id: "1",
  name: "Test App",
  rating: "GOLD",
  category: "Gaming",
  license: "Proprietary",
  releaseDate: "2023-01-01",
  popularity: 100,
};

describe("AppCard", () => {
  it("renders app name and rating", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AppCard app={mockApp} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("Test App")).toBeDefined();
    expect(screen.getByText(/gold/i)).toBeDefined();
  });
});
