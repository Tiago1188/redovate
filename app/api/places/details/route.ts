import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const placeId = searchParams.get("place_id");

  if (!placeId) {
    return NextResponse.json({ error: "Missing place_id" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  // If no API key or mock place ID, return mock data
  if (!apiKey || placeId.startsWith("mock-")) {
    // Extract postcode from mock place ID
    const parts = placeId.split("-");
    const postcode = parts[parts.length - 1];
    return NextResponse.json({ postcode });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_components,formatted_address,geometry&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status === "OK" && data.result) {
      // Extract postcode from address components
      const postcodeComponent = data.result.address_components?.find(
        (component: { types: string[] }) =>
          component.types.includes("postal_code")
      );

      return NextResponse.json({
        postcode: postcodeComponent?.long_name || null,
        formatted_address: data.result.formatted_address,
        geometry: data.result.geometry,
      });
    }

    return NextResponse.json({ postcode: null });
  } catch (error) {
    console.error("Error fetching place details:", error);
    return NextResponse.json({ postcode: null });
  }
}

