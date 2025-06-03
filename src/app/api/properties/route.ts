import { NextRequest, NextResponse } from "next/server";
import { getProperties, createProperty } from "@/lib/data";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const properties = getProperties();
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const propertyData = await request.json();

    // Validate required data
    if (!propertyData.name || !propertyData.address) {
      return NextResponse.json(
        { error: "Name and address are required" },
        { status: 400 }
      );
    }

    const newProperty = createProperty({
      name: propertyData.name,
      address: propertyData.address,
      description: propertyData.description || "",
      latitude: propertyData.latitude,
      longitude: propertyData.longitude,
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
