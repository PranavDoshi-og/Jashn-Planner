import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BudgetTab } from "../components/tabs/BudgetTab";

const mockBudget = [
  { category: "Venue & Lawns", percent: 40.0, amount: 400000, note: "Heritage lawn" },
  { category: "Catering", percent: 40.0, amount: 400000, note: "Satvik buffet" },
  { category: "Contingency Buffer", percent: 20.0, amount: 200000, note: "Unforeseen expenses" },
];

describe("BudgetTab", () => {
  it("renders budget allocation bar, slider, and category cards", () => {
    const setTotal = vi.fn();
    render(
      <BudgetTab
        budget={mockBudget}
        total={1000000}
        setTotal={setTotal}
        initialBudget={1000000}
        currency="INR"
      />
    );

    expect(screen.getByText(/Portfolio Allocation/i)).toBeInTheDocument();
    expect(screen.getAllByText("Venue & Lawns").length).toBeGreaterThan(0);
    expect(screen.getByText("Contingency Shield Active:")).toBeInTheDocument();
  });

  it("triggers setTotal when budget slider is moved", () => {
    const setTotal = vi.fn();
    render(
      <BudgetTab
        budget={mockBudget}
        total={1000000}
        setTotal={setTotal}
        initialBudget={1000000}
        currency="INR"
      />
    );

    const slider = screen.getByLabelText(/Interactive Budget Rescaler/i);
    fireEvent.change(slider, { target: { value: "1200000" } });
    expect(setTotal).toHaveBeenCalledWith(1200000);
  });

  it("shows reset button when total differs from initialBudget", () => {
    const setTotal = vi.fn();
    render(
      <BudgetTab
        budget={mockBudget}
        total={1500000}
        setTotal={setTotal}
        initialBudget={1000000}
        currency="INR"
      />
    );

    const resetBtn = screen.getByRole("button", { name: /Reset/i });
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);
    expect(setTotal).toHaveBeenCalledWith(1000000);
  });
});
