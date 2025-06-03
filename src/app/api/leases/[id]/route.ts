import { NextRequest, NextResponse } from "next/server";
import {
  getLeaseById,
  updateLease,
  terminateLease,
  getLeaseActions,
} from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lease = getLeaseById(id);

    if (!lease) {
      return NextResponse.json({ error: "Lease not found" }, { status: 404 });
    }

    // Include lease actions in the response
    const actions = getLeaseActions(id);

    return NextResponse.json({
      ...lease,
      actions,
    });
  } catch (error) {
    console.error("Error fetching lease:", error);
    return NextResponse.json(
      { error: "Failed to fetch lease" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedLease = updateLease(id, body);

    if (!updatedLease) {
      return NextResponse.json({ error: "Lease not found" }, { status: 404 });
    }

    return NextResponse.json(updatedLease);
  } catch (error) {
    console.error("Error updating lease:", error);
    return NextResponse.json(
      { error: "Failed to update lease" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason = "Terminated by admin" } = body;

    const success = terminateLease(id, reason);

    if (!success) {
      return NextResponse.json({ error: "Lease not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lease terminated successfully" });
  } catch (error) {
    console.error("Error terminating lease:", error);
    return NextResponse.json(
      { error: "Failed to terminate lease" },
      { status: 500 }
    );
  }
}
