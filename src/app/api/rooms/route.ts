import { NextRequest, NextResponse } from "next/server";
import { getRooms, createRoom } from "@/lib/data";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isAvailable = searchParams.get("available");
    const search = searchParams.get("search");

    const filters: { isAvailable?: boolean; search?: string } = {};

    if (isAvailable !== null) {
      filters.isAvailable = isAvailable === "true";
    }

    if (search) {
      filters.search = search;
    }

    const rooms = getRooms(filters);
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error obtaining rooms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roomData = await request.json();

    // Validate required data
    if (
      !roomData.name ||
      !roomData.propertyId ||
      roomData.price === undefined
    ) {
      return NextResponse.json(
        { error: "Name, property and price are required" },
        { status: 400 }
      );
    }

    const newRoom = createRoom({
      ...roomData,
      images: roomData.images || [],
      amenities: roomData.amenities || [],
      requirements: roomData.requirements || [],
      isAvailable: roomData.isAvailable ?? true,
      maxOccupants: roomData.maxOccupants || 1,
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
