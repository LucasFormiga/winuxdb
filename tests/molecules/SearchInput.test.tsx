import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, it, expect, vi } from "vitest";
import SearchInput from "@/components/molecules/SearchInput";
import messages from "../../messages/en.json";

describe("SearchInput", () => {
  it("renders with placeholder", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SearchInput onChange={vi.fn()} />
      </NextIntlClientProvider>
    );
    expect(screen.getByPlaceholderText(/search apps/i)).toBeDefined();
  });

  it("calls onChange with debounced value", async () => {
    const onChange = vi.fn();
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SearchInput onChange={onChange} />
      </NextIntlClientProvider>
    );

    const input = screen.getByPlaceholderText(/search apps/i);
    fireEvent.change(input, { target: { value: "test" } });

    // Should not be called immediately
    expect(onChange).not.toHaveBeenCalled();

    // Should be called after debounce
    await waitFor(() => expect(onChange).toHaveBeenCalledWith("test"), { timeout: 1000 });
  });
});
