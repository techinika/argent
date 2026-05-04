import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const memberQuery = query(collection(db, "teamMembers"), where("userId", "==", userId));
    const memberSnap = await getDocs(memberQuery);

    const memberships = await Promise.all(
      memberSnap.docs.map(async (mDoc) => {
        const data = mDoc.data();
        const businessRef = doc(db, "businessSettings", data.businessId);
        const businessSnap = await getDoc(businessRef);
        const businessName = businessSnap.exists() ? businessSnap.data().name : "Unknown";

        return {
          id: mDoc.id,
          businessId: data.businessId,
          businessName,
          role: data.role,
        };
      }),
    );

    return NextResponse.json({ memberships });
  } catch (error) {
    console.error("Get memberships error:", error);
    return NextResponse.json({ error: "Failed to get memberships" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, businessId, role, name } = body;

    if (!userId || !businessId) {
      return NextResponse.json(
        { error: "User ID and business ID required" },
        { status: 400 },
      );
    }

    await updateDoc(doc(db, "users", userId), {
      role: "business",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Join team error:", error);
    return NextResponse.json({ error: "Failed to join team" }, { status: 500 });
  }
}