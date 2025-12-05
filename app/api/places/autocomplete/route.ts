import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get("input");
  const types = searchParams.get("types") || "(regions)";

  if (!input) {
    return NextResponse.json({ predictions: [] });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  // If no API key, return mock data for development
  if (!apiKey) {
    // Mock Australian suburbs for demo
    const mockPredictions = getMockPredictions(input);
    return NextResponse.json({ predictions: mockPredictions });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&types=${types}&components=country:au&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status === "OK" || data.status === "ZERO_RESULTS") {
      return NextResponse.json({
        predictions: data.predictions || [],
      });
    }

    console.error("Google Places API error:", data.status);
    return NextResponse.json({ predictions: getMockPredictions(input) });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return NextResponse.json({ predictions: getMockPredictions(input) });
  }
}

// Mock predictions for development without API key
function getMockPredictions(input: string) {
  const australianLocations = [
    { name: "Sydney", state: "NSW", postcode: "2000" },
    { name: "Sydney CBD", state: "NSW", postcode: "2000" },
    { name: "North Sydney", state: "NSW", postcode: "2060" },
    { name: "Parramatta", state: "NSW", postcode: "2150" },
    { name: "Bondi", state: "NSW", postcode: "2026" },
    { name: "Bondi Beach", state: "NSW", postcode: "2026" },
    { name: "Manly", state: "NSW", postcode: "2095" },
    { name: "Chatswood", state: "NSW", postcode: "2067" },
    { name: "Melbourne", state: "VIC", postcode: "3000" },
    { name: "Melbourne CBD", state: "VIC", postcode: "3000" },
    { name: "St Kilda", state: "VIC", postcode: "3182" },
    { name: "South Yarra", state: "VIC", postcode: "3141" },
    { name: "Brisbane", state: "QLD", postcode: "4000" },
    { name: "Gold Coast", state: "QLD", postcode: "4217" },
    { name: "Surfers Paradise", state: "QLD", postcode: "4217" },
    { name: "Perth", state: "WA", postcode: "6000" },
    { name: "Fremantle", state: "WA", postcode: "6160" },
    { name: "Adelaide", state: "SA", postcode: "5000" },
    { name: "Hobart", state: "TAS", postcode: "7000" },
    { name: "Darwin", state: "NT", postcode: "0800" },
    { name: "Canberra", state: "ACT", postcode: "2600" },
    { name: "Newcastle", state: "NSW", postcode: "2300" },
    { name: "Wollongong", state: "NSW", postcode: "2500" },
    { name: "Geelong", state: "VIC", postcode: "3220" },
    { name: "Townsville", state: "QLD", postcode: "4810" },
    { name: "Cairns", state: "QLD", postcode: "4870" },
    { name: "Toowoomba", state: "QLD", postcode: "4350" },
    { name: "Ballarat", state: "VIC", postcode: "3350" },
    { name: "Bendigo", state: "VIC", postcode: "3550" },
    { name: "Albury", state: "NSW", postcode: "2640" },
    { name: "Launceston", state: "TAS", postcode: "7250" },
    { name: "Mackay", state: "QLD", postcode: "4740" },
    { name: "Rockhampton", state: "QLD", postcode: "4700" },
    { name: "Bunbury", state: "WA", postcode: "6230" },
  ];

  const searchLower = input.toLowerCase();
  const matches = australianLocations
    .filter(
      (loc) =>
        loc.name.toLowerCase().includes(searchLower) ||
        loc.state.toLowerCase().includes(searchLower)
    )
    .slice(0, 5);

  return matches.map((loc) => ({
    place_id: `mock-${loc.name.toLowerCase().replace(/\s+/g, "-")}-${loc.postcode}`,
    description: `${loc.name}, ${loc.state} ${loc.postcode}, Australia`,
    structured_formatting: {
      main_text: loc.name,
      secondary_text: `${loc.state} ${loc.postcode}, Australia`,
    },
  }));
}

