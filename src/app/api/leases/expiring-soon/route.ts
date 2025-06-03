import { NextRequest, NextResponse } from "next/server";
import { getExpiringSoonLeases, updateLeaseStatuses } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    // Update lease statuses before returning data
    updateLeaseStatuses();

    const leases = getExpiringSoonLeases(days);
    return NextResponse.json(leases);
  } catch (error) {
    console.error("Error fetching expiring leases:", error);
    return NextResponse.json(
      { error: "Failed to fetch expiring leases" },
      { status: 500 }
    );
  }
}
