import { NextRequest, NextResponse } from "next/server";
import { sendPaidSessionNotificationToCEO } from "@/lib/email";

const CEO_SHARE_RATE = 0.3;
const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, expertUserId, expertName, payerName, secret } = body;
    const authHeader = request.headers.get("authorization");
    const providedSecret = secret ?? (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);
    if (WEBHOOK_SECRET && providedSecret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const amountNum = typeof amount === "number" ? amount : parseFloat(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (!expertUserId || !expertName) {
      return NextResponse.json({ error: "Missing expertUserId or expertName" }, { status: 400 });
    }
    const ceoShare = Math.round(amountNum * CEO_SHARE_RATE * 100) / 100;
    const currencyLabel = "USD ";
    await sendPaidSessionNotificationToCEO({
      amount: amountNum,
      currencyLabel,
      ceoShare,
      expertName: String(expertName),
      expertUserId: String(expertUserId),
      payerName: payerName ? String(payerName) : undefined,
    });
    return NextResponse.json({
      success: true,
      ceoShare,
      message: "CEO notified (30% allocated to kirtan.balipersad@gmail.com).",
    });
  } catch {
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
