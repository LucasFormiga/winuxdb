import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RatingMedal from "@/components/atoms/RatingMedal";

// Mocks are in setup.ts

describe("RatingMedal", () => {
  const ratings: any[] = ["BORKED", "BRONZE", "SILVER", "GOLD", "PLATINUM", "NATIVE"];

  ratings.forEach((rating) => {
    it(`renders correctly for ${rating} rating`, () => {
      render(<RatingMedal rating={rating} />);
      expect(screen.getByText(`Ratings.${rating}`)).toBeDefined();
    });
  });
});
