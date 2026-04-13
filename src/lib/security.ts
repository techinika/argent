import { User } from "@/types";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export async function verifyUserAccess(
  userId: string,
  requiredRole: "business" | "personal" | "admin",
): Promise<boolean> {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) return false;

  const userData = userDoc.data() as User;
  if (userData.role === "admin") return true;
  return userData.role === requiredRole;
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, "").trim().slice(0, 1000);
}

export function validateAmount(amount: number): boolean {
  return amount >= 0 && amount <= 1000000000 && Number.isFinite(amount);
}

export const rateLimitMap = new Map<
  string,
  { count: number; timestamp: number }
>();

export function checkRateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60000,
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now - record.timestamp > windowMs) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= limit) return false;

  record.count++;
  return true;
}
