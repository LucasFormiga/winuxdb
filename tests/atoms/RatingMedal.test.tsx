import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, it, expect } from "vitest";
import RatingMedal from "@/components/atoms/RatingMedal";
import messages from "../../messages/en.json";

describe("RatingMedal", () => {
  const ratings: any[] = ["BORKED", "BRONZE", "SILVER", "GOLD", "PLATINUM", "NATIVE"];

  ratings.forEach((rating) => {
    it(`renders correctly for ${rating} rating`, () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <RatingMedal rating={rating} />
        </NextIntlClientProvider>
      );
      // We check for the translation from en.json
      const expectedText = messages.Ratings[rating as keyof typeof messages.Ratings];
      expect(screen.getByText(expectedText)).toBeDefined();
    });
  });
});
