import { NextRequest, NextResponse } from "next/server";
import {
  getLeases,
  createLease,
  getExpiringSoonLeases,
  updateLeaseStatuses,
} from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const expiringSoon = searchParams.get("expiring_soon");

    // Update lease statuses before returning data
    updateLeaseStatuses();

    if (expiringSoon === "true") {
      const days = parseInt(searchParams.get("days") || "30");
      const leases = getExpiringSoonLeases(days);
      return NextResponse.json(leases);
    }

    let leases = getLeases();

    if (status) {
      leases = leases.filter((lease) => lease.status === status);
    }

    return NextResponse.json(leases);
  } catch (error) {
    console.error("Error fetching leases:", error);
    return NextResponse.json(
      { error: "Failed to fetch leases" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      roomId,
      tenantName,
      tenantEmail,
      tenantPhone,
      tenantEmergencyContact,
      tenantEmergencyPhone,
      startDate,
      endDate,
      monthlyRent,
      deposit,
      depositPaid = false,
      depositAmount,
      status = "active",
      autoRenewal = false,
      renewalNoticeDays = 30,
      paymentStatus = "current",
      leaseTerms = [],
      specialConditions,
    } = body;

    if (
      !roomId ||
      !tenantName ||
      !tenantEmail ||
      !startDate ||
      !endDate ||
      !monthlyRent
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newLease = createLease({
      roomId,
      tenantName,
      tenantEmail,
      tenantPhone,
      tenantEmergencyContact,
      tenantEmergencyPhone,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      monthlyRent,
      deposit,
      depositPaid,
      depositAmount: depositAmount || deposit,
      status,
      autoRenewal,
      renewalNoticeDays,
      paymentStatus,
      leaseTerms,
      specialConditions,
    });

    return NextResponse.json(newLease, { status: 201 });
  } catch (error) {
    console.error("Error creating lease:", error);
    return NextResponse.json(
      { error: "Failed to create lease" },
      { status: 500 }
    );
  }
}
