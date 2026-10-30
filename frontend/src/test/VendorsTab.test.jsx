import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VendorsTab } from "../components/tabs/VendorsTab";

const mockVendors = [
  {
    category: "Photography & Cinema",
    tasks: ["Review portfolio albums", "Sign drone clearance"],
    questions: ["What is your overtime hourly rate?", "Do you provide raw unedited footage?"],
  },
];

describe("VendorsTab", () => {
  it("renders checklist items and vendor due diligence questions", () => {
    const setDone = vi.fn();
    render(
      <VendorsTab
        vendors={mockVendors}
        done={{}}
        setDone={setDone}
        tasksDone={0}
        tasksTotal={2}
      />
    );

    expect(screen.getByText("Photography & Cinema")).toBeInTheDocument();
    expect(screen.getByText("Review portfolio albums")).toBeInTheDocument();
    expect(screen.getByText(/"What is your overtime hourly rate\?"/)).toBeInTheDocument();
  });

  it("filters tasks based on pending/completed filter buttons", () => {
    const setDone = vi.fn();
    render(
      <VendorsTab
        vendors={mockVendors}
        done={{ "0-0": true }}
        setDone={setDone}
        tasksDone={1}
        tasksTotal={2}
      />
    );

    // Switch to Completed filter
    fireEvent.click(screen.getByRole("button", { name: /^completed$/i }));
    expect(screen.getByText("Review portfolio albums")).toBeInTheDocument();
    expect(screen.queryByText("Sign drone clearance")).not.toBeInTheDocument();

    // Switch to Pending filter
    fireEvent.click(screen.getByRole("button", { name: /^pending$/i }));
    expect(screen.queryByText("Review portfolio albums")).not.toBeInTheDocument();
    expect(screen.getByText("Sign drone clearance")).toBeInTheDocument();
  });

  it("copies vendor question to clipboard on click", async () => {
    const writeTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    render(
      <VendorsTab
        vendors={mockVendors}
        done={{}}
        setDone={vi.fn()}
        tasksDone={0}
        tasksTotal={2}
      />
    );

    const copyBtn = screen.getByLabelText(/Copy question: What is your overtime hourly rate\?/i);
    fireEvent.click(copyBtn);
    expect(writeTextMock).toHaveBeenCalledWith("What is your overtime hourly rate?");
  });
});

