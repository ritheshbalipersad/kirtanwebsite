const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "SkillSwap Pro <onboarding@resend.dev>";

export type PaidSessionNotificationParams = {
  amount: number;
  currencyLabel: string;
  ceoShare: number;
  expertName: string;
  expertUserId: string;
  payerName?: string;
};

/** CEO – receives 30% of paid session amounts and notification emails when someone is paid. */
const CEO_EMAIL = "kirtan.balipersad@gmail.com";

export async function sendPaidSessionNotificationToCEO(params: PaidSessionNotificationParams): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set; skipping paid session email to CEO");
    return false;
  }
  const { amount, currencyLabel, ceoShare, expertName, expertUserId, payerName } = params;
  const subject = "Paid session completed – 30% CEO share";
  const html = `
    <p>A paid session was completed on SkillSwap Pro.</p>
    <ul>
      <li><strong>Session amount:</strong> ${currencyLabel}${amount.toFixed(2)}</li>
      <li><strong>30% CEO share (to you):</strong> ${currencyLabel}${ceoShare.toFixed(2)}</li>
      <li><strong>Expert:</strong> ${expertName} (${expertUserId})</li>
      ${payerName ? `<li><strong>Payer:</strong> ${payerName}</li>` : ""}
    </ul>
    <p>This 30% has been allocated to the CEO (kirtan.balipersad@gmail.com).</p>
  `;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [CEO_EMAIL],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Resend API error:", res.status, err);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Failed to send CEO notification email:", e);
    return false;
  }
}
