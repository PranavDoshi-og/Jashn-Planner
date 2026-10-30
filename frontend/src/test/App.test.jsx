import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import { PRESETS } from "../types/presets";

const mockPlan = {
  summary: "A magnificent Maharashtrian celebration in Pune.",
  budget: [
    { category: "Venue & Lawns", percent: 35.0, amount: 630000, note: "Heritage lawn in Baner" },
    { category: "Traditional Catering", percent: 30.0, amount: 540000, note: "Puran Poli feast" },
    { category: "Contingency Buffer", percent: 10.0, amount: 180000, note: "Emergency buffer" },
    { category: "Decor & Mandap", percent: 25.0, amount: 450000, note: "Marigold floral decor" },
  ],
  timeline: [
    { when: "12 weeks out", title: "Lock Venue and Mandap", tasks: ["Finalize lawn deposit"] },
    { when: "Day-of 08:00 AM", title: "Day-of Event Run Sheet", tasks: ["08:00 AM - Tutari arrival", "10:30 AM - Muhurat Pheras"] },
  ],
  vendors: [
    { category: "Venue & Lawns", tasks: ["Verify generator capacity", "Sign contract"], questions: ["What is the overtime rate?"] },
    { category: "Traditional Catering", tasks: ["Tasting session"], questions: ["What is the per-plate count buffer?"] },
  ],
  ideas: {
    themes: [
      { title: "Marigold & Brass Elegance", description: "Authentic temple aesthetic" },
      { title: "Royal Peshwa Heritage", description: "Traditional royal motif" },
      { title: "Eco Mogra Fusion", description: "Zero plastic fragrant decor" },
    ],
    menu: ["Kothimbir Vadi", "Puran Poli with Ghee", "Amrakhand"],
    activities: ["Traditional Dhol Tasha entry", "Folk Haldi rituals"],
  },
};

describe("Jashn Frontend App", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders the initial intake form with default celebration preset", () => {
    render(<App />);
    expect(screen.getByText("Jashn")).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City or Venue Area/i)).toHaveValue("Pune, Maharashtra");
    expect(screen.getByText(/Your Celebration Blueprint Awaits/i)).toBeInTheDocument();
  });

  it("loads a preset scenario when selected from dropdown", () => {
    render(<App />);
    const select = screen.getByLabelText(/Quick Demo Presets:/i);
    fireEvent.change(select, { target: { value: "kids-birthday" } });

    expect(screen.getByLabelText(/Event Type/i)).toHaveValue("Birthday");
    expect(screen.getByLabelText(/City or Venue Area/i)).toHaveValue("Indiranagar, Bengaluru");
  });

  it("generates and displays full celebration plan on submit", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPlan,
    });

    render(<App />);
    const planBtn = screen.getByRole("button", { name: /Plan My Celebration/i });
    fireEvent.click(planBtn);

    await waitFor(() => {
      expect(screen.getAllByText("A magnificent Maharashtrian celebration in Pune.").length).toBeGreaterThan(0);
    });

    expect(screen.getByRole("tab", { name: /Budget/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Timeline/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Vendors/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Ideas/i })).toBeInTheDocument();
  });

  it("switches tabs and displays respective content", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPlan,
    });

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Plan My Celebration/i }));

    await waitFor(() => {
      expect(screen.getAllByText("A magnificent Maharashtrian celebration in Pune.").length).toBeGreaterThan(0);
    });

    // Check timeline tab
    const timelineTab = screen.getByRole("tab", { name: /Timeline/i });
    fireEvent.click(timelineTab);
    expect(screen.getAllByText("Lock Venue and Mandap").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Day-of Event Run Sheet").length).toBeGreaterThan(0);

    // Check ideas tab
    const ideasTab = screen.getByRole("tab", { name: /Ideas/i });
    fireEvent.click(ideasTab);
    expect(screen.getAllByText("Marigold & Brass Elegance").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Puran Poli with Ghee").length).toBeGreaterThan(0);
  });

  it("updates vendor tasks when checklist item is clicked and persists in state", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPlan,
    });

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Plan My Celebration/i }));

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /Vendors/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("tab", { name: /Vendors/i }));

    const taskCheckbox = screen.getByLabelText("Verify generator capacity");
    expect(taskCheckbox).not.toBeChecked();

    fireEvent.click(taskCheckbox);
    expect(taskCheckbox).toBeChecked();
  });

  it("displays rate limit warning if backend returns 429", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ detail: "Too many requests. Wait a minute and try again." }),
    });

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Plan My Celebration/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/Too many requests/i);
    });
  });
});
