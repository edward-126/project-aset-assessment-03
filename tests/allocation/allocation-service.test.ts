import { describe, expect, it } from "vitest";
import { AllocationError, AllocationService } from "@/lib/allocation";
import { seedScreens } from "@/seed/screens";
import { makeTestScreen, seatLabels } from "./test-helpers";

describe("AllocationService", () => {
  it("FR5: returns a centered contiguous block when available", () => {
    const service = new AllocationService();
    const result = service.allocate({ screen: seedScreens[0], groupSize: 4 });

    expect(result.mode).toBe("CONTIGUOUS");
    expect(seatLabels(result.seats)).toEqual(["D4", "D5", "D6", "D7"]);
  });

  it("FR6: excludes held, booked, and unavailable seats from allocation", () => {
    const screen = makeTestScreen({
      totalRows: 2,
      totalColumns: 5,
      preferredRowStart: 1,
      preferredRowEnd: 2,
      plan: {
        available: ["A1", "A5", "B2", "B3", "B4"],
        held: ["A2"],
        booked: ["A3"],
        unavailable: ["A4"],
      },
    });
    const service = new AllocationService();
    const result = service.allocate({ screen, groupSize: 2 });

    expect(result.mode).toBe("CONTIGUOUS");
    expect(seatLabels(result.seats)).toEqual(["B2", "B3"]);
    expect(seatLabels(result.seats)).not.toContain("A2");
    expect(seatLabels(result.seats)).not.toContain("A3");
    expect(seatLabels(result.seats)).not.toContain("A4");
  });

  it("FR7: prioritises lower fragmentation before horizontal centering", () => {
    const screen = makeTestScreen({
      totalRows: 1,
      totalColumns: 6,
      preferredRowStart: 1,
      preferredRowEnd: 1,
      plan: {
        available: ["A1", "A2", "A3", "A4", "A5", "A6"],
      },
    });
    const service = new AllocationService();
    const result = service.allocate({ screen, groupSize: 2 });

    expect(result.mode).toBe("CONTIGUOUS");
    expect(seatLabels(result.seats)).toEqual(["A1", "A2"]);
  });

  it("FR8: falls back to split allocation only when contiguous allocation is unavailable", () => {
    const screen = makeTestScreen({
      totalRows: 1,
      totalColumns: 6,
      preferredRowStart: 1,
      preferredRowEnd: 1,
      plan: {
        available: ["A1", "A3", "A5"],
        booked: ["A2", "A4", "A6"],
      },
    });
    const service = new AllocationService();
    const result = service.allocate({ screen, groupSize: 3 });

    expect(result.mode).toBe("SPLIT");
    expect(seatLabels(result.seats)).toEqual(["A1", "A3", "A5"]);
  });

  it("FR9: produces deterministic allocations for the same screen and request", () => {
    const service = new AllocationService();
    const firstResult = service.allocate({
      screen: seedScreens[1],
      groupSize: 5,
    });
    const secondResult = service.allocate({
      screen: seedScreens[1],
      groupSize: 5,
    });

    expect(seatLabels(firstResult.seats)).toEqual(
      seatLabels(secondResult.seats)
    );
    expect(firstResult.score).toBe(secondResult.score);
  });

  it("FR10: rejects invalid group sizes", () => {
    const service = new AllocationService();

    expect(() =>
      service.allocate({ screen: seedScreens[0], groupSize: 0 })
    ).toThrow(AllocationError);
  });

  it("FR11: rejects requests with insufficient available seats", () => {
    const screen = makeTestScreen({
      totalRows: 1,
      totalColumns: 3,
      plan: {
        available: ["A1"],
        booked: ["A2", "A3"],
      },
    });
    const service = new AllocationService();

    expect(() => service.allocate({ screen, groupSize: 2 })).toThrow(
      AllocationError
    );
  });
});
