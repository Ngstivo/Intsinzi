type Enquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  preferredLanguage: string;
  siteLanguage: string;
  description: string;
  demoReference: string | null;
};

const defaultOrigins = ["https://intsinzi-digital-studio.vercel.app", "https://ngstivo.github.io"];
const configuredOrigins = Deno.env.get("ENQUIRY_ALLOWED_ORIGINS");
const origins = new Set(configuredOrigins ? configuredOrigins.split(",").map(value => value.trim()) : defaultOrigins);
const languages = new Set(["en", "pl", "fr", "de", "es", "it"]);
const projectTypes = new Set(["web", "saas", "crm", "booking", "ai", "api", "wp", "other"]);
const budgets = new Set(["2000-4999", "5000-9999", "10000+", "discuss"]);
const demos = new Set(["ClientFlow CRM", "BookEase", "StockPilot", "AI Desk"]);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const maxBodyBytes = 16_384;

function clean(value: unknown, min: number, max: number): string | null {
  if (typeof value !== "string" || value.includes("\0")) return null;
  const text = value.trim();
  return text.length >= min && text.length <= max ? text : null;
}

function validate(value: unknown): Enquiry | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const id = clean(input.id, 36, 36);
  const name = clean(input.name, 1, 100);
  const email = clean(input.email, 3, 150);
  const company = clean(input.company, 0, 120);
  const projectType = clean(input.projectType, 1, 12);
  const budget = clean(input.budget, 1, 12);
  const preferredLanguage = clean(input.preferredLanguage, 2, 2);
  const siteLanguage = clean(input.siteLanguage, 2, 2);
  const description = clean(input.description, 1, 1400);
  const demoReference = clean(input.demoReference, 1, 40);
  if (!id || !uuid.test(id) || !name || !email || !emailPattern.test(email) || company === null ||
      !projectType || !projectTypes.has(projectType) || !budget || !budgets.has(budget) ||
      !preferredLanguage || !languages.has(preferredLanguage) || !siteLanguage || !languages.has(siteLanguage) ||
      !description || (demoReference && !demos.has(demoReference))) return null;
  return { id, name, email, company, projectType, budget, preferredLanguage, siteLanguage, description, demoReference };
}

async function readJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > maxBodyBytes) throw new RangeError("Body limit");
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Missing JSON");
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let raw = "";
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBodyBytes) { await reader.cancel(); throw new RangeError("Body limit"); }
      raw += decoder.decode(value, { stream: true });
    }
    return JSON.parse(raw + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}

async function rateKey(request: Request, email: string, secret: string): Promise<string> {
  const address = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip");
  const identity = address ? `ip:${address}` : `email:${email.toLowerCase()}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, encoder.encode(identity));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function submitEnquiry(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  const headers = new Headers({
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    "vary": "Origin",
  });
  const reply = (status: number, body: Record<string, unknown>) => new Response(JSON.stringify(body), { status, headers });

  if (!origin || !origins.has(origin)) return reply(403, { error: "origin" });
  headers.set("access-control-allow-origin", origin);
  if (request.method === "OPTIONS") {
    headers.set("access-control-allow-methods", "POST, OPTIONS");
    headers.set("access-control-allow-headers", "content-type");
    return new Response(null, { status: 204, headers });
  }
  if (request.method !== "POST") { headers.set("allow", "POST, OPTIONS"); return reply(405, { error: "method" }); }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return reply(415, { error: "content_type" });
  }
  let input: unknown;
  try { input = await readJson(request); }
  catch (error) { return reply(error instanceof RangeError ? 413 : 400, { error: "invalid" }); }
  if (input && typeof input === "object" && "website" in input && input.website !== "") {
    return reply(400, { error: "invalid" });
  }
  const enquiry = validate(input);
  if (!enquiry) return reply(400, { error: "invalid" });

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return reply(503, { error: "unavailable" });
  try {
    const fingerprint = await rateKey(request, enquiry.email, key);
    const result = await fetch(`${url}/rest/v1/rpc/submit_project_enquiry`, {
      method: "POST",
      headers: { "content-type": "application/json", apikey: key, authorization: `Bearer ${key}` },
      body: JSON.stringify({ payload: enquiry, fingerprint }),
      signal: AbortSignal.timeout(8000),
    });
    if (!result.ok) {
      console.error("Enquiry storage failed", result.status);
      return reply(503, { error: "unavailable" });
    }
    const status = await result.json();
    if (status === "rate_limited") {
      headers.set("retry-after", "3600");
      return reply(429, { error: "rate_limited" });
    }
    if (status !== "saved" && status !== "already_saved") return reply(503, { error: "unavailable" });
    return reply(status === "saved" ? 201 : 200, { id: enquiry.id });
  } catch {
    console.error("Enquiry storage unavailable");
    return reply(503, { error: "unavailable" });
  }
}

Deno.serve(submitEnquiry);
