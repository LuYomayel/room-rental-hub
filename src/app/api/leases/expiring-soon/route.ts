import { NextResponse } from "next/server";
import { getExpiringSoonLeases } from "@/lib/data";

export async function GET() {
  try {
    const expiringSoonLeases = getExpiringSoonLeases(30); // next 30 days
    return NextResponse.json(expiringSoonLeases);
  } catch (error) {
    console.error("Error fetching expiring leases:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
