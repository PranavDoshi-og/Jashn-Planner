export const isoInDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const PRESETS = [
  {
    id: "pune-wedding",
    title: "Royal Maharashtrian Wedding",
    subtitle: "250 guests • Pune • ₹18 Lakhs",
    badge: "Wedding",
    form: {
      event_type: "Wedding",
      event_date: isoInDays(90),
      guests: 250,
      budget: 1800000,
      currency: "INR",
      location: "Pune, Maharashtra",
      vibe: "Regal, intimate, rich marigold & mogra aesthetic, joyous & lively",
      culture: "Maharashtrian Hindu traditions (Haldi, Muhurat Pheras), authentic Satvik vegetarian feast",
      must_haves: "Traditional Tutari & Shehnai artists, eco-friendly floral mandap, live Puran Poli & Ukadiche Modak counter, brass thali service",
    },
  },
  {
    id: "kids-birthday",
    title: "Little Explorer 5th Birthday",
    subtitle: "45 guests • Bengaluru • ₹75,000",
    badge: "Birthday",
    form: {
      event_type: "Birthday",
      event_date: isoInDays(28),
      guests: 45,
      budget: 75000,
      currency: "INR",
      location: "Indiranagar, Bengaluru",
      vibe: "Playful, colorful, immersive jungle adventure theme, energetic",
      culture: "Modern urban birthday with multi-generational family and school friends",
      must_haves: "Interactive treasure hunt, DIY cupcake decorating station, animal mascot, toddler-safe play zone",
    },
  },
  {
    id: "diwali-mela",
    title: "Diwali Society Utsav & Mela",
    subtitle: "500 guests • Mumbai • ₹6 Lakhs",
    badge: "Community",
    form: {
      event_type: "Community festival",
      event_date: isoInDays(45),
      guests: 500,
      budget: 600000,
      currency: "INR",
      location: "Kandivali, Mumbai",
      vibe: "Festive warmth, earthen diyas, community bonding, dazzling lights",
      culture: "Pan-Indian Diwali celebration with diverse society residents",
      must_haves: "Grand rangoli contest, live Dhol-Tasha beats, authentic street chaat stalls, eco-friendly laser show (no loud crackers)",
    },
  },
  {
    id: "silver-anniversary",
    title: "Silver 25th Anniversary Gala",
    subtitle: "120 guests • New Delhi • ₹9.5 Lakhs",
    badge: "Anniversary",
    form: {
      event_type: "Anniversary",
      event_date: isoInDays(60),
      guests: 120,
      budget: 950000,
      currency: "INR",
      location: "Aerocity, New Delhi",
      vibe: "Sophisticated, silver & blush rose elegance, nostalgic & warm",
      culture: "North Indian celebration, family and corporate colleagues",
      must_haves: "Memory lane photo installation, live retro Bollywood & Ghazal quartet, tiered champagne toast cake, seated buffet",
    },
  },
];

