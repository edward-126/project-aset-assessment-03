import { beforeEach, describe, expect, it, vi } from "vitest";
import { ScreenRepository } from "@/lib/repositories/screen-repository";
import type { ScreenDocument } from "@/models/Screen";

const mocks = vi.hoisted(() => ({
  connectToDatabase: vi.fn(),
  find: vi.fn(),
  findOne: vi.fn(),
  updateOne: vi.fn(),
}));

vi.mock("@/lib/db/mongodb", () => ({
  connectToDatabase: mocks.connectToDatabase,
}));

vi.mock("@/models/Screen", () => ({
  ScreenModel: {
    find: mocks.find,
    findOne: mocks.findOne,
    updateOne: mocks.updateOne,
  },
}));

function makeScreenDocument(overrides: Partial<ScreenDocument> = {}) {
  return {
    id: "screen-1",
    name: "Screen 1",
    totalRows: 1,
    totalColumns: 2,
    preferredViewingZone: {
      rowStart: 1,
      rowEnd: 1,
      centerBias: 1,
    },
    seats: [
      {
        id: "screen-1-A1",
        screenId: "screen-1",
        rowLabel: "A",
        seatNumber: 1,
        type: "STANDARD",
        status: "AVAILABLE",
        positionX: 1,
        positionY: 1,
        heldByBookingId: null,
      },
    ],
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T01:00:00.000Z"),
    ...overrides,
  } satisfies ScreenDocument;
}

function makeLeanQuery<T>(value: T) {
  return {
    lean: vi.fn(() => ({
      exec: vi.fn().mockResolvedValue(value),
    })),
  };
}

function makeSortedLeanQuery<T>(value: T) {
  return {
    sort: vi.fn(() => makeLeanQuery(value)),
  };
}

describe("ScreenRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.connectToDatabase.mockResolvedValue(undefined);
  });

  it("findAll returns screens sorted by name with ISO timestamp fields", async () => {
    const repository = new ScreenRepository();
    const screen = makeScreenDocument();
    const query = makeSortedLeanQuery([screen]);
    mocks.find.mockReturnValue(query);

    const result = await repository.findAll();

    expect(mocks.connectToDatabase).toHaveBeenCalledOnce();
    expect(mocks.find).toHaveBeenCalledWith({});
    expect(query.sort).toHaveBeenCalledWith({ name: 1 });
    expect(result).toEqual([
      expect.objectContaining({
        id: "screen-1",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T01:00:00.000Z",
      }),
    ]);
  });

  it("findById returns null when a screen is not found", async () => {
    const repository = new ScreenRepository();
    mocks.findOne.mockReturnValue(makeLeanQuery(null));

    await expect(repository.findById("missing-screen")).resolves.toBeNull();

    expect(mocks.findOne).toHaveBeenCalledWith({ id: "missing-screen" });
  });

  it("updates matching embedded seat states with array filters", async () => {
    const repository = new ScreenRepository();
    const exec = vi.fn().mockResolvedValue({ matchedCount: 1, modifiedCount: 2 });
    mocks.updateOne.mockReturnValue({ exec });

    await repository.updateSeatStates(
      "screen-1",
      ["screen-1-A1", "screen-1-A2"],
      {
        status: "HELD",
        heldByBookingId: "booking-1",
      }
    );

    expect(mocks.updateOne).toHaveBeenCalledWith(
      { id: "screen-1" },
      {
        $set: {
          "seats.$[seat].status": "HELD",
          "seats.$[seat].heldByBookingId": "booking-1",
        },
      },
      {
        arrayFilters: [{ "seat.id": { $in: ["screen-1-A1", "screen-1-A2"] } }],
        runValidators: true,
      }
    );
    expect(exec).toHaveBeenCalledOnce();
  });

  it("skips seat updates when there are no seat ids", async () => {
    const repository = new ScreenRepository();

    await repository.updateSeatStates("screen-1", [], { status: "BOOKED" });

    expect(mocks.updateOne).not.toHaveBeenCalled();
  });
});
