import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { SeatingDemoClient } from "@/components/seating-demo/seating-demo-client";

beforeAll(() => {
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => undefined;
  Element.prototype.releasePointerCapture ??= () => undefined;
  Element.prototype.scrollIntoView ??= () => undefined;
});

describe("SeatingDemoClient", () => {
  it("allocates a group in the half-full default scenario", () => {
    render(<SeatingDemoClient />);

    fireEvent.click(screen.getByRole("button", { name: /allocate/i }));

    expect(screen.getByText("ALLOCATED")).toBeTruthy();
    expect(screen.getByText(/Allocated the lowest-scoring contiguous block/i)).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /score breakdown/i })
    ).toBeTruthy();
  });

  it("shows solo-risk handling without selecting the trapped solo seat", () => {
    render(<SeatingDemoClient />);

    selectOption("Scenario", "Solo risk");
    selectOption("Group size", "1");
    fireEvent.click(screen.getByRole("button", { name: /allocate/i }));

    const selectedSeats = selectedSeatPanel();

    expect(within(selectedSeats).queryByText("K12")).toBeNull();
    expect(screen.getByText("ALLOCATED")).toBeTruthy();
  });

  it("uses admin override status when requested", () => {
    render(<SeatingDemoClient />);

    selectOption("Scenario", "Admin override demo");
    selectOption("Request type", "Admin override");
    fireEvent.click(screen.getByRole("button", { name: /allocate/i }));

    expect(screen.getByText("OVERRIDE_ALLOCATED")).toBeTruthy();
    expect(screen.getByText(/bypassing normal seat-state/i)).toBeTruthy();
  });
});

function selectedSeatPanel() {
  const label = screen.getByText("Selected seats");
  const panel = label.parentElement;

  if (!panel) {
    throw new Error("Expected selected seat panel to exist.");
  }

  return panel;
}

function selectOption(triggerName: string, optionName: string) {
  const trigger = screen.getByRole("combobox", { name: triggerName });

  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  fireEvent.click(screen.getByRole("option", { name: optionName }));
}
