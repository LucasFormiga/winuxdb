import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SearchInput from "@/components/molecules/SearchInput";

// Mocks are in setup.ts

describe("SearchInput", () => {
  it("renders with placeholder", () => {
    render(<SearchInput onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search.placeholder')).toBeDefined();
  });

  it("calls onChange with debounced value", async () => {
    const onChange = vi.fn();
    render(<SearchInput onChange={onChange} />);

    const input = screen.getByPlaceholderText('Search.placeholder');
    fireEvent.change(input, { target: { value: "test" } });

    // Should not be called immediately
    expect(onChange).not.toHaveBeenCalled();

    // Should be called after debounce
    await waitFor(() => expect(onChange).toHaveBeenCalledWith("test"), { timeout: 1000 });
  });
});
