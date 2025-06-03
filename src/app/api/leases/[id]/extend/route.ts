import { NextRequest, NextResponse } from "next/server";
import { extendLease } from "@/lib/data";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { newEndDate, newRent } = body;

    if (!newEndDate) {
      return NextResponse.json(
        { error: "New end date is required" },
        { status: 400 }
      );
    }

    const success = extendLease(id, new Date(newEndDate), newRent);

    if (!success) {
      return NextResponse.json({ error: "Lease not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Lease extended successfully",
      newEndDate,
      newRent,
    });
  } catch (error) {
    console.error("Error extending lease:", error);
    return NextResponse.json(
      { error: "Failed to extend lease" },
      { status: 500 }
    );
  }
}
