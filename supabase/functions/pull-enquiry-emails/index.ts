import { timingSafeEqual } from "node:crypto";
import { formatEnquiryEmail, type Enquiry } from "../_shared/enquiry-email.ts";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function pullEnquiryEmails(request: Request): Promise<Response> {
  const reply = (status: number, payload: unknown) => Response.json(payload, {
    status, headers: { "cache-control": "no-store" },
  });
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { allow: "POST" } });
  const secret = Deno.env.get("ENQUIRY_EMAIL_PULL_KEY");
  const header = request.headers.get("x-intsinzi-pull-key") ?? "";
  const encoder = new TextEncoder();
  const supplied = encoder.encode(header);
  const expected = encoder.encode(secret ?? "");
  if (!secret || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return reply(401, { error: "unauthorized" });
  }

  const input = await request.json().catch(() => null);
  if (input?.action === "check") return reply(200, { ok: true });
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return reply(503, { error: "unavailable" });
  const rpc = async (name: string, payload: Record<string, unknown>) => {
    const result = await fetch(`${url}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!result.ok) throw new Error("Queue request failed");
    return result.json();
  };

  try {
    if (input?.action === "claim") {
      const worker = crypto.randomUUID();
      const jobs: Enquiry[] = await rpc("claim_enquiry_emails", { worker_token: worker });
      return reply(200, { worker, emails: jobs.map(formatEnquiryEmail) });
    }
    if (input?.action === "finish" && typeof input.id === "string" && uuid.test(input.id)
        && typeof input.worker === "string" && uuid.test(input.worker) && typeof input.delivered === "boolean") {
      const updated = await rpc("finish_enquiry_email", {
        enquiry: input.id, worker_token: input.worker, delivered: input.delivered,
      });
      return reply(updated ? 200 : 409, { ok: updated });
    }
    return reply(400, { error: "invalid" });
  } catch {
    console.error("Gmail enquiry queue unavailable");
    return reply(503, { error: "unavailable" });
  }
}

Deno.serve(pullEnquiryEmails);
