import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IdeasTab } from "../components/tabs/IdeasTab";

const mockIdeas = {
  themes: [
    { title: "Marigold & Brass Elegance", description: "Authentic temple floral aesthetic" },
    { title: "Royal Peshwa Heritage", description: "Traditional royal motif" },
    { title: "Eco Mogra Fusion", description: "Zero plastic fragrant decor" },
  ],
  menu: ["Puran Poli with Pure Ghee", "Kothimbir Vadi", "Mango Amrakhand"],
  activities: ["Traditional Dhol Tasha entrance", "Folk Haldi rituals and Antakshari"],
};

describe("IdeasTab", () => {
  it("renders 3 aesthetic theme cards with titles and descriptions", () => {
    render(<IdeasTab ideas={mockIdeas} />);

    expect(screen.getByText("Marigold & Brass Elegance")).toBeInTheDocument();
    expect(screen.getByText("Authentic temple floral aesthetic")).toBeInTheDocument();
    expect(screen.getByText("Royal Peshwa Heritage")).toBeInTheDocument();
    expect(screen.getByText("Eco Mogra Fusion")).toBeInTheDocument();
  });

  it("renders culinary menu items", () => {
    render(<IdeasTab ideas={mockIdeas} />);

    expect(screen.getByText("Puran Poli with Pure Ghee")).toBeInTheDocument();
    expect(screen.getByText("Kothimbir Vadi")).toBeInTheDocument();
    expect(screen.getByText("Mango Amrakhand")).toBeInTheDocument();
  });

  it("renders guest engagement activities", () => {
    render(<IdeasTab ideas={mockIdeas} />);

    expect(screen.getByText("Traditional Dhol Tasha entrance")).toBeInTheDocument();
    expect(screen.getByText("Folk Haldi rituals and Antakshari")).toBeInTheDocument();
  });
});

