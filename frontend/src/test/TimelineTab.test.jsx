import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimelineTab } from "../components/tabs/TimelineTab";

const mockTimeline = [
  {
    when: "12 weeks out",
    title: "Lock Venue and Mandap",
    tasks: ["Tour 3 heritage lawns", "Sign contract deposit"],
  },
  {
    when: "Day-of 08:00 AM",
    title: "Day-of Event Run Sheet",
    tasks: ["08:00 AM - Tutari troupe arrival", "10:30 AM - Muhurat Pheras"],
  },
];

describe("TimelineTab", () => {
  it("renders backward planning sequence and milestones", () => {
    const onPrint = vi.fn();
    render(<TimelineTab timeline={mockTimeline} onPrint={onPrint} />);

    expect(screen.getByText("Backward Planning Sequence")).toBeInTheDocument();
    expect(screen.getByText("Lock Venue and Mandap")).toBeInTheDocument();
    expect(screen.getByText("Tour 3 heritage lawns")).toBeInTheDocument();
  });

  it("identifies and visually badges the Day-of Event Run Sheet", () => {
    render(<TimelineTab timeline={mockTimeline} onPrint={vi.fn()} />);

    expect(screen.getByText("★ Day-of Event Run Sheet")).toBeInTheDocument();
    expect(screen.getByText("08:00 AM - Tutari troupe arrival")).toBeInTheDocument();
  });

  it("toggles milestone completion state when clicked", () => {
    render(<TimelineTab timeline={mockTimeline} onPrint={vi.fn()} />);

    const markDoneBtn = screen.getAllByRole("button", { name: /Mark done/i })[0];
    fireEvent.click(markDoneBtn);

    expect(screen.getByText("Completed ✓")).toBeInTheDocument();
  });

  it("triggers onPrint callback when print button is clicked", () => {
    const onPrint = vi.fn();
    render(<TimelineTab timeline={mockTimeline} onPrint={onPrint} />);

    const printBtn = screen.getByRole("button", { name: /Print Timeline/i });
    fireEvent.click(printBtn);

    expect(onPrint).toHaveBeenCalledTimes(1);
  });
});
