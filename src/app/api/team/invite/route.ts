import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { sendTeamInvitation } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role, name, businessId } = body;

    if (!email || !businessId) {
      return NextResponse.json(
        { error: "Email and business ID are required" },
        { status: 400 },
      );
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await addDoc(collection(db, "teamInvitations"), {
      businessId,
      email,
      role: role || "member",
      name: name || "",
      token,
      expiresAt,
      createdAt: new Date(),
    });

    try {
      await sendTeamInvitation(email, token, businessId);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Team invite error:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 },
    );
  }
}
