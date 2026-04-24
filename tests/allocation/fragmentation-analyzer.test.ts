import { describe, expect, it } from "vitest";
import { FragmentationAnalyzer } from "@/lib/allocation";
import { makeTestScreen } from "./test-helpers";

describe("FragmentationAnalyzer", () => {
  it("FR12: detects isolated single-seat gaps after simulated allocation", () => {
    const screen = makeTestScreen({
      totalRows: 1,
      totalColumns: 6,
      preferredRowStart: 1,
      preferredRowEnd: 1,
      plan: {
        available: ["A1", "A2", "A3", "A4", "A5", "A6"],
      },
    });
    const candidate = screen.seats.filter((seat) =>
      ["A2", "A3", "A4", "A5"].includes(`${seat.rowLabel}${seat.seatNumber}`)
    );
    const analyzer = new FragmentationAnalyzer();

    expect(analyzer.detectSingleSeatGaps(screen.seats, candidate)).toBe(2);
    expect(analyzer.calculateFragmentationPenalty(candidate, screen)).toBe(8);
  });
});
