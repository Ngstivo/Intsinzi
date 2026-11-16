import { timingSafeEqual } from "node:crypto";

import { formatEnquiryEmail, studioEmail, type Enquiry } from "../_shared/enquiry-email.ts";

function authenticated(request: Request, secret: string): boolean {
  const encoder = new TextEncoder();
  const expected = encoder.encode(secret);
  const provided = encoder.encode(request.headers.get("x-intsinzi-worker-key") ?? "");
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

async function rpc(url: string, key: string, name: string, payload: Record<string, unknown>) {
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`RPC HTTP ${response.status}`);
  return response.json();
}

export async function sendEnquiryEmails(request: Request): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { allow: "POST" } });
  const secret = Deno.env.get("ENQUIRY_EMAIL_WORKER_KEY");
  if (!secret || !authenticated(request, secret)) return new Response(null, { status: 401 });
  const emailKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("ENQUIRY_EMAIL_FROM");
  if (!emailKey || !from) return Response.json({ status: "waiting_for_sender" });
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return new Response(null, { status: 503 });

  const worker = crypto.randomUUID();
  let jobs: Enquiry[];
  try {
    jobs = await rpc(url, key, "claim_enquiry_emails", { worker_token: worker });
  } catch {
    console.error("Could not claim enquiry emails");
    return new Response(null, { status: 503 });
  }
  if (!jobs.length) return Response.json({ sent: 0, retrying: 0 });

  let sent = 0;
  let retrying = 0;
  for (const job of jobs) {
    let delivered = false;
    try {
      const message = formatEnquiryEmail(job);
      const delivery = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${emailKey}`, "content-type": "application/json",
          "idempotency-key": `intsinzi-enquiry/${job.id}`,
        },
        body: JSON.stringify({
          from, to: [studioEmail],
          reply_to: message.replyTo,
          subject: message.subject,
          text: message.text,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!delivery.ok) throw new Error(`Email HTTP ${delivery.status}`);
      delivered = true;
      sent++;
    } catch (error) {
      retrying++;
      const message = error instanceof Error && /^Email HTTP \d{3}$/.test(error.message) ? error.message : "";
      console.error("Enquiry email will retry", message);
    }
    try {
      const updated = await rpc(url, key, "finish_enquiry_email", {
        enquiry: job.id, worker_token: worker, delivered,
      });
      if (!updated) console.error("Enquiry email lease was lost");
    } catch {
      console.error("Could not record enquiry email result");
    }
  }
  return Response.json({ sent, retrying });
}

Deno.serve(sendEnquiryEmails);
