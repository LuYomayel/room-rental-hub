import { NextRequest, NextResponse } from "next/server";
import { changeTenant } from "@/lib/data";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { newTenantName, newTenantEmail, newTenantPhone, effectiveDate } =
      body;

    if (!newTenantName || !newTenantEmail) {
      return NextResponse.json(
        { error: "New tenant name and email are required" },
        { status: 400 }
      );
    }

    const success = changeTenant(
      id,
      newTenantName,
      newTenantEmail,
      newTenantPhone,
      effectiveDate ? new Date(effectiveDate) : new Date()
    );

    if (!success) {
      return NextResponse.json({ error: "Lease not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Tenant changed successfully",
      newTenantName,
      newTenantEmail,
      effectiveDate: effectiveDate || new Date(),
    });
  } catch (error) {
    console.error("Error changing tenant:", error);
    return NextResponse.json(
      { error: "Failed to change tenant" },
      { status: 500 }
    );
  }
}
